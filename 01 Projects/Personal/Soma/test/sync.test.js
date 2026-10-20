// Run: node --test test/
// Sync: two devices and the PC hub. Every scenario here is one that could lose or
// double-count work if merging were done naively.
const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../src/engine.js");
const content = require("../src/content.js");

const T0 = new Date("2026-10-19T14:00:00").getTime();   // Monday afternoon
const MIN = 60000;

function device(name, now = T0) {
  const s = E.initialState(content, now);
  s.deviceName = name;
  s.books.forEach((b) => { b.totalPages = 300; b.page = 0; b.updatedAt = 1; });   // as if set up in the app
  return s;
}
function hub(now = T0) {
  const s = E.initialState(content, now);
  return Object.assign(s, { hub: true, deviceId: "hub", deviceName: "PC hub", days: {} });
}
/** What a sync does: the hub merges the device in, the device merges the hub's answer back. */
function sync(dev, h) {
  const h2 = E.merge(h, E.syncPayload(dev));
  const d2 = E.merge(dev, E.syncPayload(h2));
  return [d2, h2];
}
const card = (s, kind, now = T0) => E.candidates(s, content, now).find((c) => c.kind === kind && !c.setup);
const xp = (s, now = T0) => E.totals(s, content, now).xp;
const shared = (s) => ({
  books: s.books.map((b) => [b.id, b.page, b.totalPages, !!b.deleted]),
  cards: s.cards.map((c) => [c.id, c.due, c.interval]).sort(),
  notes: s.notes.map((n) => n.id).sort(),
  events: s.events.map((e) => e.id).sort(),
  days: JSON.stringify(Object.entries(E.allDays(s)).sort()),
});

test("two devices and the hub converge, with nothing double counted", () => {
  let pc = device("PC"), phone = device("Phone"), h = hub();
  const read = card(pc, "read");
  E.complete(pc, content, read, { minutes: 25, pageReached: 12, takeaway: "PC note" }, T0);
  const exam = card(phone, "exam");
  E.complete(phone, content, exam, { minutes: 15, count: 1 }, T0 + MIN);
  const pcXP = xp(pc), phoneXP = xp(phone);

  [pc, h] = sync(pc, h);
  [phone, h] = sync(phone, h);
  [pc, h] = sync(pc, h);

  assert.deepEqual(shared(pc), shared(phone));
  assert.equal(xp(pc), xp(phone));
  // study 25 + 15 = 40 min → 8 XP, plus the exam question 5 = 13 (caps apply to the combined day)
  assert.equal(xp(pc), 13, `combined XP, was PC ${pcXP} + phone ${phoneXP}`);
  assert.equal(pc.notes.length, 1);
  assert.equal(phone.books.find((b) => b.id === read.ref).page, 12, "phone sees PC's reading progress");

  // Syncing again and again changes nothing.
  for (let i = 0; i < 3; i++) { [pc, h] = sync(pc, h); [phone, h] = sync(phone, h); }
  assert.equal(xp(pc), 13);
  assert.equal(xp(phone), 13);
  assert.deepEqual(shared(pc), shared(phone));
});

test("merge is order-independent on shared data", () => {
  const a = device("A"), b = device("B");
  E.complete(a, content, card(a, "read"), { minutes: 25, pageReached: 10 }, T0);
  E.complete(b, content, card(b, "write"), { minutes: 25 }, T0 + MIN);
  b.cards.push(E.newCard("FR", "q", "a", T0));
  const ab = E.merge(a, E.syncPayload(b)), ba = E.merge(b, E.syncPayload(a));
  assert.deepEqual(shared(ab), shared(ba));
  assert.equal(xp(ab), xp(ba));
});

test("XP caps hold across devices", () => {
  let pc = device("PC"), phone = device("Phone"), h = hub();
  E.dayRec(pc, E.dayKey(T0)).study_min = 150;
  E.dayRec(phone, E.dayKey(T0)).study_min = 150;
  pc.daysAt = phone.daysAt = T0;
  [pc, h] = sync(pc, h); [phone, h] = sync(phone, h); [pc, h] = sync(pc, h);
  assert.equal(E.dayXP(E.peekDay(pc, E.dayKey(T0))), 30, "300 combined minutes is still capped at 30");
  const before = E.dayXP(E.peekDay(pc, E.dayKey(T0)));
  const r = E.complete(pc, content, card(pc, "read"), { minutes: 25, pageReached: 15 }, T0 + 5 * MIN);
  assert.equal(r.xp, 0, "no XP past the cap, even though this device alone is under it");
  assert.equal(before, 30);
});

