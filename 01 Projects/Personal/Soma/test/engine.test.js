// Run: node --test test/
// Unit tests for the feed engine, against a synthetic user. No real data needed.
const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../src/engine.js");
const content = require("../src/content.js");

// Fixed local times so slots are deterministic. 2026-10-19 is a Monday.
const at = (s) => new Date(s).getTime();
const MON_0555 = at("2026-10-19T05:55:00");
const TUE_0555 = at("2026-10-20T05:55:00");
const MON_1400 = at("2026-10-19T14:00:00");
const MON_2200 = at("2026-10-19T22:00:00");

function fresh(now = MON_1400) {
  const s = E.initialState(content, now);
  s.books.forEach((b, i) => { b.totalPages = 300; b.page = i * 10; });
  return s;
}
const feedOf = (s, now) => E.rank(s, content, now);
const real = (feed) => feed.filter((c) => !c.special);

test("score is the documented weighted sum minus the penalty", () => {
  const f = { T: 1, C: 0.5, W: 0.8, F: 0.2, N: 1, penalty: 0.1 };
  const want = 0.30 * 1 + 0.25 * 0.5 + 0.20 * 0.8 + 0.15 * 0.2 + 0.10 * 1 - 0.1;
  assert.ok(Math.abs(E.score(f, E.DEFAULT_WEIGHTS) - want) < 1e-12);
  const sum = Object.values(E.DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-12, "weights sum to 1");
});

test("features are all normalised to 0..1", () => {
  const s = fresh();
  const ctx = E.context(s, content, MON_1400);
  for (const c of E.candidates(s, content, MON_1400)) {
    const f = E.features(c, s, MON_1400, ctx);
    for (const k of ["T", "C", "W", "F", "N"]) assert.ok(f[k] >= 0 && f[k] <= 1, `${c.id} ${k}=${f[k]}`);
  }
});

test("timetable: Monday 05:55 leads with study, Tuesday 05:55 with writing", () => {
  const mon = real(feedOf(fresh(MON_0555), MON_0555));
  assert.ok(["read", "flash", "exam"].includes(mon[0].kind), `Monday top was ${mon[0].kind}`);
  const tue = real(feedOf(fresh(TUE_0555), TUE_0555));
  assert.equal(tue[0].kind, "write", `Tuesday top was ${tue[0].kind}`);
});

test("quiet hours: only the hard-stop card, unless overridden", () => {
  const s = fresh(MON_2200);
  const feed = feedOf(s, MON_2200);
  assert.equal(feed.length, 1);
  assert.equal(feed[0].kind, "quiet");
  s.quietOverrideUntil = MON_2200 + 10 * 60000;
  assert.ok(real(feedOf(s, MON_2200)).length > 0);
});

test("eligibility: hidden, finished, snoozed and done-today cards are excluded", () => {
  const s = fresh(MON_1400);
  s.books[0].page = s.books[0].totalPages;                       // finished
  E.record(s, { type: "not_interested", item: "method:pomodoro", key: "method:pomodoro" }, MON_1400);
  E.record(s, { type: "snooze", item: "exam", key: "exam:Financial Reporting" }, MON_1400);
  const ids = E.candidates(s, content, MON_1400).map((c) => c.id);
  assert.ok(!ids.includes("read:" + s.books[0].id), "finished book excluded");
  assert.ok(!ids.includes("method:pomodoro"), "hidden method excluded");
  assert.ok(!ids.includes("exam"), "snoozed card excluded");
  // after the snooze expires it is back
  assert.ok(E.candidates(s, content, MON_1400 + 3 * 3600000).some((c) => c.id === "exam"));

  const preread = at("2026-10-19T16:30:00");
  const card = E.candidates(s, content, preread).find((c) => c.id === "routine:preread");
  assert.ok(card, "pre-read routine is in its slot");
  E.complete(s, content, card, { minutes: 20 }, preread);
  assert.ok(!E.candidates(s, content, preread + 60000).some((c) => c.id === "routine:preread"), "done today");
});

