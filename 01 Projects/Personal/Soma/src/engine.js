/* Soma — the feed engine. Pure functions over a plain state object, with no DOM, so the
   same file runs in the app, in the APK's WebView and under `node --test`.

   Pipeline (see README.md for the full write-up):
     1. candidates()  every card that is eligible right now
     2. features()    five normalised features per card: T C W F N, plus a penalty
     3. score()       S = 0.30·T + 0.25·C + 0.20·W + 0.15·F + 0.10·N − penalty
     4. diversify()   greedy re-rank: no near-identical cards in a row, plus an exploration budget
     5. record()/complete()  the learning loop: decayed counts, reading speed, spacing

   This is a configurable weighted heuristic, not a trained model. The features are kept
   separate from the scoring so a learned ranker could replace score() later. */
(function (root) {
  "use strict";

  const DAY = 86400000;
  const SCHEMA_VERSION = 1;
  const RANK_VERSION = "rank-v1";
  const DEFAULT_WEIGHTS = { T: 0.30, C: 0.25, W: 0.20, F: 0.15, N: 0.10 };
  const HALF_LIFE_DAYS = 14;        // learned counts halve every two weeks
  const SNOOZE_HALF_LIFE_DAYS = 1;  // a "not now" fades within a day or two
  const SNOOZE_MS = 2 * 3600000;
  const REPEAT_WINDOW_MS = 45 * 60000;  // a kind of work finished this recently…
  const REPEAT_PENALTY = 0.15;          // …is pushed down by this much
  const MAX_EVENTS = 4000;
  const KINDS_WITH_TIMER = ["read", "watch", "flash", "exam", "write", "essay", "task", "routine"];

  // ---------- small helpers ----------
  const pad = (n) => String(n).padStart(2, "0");
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  function dayKey(t) { const d = new Date(t); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function hm(s) { const [h, m] = s.split(":").map(Number); return h * 60 + m; }
  function minuteOfDay(t) { const d = new Date(t); return d.getHours() * 60 + d.getMinutes(); }
  function inWindow(mins, from, to) { const a = hm(from), b = hm(to); return a <= b ? mins >= a && mins < b : mins >= a || mins < b; }
  function mondayKey(t) { const d = new Date(t); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dayKey(d); }
  function uid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

  // ---------- state ----------
  function defaultSettings() {
    return {
      weights: { ...DEFAULT_WEIGHTS }, rankVersion: RANK_VERSION,
      mode: "smart",            // smart | timetable
      area: "all",              // all | maf | writing
      blockMin: 25, quietFrom: "21:30", quietTo: "05:00",
      dailyLimitMin: 240,       // focus minutes before the feed tells you to stop
      breakEvery: 2,            // blocks before a break card
      writingDays: [0, 2, 4],   // Sun, Tue, Thu
      weeklyTargets: { write: 150, study: 300 },
      remindersOn: false,
    };
  }

  function initialState(content, now) {
    return {
      schema: SCHEMA_VERSION, created: +now, settings: defaultSettings(),
      books: content.books.map((b) => ({ ...b, totalPages: null, page: 0, active: true, speed: null, updatedAt: 0 })),
      materials: content.materials.map((m) => ({ ...m, active: true, minutesDone: 0, updatedAt: 0 })),
      tasks: [], cards: [], notes: [], events: [], stats: {}, days: {},
      snoozed: {}, hidden: {}, badges: {}, synced: {}, quietOverrideUntil: 0,
      session: { blocks: 0 },
      // ---- sync ----
      // Each device owns its own `days` and nobody else ever edits them; other devices' days
      // arrive as read-only copies in `peers`. That's what makes merging safe: per-device
      // counters are summed, never overwritten. See merge().
      deviceId: "dev-" + uid(), deviceName: "Device", daysAt: 0, peers: {},
      learningResetAt: 0, hiddenClearedAt: 0,
      sync: { addr: "", pin: "", auto: true, lastAt: 0, lastError: null, hubObsidian: false },
    };
  }

  /** Fills in anything a state saved by an older build is missing, so upgrades never wipe data. */
  function migrate(state, content, now) {
    const fresh = initialState(content, now);
    const s = { ...fresh, ...state };
    s.settings = { ...fresh.settings, ...(state.settings || {}) };
    s.settings.weights = { ...DEFAULT_WEIGHTS, ...((state.settings || {}).weights || {}) };
    s.sync = { ...fresh.sync, ...(state.sync || {}) };
    s.peers = state.peers || {};
    // Events written before sync existed get a stable id from their own contents.
    s.events = (state.events || []).map((e) => (e.id ? e : { ...e, id: "legacy-" + e.t + "-" + e.type + "-" + (e.item || "") }));
    s.schema = SCHEMA_VERSION;
    return s;
  }

  const NUM_DAY = ["write_min", "study_min", "exam_q", "exposure", "focus_min", "pages", "deep_blocks", "focus_breaks"];
  const BOOL_DAY = ["class", "walk", "tablets", "log", "active"];
  function blankDay() {
    return { write_min: 0, study_min: 0, class: false, exam_q: 0, walk: false, tablets: false,
      exposure: 0, log: false, focus_min: 0, pages: 0, deep_blocks: 0, focus_breaks: 0, done: {}, active: false };
  }
  /** This device's own record for a day, created if missing. Only this device writes to it. */
  function dayRec(state, dk) {
    if (!state.days[dk]) state.days[dk] = blankDay();
    return state.days[dk];
  }
  /** Two devices' records for the same day, combined: minutes add up, ticks are OR-ed. */
  function addDay(a, b) {
    const out = { ...a, done: { ...(a.done || {}) } };
    for (const f of NUM_DAY) out[f] = (a[f] || 0) + (b[f] || 0);
    for (const f of BOOL_DAY) out[f] = !!(a[f] || b[f]);
    Object.assign(out.done, b.done || {});
    return out;
  }
  /** Every day across this device and every synced device. Read from this; write with dayRec(). */
  function allDays(state) {
    const out = {};
    const add = (days) => { for (const [k, d] of Object.entries(days || {})) out[k] = addDay(out[k] || blankDay(), d); };
    add(state.days);
    for (const p of Object.values(state.peers || {})) add(p && p.days);
    return out;
  }
  const peekDay = (state, dk) => allDays(state)[dk] || blankDay();

  // ---------- decayed statistics ----------
  function decayFactor(fromMs, toMs, halfLife) {
    if (!fromMs) return 1;
    return Math.pow(0.5, Math.max(0, (toMs - fromMs) / DAY) / halfLife);
  }
  function readStat(state, key, now, halfLife = HALF_LIFE_DAYS) {
    const s = state.stats[key];
    if (!s) return { pos: 0, neg: 0, shown: 0, last: 0, touched: 0 };
    const f = decayFactor(s.at, +now, halfLife);
    return { pos: s.pos * f, neg: s.neg * f, shown: s.shown * f, last: s.last || 0, touched: s.touched || 0 };
  }
  function bump(state, key, field, amount, now, halfLife = HALF_LIFE_DAYS) {
    const cur = readStat(state, key, now, halfLife);
    cur[field] += amount;
    state.stats[key] = { pos: cur.pos, neg: cur.neg, shown: cur.shown, at: +now, last: cur.last, touched: cur.touched };
    return state.stats[key];
  }

  // ---------- timetable ----------
  function slotAt(content, now) {
    const d = new Date(now), mins = minuteOfDay(d), dow = d.getDay();
    return content.slots.find((s) => s.days.includes(dow) && inWindow(mins, s.from, s.to)) || null;
  }
  function isQuiet(state, now) {
    if (+now < (state.quietOverrideUntil || 0)) return false;
    return inWindow(minuteOfDay(now), state.settings.quietFrom, state.settings.quietTo);
  }

  // ---------- 1. candidate generation ----------
  function chunkPages(book, blockMin) {
    return Math.max(3, Math.round((book.speed || 0.5) * blockMin));
  }

  function leastPractisedModule(state, content, now) {
    let best = content.modules[0], oldest = Infinity;
    for (const m of content.modules) {
      const t = readStat(state, "exam:" + m, now).touched || 0;
      if (t < oldest) { oldest = t; best = m; }
    }
    return best;
  }

  function weekTotals(state, now) {
    const mk = mondayKey(now), out = { write: 0, study: 0, exposure: 0, days: 0 };
    for (const [k, d] of Object.entries(allDays(state))) {
      if (k >= mk && k <= dayKey(now)) { out.write += d.write_min; out.study += d.study_min; out.exposure += d.exposure; }
    }
    out.days = ((new Date(now).getDay() + 6) % 7) + 1;
    return out;
  }

  function isEssayDay(now) {
    const d = new Date(now);
    if (d.getDay() !== 0) return false;
    const nth = Math.ceil(d.getDate() / 7);
    return nth === 2 || nth === 4;
  }

  function candidates(state, content, now) {
    const s = state.settings, dk = dayKey(now), day = peekDay(state, dk), out = [];
    const snoozed = (id) => (state.snoozed[id] || 0) > +now;
    const mins = minuteOfDay(now);
    const slot = slotAt(content, now);

    for (const b of state.books) {
      const id = "read:" + b.id;
      if (!b.active || b.deleted || snoozed(id) || (b.totalPages && b.page >= b.totalPages)) continue;
      if (!b.totalPages) {
        out.push({ id, key: id, kind: "read", setup: true, area: b.area, topic: b.module, title: b.title, by: b.author,
          note: "First time: enter the page count and the page you're on.", minutes: 2, importance: 0.45 + 0.1 * (b.priority || 1), ref: b.id });
        continue;
      }
      const from = b.page + 1, to = Math.min(b.totalPages, b.page + chunkPages(b, s.blockMin));
      out.push({ id, key: id, kind: "read", area: b.area, topic: b.module, title: b.title, by: b.author,
        note: `Pages ${from}–${to} · about ${s.blockMin} min`, minutes: s.blockMin,
        importance: 0.55 + 0.1 * (b.priority || 1), ref: b.id, pages: { from, to } });
    }

    for (const m of state.materials) {
      const id = "watch:" + m.id;
      if (!m.active || m.deleted || snoozed(id) || state.hidden[id]) continue;
      out.push({ id, key: id, kind: "watch", area: m.area, topic: m.module, title: m.title, url: m.url,
        note: "Needs internet, or a download made beforehand.", minutes: s.blockMin, importance: 0.5, ref: m.id });
    }

    const decks = {};
    for (const c of state.cards) if (c.due <= dk) (decks[c.deck] = decks[c.deck] || []).push(c);
    for (const [deck, list] of Object.entries(decks)) {
      const id = "flash:" + deck;
      if (snoozed(id)) continue;
      const overdue = Math.max(...list.map((c) => (new Date(dk) - new Date(c.due)) / DAY));
      out.push({ id, key: id, kind: "flash", area: "maf", topic: deck, title: `Review ${list.length} due card${list.length > 1 ? "s" : ""}`,
        note: `${deck} · spaced repetition`, minutes: Math.min(20, Math.max(5, list.length)), importance: 0.7 + Math.min(0.2, list.length / 50),
        ref: deck, overdue });
    }

    if (day.exam_q < 3 && !snoozed("exam")) {
      const mod = leastPractisedModule(state, content, now);
      out.push({ id: "exam", key: "exam:" + mod, kind: "exam", area: "maf", topic: mod, title: "One exam question, against the clock",
        note: `${mod} · 15 minutes · NBAA or ACCA past paper`, minutes: 15, importance: 0.85, ref: mod });
    }

    for (const w of content.writing) {
      const id = "write:" + w.id;
      if (snoozed(id)) continue;
      out.push({ id, key: id, kind: "write", area: "writing", topic: w.id, title: w.title, note: w.note, minutes: w.minutes, importance: 0.8, ref: w.id });
    }
    if (isEssayDay(now) && !snoozed("essay") && !day.done.essay) {
      const e = content.essay;
      out.push({ id: "essay", key: "essay", kind: "essay", area: "writing", topic: "essay", title: e.title, note: e.note, minutes: e.minutes, importance: 0.85, ref: "essay" });
    }

    if (day.exposure < 2 && !snoozed("expose")) {
      const week = weekTotals(state, now);
      const idea = content.exposureIdeas[Math.floor(+now / DAY) % content.exposureIdeas.length];
      out.push({ id: "expose", key: "expose", kind: "expose", area: "writing", topic: "exposure",
        title: "Put one thing in front of someone who can say no", note: `Idea for today: ${idea}.`, minutes: 10,
        importance: week.exposure === 0 ? 1 : 0.75, ref: "expose" });
    }

    for (const r of content.routines) {
      const id = "routine:" + r.id;
      if (day.done[id] || snoozed(id)) continue;
      const inSlot = slot && slot.routine === r.id;
      const inOwnWindow = r.window && inWindow(mins, r.window[0], r.window[1]);
      if (!inSlot && !inOwnWindow) continue;
      out.push({ id, key: id, kind: "routine", area: r.area, topic: r.id, title: r.title, note: r.note, minutes: r.minutes,
        importance: 0.9, ref: r.id, noTimer: !!r.noTimer, form: r.form });
    }

    for (const t of state.tasks) {
      const id = "task:" + t.id;
      if (t.done || t.deleted || snoozed(id) || state.hidden[id]) continue;
      out.push({ id, key: id, kind: "task", area: t.area || "maf", topic: t.topic || "task", title: t.title, note: t.note || "",
        minutes: t.minutes || s.blockMin, importance: 0.45 + 0.15 * (t.priority || 1), due: t.due || null, ref: t.id });
    }

    const methods = content.methods
      .filter((m) => !state.hidden["method:" + m.id] && +now - readStat(state, "method:" + m.id, now).last > 3 * DAY)
      .sort((a, b) => readStat(state, "method:" + a.id, now).last - readStat(state, "method:" + b.id, now).last)
      .slice(0, 3);
    for (const m of methods) {
      out.push({ id: "method:" + m.id, key: "method:" + m.id, kind: "method", area: "method", topic: "method", title: m.name,
        note: m.idea, source: m.source, evidence: m.evidence, tryIt: m.try, form: m.form, minutes: 1, importance: 0.25, ref: m.id });
    }
    return out;
  }

  // ---------- 2. features ----------
  function context(state, content, now) {
    const week = weekTotals(state, now), t = state.settings.weeklyTargets, frac = week.days / 7;
    // When each kind of work was last finished, for the repetition penalty.
    const lastDone = {};
    for (let i = state.events.length - 1; i >= 0 && +now - state.events[i].t < REPEAT_WINDOW_MS; i--) {
      const e = state.events[i];
      if (e.type === "complete" && e.kind && !lastDone[e.kind]) lastDone[e.kind] = e.t;
    }
    return {
      lastDone,
      slot: slotAt(content, now),
      writingDay: state.settings.writingDays.includes(new Date(now).getDay()),
      behind: { writing: week.write < t.write * frac, maf: week.study < t.study * frac },
    };
  }

  function features(c, state, now, ctx) {
    // T · time fit and urgency
    let T = 0.45;
    if (ctx.slot) {
      if (c.kind === "routine") T = c.ref === ctx.slot.routine ? 1 : 0.3;
      else T = ctx.slot.fits.includes(c.kind) ? 1 : c.kind === "method" ? 0.4 : 0.15;
    } else if (c.kind === "routine") T = 0.9;          // routines outside a slot are in their own window
    if (c.kind === "write" && ctx.writingDay && !ctx.slot) T = Math.max(T, 0.6);
    if (c.due) T = Math.max(T, clamp01(1 - (new Date(c.due + "T23:59:59") - new Date(now)) / DAY / 14));

    // C · predicted completion: decayed completes vs skips/snoozes, Beta(1,1) prior.
    // Impressions are not evidence either way.
    const st = readStat(state, c.key, now);
    const C = (st.pos + 1) / (st.pos + st.neg + 2);

    // W · importance, nudged up when that side of the week is behind target
    const W = clamp01(c.importance + (ctx.behind[c.area] ? 0.15 : 0));

    // F · staleness: rises the longer since this was last done
    const since = st.touched ? (+now - st.touched) / DAY : 7;
    let F = 1 - Math.exp(-since / 2);
    if (c.kind === "flash") F = Math.max(F, clamp01(0.5 + (c.overdue || 0) / 7));

    // N · novelty: fewer recent showings, more novel
    const N = 1 / (1 + st.shown);

    // explicit negative feedback, fading over a day or two
    let penalty = Math.min(0.5, 0.25 * readStat(state, "snooze:" + c.id, now, SNOOZE_HALF_LIFE_DAYS).neg);
    // repetition: the same kind of work just finished goes to the back for a while
    const repeat = ctx.lastDone && ctx.lastDone[c.kind] && c.kind !== "routine";
    if (repeat) penalty += REPEAT_PENALTY;
    return { T, C, W, F, N, penalty, repeat: !!repeat };
  }

  // ---------- 3. scoring ----------
  function score(f, w) {
    return w.T * f.T + w.C * f.C + w.W * f.W + w.F * f.F + w.N * f.N - f.penalty;
  }

  // ---------- 4. diversity and exploration ----------
  // Most cards of one kind a single feed may hold. Watch cards need internet; setup cards are
  // onboarding, so they come one at a time.
  const KIND_CAP = { watch: 1, setup: 1, default: 3 };
  const capKey = (it) => (it.setup ? "setup" : it.kind);
  const capOf = (k) => (KIND_CAP[k] != null ? KIND_CAP[k] : KIND_CAP.default);

  function diversify(items) {
    const methods = items.filter((i) => i.kind === "method").sort((a, b) => b.score - a.score);
    const pool = items.filter((i) => i.kind !== "method");
    const out = [], used = {};
    while (pool.length) {
      let best = -Infinity, bi = -1;
      for (let i = 0; i < pool.length; i++) {
        const it = pool[i], p1 = out[out.length - 1], p2 = out[out.length - 2];
        if ((used[capKey(it)] || 0) >= capOf(capKey(it))) continue;
        let sc = it.score;
        if (p1 && p1.kind === it.kind) sc -= 0.08;
        if (p1 && p1.topic === it.topic) sc -= 0.05;
        if (p1 && p2 && p1.area === it.area && p2.area === it.area) sc -= 0.03;
        if (sc > best) { best = sc; bi = i; }
      }
      if (bi < 0) break;   // everything left is over its kind's cap
      const it = pool.splice(bi, 1)[0];
      used[capKey(it)] = (used[capKey(it)] || 0) + 1;
      out.push({ ...it, rankScore: best });
    }
    // Exploration budget: up to two method cards, at positions 4 and 9.
    [3, 8].forEach((at, k) => { if (methods[k]) out.splice(Math.min(at, out.length), 0, { ...methods[k], explore: true }); });
    return out;
  }

  function timetableOrder(items, content, now) {
    const mins = minuteOfDay(now), dow = new Date(now).getDay();
    const today = content.slots.filter((s) => s.days.includes(dow)).sort((a, b) => hm(a.from) - hm(b.from));
    const order = (it) => {
      const i = today.findIndex((s) => (it.kind === "routine" ? s.routine === it.ref : s.fits.includes(it.kind)) && hm(s.to) > mins);
      return i < 0 ? 99 : i;
    };
    return items.slice().sort((a, b) => order(a) - order(b) || b.score - a.score);
  }

  // ---------- the feed ----------
  function special(kind, extra) { return { id: "special:" + kind, key: "special:" + kind, kind, area: "life", special: true, ...extra }; }

  function rank(state, content, now, opts = {}) {
    const s = state.settings, dk = dayKey(now), day = peekDay(state, dk);
    if (isQuiet(state, now)) return [special("quiet", { title: "Hard stop", note: `Screens off. Sleep is part of the work. The feed opens at ${s.quietTo}.` })];
    if (day.focus_min >= s.dailyLimitMin) return [special("limit", { title: "That's your limit for today", note: `${Math.round(day.focus_min / 6) / 10} hours of focus. You set the limit at ${s.dailyLimitMin / 60} h. Stop and rest.` })];

    const ctx = context(state, content, now);
    let cands = candidates(state, content, now);
    if (s.area !== "all") cands = cands.filter((c) => c.area === s.area || c.area === "life" || c.kind === "method");
    const scored = cands.map((c) => { const feat = features(c, state, now, ctx); return { ...c, feat, score: score(feat, s.weights) }; });

    let feed = s.mode === "timetable" ? timetableOrder(scored, content, now) : diversify(scored);
    feed = feed.slice(0, opts.limit || 12);
    if ((state.session.blocks || 0) >= s.breakEvery) feed.unshift(special("break", { title: "Break: 5 minutes", note: "Stand up, drink water, look out of a window. Then come back." }));
    feed.push(special("end", { title: "That's the feed", note: "Refresh for a new order, or call it a day." }));
    return feed;
  }

  // ---------- 5. the learning loop ----------
  function record(state, ev, now) {
    // Every event carries a unique id and its device, so two devices' logs can be merged without duplicates.
    const e = { ...ev, t: +now, id: uid(), dev: state.deviceId };
    if (e.type === "impression") {
      const st = state.stats[e.key];
      if (st && +now - (st.last || 0) < 10 * 60000) return false;   // one impression per card per 10 min
      bump(state, e.key, "shown", 1, now);
      state.stats[e.key].last = +now;
    } else if (e.type === "skip") {
      bump(state, e.key, "neg", 0.3, now);                           // weak: swiped past after a real look
    } else if (e.type === "snooze") {
      bump(state, e.key, "neg", 1, now);
      bump(state, "snooze:" + e.item, "neg", 1, now, SNOOZE_HALF_LIFE_DAYS);
      state.snoozed[e.item] = +now + SNOOZE_MS;
    } else if (e.type === "not_interested") {
      bump(state, e.key, "neg", 2, now);
      state.hidden[e.item] = true;
    } else if (e.type === "focus_break") {
      dayRec(state, dayKey(now)).focus_breaks++;
      state.daysAt = +now;
    }
    state.events.push(e);
    if (state.events.length > MAX_EVENTS) state.events.splice(0, state.events.length - MAX_EVENTS);
    return true;
  }

  function complete(state, content, card, res, now) {
    // XP caps apply to the whole day across devices, so measure before and after on the merged day.
    const dk = dayKey(now), day = dayRec(state, dk), before = dayXP(peekDay(state, dk));
    const min = Math.max(0, Math.round(res.minutes || 0));
    state.daysAt = +now;
    if (card.setup) {
      // Entering a page count is housekeeping, not a reading block: no learning signal, no streak.
      record(state, { type: "setup", item: card.id, key: card.key, kind: card.kind }, now);
    } else {
      record(state, { type: "complete", item: card.id, key: card.key, kind: card.kind, minutes: min, rating: res.rating || null }, now);
      bump(state, card.key, "pos", 1, now);
      state.stats[card.key].touched = +now;
      day.active = true;
    }
    // Focus minutes are study and writing time. Class, the walk, tablets and the log don't count.
    const routine = card.kind === "routine" ? content.routines.find((x) => x.id === card.ref) : null;
    const counts = KINDS_WITH_TIMER.includes(card.kind) && !(routine && !routine.study) && !card.setup;
    if (counts) day.focus_min += min;

    switch (card.kind) {
      case "read": {
        const b = state.books.find((x) => x.id === card.ref);
        if (!b) break;
        b.updatedAt = +now;
        if (res.totalPages) b.totalPages = Math.max(1, Math.round(res.totalPages));
        if (res.pageReached != null) {
          const newPage = Math.max(0, Math.min(b.totalPages || Infinity, Math.round(res.pageReached)));
          const read = Math.max(0, newPage - b.page);
          if (!card.setup && min >= 5 && read > 0) {
            const sp = Math.max(0.05, Math.min(5, read / min));
            b.speed = b.speed ? 0.7 * b.speed + 0.3 * sp : sp;
          }
          b.page = newPage;
          day.pages += card.setup ? 0 : read;
          if (b.totalPages && b.page >= b.totalPages) state.badges["finished:" + b.id] = dk;
        }
        day.study_min += card.setup ? 0 : min;
        break;
      }
      case "watch": {
        const m = state.materials.find((x) => x.id === card.ref);
        if (m) { m.minutesDone += min; m.updatedAt = +now; }
        day.study_min += min; break;
      }
      case "flash": day.study_min += min; break;
      case "exam": day.exam_q += Math.max(1, res.count || 1); day.study_min += min; break;
      case "write": day.write_min += min; break;
      case "essay": day.write_min += min; day.done.essay = true; break;
      case "expose": day.exposure += 1; break;
      case "routine": {
        if (routine && routine.sets) Object.assign(day, routine.sets);
        if (routine && routine.study) day.study_min += min;
        day.done[card.id] = true; break;
      }
      case "task": {
        const t = state.tasks.find((x) => x.id === card.ref);
        if (t && res.finished) { t.done = true; t.updatedAt = +now; }
        if (card.area === "writing") day.write_min += min; else if (card.area === "maf") day.study_min += min;
        break;
      }
      default: break; // methods earn nothing, by design
    }

    if (res.takeaway && res.takeaway.trim()) {
      state.notes.push({ id: uid(), t: +now, item: card.id, title: card.title, kind: card.kind, text: res.takeaway.trim() });
    }
    if (counts && min >= 25 && !(res.distractions > 0)) day.deep_blocks++;
    if (counts && min >= 15) state.session.blocks = (state.session.blocks || 0) + 1;
    awardBadges(state, now);
    const merged = peekDay(state, dk);
    return { xp: dayXP(merged) - before, day: merged };
  }

  /** SM-2 style spacing. grade: 1 again, 3 hard, 4 good, 5 easy. */
  function reviewCard(card, grade, now) {
    if (grade < 3) { card.reps = 0; card.interval = 1; }
    else {
      card.reps = (card.reps || 0) + 1;
      card.interval = card.reps === 1 ? 1 : card.reps === 2 ? 3 : Math.round((card.interval || 1) * (card.ef || 2.5));
      if (grade === 5) card.interval = Math.round(card.interval * 1.3);
    }
    card.ef = Math.max(1.3, (card.ef || 2.5) + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    card.due = dayKey(+now + card.interval * DAY);
    card.updatedAt = +now;
    return card;
  }
  function newCard(deck, q, a, now) { return { id: uid(), deck, q, a, ef: 2.5, interval: 0, reps: 0, due: dayKey(now), created: +now, updatedAt: +now }; }

  // ---------- XP, mirrored from The Game (game.js) ----------
  function dayXP(p) {
    let x = 0;
    x += Math.min(Math.floor((p.write_min || 0) / 5), 30);
    x += Math.min(Math.floor((p.study_min || 0) / 5), 30);
    if (p.class) x += 10;
    x += Math.min(p.exam_q || 0, 3) * 5;
    if (p.walk) x += 5;
    if (p.tablets) x += 5;
    if (p.log) x += 5;
    x += Math.min(p.exposure || 0, 2) * 25;
    return x;
  }
  function questsFor(days) {
    const sum = (f) => days.reduce((s, p) => s + (p[f] || 0), 0);
    return [
      ["Write 150 min", sum("write_min"), 150], ["Study 300 min", sum("study_min"), 300],
      ["10 exam questions", sum("exam_q"), 10], ["1 exposure", sum("exposure"), 1],
      ["Log 6 of 7 days", days.filter((p) => p.log).length, 6],
    ];
  }
  function totals(state, content, now) {
    const weeks = {}, days = allDays(state);
    for (const [k, d] of Object.entries(days)) (weeks[mondayKey(k + "T12:00:00")] = weeks[mondayKey(k + "T12:00:00")] || []).push(d);
    const bonus = Object.values(weeks).reduce((s, w) => s + questsFor(w).filter(([, v, m]) => v >= m).length * 50, 0);
    const xp = Object.values(days).reduce((s, d) => s + dayXP(d), 0) + bonus;
    let li = 0;
    content.levels.forEach((l, i) => { if (xp >= l[0]) li = i; });
    const next = content.levels[li + 1];
    return {
      xp, level: li + 1, name: content.levels[li][1], meaning: content.levels[li][2],
      next: next ? { name: next[1], at: next[0] } : null,
      pct: next ? (xp - content.levels[li][0]) / (next[0] - content.levels[li][0]) : 1,
      quests: questsFor(weeks[mondayKey(now)] || []), streak: streak(state, now),
    };
  }
  function streak(state, now) {
    let n = 0;
    const all = allDays(state);
    const d = new Date(now); d.setHours(12, 0, 0, 0);
    if (!(all[dayKey(d)] || {}).active) d.setDate(d.getDate() - 1);
    while ((all[dayKey(d)] || {}).active) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function awardBadges(state, now) {
    const b = state.badges, dk = dayKey(now), days = Object.values(allDays(state));
    const give = (id, cond) => { if (cond && !b[id]) b[id] = dk; };
    give("first-deep", days.some((d) => d.deep_blocks > 0));
    give("ten-deep", days.reduce((s, d) => s + d.deep_blocks, 0) >= 10);
    give("first-exposure", days.some((d) => d.exposure > 0));
    give("hundred-pages", days.reduce((s, d) => s + d.pages, 0) >= 100);
    give("streak-7", streak(state, now) >= 7);
    give("streak-30", streak(state, now) >= 30);
    give("fifty-cards", state.cards.length >= 50);
  }

  // ---------- evaluation: what the Stats screen shows ----------
  function metrics(state, now, days = 14) {
    const since = +now - days * DAY, ev = state.events.filter((e) => e.t >= since);
    const n = (type) => ev.filter((e) => e.type === type).length;
    const done = ev.filter((e) => e.type === "complete");
    const ratings = done.map((e) => e.rating).filter(Boolean);
    const kinds = new Set(done.map((e) => e.kind)), items = done.map((e) => e.item);
    const repeats = items.filter((x, i) => i > 0 && x === items[i - 1]).length;
    return {
      impressions: n("impression"), starts: n("start"), completes: done.length, skips: n("skip"), snoozes: n("snooze"), hides: n("not_interested"),
      completionRate: n("start") ? done.length / n("start") : null,
      satisfaction: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
      kindDiversity: kinds.size, repeatRate: items.length > 1 ? repeats / (items.length - 1) : 0,
    };
  }


  // ---------- sync: merging two devices ----------
  //
  // The rules, one per kind of data, chosen so that any two copies merge to the same result
  // no matter which way round or how often they're merged:
  //   days      per device, owned by that device; other devices' copies live in peers and the
  //             newest copy of each device wins. Totals are sums over devices, so nothing is
  //             counted twice and nothing is lost.
  //   events    union by id (the learning log). Stats, snoozes and hidden cards are rebuilt
  //             from the merged log, so learning on one device teaches the other.
  //   books, materials, tasks, flashcards
  //             per item, the most recently changed copy wins (last writer wins). Deleting is
  //             a "deleted" flag, so a delete travels instead of being undone by the other side.
  //   notes     union by id.   badges   union, earliest date.
  //   settings  the most recently changed copy wins, except feed order, side filter and phone
  //             reminders, which stay per device.
  //   resets    "reset learning" and "show hidden cards" are timestamps, so they travel too.
  const LOCAL_ONLY_SETTINGS = ["mode", "area", "remindersOn"];

  /** Deterministic tie-break, so both sides pick the same copy when timestamps are equal. */
  function newer(a, b) {
    const ta = (a && a.updatedAt) || 0, tb = (b && b.updatedAt) || 0;
    if (ta !== tb) return ta > tb ? a : b;
    return JSON.stringify(a) >= JSON.stringify(b) ? a : b;
  }
  function lww(listA, listB) {
    const byId = new Map();
    for (const x of listA || []) if (x && x.id != null) byId.set(x.id, x);
    for (const x of listB || []) if (x && x.id != null) byId.set(x.id, byId.has(x.id) ? newer(byId.get(x.id), x) : x);
    // Keep this device's order, then anything new from the other side.
    const order = [...(listA || []), ...(listB || [])].map((x) => x && x.id).filter((id, i, all) => id != null && all.indexOf(id) === i);
    return order.map((id) => byId.get(id));
  }
  function unionById(listA, listB, keep) {
    const byId = new Map();
    for (const x of [...(listA || []), ...(listB || [])]) if (x && x.id != null && !byId.has(x.id) && (!keep || keep(x))) byId.set(x.id, x);
    return [...byId.values()];
  }

  /** Rebuilds the learned stats, active snoozes and hidden cards from the event log. */
  function rebuildDerived(state) {
    const tmp = { stats: {}, snoozed: {}, hidden: {} };
    const resetAt = state.learningResetAt || 0, clearedAt = state.hiddenClearedAt || 0;
    for (const e of state.events) {
      if (!e || e.t < resetAt) continue;
      if (e.type === "impression") { bump(tmp, e.key, "shown", 1, e.t); tmp.stats[e.key].last = e.t; }
      else if (e.type === "skip") bump(tmp, e.key, "neg", 0.3, e.t);
      else if (e.type === "snooze") {
        bump(tmp, e.key, "neg", 1, e.t);
        bump(tmp, "snooze:" + e.item, "neg", 1, e.t, SNOOZE_HALF_LIFE_DAYS);
        tmp.snoozed[e.item] = Math.max(tmp.snoozed[e.item] || 0, e.t + SNOOZE_MS);
      } else if (e.type === "not_interested") {
        bump(tmp, e.key, "neg", 2, e.t);
        if (e.t > clearedAt) tmp.hidden[e.item] = true;
      } else if (e.type === "complete") { bump(tmp, e.key, "pos", 1, e.t); tmp.stats[e.key].touched = e.t; }
    }
    state.stats = tmp.stats; state.snoozed = tmp.snoozed; state.hidden = tmp.hidden;
    return state;
  }

  /**
   * Merges another device's state (or the PC hub's) into this one and returns a new state.
   * Never mutates either input. Safe to call repeatedly: merging the same data twice changes nothing.
   */
  function merge(local, remote) {
    if (!remote || typeof remote !== "object") return local;
    const out = { ...local };

    // Days: this device keeps its own; every other device's newest copy goes into peers.
    const peers = { ...(local.peers || {}) };
    const offer = (id, entry) => {
      if (!id || !entry || !entry.days) return;
      if (id === local.deviceId) return;                 // never let someone else's copy replace ours
      const cur = peers[id];
      if (!cur || (entry.at || 0) > (cur.at || 0)) peers[id] = entry;
    };
    for (const [id, entry] of Object.entries(remote.peers || {})) offer(id, entry);
    if (!remote.hub) offer(remote.deviceId, { name: remote.deviceName || "Device", days: remote.days || {}, at: remote.daysAt || 0 });
    out.peers = peers;
    // Restoring this device's own backup: its days come back if they're newer than what's here.
    if (remote.deviceId === local.deviceId && !remote.hub && (remote.daysAt || 0) > (local.daysAt || 0)) {
      out.days = remote.days || {}; out.daysAt = remote.daysAt;
    }

    out.learningResetAt = Math.max(local.learningResetAt || 0, remote.learningResetAt || 0);
    out.hiddenClearedAt = Math.max(local.hiddenClearedAt || 0, remote.hiddenClearedAt || 0);

    out.events = unionById(local.events, remote.events, (e) => typeof e.t === "number" && e.t >= out.learningResetAt)
      .sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : 1));
    if (out.events.length > MAX_EVENTS) out.events = out.events.slice(-MAX_EVENTS);

    out.books = lww(local.books, remote.books);
    out.materials = lww(local.materials, remote.materials);
    out.tasks = lww(local.tasks, remote.tasks);
    out.cards = lww(local.cards, remote.cards);
    out.notes = unionById(local.notes, remote.notes).sort((a, b) => (a.t || 0) - (b.t || 0));

    out.badges = { ...(remote.badges || {}) };
    for (const [k, v] of Object.entries(local.badges || {})) out.badges[k] = out.badges[k] && out.badges[k] < v ? out.badges[k] : v;

    const ls = local.settings || {}, rs = remote.settings || {};
    const win = (rs.updatedAt || 0) > (ls.updatedAt || 0) ? rs : ls;
    out.settings = { ...defaultSettings(), ...win, weights: { ...DEFAULT_WEIGHTS, ...(win.weights || {}) } };
    for (const k of LOCAL_ONLY_SETTINGS) if (k in ls) out.settings[k] = ls[k];

    return rebuildDerived(out);
  }

  /** What a device sends when it syncs: everything except what only makes sense on this device. */
  function syncPayload(state) {
    const { session, synced, quietOverrideUntil, sync, ...rest } = state;
    return rest;
  }

  // ---------- Obsidian: daily-note properties ----------
  const NUM_FIELDS = ["write_min", "study_min", "exam_q", "exposure"];
  const BOOL_FIELDS = ["class", "walk", "tablets", "log"];
  function dailyNoteProps(day) {
    const p = {};
    NUM_FIELDS.forEach((f) => (p[f] = day[f] || 0));
    BOOL_FIELDS.forEach((f) => (p[f] = !!day[f]));
    return p;
  }
  /** Adds what Soma recorded since the last sync to a daily note, so minutes the desktop
      timer already wrote are kept, not overwritten. Returns the new text and the new sync mark. */
  function mergeFrontmatter(text, props, synced) {
    synced = synced || {};
    let fm = "", body = text, has = false;
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
    if (m) { fm = m[1]; body = text.slice(m[0].length); has = true; }
    const lines = fm ? fm.split(/\r?\n/) : [];
    const get = (f) => { const l = lines.find((x) => x.startsWith(f + ":")); return l == null ? null : l.slice(f.length + 1).trim(); };
    const set = (f, v) => { const i = lines.findIndex((x) => x.startsWith(f + ":")); const line = `${f}: ${v}`; if (i >= 0) lines[i] = line; else lines.push(line); };
    for (const f of NUM_FIELDS) {
      const delta = (props[f] || 0) - (synced[f] || 0);
      const cur = parseInt(get(f) || "0", 10) || 0;
      set(f, Math.max(0, cur + delta));
    }
    for (const f of BOOL_FIELDS) set(f, get(f) === "true" || !!props[f]);
    const out = "---\n" + lines.join("\n") + "\n---\n" + (has ? body : "\n" + body);
    return { text: out, synced: { ...props } };
  }

  const SomaEngine = {
    DAY, SCHEMA_VERSION, RANK_VERSION, DEFAULT_WEIGHTS, HALF_LIFE_DAYS,
    dayKey, hm, minuteOfDay, inWindow, mondayKey, uid,
    defaultSettings, initialState, migrate, dayRec, readStat, bump, decayFactor,
    slotAt, isQuiet, chunkPages, candidates, context, features, score, diversify, timetableOrder, rank,
    record, complete, reviewCard, newCard, dayXP, questsFor, totals, streak, metrics,
    dailyNoteProps, mergeFrontmatter, weekTotals,
    blankDay, addDay, allDays, peekDay, merge, rebuildDerived, syncPayload, lww,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = SomaEngine;
  else root.SomaEngine = SomaEngine;
})(typeof window !== "undefined" ? window : globalThis);
