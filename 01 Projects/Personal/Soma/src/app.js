/* Soma — the interface. Everything the engine decides is in engine.js; this file only
   renders, listens and saves. Works offline in a browser and inside the Android WebView,
   where window.SomaNative adds haptics, file saving, sharing and phone reminders. */
(function () {
  "use strict";
  const E = window.SomaEngine, C = window.SomaContent;
  const KEY = "soma.state.v1";
  const NATIVE = window.SomaNative || null;
  const VERSION = window.SOMA_VERSION || "dev";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const now = () => Date.now();
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const ICON = { read: "📖", watch: "🎬", flash: "🗂️", exam: "❓", write: "✍️", essay: "🖋️", expose: "📣", task: "✅", method: "💡",
    quiet: "🌙", limit: "🛑", break: "☕", end: "🏁" };
  const ROUTINE_ICON = { walk: "🌅", tablets: "💊", preread: "👀", class: "🎓", notes: "📝", group: "👥", log: "📓", review: "🔁" };
  const LABEL = { read: "Read", watch: "Watch", flash: "Flashcards", exam: "Exam practice", write: "Write", essay: "Essay", expose: "Exposure",
    routine: "Routine", task: "Task", method: "Method", quiet: "Quiet hours", limit: "Limit", break: "Break", end: "End" };
  const BADGES = { "first-deep": "🧠 First deep block", "ten-deep": "🧠 10 deep blocks", "first-exposure": "📣 First exposure",
    "hundred-pages": "📚 100 pages", "streak-7": "🔥 7-day streak", "streak-30": "🔥 30-day streak", "fifty-cards": "🗂️ 50 flashcards" };

  // ---------- state ----------
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return E.migrate(JSON.parse(raw), C, now()); } catch (e) { /* fall through */ }
    return E.initialState(C, now());
  }
  let state = load();
  state.deviceName = NATIVE ? "Phone" : location.protocol === "file:" ? "PC (file)" : "PC";
  let saveTimer = null;
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 150); }
  function saveNow() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast("Couldn't save. Export a backup from Stats."); }
  }
  // A session is a run of blocks without a long gap; after 90 minutes away the break counter resets.
  if (!state.session.lastAt || now() - state.session.lastAt > 90 * 60000) state.session.blocks = 0;

  let feed = [], current = null, view = "feed", focusState = null, audio = null, wakeLock = null;

  // ---------- helpers ----------
  function toast(msg, ms = 2200) {
    const t = $("#toast"); t.innerHTML = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
  }
  function haptic(ms) { try { if (NATIVE) NATIVE.haptic(ms); else if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* optional */ } }
  function chime() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.25, 0.5].forEach((d, i) => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.frequency.value = [660, 880, 990][i]; o.connect(g); g.connect(audio.destination);
        g.gain.setValueAtTime(0.0001, audio.currentTime + d);
        g.gain.exponentialRampToValueAtTime(0.25, audio.currentTime + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + d + 0.22);
        o.start(audio.currentTime + d); o.stop(audio.currentTime + d + 0.25);
      });
    } catch (e) { /* no audio */ }
    haptic(300);
  }
  async function keepAwake(on) {
    if (NATIVE && NATIVE.keepAwake) { try { NATIVE.keepAwake(!!on); } catch (e) { /* optional */ } return; }
    try {
      if (on && navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen");
      else if (wakeLock) { await wakeLock.release(); wakeLock = null; }
    } catch (e) { wakeLock = null; }
  }
  function download(name, text, type = "application/json") {
    if (NATIVE && NATIVE.saveFile) {
      const path = NATIVE.saveFile(name, text);
      if (path) { toast("Saved to " + esc(path), 4000); return; }
      NATIVE.share(name, text); return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast("Copied"); return; } catch (e) { /* fall back */ }
    if (NATIVE) { NATIVE.share("Soma", text); return; }
    sheet(`<h2>Copy this</h2><textarea id="copybox" style="min-height:180px">${esc(text)}</textarea><div class="btns"><button class="btn" data-close>Close</button></div>`);
    $("#copybox").select();
  }
  const today = () => E.dayKey(now());
  // Today across every synced device: what you see. Writes go through the engine to this device's own record.
  const dayNow = () => E.peekDay(state, today());
  function accentFor(area) { return area === "maf" ? "var(--maf)" : area === "writing" ? "var(--writing)" : area === "method" ? "var(--method)" : "var(--life)"; }

  /** What finishing this card would add to today's XP, given what's already earned. */
  function previewXP(c) {
    const d = { ...dayNow() }, before = E.dayXP(d), m = c.minutes || 0;
    if (["read", "watch", "flash", "exam"].includes(c.kind) || (c.kind === "routine" && ["preread", "notes", "group", "review"].includes(c.ref))) d.study_min += m;
    if (c.kind === "exam") d.exam_q += 1;
    if (c.kind === "write" || c.kind === "essay") d.write_min += m;
    if (c.kind === "task") { if (c.area === "writing") d.write_min += m; else if (c.area === "maf") d.study_min += m; }
    if (c.kind === "expose") d.exposure += 1;
    if (c.kind === "routine") { const r = C.routines.find((x) => x.id === c.ref); if (r && r.sets) Object.assign(d, r.sets); }
    return E.dayXP(d) - before;
  }

  // ---------- top bar ----------
  function updateTop() {
    const t = E.totals(state, C, now());
    $("#xp").innerHTML = `<span class="lv">Lv ${t.level} · </span>${t.xp} XP · 🔥${t.streak}`;
    $("#xp").setAttribute("aria-label", `Level ${t.level} ${t.name}, ${t.xp} XP, ${t.streak} day streak. Open stats.`);
    document.querySelectorAll(".modes button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === state.settings.mode)));
    document.querySelectorAll(".areas button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.area === state.settings.area)));
  }

  // ---------- the feed ----------
  function cardHTML(c, i) {
    const icon = c.kind === "routine" ? ROUTINE_ICON[c.ref] || "🔁" : ICON[c.kind] || "•";
    const xp = c.special ? 0 : previewXP(c);
    const tags = c.special ? "" : `<p class="tags">#${esc(c.area)}${c.topic && c.topic !== c.area ? " #" + esc(slug(c.topic)) : ""}${xp ? ` · <span class="xpburst">+${xp} XP</span>` : ""}</p>`;
    let body = `<span class="kind${c.explore ? " explore" : ""}">${esc(LABEL[c.kind] || c.kind)}</span>
      <h2>${esc(c.title)}</h2>${c.by ? `<p class="by">${esc(c.by)}</p>` : ""}<p class="note">${esc(c.note)}</p>`;
    if (c.kind === "method") body += `<p class="tryit"><b>Try it:</b> ${esc(c.tryIt)}</p><p class="source">${esc(c.source)}<br><span class="evidence">${esc(c.evidence)}</span></p>`;
    if (c.kind === "end") {
      const t = E.totals(state, C, now()), d = dayNow();
      body += `<p class="meta">Today: <b>${E.dayXP(d)} XP</b> · ${d.focus_min} min of focus · ${d.pages} pages · ${d.deep_blocks} deep block${d.deep_blocks === 1 ? "" : "s"}</p>
        <div class="bar" style="margin:8px 0;--accent:var(--gold)"><i style="width:${Math.round(t.pct * 100)}%"></i></div>
        <p class="meta">Level ${t.level} ${esc(t.name)}${t.next ? ` · ${t.next.at - t.xp} XP to ${esc(t.next.name)}` : ""}</p>`;
    }
    if (!c.special) body += `${tags}${c.meta ? "" : ""}<button class="why" data-act="why" data-i="${i}" aria-expanded="false">Why this card?</button><div class="whybox" hidden></div>`;

    let rail = "";
    if (!c.special) {
      const primary = c.kind === "method" ? ["Open", "👁"] : c.noTimer || c.kind === "expose" ? ["Done", "✓"] : c.setup ? ["Set up", "⚙"] : ["Start", "▶"];
      rail = `<div class="rail">
        <button class="primary" data-act="start" data-i="${i}" aria-label="${primary[0]}: ${esc(c.title)}"><span class="ico">${primary[1]}</span>${primary[0]}</button>
        <button data-act="snooze" data-i="${i}" aria-label="Not now"><span class="ico">⏰</span>Not now</button>
        ${["method", "watch", "task"].includes(c.kind) ? `<button data-act="hide" data-i="${i}" aria-label="Not for me"><span class="ico">✕</span>Not for me</button>` : ""}
        ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener" aria-label="Open the course (needs internet)"><span class="ico">🔗</span>Open</a>` : ""}
      </div>`;
    } else if (c.kind === "quiet") rail = `<div class="rail"><button data-act="override" data-i="${i}"><span class="ico">⏳</span>10 more min</button></div>`;
    else if (c.kind === "break") rail = `<div class="rail"><button class="primary" data-act="breakdone" data-i="${i}"><span class="ico">✓</span>Done</button><button data-act="breakskip" data-i="${i}"><span class="ico">↷</span>Skip</button></div>`;
    else if (c.kind === "end") rail = `<div class="rail"><button class="primary" data-act="refresh" data-i="${i}"><span class="ico">↻</span>Refresh</button></div>`;
    else if (c.kind === "limit") rail = `<div class="rail"><button data-act="goto" data-view="settings"><span class="ico">⚙</span>Settings</button></div>`;

    const area = c.special ? "life" : c.area;
    return `<section class="card area-${esc(area)} kind-${esc(c.kind)}" data-i="${i}" aria-roledescription="card" aria-label="${esc(LABEL[c.kind] || "")}: ${esc(c.title)}">
      <div class="big" aria-hidden="true">${icon}</div><div class="card-body">${body}</div>${rail}
      ${i === 0 && feed.length > 1 ? `<div class="swipehint" aria-hidden="true">Swipe up · ↓ key</div>` : ""}</section>`;
  }

  let observer = null;
  function renderFeed(keepId) {
    current = null;
    feed = E.rank(state, C, now());
    const el = $("#view-feed");
    el.innerHTML = feed.map(cardHTML).join("");
    let idx = 0;
    if (keepId) { const k = feed.findIndex((c) => c.id === keepId); if (k >= 0) idx = k; }
    el.scrollTop = idx * el.clientHeight;
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting && en.intersectionRatio >= 0.6) onActive(+en.target.dataset.i);
    }, { root: el, threshold: [0.6] });
    el.querySelectorAll(".card").forEach((c) => observer.observe(c));
    updateTop();
    save();
  }

  function onActive(i) {
    if (current && current.i === i) return;
    if (current) {
      const prev = feed[current.i], dwell = now() - current.since;
      // A real look (3 s or more) and a swipe past is weak negative feedback. A quick flick is no signal.
      if (prev && !prev.special && !current.started && dwell >= 3000) { E.record(state, { type: "skip", item: prev.id, key: prev.key, kind: prev.kind, dwell }, now()); save(); }
    }
    const c = feed[i];
    if (!c) return;
    current = { i, id: c.id, since: now(), started: false };
    const mark = current;
    setTimeout(() => {
      if (current === mark && !c.special && E.record(state, { type: "impression", item: c.id, key: c.key, kind: c.kind }, now())) save();
    }, 1000);
  }

  function why(i, btn) {
    const c = feed[i], box = btn.nextElementSibling, w = state.settings.weights, f = c.feat;
    if (!box.hidden) { box.hidden = true; btn.setAttribute("aria-expanded", "false"); return; }
    const rows = [["T", "Fits right now", f.T], ["C", "You usually finish these", f.C], ["W", "Importance", f.W], ["F", "Due / not done lately", f.F], ["N", "New to you", f.N]];
    const reasons = [];
    if (f.T >= 0.9) reasons.push("it belongs to this time slot");
    if (f.C >= 0.7) reasons.push("you tend to finish it");
    if (f.F >= 0.8) reasons.push("you haven't done it lately");
    if (f.W >= 0.85) reasons.push("it matters most this week");
    if (c.explore) reasons.push("it's an exploration card, to show you something new");
    if (f.repeat) reasons.push("it's lower because you just did this kind of work");
    if (f.penalty > (f.repeat ? 0.15 : 0)) reasons.push(`it's lower because you said "not now" recently`);
    box.innerHTML = `<p style="margin:0 0 6px">Shown because ${esc(reasons.join(", ") || "it scored highest of what's left")}.</p><table>${rows.map(([k, n, v]) =>
      `<tr><td>${k}</td><td>${n}</td><td style="width:40%"><div class="bar" style="--accent:${accentFor(c.area)}"><i style="width:${Math.round(v * 100)}%"></i></div></td><td>${(w[k] * v).toFixed(2)}</td></tr>`).join("")}
      ${f.penalty ? `<tr><td></td><td>Penalty</td><td></td><td>−${f.penalty.toFixed(2)}</td></tr>` : ""}
      <tr><td></td><td><b>Score</b></td><td></td><td><b>${c.score.toFixed(2)}</b></td></tr></table>
      <p style="margin:6px 0 0">S = ${w.T}·T + ${w.C}·C + ${w.W}·W + ${w.F}·F + ${w.N}·N − penalty. A weighted formula you can change in Settings, not a trained AI.</p>`;
    box.hidden = false; btn.setAttribute("aria-expanded", "true");
  }

  // ---------- starting a card ----------
  function start(c) {
    if (current && current.id === c.id) current.started = true;
    try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio */ }
    E.record(state, { type: "start", item: c.id, key: c.key, kind: c.kind }, now()); save();
    if (c.kind === "method") return methodSheet(c);
    if (c.kind === "read" && c.setup) return setupSheet(c);
    if (c.kind === "flash") return flashSession(c);
    if (c.form === "log") return logSheet(c);
    if (c.noTimer || c.kind === "expose") return completeSheet(c, { minutes: c.noTimer ? c.minutes : 10 });
    if (c.kind === "routine" && c.ref === "tablets") return finish(c, { minutes: 1 });
    focus(c);
  }

  // ---------- focus timer ----------
  function focus(c) {
    const total = (c.minutes || state.settings.blockMin) * 60000;
    focusState = { c, start: now(), total, pausedAt: null, pausedMs: 0, distractions: 0, leftAt: null };
    const o = $("#focus");
    o.innerHTML = `<p class="small">${esc(LABEL[c.kind] || "")} · ${c.area === "maf" ? "MAF" : c.area === "writing" ? "Writing" : ""}</p>
      <h2>${esc(c.title)}</h2><p class="small">${esc(c.note || "")}</p>
      <div class="ring" style="--accent:${accentFor(c.area)}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="45" fill="none" stroke="var(--line)" stroke-width="6"/>
      <circle id="arc" cx="50" cy="50" r="45" fill="none" stroke="${accentFor(c.area)}" stroke-width="6" stroke-linecap="round" stroke-dasharray="282.7" stroke-dashoffset="0"/></svg>
      <div class="t" id="clock" role="timer" aria-live="off">--:--</div></div>
      <p class="small" id="distract">No focus breaks yet. Leaving the app counts as one.</p>
      <div class="btns" style="justify-content:center"><button class="btn" id="pause">Pause</button><button class="btn primary" id="finish">Finish now</button><button class="btn" id="cancel">Cancel</button></div>`;
    o.hidden = false;
    keepAwake(true);
    if (NATIVE && NATIVE.scheduleTimer) NATIVE.scheduleTimer(String(now() + total), "Time's up: " + c.title);
    $("#pause").onclick = () => {
      if (focusState.pausedAt) { focusState.pausedMs += now() - focusState.pausedAt; focusState.pausedAt = null; $("#pause").textContent = "Pause"; }
      else { focusState.pausedAt = now(); $("#pause").textContent = "Resume"; }
    };
    $("#finish").onclick = () => endFocus(false);
    $("#cancel").onclick = () => { if (confirm("Stop this block without logging it?")) closeFocus(); };
    focusState.timer = setInterval(tick, 250); tick();
  }
  function elapsed() {
    const f = focusState;
    return now() - f.start - f.pausedMs - (f.pausedAt ? now() - f.pausedAt : 0);
  }
  function tick() {
    if (!focusState) return;
    const left = Math.max(0, focusState.total - elapsed());
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    $("#clock").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    $("#arc").setAttribute("stroke-dashoffset", String(282.7 * (1 - left / focusState.total)));
    document.title = `${$("#clock").textContent} · Soma`;
    if (left <= 0) endFocus(true);
  }
  function closeFocus() {
    if (focusState) clearInterval(focusState.timer);
    focusState = null; $("#focus").hidden = true; document.title = "Soma"; keepAwake(false);
    sync.flush();
    if (NATIVE && NATIVE.cancelTimer) NATIVE.cancelTimer();
  }
  function endFocus(natural) {
    const f = focusState; if (!f) return;
    const minutes = Math.max(1, Math.round(elapsed() / 60000));
    closeFocus();
    if (natural) chime();
    completeSheet(f.c, { minutes, distractions: f.distractions });
  }
  document.addEventListener("visibilitychange", () => {
    if (!focusState || focusState.pausedAt) return;
    // The first 10 seconds are a grace period: a permission prompt or a last look at the
    // phone when you press Start isn't a lapse of focus.
    if (document.hidden && elapsed() < 10000) return;
    if (document.hidden) {
      focusState.distractions++; focusState.leftAt = now();
      E.record(state, { type: "focus_break", item: focusState.c.id, key: focusState.c.key }, now()); saveNow();
    } else if (focusState.leftAt) {
      const away = Math.round((now() - focusState.leftAt) / 60000);
      $("#distract").textContent = `${focusState.distractions} focus break${focusState.distractions > 1 ? "s" : ""}. ${focusState.distractions === 1 ? "The timer kept running." : ""}`;
      toast(away >= 1 ? `Away ${away} min. Counted as a focus break.` : "Focus break counted. Back to it.");
      focusState.leftAt = null; tick();
    }
  });

  // ---------- sheets ----------
  function sheet(html) {
    const w = $("#sheetwrap"); $("#sheet").innerHTML = html; w.hidden = false;
    // Focus the sheet itself, not its first box: on a phone that would pop the keyboard over the form.
    $("#sheet").scrollTop = 0; $("#sheet").focus({ preventScroll: true });
  }
  function closeSheet() { $("#sheetwrap").hidden = true; $("#sheet").innerHTML = ""; if (typeof sync !== "undefined") sync.flush(); }
  function ratingHTML() {
    return `<label>How useful was this block?</label><div class="rating" role="group" aria-label="Rating">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-rate="${n}" aria-pressed="false">${n}</button>`).join("")}</div>`;
  }
  function readRating() { const b = $("#sheet").querySelector('[data-rate][aria-pressed="true"]'); return b ? +b.dataset.rate : null; }

  function completeSheet(c, pre) {
    const f = [];
    f.push(`<h2>${esc(ICON[c.kind] || ROUTINE_ICON[c.ref] || "✓")} ${esc(c.title)}</h2>`);
    if (pre.distractions === 0 && pre.minutes >= 25) f.push(`<p class="small">🧠 A deep block: ${pre.minutes} minutes and no focus breaks.</p>`);
    if (!c.noTimer && c.kind !== "expose") f.push(`<label for="f-min">Minutes</label><input id="f-min" type="number" inputmode="numeric" min="0" max="600" value="${pre.minutes || 0}">`);
    if (c.kind === "read") {
      f.push(`<label for="f-page">Page you reached</label><input id="f-page" type="number" min="0" value="${c.pages ? c.pages.to : ""}">`);
      f.push(`<label for="f-take">Close the book. One thing you remember:</label><textarea id="f-take" placeholder="Retrieval practice: write it from memory"></textarea>`);
      f.push(`<details><summary class="small">Make a flashcard from it</summary><label for="f-q">Question</label><input id="f-q" type="text"><label for="f-a">Answer</label><input id="f-a" type="text"></details>`);
    } else if (c.kind === "exam") {
      f.push(`<label for="f-count">Questions answered</label><input id="f-count" type="number" min="1" max="5" value="1">`);
      f.push(`<label for="f-take">What tripped you up?</label><textarea id="f-take"></textarea>`);
    } else if (c.kind === "write" || c.kind === "essay") {
      f.push(`<label for="f-take">Where did you stop? One line for tomorrow</label><textarea id="f-take" placeholder="Stop mid-scene, while you know what comes next"></textarea>`);
    } else if (c.kind === "expose") {
      f.push(`<label for="f-take">What did you show, and to whom?</label><textarea id="f-take"></textarea>`);
    } else if (c.kind === "task") {
      f.push(`<label><input id="f-done" type="checkbox"> The whole task is finished</label>`);
    } else if (c.kind === "watch" || (c.kind === "routine" && !c.noTimer)) {
      f.push(`<label for="f-take">One takeaway (optional)</label><textarea id="f-take"></textarea>`);
    }
    if (!c.noTimer && c.kind !== "expose") f.push(ratingHTML());
    f.push(`<div class="btns"><button class="btn primary" id="f-save">Log it</button><button class="btn" data-close>Cancel</button></div>`);
    sheet(f.join(""));
    $("#f-save").onclick = () => {
      const v = (id) => { const el = $("#" + id); return el ? el.value : null; };
      const res = { minutes: c.noTimer || c.kind === "expose" ? c.minutes : +(v("f-min") || 0), distractions: pre.distractions || 0, rating: readRating(), takeaway: v("f-take") || "" };
      if (c.kind === "read" && v("f-page") !== "") res.pageReached = +v("f-page");
      if (c.kind === "exam") res.count = +(v("f-count") || 1);
      if (c.kind === "task") res.finished = $("#f-done").checked;
      if (c.kind === "read" && v("f-q") && v("f-a")) { state.cards.push(E.newCard(c.topic || "General", v("f-q"), v("f-a"), now())); }
      closeSheet(); finish(c, res);
    };
  }

  function setupSheet(c) {
    sheet(`<h2>📖 ${esc(c.title)}</h2><p class="small">${esc(c.by || "")}</p>
      <label for="s-total">How many pages?</label><input id="s-total" type="number" min="1" placeholder="e.g. 640">
      <label for="s-page">Page you're on now</label><input id="s-page" type="number" min="0" value="0">
      <div class="btns"><button class="btn primary" id="s-save">Save</button><button class="btn" data-close>Later</button></div>`);
    $("#s-save").onclick = () => {
      const total = +$("#s-total").value, page = +$("#s-page").value || 0;
      if (!total) { toast("Enter the page count"); return; }
      closeSheet(); finish(c, { minutes: 0, totalPages: total, pageReached: page }, true);
    };
  }

  function methodSheet(c) {
    const form = c.form === "intention"
      ? `<label for="m-when">When…</label><input id="m-when" type="text" placeholder="I get home from class"><label for="m-will">…I will</label><input id="m-will" type="text" placeholder="open Soma and start the first card">` : "";
    sheet(`<h2>💡 ${esc(c.title)}</h2><p>${esc(c.note)}</p><p class="tryit" style="border-left:3px solid var(--method);padding-left:10px"><b>Try it:</b> ${esc(c.tryIt)}</p>${form}
      <p class="small">${esc(c.source)} · <i>${esc(c.evidence)}</i></p><p class="small">Method cards earn no XP. Using them is what pays.</p>
      <div class="btns"><button class="btn primary" id="m-ok">Got it</button><button class="btn" id="m-no">Not for me</button></div>`);
    $("#m-ok").onclick = () => {
      let take = "";
      if (c.form === "intention" && $("#m-when").value && $("#m-will").value) take = `When ${$("#m-when").value}, I will ${$("#m-will").value}.`;
      closeSheet(); finish(c, { minutes: 0, takeaway: take }, true);
    };
    $("#m-no").onclick = () => { closeSheet(); hide(c); };
  }

  function logSheet(c) {
    const qs = ["What I did", "One exposure (sent, asked, showed)", "Tablets taken?", "Spend logged in Expenses?", "Left work on time?"];
    sheet(`<h2>📓 The five-line log</h2>${qs.map((q, i) => `<label for="l${i}">${i + 1}. ${q}</label><input id="l${i}" type="text">`).join("")}
      <p class="small">Copy it into tonight's daily note too, from Stats.</p>
      <div class="btns"><button class="btn primary" id="l-save">Log it</button><button class="btn" data-close>Cancel</button></div>`);
    $("#l-save").onclick = () => {
      const text = qs.map((q, i) => `${i + 1}. ${q}: ${$("#l" + i).value}`).join("\n");
      closeSheet(); finish(c, { minutes: 5, takeaway: text });
    };
  }

  // ---------- flashcards ----------
  function flashSession(c) {
    const queue = state.cards.filter((x) => x.deck === c.ref && x.due <= today());
    const t0 = now(); let again = new Set();
    const o = $("#focus"); o.hidden = false;
    const show = () => {
      const card = queue[0];
      if (!card) {
        o.hidden = true;
        return completeSheet(c, { minutes: Math.max(1, Math.round((now() - t0) / 60000)) });
      }
      o.innerHTML = `<p class="small">🗂️ ${esc(c.ref)} · ${queue.length} left</p><div class="flashcard"><div class="q"><b>${esc(card.q)}</b></div>
        <div class="a" hidden>${esc(card.a)}</div></div>
        <div class="btns" id="fbtns" style="justify-content:center"><button class="btn primary" id="reveal">Show answer</button><button class="btn" id="fstop">Stop</button></div>`;
      $("#fstop").onclick = () => { o.hidden = true; completeSheet(c, { minutes: Math.max(1, Math.round((now() - t0) / 60000)) }); };
      $("#reveal").onclick = () => {
        o.querySelector(".a").hidden = false;
        $("#fbtns").innerHTML = [[1, "Again"], [3, "Hard"], [4, "Good"], [5, "Easy"]].map(([g, n]) => `<button class="btn${g === 4 ? " primary" : ""}" data-g="${g}">${n}</button>`).join("");
        $("#fbtns").querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => {
          const g = +b.dataset.g; E.reviewCard(card, g, now()); queue.shift();
          if (g < 3 && !again.has(card.id)) { again.add(card.id); queue.push(card); }
          save(); show();
        }));
      };
    };
    show();
  }

  // ---------- finishing ----------
  function finish(c, res, quiet) {
    const before = E.totals(state, C, now());
    const r = E.complete(state, C, c, res, now());
    state.session.lastAt = now();
    saveNow();
    const after = E.totals(state, C, now());
    haptic(40);
    if (!quiet) {
      const notes = state.notes.filter((n) => now() - n.t > E.DAY && n.text.length > 8);
      let reveal = "";
      if (notes.length) {
        const n = notes[Math.floor(Math.random() * notes.length)];
        reveal = `<div class="reveal"><p class="small" style="margin:0 0 4px">From your notes, ${esc(E.dayKey(n.t))} · ${esc(n.title)}</p>${esc(n.text)}</div>`;
      } else {
        const m = C.methods[Math.floor(Math.random() * C.methods.length)];
        reveal = `<div class="reveal"><p class="small" style="margin:0 0 4px">💡 ${esc(m.name)}</p>${esc(m.idea)}</div>`;
      }
      const lvl = after.level > before.level ? `<h2 style="color:var(--gold)">Level up: ${esc(after.name)}</h2><p class="small">${esc(after.meaning)}</p>` : "";
      sheet(`${lvl}<h2>${r.xp > 0 ? `<span class="xpburst">+${r.xp} XP</span>` : "Logged"}</h2>
        <p class="small">Today ${E.dayXP(r.day)} XP · 🔥 ${after.streak}-day streak${r.day.deep_blocks ? ` · 🧠 ${r.day.deep_blocks} deep` : ""}</p>${reveal}
        <div class="btns"><button class="btn primary" data-close>Next card →</button></div>`);
      if (lvl) chime();
    } else toast(r.xp > 0 ? `+${r.xp} XP` : "Saved");
    renderFeed();
    sync.soon();
  }
  function snooze(c) { E.record(state, { type: "snooze", item: c.id, key: c.key, kind: c.kind }, now()); toast("Back in 2 hours"); renderFeed(); sync.soon(); }
  function hide(c) { E.record(state, { type: "not_interested", item: c.id, key: c.key, kind: c.kind }, now()); toast("Won't show that again. Undo in Settings."); renderFeed(); sync.soon(); }

  // ---------- library ----------
  function renderLibrary() {
    const bookRow = (b) => {
      const pct = b.totalPages ? Math.round((b.page / b.totalPages) * 100) : 0;
      return `<li><div class="row"><span class="dot ${esc(b.area)}"></span><div class="grow"><b>${esc(b.title)}</b><div class="small">${esc(b.author || "")} · ${esc(b.module || "")}</div>
        <div class="bar" style="margin:6px 0;--accent:${accentFor(b.area)}"><i style="width:${pct}%"></i></div>
        <div class="small">${b.totalPages ? `p. ${b.page} of ${b.totalPages} · ${pct}%` : "Page count not set"}${b.speed ? ` · ${b.speed.toFixed(2)} pages/min` : ""}${b.active ? "" : " · paused"}</div></div>
        <button class="btn tiny" data-act="editbook" data-id="${esc(b.id)}">Edit</button></div></li>`;
    };
    const decks = {};
    state.cards.forEach((c) => { const d = (decks[c.deck] = decks[c.deck] || { n: 0, due: 0 }); d.n++; if (c.due <= today()) d.due++; });
    $("#view-library").innerHTML = `<div class="page">
      <h3>📚 Books</h3><div class="panel"><ul class="list">${state.books.filter((b) => !b.deleted).map(bookRow).join("")}</ul>
        <div class="btns"><button class="btn" data-act="addbook">+ Add a book</button></div></div>
      <h3>🗂️ Flashcards</h3><div class="panel">${Object.keys(decks).length ? `<ul class="list">${Object.entries(decks).map(([d, x]) => `<li class="row"><div class="grow"><b>${esc(d)}</b><div class="small">${x.n} cards · ${x.due} due</div></div></li>`).join("")}</ul>` : `<p class="small">No cards yet. Add them here, or after a reading block.</p>`}
        <div class="btns"><button class="btn" data-act="addcard">+ Add a card</button></div></div>
      <h3>✅ Your tasks</h3><div class="panel">${state.tasks.filter((t) => !t.done).length ? `<ul class="list">${state.tasks.filter((t) => !t.done).map((t) => `<li class="row"><span class="dot ${esc(t.area)}"></span><div class="grow"><b>${esc(t.title)}</b><div class="small">${t.minutes} min${t.due ? " · due " + esc(t.due) : ""}</div></div><button class="btn tiny" data-act="donetask" data-id="${esc(t.id)}">Done</button></li>`).join("")}</ul>` : `<p class="small">Assignments, a dissertation step, anything with a deadline. They join the feed.</p>`}
        <div class="btns"><button class="btn" data-act="addtask">+ Add a task</button></div></div>
      <h3>🎬 Online materials</h3><div class="panel"><ul class="list">${state.materials.map((m) => `<li class="row"><span class="dot ${esc(m.area)}"></span><div class="grow"><b>${esc(m.title)}</b><div class="small">${esc(m.module)} · ${m.minutesDone} min done</div></div>
        <button class="btn tiny" data-act="togglemat" data-id="${esc(m.id)}">${m.active ? "Pause" : "Resume"}</button></li>`).join("")}</ul></div>
      <h3>📝 Your notes</h3><div class="panel">${state.notes.length ? `<ul class="list">${state.notes.slice(-30).reverse().map((n) => `<li><div class="small">${esc(E.dayKey(n.t))} · ${esc(n.title)}</div>${esc(n.text).replace(/\n/g, "<br>")}</li>`).join("")}</ul>` : `<p class="small">What you write after each block lands here, and comes back to you later as a reminder.</p>`}
        <div class="btns"><button class="btn" data-act="exportnotes">Export notes as Markdown</button></div></div>
    </div>`;
  }

  function bookSheet(b) {
    const isNew = !b;
    b = b || { id: E.uid(), title: "", author: "", module: "", area: "maf", totalPages: null, page: 0, active: true, priority: 2, speed: null };
    sheet(`<h2>${isNew ? "Add a book" : "Edit book"}</h2>
      <label for="b-title">Title</label><input id="b-title" type="text" value="${esc(b.title)}">
      <label for="b-author">Author</label><input id="b-author" type="text" value="${esc(b.author)}">
      <label for="b-module">Module or topic</label><input id="b-module" type="text" value="${esc(b.module)}">
      <div class="row"><div class="grow"><label for="b-area">Side</label><select id="b-area"><option value="maf"${b.area === "maf" ? " selected" : ""}>🟦 MAF</option><option value="writing"${b.area === "writing" ? " selected" : ""}>🟧 Writing</option></select></div>
      <div class="grow"><label for="b-prio">Priority</label><select id="b-prio">${[1, 2, 3].map((p) => `<option${b.priority === p ? " selected" : ""}>${p}</option>`).join("")}</select></div></div>
      <div class="row"><div class="grow"><label for="b-total">Total pages</label><input id="b-total" type="number" min="1" value="${b.totalPages || ""}"></div>
      <div class="grow"><label for="b-page">Current page</label><input id="b-page" type="number" min="0" value="${b.page || 0}"></div></div>
      <label><input id="b-active" type="checkbox"${b.active ? " checked" : ""}> In the feed</label>
      <div class="btns"><button class="btn primary" id="b-save">Save</button>${isNew ? "" : `<button class="btn danger" id="b-del">Remove</button>`}<button class="btn" data-close>Cancel</button></div>`);
    $("#b-save").onclick = () => {
      if (!$("#b-title").value.trim()) { toast("Give it a title"); return; }
      Object.assign(b, { updatedAt: now(), title: $("#b-title").value.trim(), author: $("#b-author").value.trim(), module: $("#b-module").value.trim() || "General",
        area: $("#b-area").value, priority: +$("#b-prio").value, totalPages: +$("#b-total").value || null, page: +$("#b-page").value || 0, active: $("#b-active").checked });
      if (isNew) state.books.push(b);
      closeSheet(); saveNow(); renderLibrary(); renderFeed();
    };
    if (!isNew) $("#b-del").onclick = () => { if (confirm("Remove this book? Its progress is lost.")) { Object.assign(b, { deleted: true, active: false, updatedAt: now() }); closeSheet(); saveNow(); renderLibrary(); renderFeed(); } };
  }
  function cardSheet() {
    const decks = [...new Set(state.cards.map((c) => c.deck).concat(C.modules))];
    sheet(`<h2>Add a flashcard</h2><label for="c-deck">Deck</label><input id="c-deck" type="text" list="decklist" value="${esc(decks[0])}"><datalist id="decklist">${decks.map((d) => `<option value="${esc(d)}">`).join("")}</datalist>
      <label for="c-q">Question</label><textarea id="c-q"></textarea><label for="c-a">Answer</label><textarea id="c-a"></textarea>
      <div class="btns"><button class="btn primary" id="c-save">Add</button><button class="btn" id="c-more">Add and another</button><button class="btn" data-close>Close</button></div>`);
    const add = () => {
      if (!$("#c-q").value.trim() || !$("#c-a").value.trim()) { toast("Question and answer, please"); return false; }
      state.cards.push(E.newCard($("#c-deck").value.trim() || "General", $("#c-q").value.trim(), $("#c-a").value.trim(), now())); saveNow(); return true;
    };
    $("#c-save").onclick = () => { if (add()) { closeSheet(); renderLibrary(); renderFeed(); } };
    $("#c-more").onclick = () => { if (add()) { $("#c-q").value = ""; $("#c-a").value = ""; $("#c-q").focus(); toast("Added"); } };
  }
  function taskSheet() {
    sheet(`<h2>Add a task</h2><label for="t-title">What is it?</label><input id="t-title" type="text" placeholder="e.g. Draft the concept note">
      <div class="row"><div class="grow"><label for="t-area">Side</label><select id="t-area"><option value="maf">🟦 MAF</option><option value="writing">🟧 Writing</option><option value="life">Life</option></select></div>
      <div class="grow"><label for="t-min">Block (min)</label><input id="t-min" type="number" min="5" value="${state.settings.blockMin}"></div></div>
      <div class="row"><div class="grow"><label for="t-due">Due (optional)</label><input id="t-due" type="date"></div>
      <div class="grow"><label for="t-prio">Priority</label><select id="t-prio"><option>1</option><option selected>2</option><option>3</option></select></div></div>
      <div class="btns"><button class="btn primary" id="t-save">Add</button><button class="btn" data-close>Cancel</button></div>`);
    $("#t-save").onclick = () => {
      if (!$("#t-title").value.trim()) { toast("Name the task"); return; }
      state.tasks.push({ id: E.uid(), title: $("#t-title").value.trim(), area: $("#t-area").value, minutes: +$("#t-min").value || 25, due: $("#t-due").value || null, priority: +$("#t-prio").value, done: false, updatedAt: now() });
      closeSheet(); saveNow(); renderLibrary(); renderFeed();
    };
  }
  function exportNotes() {
    const by = {};
    state.notes.forEach((n) => (by[n.title] = by[n.title] || []).push(n));
    const md = `---\ntags: [soma, notes]\ndate: ${today()}\n---\n\n# Soma notes, exported ${today()}\n\n` +
      Object.entries(by).map(([t, ns]) => `## ${t}\n\n${ns.map((n) => `- **${E.dayKey(n.t)}** ${n.text.replace(/\n/g, "\n  ")}`).join("\n")}\n`).join("\n");
    download(`Soma notes ${today()}.md`, md, "text/markdown");
  }

  // ---------- stats ----------
  function dailyYAML() { const p = E.dailyNoteProps(dayNow()); return Object.entries(p).map(([k, v]) => `${k}: ${v}`).join("\n"); }
  function renderStats() {
    const t = E.totals(state, C, now()), d = dayNow(), m = E.metrics(state, now());
    const last = []; for (let i = 13; i >= 0; i--) { const k = E.dayKey(now() - i * E.DAY); last.push([k, E.dayXP(state.days[k] || {})]); }
    const max = Math.max(60, ...last.map((x) => x[1]));
    const pct = (x) => (x == null ? "—" : Math.round(x * 100) + "%");
    $("#view-stats").innerHTML = `<div class="page">
      <div class="panel"><div class="level">Level ${t.level} · ${esc(t.name)} <small>${esc(t.meaning)}</small></div>
        <div class="bar" style="margin:8px 0;--accent:var(--gold)"><i style="width:${Math.round(t.pct * 100)}%"></i></div>
        <div class="small">${t.xp} XP${t.next ? ` · ${t.next.at - t.xp} to ${esc(t.next.name)}` : ""} · 🔥 ${t.streak}-day streak</div></div>
      <h3>Today</h3><div class="stat-grid">
        <div class="stat"><b>${E.dayXP(d)}</b>XP today</div><div class="stat"><b>${d.focus_min}</b>focus minutes</div>
        <div class="stat"><b>${d.pages}</b>pages read</div><div class="stat"><b>${d.deep_blocks}</b>deep blocks · ${d.focus_breaks} breaks</div></div>
      <div class="panel"><div class="small">For today's daily note in Obsidian:</div><pre style="margin:6px 0;white-space:pre-wrap">${esc(dailyYAML())}</pre>
        <div class="btns"><button class="btn" data-act="copyyaml">Copy</button>${state.sync.hubObsidian && now() - state.sync.lastAt < 2 * E.DAY ? `</div><p class="small">✅ Your PC hub writes these into Obsidian on every sync.</p></div>` : window.showDirectoryPicker && !NATIVE ? `<button class="btn primary" data-act="obsidian">Save to Obsidian</button></div></div>` : "</div></div>"}
      <h3>This week's quests</h3><div class="panel">${t.quests.map(([n, v, mx]) => `<div style="margin:6px 0"><div class="row"><span class="grow">${esc(n)}</span><span class="small">${v} / ${mx}${v >= mx ? " ✅ +50" : ""}</span></div><div class="bar" style="--accent:var(--gold)"><i style="width:${Math.min(100, Math.round((v / mx) * 100))}%"></i></div></div>`).join("")}</div>
      <h3>Boss fights</h3><div class="panel"><ul class="list">${C.bosses.map((b) => { const k = Math.ceil((new Date(b.from) - now()) / E.DAY), e = Math.ceil((new Date(b.to) - now()) / E.DAY);
        return `<li class="row"><span class="dot ${b.area}"></span><span class="grow">${esc(b.name)}</span><span class="small">${k > 0 ? `in ${k} days` : e >= 0 ? "⚔️ now" : "done"}</span></li>`; }).join("")}</ul></div>
      <h3>Last 14 days</h3><div class="panel" style="padding-bottom:26px"><div class="days">${last.map(([k, x]) => `<div style="height:${Math.round((x / max) * 100)}%" title="${k}: ${x} XP"><span>${k.slice(8)}</span></div>`).join("")}</div></div>
      <h3>Badges</h3><div class="panel">${Object.keys(state.badges).length ? Object.entries(state.badges).map(([b, dk]) => `<span class="badge" title="${esc(dk)}">${esc(BADGES[b] || (b.startsWith("finished:") ? "📕 Finished " + (state.books.find((x) => "finished:" + x.id === b) || { title: "a book" }).title : b))}</span>`).join("") : `<p class="small">Your first deep block earns the first one.</p>`}</div>
      <h3>Is the feed working? (last 14 days)</h3><div class="panel small">
        Cards started then finished: <b>${pct(m.completionRate)}</b> · how useful, out of 5: <b>${m.satisfaction ? m.satisfaction.toFixed(1) : "—"}</b><br>
        Finished ${m.completes} · skipped ${m.skips} · "not now" ${m.snoozes} · hidden ${m.hides} · kinds of work done: ${m.kindDiversity} · same card twice in a row: ${pct(m.repeatRate)}<br>
        Finishing cards isn't the goal by itself. A high rating and a mix of work matter more.</div>
      <h3>Your data</h3><div class="panel"><p class="small">${state.sync.lastAt ? "Synced with your PC " + ago(state.sync.lastAt) + ". " : ""}Everything stays on your own devices. Without Wi-Fi, carry a backup file across (USB, Bluetooth, WhatsApp): importing it <b>merges</b>, it never replaces.</p>
        <div class="btns"><button class="btn" data-act="export">Export backup</button><label class="btn" style="margin:0;color:inherit">Import backup<input type="file" accept=".json,application/json" data-act="import" hidden></label></div></div>
    </div>`;
  }

  // Desktop: write today's numbers straight into the vault's daily note (Chrome/Edge only).
  function idb() {
    return new Promise((res, rej) => { const r = indexedDB.open("soma", 1); r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  }
  async function kv(key, val) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction("kv", val === undefined ? "readonly" : "readwrite"), st = tx.objectStore("kv");
      const r = val === undefined ? st.get(key) : st.put(val, key);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  async function saveToObsidian() {
    try {
      let dir = await kv("vault").catch(() => null);
      if (dir && (await dir.queryPermission({ mode: "readwrite" })) !== "granted" && (await dir.requestPermission({ mode: "readwrite" })) !== "granted") dir = null;
      if (!dir) { dir = await window.showDirectoryPicker({ id: "soma-vault", mode: "readwrite" }); await kv("vault", dir); }
      let d = dir;
      for (const part of ["01 Projects", "Personal", "Daily"]) d = await d.getDirectoryHandle(part, { create: true });
      const dk = today(), fh = await d.getFileHandle(dk + ".md", { create: true });
      let text = await (await fh.getFile()).text();
      if (!text.trim()) {
        const dt = new Date();
        const long = dt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "");
        text = (window.SOMA_DAILY_TEMPLATE || "---\n---\n").replace(/\{\{date:YYYY-MM-DD\}\}/g, dk).replace(/\{\{date:dddd D MMMM YYYY\}\}/g, long);
      }
      const r = E.mergeFrontmatter(text, E.dailyNoteProps(dayNow()), state.synced[dk]);
      const w = await fh.createWritable(); await w.write(r.text); await w.close();
      state.synced[dk] = r.synced; saveNow();
      toast(`Saved to Daily/${dk}.md`);
    } catch (e) {
      if (e && e.name === "AbortError") return;
      toast("Couldn't write to the vault: " + esc(e && e.message ? e.message : e), 4000);
    }
  }

  // ---------- settings ----------
  function renderSettings() {
    const s = state.settings, w = s.weights;
    const wrow = (k, name, help) => `<label for="w-${k}">${k} · ${name}: <b id="wv-${k}">${w[k].toFixed(2)}</b></label><input id="w-${k}" type="range" min="0" max="0.6" step="0.01" value="${w[k]}" data-set="weights.${k}"><div class="small">${help}</div>`;
    $("#view-settings").innerHTML = `<div class="page">
      <h3>Feed</h3><div class="panel">
        <label for="s-mode">Order</label><select id="s-mode" data-set="mode"><option value="smart"${s.mode === "smart" ? " selected" : ""}>For you: ranked, learns from you</option><option value="timetable"${s.mode === "timetable" ? " selected" : ""}>Timetable: in order of today's slots</option></select>
        <div class="row"><div class="grow"><label for="s-block">Block length</label><select id="s-block" data-set="blockMin" data-num>${[15, 25, 50].map((m) => `<option value="${m}"${s.blockMin === m ? " selected" : ""}>${m} min</option>`).join("")}</select></div>
        <div class="grow"><label for="s-break">Break every</label><select id="s-break" data-set="breakEvery" data-num>${[1, 2, 3, 4].map((m) => `<option value="${m}"${s.breakEvery === m ? " selected" : ""}>${m} block${m > 1 ? "s" : ""}</option>`).join("")}</select></div></div>
        <label for="s-limit">Daily focus limit</label><select id="s-limit" data-set="dailyLimitMin" data-num>${[120, 180, 240, 300, 360].map((m) => `<option value="${m}"${s.dailyLimitMin === m ? " selected" : ""}>${m / 60} hours</option>`).join("")}</select>
        <div class="row"><div class="grow"><label for="s-qf">Quiet from</label><input id="s-qf" type="time" value="${s.quietFrom}" data-set="quietFrom"></div><div class="grow"><label for="s-qt">until</label><input id="s-qt" type="time" value="${s.quietTo}" data-set="quietTo"></div></div>
        <p class="small">In quiet hours the feed shows one card: stop. It's there for your sleep and your blood pressure.</p></div>
      <h3>How cards are ranked</h3><div class="panel"><p class="small">S = T·w + C·w + W·w + F·w + N·w − penalty. Every card's "Why this card?" shows its numbers. Ranking ${esc(s.rankVersion)}.</p>
        ${wrow("T", "fits right now", "Time slot and deadlines.")}${wrow("C", "you usually finish these", "Learned from what you finish, skip and put off. Halves every 14 days.")}
        ${wrow("W", "importance", "Exposure and exam practice weigh most. Rises when a side of your week is behind.")}${wrow("F", "not done lately", "Things you haven't touched for a while come back.")}
        ${wrow("N", "new to you", "Cards you've seen less often.")}
        <div class="btns"><button class="btn" data-act="resetweights">Reset to 0.30 / 0.25 / 0.20 / 0.15 / 0.10</button></div></div>
      ${NATIVE && NATIVE.setReminders ? `<h3>Phone reminders</h3><div class="panel"><label><input type="checkbox" id="s-rem"${s.remindersOn ? " checked" : ""}> Remind me at the timetable slots</label>
        <ul class="list small">${C.reminders.map((r) => `<li>${esc(r.at)} · ${esc(r.title)} · ${r.days.length === 7 ? "every day" : r.days.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(" ")}</li>`).join("")}</ul></div>` : ""}
      <h3>Sync with your PC</h3><div class="panel">
        <div id="hub-info">${sync.hubInfoHTML()}</div>
        ${/^https?:$/.test(location.protocol) && sync.isLocalHub() ? "" : `
        <label for="sy-addr">PC address</label><input id="sy-addr" type="text" inputmode="url" autocomplete="off" placeholder="${NATIVE ? "192.168.1.23:5178" : "leave empty on the PC itself"}" value="${esc(state.sync.addr)}">
        <label for="sy-pin">Sync code</label><input id="sy-pin" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="6 digits, shown on the PC" value="${esc(state.sync.pin)}">`}
        <label><input type="checkbox" id="sy-auto"${state.sync.auto ? " checked" : ""}> Sync automatically: on opening, after each block, every 5 minutes</label>
        <p class="small" id="sync-status"></p>
        <div class="btns"><button class="btn primary" data-act="syncnow">Sync now</button></div>
        ${Object.keys(state.peers || {}).length ? `<p class="small">Also synced: ${Object.values(state.peers).map((p) => esc(p.name) + " (" + ago(p.at) + ")").join(" · ")}</p>` : ""}
        <p class="small">Both on the same Wi-Fi, or connect the PC to your phone's hotspot. <b>No internet needed.</b> Nothing is overwritten: work from both devices is added together.</p></div>
      <h3>Hidden and learned</h3><div class="panel"><p class="small">${Object.keys(state.hidden).length} hidden card${Object.keys(state.hidden).length === 1 ? "" : "s"}.</p>
        <div class="btns"><button class="btn" data-act="unhide">Show hidden cards again</button><button class="btn danger" data-act="resetlearning">Reset what the feed learned</button></div></div>
      <h3>About</h3><div class="panel small">Soma ${esc(VERSION)} · works offline · your data stays on your own devices: it only travels to your own PC when you sync, or in a backup file you export.<br>
        The ranking is a formula with weights you control. It learns from what you finish and what you put off, but it is not a trained AI model.
        <div class="btns"><button class="btn danger" data-act="wipe">Erase everything</button></div></div>
    </div>`;
  }
  function afterSettings() { sync.status(); sync.loadInfo(); }
  function setPath(path, value) {
    state.settings.updatedAt = now();
    const parts = path.split("."); let o = state.settings;
    while (parts.length > 1) o = o[parts.shift()];
    o[parts[0]] = value;
  }

  // ---------- sync with the PC hub ----------
  // The phone (or a desktop page opened from disk) sends its whole state to the hub, which
  // merges it with every other device and answers with the combined copy; this side merges
  // that answer in. Merging is in engine.js and never loses work on either side.
  function ago(t) {
    if (!t) return "never";
    const m = Math.round((now() - t) / 60000);
    return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " days ago";
  }
  const sync = (() => {
    let busy = false, timer = null, hubInfo = null, pending = null;
    // While a sheet, the timer or a flashcard review is open, its code holds references into the
    // current state. Swapping in a merged state then would orphan whatever it writes, so the
    // hub's answer waits until the screen is free again.
    const screenBusy = () => !$("#sheetwrap").hidden || !$("#focus").hidden;
    function apply(remote) {
      state = E.merge(state, remote);
      saveNow();
      refreshAfterSync();
    }
    function flush() { if (pending && !screenBusy()) { const r = pending; pending = null; apply(r); } }
    const clean = (a) => String(a || "").trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    function address() {
      if (state.sync.addr) return clean(state.sync.addr);
      if (/^https?:$/.test(location.protocol)) return location.host;   // the desktop app, served by the hub itself
      if (!NATIVE) return "localhost:5178";                            // the desktop app opened from disk: try this PC's hub
      return "";
    }
    const isLocalHub = () => /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(address());
    function status(msg) {
      const el = $("#sync-status");
      if (!el) return;
      const s = state.sync;
      el.innerHTML = msg ? esc(msg) : s.lastError ? "⚠️ " + esc(s.lastError) : s.lastAt ? "✅ Synced " + ago(s.lastAt) + " with " + esc(address()) : "Not synced yet.";
    }
    async function run(manual) {
      const addr = address();
      if (!addr) { if (manual) toast("Enter your PC's address first"); status(); return false; }
      if (busy) return false;
      busy = true; status("Syncing…");
      const ctrl = new AbortController(), kill = setTimeout(() => ctrl.abort(), 20000);
      try {
        const res = await fetch("http://" + addr + "/api/sync", {
          method: "POST", signal: ctrl.signal,
          headers: { "Content-Type": "application/json", "X-Soma-Pin": state.sync.pin || "" },
          body: JSON.stringify(E.syncPayload(state)),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "The PC answered " + res.status);
        Object.assign(state.sync, { lastAt: now(), lastError: null, hubObsidian: !!data.obsidian });
        // Merge into whatever is here now, including anything logged while the request was out.
        if (screenBusy()) { pending = data.state; saveNow(); } else apply(data.state);
        if (manual) toast("Synced with your PC");
        return true;
      } catch (e) {
        state.sync.lastError = e.name === "AbortError" ? "The PC didn't answer in time."
          : /fetch|network|load failed/i.test(e.message) ? "Can't reach the PC. Is the hub running, and are both on the same Wi-Fi?" : e.message;
        saveNow();
        if (manual) toast(esc(state.sync.lastError), 4500);
        return false;
      } finally { clearTimeout(kill); busy = false; status(); }
    }
    function soon() { if (!state.sync.auto || !address()) return; clearTimeout(timer); timer = setTimeout(() => run(false), 3000); }
    async function loadInfo() {
      if (!isLocalHub()) return null;
      try {
        const r = await fetch("http://" + address() + "/api/info");
        hubInfo = await r.json();
      } catch (e) { hubInfo = null; }
      const el = $("#hub-info");
      if (el) el.innerHTML = hubInfoHTML();
      return hubInfo;
    }
    function hubInfoHTML() {
      if (!hubInfo || !hubInfo.ok) return isLocalHub() ? '<p class="small">Start the hub on this PC with the <b>Soma</b> shortcut (or <code>node sync-server.js</code>), and your phone can sync with it.</p>' : "";
      const addrs = (hubInfo.addresses || []).map((a) => "<b>" + esc(a) + "</b>").join(" or ") || "<i>no network found: connect to Wi-Fi or the phone's hotspot</i>";
      return '<p>💻 <b>This PC is your sync hub.</b> On your phone: Soma → Settings → Sync with your PC.</p>' +
        '<p class="small">PC address: ' + addrs + '<br>Sync code: <b style="font-size:18px;letter-spacing:.15em">' + esc(hubInfo.pin || "") + "</b></p>";
    }
    return { run, soon, flush, address, isLocalHub, status, loadInfo, hubInfoHTML, clean };
  })();
  function refreshAfterSync() {
    updateTop();
    if (!$("#sheetwrap").hidden || !$("#focus").hidden) return;      // never pull the screen away mid-task
    if (view === "feed") renderFeed(current && current.id);
    else if (view === "stats") renderStats();
    else if (view === "library") renderLibrary();
    else if (view === "settings") sync.status();
  }

  // ---------- navigation ----------
  function go(v) {
    view = v;
    ["feed", "library", "stats", "settings"].forEach((x) => { $("#view-" + x).hidden = x !== v; });
    document.querySelectorAll(".bottom button").forEach((b) => (b.dataset.view === v ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current")));
    $(".modes").hidden = v !== "feed"; $(".areas").hidden = v !== "feed";
    if (v === "library") renderLibrary();
    if (v === "stats") renderStats();
    if (v === "settings") { renderSettings(); afterSettings(); }
    if (v === "feed") renderFeed();
  }
  function scrollTo(i) { const el = $("#view-feed"); i = Math.max(0, Math.min(feed.length - 1, i)); el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" }); }

  // ---------- events ----------
  document.addEventListener("click", (ev) => {
    const close = ev.target.closest("[data-close]");
    if (close) { closeSheet(); return; }
    if (ev.target.id === "sheetwrap") { closeSheet(); return; }
    const rate = ev.target.closest("[data-rate]");
    if (rate) { rate.parentElement.querySelectorAll("[data-rate]").forEach((b) => b.setAttribute("aria-pressed", String(b === rate))); return; }
    const nav = ev.target.closest(".bottom button, [data-act=goto]");
    if (nav) { go(nav.dataset.view); return; }
    const mode = ev.target.closest(".modes button");
    if (mode) { state.settings.mode = mode.dataset.mode; renderFeed(); return; }
    const area = ev.target.closest(".areas button");
    if (area) { state.settings.area = area.dataset.area; renderFeed(); return; }
    if (ev.target.closest("#xp")) { go("stats"); return; }
    const a = ev.target.closest("[data-act]");
    if (!a) return;
    const c = a.dataset.i != null ? feed[+a.dataset.i] : null;
    switch (a.dataset.act) {
      case "start": start(c); break;
      case "snooze": snooze(c); break;
      case "hide": hide(c); break;
      case "why": why(+a.dataset.i, a); break;
      case "override": state.quietOverrideUntil = now() + 10 * 60000; toast("Ten minutes. Then sleep."); renderFeed(); break;
      case "breakdone": state.session.blocks = 0; state.session.lastAt = now(); toast("Good. Back to it."); renderFeed(); break;
      case "breakskip": state.session.blocks = 0; E.record(state, { type: "skip", item: "special:break", key: "special:break" }, now()); renderFeed(); break;
      case "refresh": renderFeed(); scrollTo(0); break;
      case "addbook": bookSheet(null); break;
      case "editbook": bookSheet(state.books.find((b) => b.id === a.dataset.id)); break;
      case "addcard": cardSheet(); break;
      case "addtask": taskSheet(); break;
      case "donetask": { const t = state.tasks.find((x) => x.id === a.dataset.id); if (t) Object.assign(t, { done: true, updatedAt: now() }); saveNow(); renderLibrary(); sync.soon(); break; }
      case "togglemat": { const m = state.materials.find((x) => x.id === a.dataset.id); if (m) Object.assign(m, { active: !m.active, updatedAt: now() }); saveNow(); renderLibrary(); sync.soon(); break; }
      case "exportnotes": exportNotes(); break;
      case "copyyaml": copy(dailyYAML()); break;
      case "syncnow": sync.run(true); break;
      case "obsidian": saveToObsidian(); break;
      case "export": download(`soma-backup-${today()}.json`, JSON.stringify(state)); break;
      case "resetweights": state.settings.weights = { ...E.DEFAULT_WEIGHTS }; state.settings.updatedAt = now(); saveNow(); renderSettings(); sync.soon(); break;
      case "unhide": state.hidden = {}; state.hiddenClearedAt = now(); saveNow(); toast("Hidden cards are back"); sync.soon(); break;
      case "resetlearning": if (confirm("Forget everything the feed has learned about you? Your books, notes and XP stay.")) { state.stats = {}; state.events = []; state.snoozed = {}; state.hidden = {}; state.learningResetAt = now(); saveNow(); toast("Learning reset, on every synced device"); sync.soon(); } break;
      case "wipe": if (confirm("Erase ALL Soma data on this device? If it syncs with your PC, the PC's copy comes back on the next sync. To start over everywhere, also delete data/soma-sync.json on the PC.")) { localStorage.removeItem(KEY); state = E.initialState(C, now()); saveNow(); go("feed"); } break;
      default: break;
    }
  });
  document.addEventListener("input", (ev) => {
    const el = ev.target.closest("[data-set]");
    if (!el) return;
    const v = el.type === "range" || el.hasAttribute("data-num") ? +el.value : el.value;
    setPath(el.dataset.set, v);
    if (el.type === "range") $("#wv-" + el.dataset.set.split(".")[1]).textContent = (+el.value).toFixed(2);
    save(); sync.soon();
  });
  document.addEventListener("change", (ev) => {
    if (ev.target.id === "sy-addr") { state.sync.addr = sync.clean(ev.target.value); state.sync.lastError = null; saveNow(); sync.status(); }
    if (ev.target.id === "sy-pin") { ev.target.value = state.sync.pin = ev.target.value.replace(/\D/g, "").slice(0, 6); saveNow(); }
    if (ev.target.id === "sy-auto") { state.sync.auto = ev.target.checked; saveNow(); }
    if (ev.target.id === "s-rem") {
      state.settings.remindersOn = ev.target.checked; saveNow();
      try {
        const res = NATIVE.setReminders(ev.target.checked ? JSON.stringify(C.reminders) : "[]");
        toast(ev.target.checked ? (res === "ok" ? "Reminders set" : esc(res)) : "Reminders off", 3500);
      } catch (e) { toast("Couldn't set reminders"); }
    }
    if (ev.target.dataset.act === "import" && ev.target.files[0]) {
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data || !Array.isArray(data.books) || typeof data.days !== "object" || data.hub) throw new Error("not a Soma backup");
          if (!confirm("Merge this backup into what's on this device? Nothing here is lost; anything new in the file is added.")) return;
          state = E.merge(state, E.migrate(data, C, now())); saveNow(); toast("Backup merged"); go("stats"); sync.soon();
        } catch (e) { toast("That file isn't a Soma backup"); }
      };
      r.readAsText(ev.target.files[0]);
    }
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") { if (!$("#sheetwrap").hidden) closeSheet(); return; }
    if (view !== "feed" || !$("#sheetwrap").hidden || !$("#focus").hidden || /input|textarea|select/i.test(ev.target.tagName)) return;
    const i = current ? current.i : 0;
    if (ev.key === "ArrowDown" || ev.key === "j") { ev.preventDefault(); scrollTo(i + 1); }
    else if (ev.key === "ArrowUp" || ev.key === "k") { ev.preventDefault(); scrollTo(i - 1); }
    else if ((ev.key === "Enter" || ev.key === " ") && feed[i] && !feed[i].special && ev.target === document.body) { ev.preventDefault(); start(feed[i]); }
    else if (ev.key === "n" && feed[i] && !feed[i].special) snooze(feed[i]);
  });

  // Android back button: close the top layer first; exit only from the feed.
  window.Soma = {
    onBack() {
      if (!$("#sheetwrap").hidden) { closeSheet(); return true; }
      if (!$("#focus").hidden) { if (focusState) { if (confirm("Stop this block without logging it?")) closeFocus(); } else $("#focus").hidden = true; return true; }
      if (view !== "feed") { go("feed"); return true; }
      return false;
    },
  };

  // Re-rank when the app comes back to the front: the time slot may have changed.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    if (!focusState && view === "feed" && $("#sheetwrap").hidden) renderFeed(current && current.id);
    sync.soon();
  });
  setInterval(() => { if (state.sync.auto && !document.hidden && !focusState) sync.run(false); }, 5 * 60000);
  setInterval(() => { if (!focusState && view === "feed" && $("#sheetwrap").hidden && !document.hidden) updateTop(); }, 60000);

  go("feed");
  if (state.sync.auto && sync.address()) setTimeout(() => sync.run(false), 1200);
})();