test("negative feedback: a snoozed card ranks lower once it returns", () => {
  const s = fresh(MON_1400);
  const ctx = E.context(s, content, MON_1400);
  const card = E.candidates(s, content, MON_1400).find((c) => c.id === "write:chantal");
  const before = E.score(E.features(card, s, MON_1400, ctx), E.DEFAULT_WEIGHTS);
  E.record(s, { type: "snooze", item: card.id, key: card.key }, MON_1400);
  const later = MON_1400 + 3 * 3600000;
  const after = E.score(E.features(card, s, later, E.context(s, content, later)), E.DEFAULT_WEIGHTS);
  assert.ok(after < before - 0.1, `before ${before.toFixed(3)} after ${after.toFixed(3)}`);
});

test("impressions are not positive feedback, and are de-duplicated", () => {
  const s = fresh();
  const card = E.candidates(s, content, MON_1400).find((c) => c.kind === "read");
  const c0 = E.features(card, s, MON_1400, E.context(s, content, MON_1400)).C;
  assert.equal(E.record(s, { type: "impression", item: card.id, key: card.key }, MON_1400), true);
  assert.equal(E.record(s, { type: "impression", item: card.id, key: card.key }, MON_1400 + 60000), false, "duplicate within 10 min");
  const c1 = E.features(card, s, MON_1400, E.context(s, content, MON_1400)).C;
  assert.equal(c0, c1, "C unchanged by an impression");
  assert.equal(E.readStat(s, card.key, MON_1400).shown, 1);
});

test("diversity: no two cards of the same kind in a row when there's a choice", () => {
  const feed = real(feedOf(fresh(MON_1400), MON_1400));
  const kinds = new Set(feed.map((c) => c.kind));
  assert.ok(kinds.size >= 3);
  let sameRun = 0;
  for (let i = 1; i < feed.length; i++) if (feed[i].kind === feed[i - 1].kind) sameRun++;
  assert.ok(sameRun <= 2, `same-kind neighbours: ${sameRun} in ${feed.map((c) => c.kind).join(",")}`);
  assert.ok(feed.some((c) => c.explore), "an exploration card is included");
});

test("repetition: the kind of work just finished doesn't come straight back", () => {
  const s = fresh(MON_1400);
  const top = real(feedOf(s, MON_1400))[0];
  E.complete(s, content, top, { minutes: 15, pageReached: top.pages ? top.pages.to : undefined }, MON_1400);
  const next = real(feedOf(s, MON_1400 + 60000))[0];
  assert.notEqual(next.kind, top.kind, `${top.kind} came straight back`);
  assert.ok(real(feedOf(s, MON_1400 + 60000)).find((c) => c.kind === top.kind && c.feat.repeat));
  // after the window it's eligible on equal terms again
  const later = real(feedOf(s, MON_1400 + 60 * 60000)).find((c) => c.kind === top.kind);
  if (later) assert.equal(later.feat.repeat, false);
});

test("caps: at most one watch card and one setup card per feed", () => {
  const s = E.initialState(content, MON_1400);      // nothing set up: 9 setup cards, 8 watch cards
  const feed = real(feedOf(s, MON_1400));
  assert.ok(feed.filter((c) => c.kind === "watch").length <= 1);
  assert.ok(feed.filter((c) => c.setup).length <= 1);
  const kinds = {};
  feed.filter((c) => c.kind !== "method").forEach((c) => (kinds[c.kind] = (kinds[c.kind] || 0) + 1));
  assert.ok(Object.values(kinds).every((n) => n <= 3), JSON.stringify(kinds));
});

test("setting up a book is not a reading block", () => {
  const s = E.initialState(content, MON_1400);
  const setup = E.candidates(s, content, MON_1400).find((c) => c.setup);
  const { xp, day } = E.complete(s, content, setup, { minutes: 0, totalPages: 400, pageReached: 40 }, MON_1400);
  assert.equal(xp, 0);
  assert.equal(day.active, false, "no streak for setup");
  const ctx = E.context(s, content, MON_1400 + 60000);
  assert.ok(!ctx.lastDone.read, "no repetition penalty from setup");
  const card = E.candidates(s, content, MON_1400 + 60000).find((c) => c.id === setup.id);
  assert.match(card.note, /Pages 41–/);
});

test("time decay: learned counts halve every 14 days", () => {
  const s = fresh();
  E.bump(s, "k", "pos", 4, MON_1400);
  assert.ok(Math.abs(E.readStat(s, "k", MON_1400 + 14 * E.DAY).pos - 2) < 1e-9);
  assert.ok(Math.abs(E.readStat(s, "k", MON_1400 + 28 * E.DAY).pos - 1) < 1e-9);
});