test("the newest book progress wins; a delete travels", () => {
  let pc = device("PC"), phone = device("Phone"), h = hub();
  const id = pc.books[0].id;
  E.complete(pc, content, { id: "read:" + id, key: "read:" + id, kind: "read", area: "maf", ref: id }, { minutes: 25, pageReached: 52 }, T0);
  [pc, h] = sync(pc, h); [phone, h] = sync(phone, h);
  E.complete(phone, content, { id: "read:" + id, key: "read:" + id, kind: "read", area: "maf", ref: id }, { minutes: 25, pageReached: 64 }, T0 + 60 * MIN);
  [phone, h] = sync(phone, h); [pc, h] = sync(pc, h);
  assert.equal(pc.books.find((b) => b.id === id).page, 64);

  const victim = pc.books[1];
  Object.assign(victim, { deleted: true, updatedAt: T0 + 90 * MIN });
  [pc, h] = sync(pc, h); [phone, h] = sync(phone, h);
  assert.equal(phone.books.find((b) => b.id === victim.id).deleted, true);
  assert.ok(!E.candidates(phone, content, T0 + 91 * MIN).some((c) => c.ref === victim.id), "deleted book gone from the phone's feed");
});

test("snoozes, hidden cards and done routines carry across", () => {
  let pc = device("PC"), phone = device("Phone"), h = hub();
  const preread = new Date("2026-10-19T16:30:00").getTime();
  const r = E.candidates(phone, content, preread).find((c) => c.id === "routine:preread");
  E.complete(phone, content, r, { minutes: 20 }, preread);
  E.record(phone, { type: "snooze", item: "write:chantal", key: "write:chantal" }, preread);
  E.record(phone, { type: "not_interested", item: "method:pomodoro", key: "method:pomodoro" }, preread);
  [phone, h] = sync(phone, h); [pc, h] = sync(pc, h);
  const ids = E.candidates(pc, content, preread + MIN).map((c) => c.id);
  assert.ok(!ids.includes("routine:preread"), "pre-read done on the phone isn't offered on the PC");
  assert.ok(!ids.includes("write:chantal"), "snoozed on the phone, snoozed on the PC");
  assert.ok(!ids.includes("method:pomodoro"), "hidden on the phone, hidden on the PC");
});

test("'show hidden cards' and 'reset learning' travel as timestamps", () => {
  let pc = device("PC"), phone = device("Phone"), h = hub();
  E.record(phone, { type: "not_interested", item: "method:pomodoro", key: "method:pomodoro" }, T0);
  E.record(phone, { type: "skip", item: "exam", key: "exam:Financial Reporting" }, T0);
  [phone, h] = sync(phone, h); [pc, h] = sync(pc, h);
  assert.ok(pc.hidden["method:pomodoro"]);

  pc.hiddenClearedAt = T0 + MIN; pc.hidden = {};
  pc.learningResetAt = T0 + MIN; pc.events = []; pc.stats = {};
  [pc, h] = sync(pc, h); [phone, h] = sync(phone, h);
  assert.ok(!phone.hidden["method:pomodoro"], "unhidden everywhere");
  assert.equal(phone.events.filter((e) => e.t < T0 + MIN).length, 0, "old learning gone everywhere");
  assert.deepEqual(phone.stats, {});
  // learning after the reset still syncs
  E.record(phone, { type: "skip", item: "exam", key: "exam:Financial Reporting" }, T0 + 2 * MIN);
  [phone, h] = sync(phone, h); [pc, h] = sync(pc, h);
  assert.equal(pc.events.length, 1);
});