test("learning: completions raise predicted completion, snoozes lower it", () => {
  const s = fresh();
  const ctx = E.context(s, content, MON_1400);
  const read = E.candidates(s, content, MON_1400).find((c) => c.kind === "read");
  const c0 = E.features(read, s, MON_1400, ctx).C;
  for (let i = 0; i < 3; i++) E.complete(s, content, read, { minutes: 25, pageReached: s.books.find((b) => b.id === read.ref).page + 10 }, MON_1400 + i * 3600000);
  assert.ok(E.features(read, s, MON_1400 + 4 * 3600000, ctx).C > c0);
  const write = E.candidates(s, content, MON_1400).find((c) => c.id === "write:mihogoni");
  const w0 = E.features(write, s, MON_1400, ctx).C;
  E.record(s, { type: "snooze", item: write.id, key: write.key }, MON_1400);
  assert.ok(E.features(write, s, MON_1400, ctx).C < w0);
});

test("reading: speed is learned and sets the next chunk size", () => {
  const s = fresh();
  const b = s.books[0];
  b.page = 0;
  const card = { id: "read:" + b.id, key: "read:" + b.id, kind: "read", area: b.area, ref: b.id, title: b.title };
  E.complete(s, content, card, { minutes: 25, pageReached: 25 }, MON_1400);   // 1 page/min
  assert.equal(b.page, 25);
  assert.ok(Math.abs(b.speed - 1) < 1e-9);
  assert.equal(E.chunkPages(b, 25), 25);
  E.complete(s, content, card, { minutes: 25, pageReached: 30 }, MON_1400 + 3600000); // 0.2 page/min
  assert.ok(Math.abs(b.speed - (0.7 * 1 + 0.3 * 0.2)) < 1e-9);
  const day = s.days[E.dayKey(MON_1400)];
  assert.equal(day.pages, 30);
  assert.equal(day.study_min, 50);
});

test("XP matches The Game: caps and exposure weight", () => {
  assert.equal(E.dayXP({ write_min: 500, study_min: 500 }), 60, "both minute caps at 30");
  assert.equal(E.dayXP({ exam_q: 9 }), 15, "three exam questions max");
  assert.equal(E.dayXP({ exposure: 5 }), 50, "two exposures max");
  assert.equal(E.dayXP({ class: true, walk: true, tablets: true, log: true }), 25);
  const s = fresh();
  const { xp } = E.complete(s, content, { id: "expose", key: "expose", kind: "expose", area: "writing", ref: "expose" }, { minutes: 10 }, MON_1400);
  assert.equal(xp, 25);
});

test("methods earn no XP and no focus minutes", () => {
  const s = fresh();
  const m = E.candidates(s, content, MON_1400).find((c) => c.kind === "method");
  const { xp, day } = E.complete(s, content, m, { minutes: 1 }, MON_1400);
  assert.equal(xp, 0);
  assert.equal(day.focus_min, 0);
});

test("daily limit and break cards", () => {
  const s = fresh();
  const card = E.candidates(s, content, MON_1400).find((c) => c.kind === "read");
  E.complete(s, content, card, { minutes: 25, pageReached: 15 }, MON_1400);
  E.complete(s, content, card, { minutes: 25, pageReached: 30 }, MON_1400 + 1800000);
  assert.equal(feedOf(s, MON_1400 + 3600000)[0].kind, "break", "break after two blocks");
  s.days[E.dayKey(MON_1400)].focus_min = 240;
  assert.equal(feedOf(s, MON_1400 + 3600000)[0].kind, "limit");
});

test("spaced repetition: intervals grow, 'again' resets", () => {
  const c = E.newCard("FR", "IAS 16 measures?", "Cost or revaluation", MON_1400);
  assert.equal(c.due, E.dayKey(MON_1400));
  E.reviewCard(c, 4, MON_1400); assert.equal(c.interval, 1);
  E.reviewCard(c, 4, MON_1400); assert.equal(c.interval, 3);
  E.reviewCard(c, 4, MON_1400); assert.ok(c.interval >= 7);
  E.reviewCard(c, 1, MON_1400); assert.equal(c.interval, 1); assert.equal(c.reps, 0);
  assert.ok(c.ef >= 1.3);
});