test("flashcard reviews travel; a card made on one device appears on the other", () => {
  let pc = device("PC"), phone = device("Phone"), h = hub();
  const c = E.newCard("FR", "IAS 16?", "PPE", T0);
  phone.cards.push(c);
  [phone, h] = sync(phone, h); [pc, h] = sync(pc, h);
  const onPc = pc.cards.find((x) => x.id === c.id);
  assert.ok(onPc);
  E.reviewCard(onPc, 4, T0 + 10 * MIN);
  E.reviewCard(onPc, 4, T0 + 11 * MIN);
  [pc, h] = sync(pc, h); [phone, h] = sync(phone, h);
  assert.equal(phone.cards.find((x) => x.id === c.id).interval, 3);
});

test("rebuilding stats from the log matches what was learned live", () => {
  const s = device("PC");
  let t = T0;
  for (let i = 0; i < 6; i++, t += 20 * MIN) {
    for (const c of E.rank(s, content, t).filter((x) => !x.special).slice(0, 3)) {
      E.record(s, { type: "impression", item: c.id, key: c.key }, t);
      if (c.kind === "read" && !c.setup) E.complete(s, content, c, { minutes: 25, pageReached: s.books.find((b) => b.id === c.ref).page + 8 }, t + MIN);
      else if (c.kind === "write") E.record(s, { type: "snooze", item: c.id, key: c.key }, t + MIN);
      else E.record(s, { type: "skip", item: c.id, key: c.key }, t + MIN);
    }
    s.session.blocks = 0;
  }
  const live = JSON.parse(JSON.stringify({ stats: s.stats, snoozed: s.snoozed, hidden: s.hidden }));
  E.rebuildDerived(s);
  for (const [k, v] of Object.entries(live.stats)) {
    const r = s.stats[k];
    assert.ok(r, "missing " + k);
    for (const f of ["pos", "neg", "shown"]) {
      // rebuilt values are anchored at each event's own time, live ones at the last bump: compare at a common time
      const a = E.readStat({ stats: live.stats }, k, t + 60 * MIN)[f], b = E.readStat(s, k, t + 60 * MIN)[f];
      assert.ok(Math.abs(a - b) < 1e-9, `${k}.${f} live ${a} rebuilt ${b}`);
    }
  }
  assert.deepEqual(s.snoozed, live.snoozed);
});

test("restoring this device's own backup brings its days back", () => {
  const phone = device("Phone");
  E.complete(phone, content, card(phone, "exam"), { minutes: 15, count: 1 }, T0);
  const backup = JSON.parse(JSON.stringify(phone));
  const wiped = Object.assign(E.initialState(content, T0 + MIN), { deviceId: phone.deviceId });
  const restored = E.merge(wiped, backup);
  assert.equal(xp(restored), xp(phone));
  // and a backup from a wiped device that got a new id still counts once
  const fresh = E.initialState(content, T0 + MIN);
  const r2 = E.merge(fresh, backup);
  assert.equal(xp(r2), xp(phone));
  assert.equal(xp(E.merge(r2, backup)), xp(phone), "merging the same backup twice doesn't double it");
});

test("settings: shared ones follow the newest change; feed order and filter stay per device", () => {
  const pc = device("PC"), phone = device("Phone");
  Object.assign(pc.settings, { blockMin: 50, mode: "timetable", area: "maf", updatedAt: T0 + MIN });
  Object.assign(phone.settings, { blockMin: 15, mode: "smart", area: "all", updatedAt: T0 });
  const m = E.merge(phone, E.syncPayload(pc));
  assert.equal(m.settings.blockMin, 50);
  assert.equal(m.settings.mode, "smart");
  assert.equal(m.settings.area, "all");
  assert.equal(m.settings.weights.T, 0.30);
});

test("merge never mutates its inputs, and ignores junk", () => {
  const a = device("A"), b = device("B");
  E.complete(b, content, card(b, "read"), { minutes: 25, pageReached: 9 }, T0);
  const snapA = JSON.stringify(a), snapB = JSON.stringify(b);
  E.merge(a, b);
  assert.equal(JSON.stringify(a), snapA);
  assert.equal(JSON.stringify(b), snapB);
  assert.equal(E.merge(a, null), a);
  assert.doesNotThrow(() => E.merge(a, { events: [null, { id: "x" }], books: [null], peers: { z: null } }));
});