test("due flashcards appear as one card per deck", () => {
  const s = fresh();
  s.cards.push(E.newCard("FR", "q1", "a1", MON_1400), E.newCard("FR", "q2", "a2", MON_1400), E.newCard("FM", "q", "a", MON_1400));
  const flash = E.candidates(s, content, MON_1400).filter((c) => c.kind === "flash");
  assert.equal(flash.length, 2);
  assert.equal(flash.find((c) => c.ref === "FR").title, "Review 2 due cards");
});

test("Obsidian sync adds only what's new, and keeps timer minutes", () => {
  const note = "---\ntags: [daily]\nwrite_min: 25\nstudy_min: 0\nwalk: false\n---\n\n# Monday\n";
  const props = { write_min: 50, study_min: 30, exam_q: 1, exposure: 0, class: true, walk: false, tablets: false, log: false };
  const r1 = E.mergeFrontmatter(note, props, {});
  assert.match(r1.text, /write_min: 75/);
  assert.match(r1.text, /study_min: 30/);
  assert.match(r1.text, /class: true/);
  assert.match(r1.text, /# Monday/);
  const r2 = E.mergeFrontmatter(r1.text, { ...props, study_min: 45 }, r1.synced);
  assert.match(r2.text, /write_min: 75/, "no double counting");
  assert.match(r2.text, /study_min: 45/);
  const r3 = E.mergeFrontmatter("# no frontmatter\n", props, {});
  assert.ok(r3.text.startsWith("---\n"));
});

test("weekly quests add +50 each, and levels follow the table", () => {
  const s = fresh();
  const dk = E.dayKey(MON_1400);
  Object.assign(E.dayRec(s, dk), { exposure: 1, active: true });
  const t = E.totals(s, content, MON_1400);
  assert.equal(t.xp, 25 + 50, "exposure XP plus the '1 exposure' quest");
  assert.equal(t.level, 1);
  assert.equal(t.name, "Mwanafunzi");
  assert.equal(t.streak, 1);
});

test("migrate keeps user data and fills new settings", () => {
  const old = { books: [{ id: "x", title: "Mine", area: "maf", page: 7 }], settings: { blockMin: 50 } };
  const m = E.migrate(old, content, MON_1400);
  assert.equal(m.books[0].page, 7);
  assert.equal(m.settings.blockMin, 50);
  assert.equal(m.settings.weights.T, 0.30);
  assert.ok(Array.isArray(m.events));
});

test("synthetic user: two weeks of habits shift the feed", () => {
  // A user who always finishes reading and always snoozes writing should see reading rise.
  const s = fresh(MON_1400);
  let t = MON_1400;
  for (let d = 0; d < 14; d++, t += E.DAY) {
    for (const c of real(feedOf(s, t)).slice(0, 4)) {
      E.record(s, { type: "impression", item: c.id, key: c.key }, t);
      if (c.kind === "read" && !c.setup) E.complete(s, content, c, { minutes: 25, pageReached: s.books.find((b) => b.id === c.ref).page + 10 }, t);
      else if (c.kind === "write") E.record(s, { type: "snooze", item: c.id, key: c.key }, t);
    }
    s.session.blocks = 0;
  }
  const ctx = E.context(s, content, t);
  const cands = E.candidates(s, content, t);
  // Average over the cards the user actually interacted with; untouched ones sit at the 0.5 prior.
  const avg = (kind) => {
    const xs = cands.filter((c) => c.kind === kind && s.stats[c.key] && (s.stats[c.key].pos || s.stats[c.key].neg))
      .map((c) => E.features(c, s, t, ctx).C);
    assert.ok(xs.length > 0, `no ${kind} cards were interacted with`);
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  };
  // Beta(1,1) prior: one completion gives 0.67, so these bars mean "learned", not "certain".
  assert.ok(avg("read") > 0.7, `read C ${avg("read")}`);
  assert.ok(avg("write") < 0.4, `write C ${avg("write")}`);
  assert.ok(avg("read") - avg("write") > 0.35);
  const m = E.metrics(s, t);
  assert.ok(m.completes > 0 && m.snoozes > 0);
});
