// The Game — scoring for the daily notes. Used by Home, The Game and each daily note:
//   dv.view("01 Projects/Personal/The Game/game", {mode: "home" | "full" | "today"})
// Rules live in The Game.md. Change a number here and every page follows.

const DAILY = '"01 Projects/Personal/Daily"';
const mode = (input && input.mode) || "full";

// ---- scoring --------------------------------------------------------------
function xpOf(p) {
  let x = 0;
  x += Math.min(Math.floor((p.write_min || 0) / 5), 30); // writing: 1 per 5 min, cap 30
  x += Math.min(Math.floor((p.study_min || 0) / 5), 30); // study: 1 per 5 min, cap 30
  if (p.class) x += 10;
  x += Math.min(p.exam_q || 0, 3) * 5;                    // exam questions: 5 each, max 3
  if (p.walk) x += 5;
  if (p.tablets) x += 5;
  if (p.log) x += 5;
  x += Math.min(p.exposure || 0, 2) * 25;                 // exposure: the big one
  return x;
}

const LEVELS = [
  [0, "Mwanafunzi", "the student"],
  [300, "Mwanagenzi", "the apprentice"],
  [800, "Fundi", "the craftsman"],
  [1600, "Hodari", "the capable one"],
  [3000, "Mtaalamu", "the expert"],
  [5000, "Bingwa", "the champion"],
  [8000, "Gwiji", "the master"],
];

const BOSSES = [
  ["🐉 Commonwealth Prize: submit Chantal", "2027-01-05", "2027-01-19"],
  ["👹 Semester 1 exams", "2027-02-15", "2027-02-28"],
  ["🧌 Proposal defence", "2027-05-20", "2027-05-30"],
  ["🐲 Dissertation submission", "2027-09-15", "2027-10-05"],
];

// ---- data -----------------------------------------------------------------
const day = (p) => p.file.name; // YYYY-MM-DD
const pages = dv.pages(DAILY).where((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.file.name)).array();
const byDate = Object.fromEntries(pages.map((p) => [day(p), p]));
const iso = (d) => d.toISOString().slice(0, 10);
const today = new Date(); today.setHours(12, 0, 0, 0);
const todayIso = iso(today);

// Weekly quests: +50 XP each one completed, Monday to Sunday.
const mondayOf = (name) => { const d = new Date(name + "T12:00:00"); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
function questsFor(wk) {
  const sum = (f) => wk.reduce((s, p) => s + (p[f] || 0), 0);
  return [
    ["✍️ Write 150 min", sum("write_min"), 150],
    ["📘 Study 300 min", sum("study_min"), 300],
    ["❓ 10 exam questions", sum("exam_q"), 10],
    ["📣 1 exposure", sum("exposure"), 1],
    ["📝 Log 6 of 7 days", wk.filter((p) => p.log).length, 6],
  ];
}
const weeks = {};
pages.forEach((p) => { (weeks[mondayOf(day(p))] = weeks[mondayOf(day(p))] || []).push(p); });
const questBonus = Object.values(weeks).reduce((s, wk) => s + questsFor(wk).filter(([, v, m]) => v >= m).length * 50, 0);

const total = pages.reduce((s, p) => s + xpOf(p), 0) + questBonus;
let lvl = 0;
LEVELS.forEach((l, i) => { if (total >= l[0]) lvl = i; });
const next = LEVELS[lvl + 1];
const pct = next ? Math.round(((total - LEVELS[lvl][0]) / (next[0] - LEVELS[lvl][0])) * 100) : 100;

// A chain counts back over the days it applies to. Today doesn't break it until today is over.
function chain(applies, did) {
  let n = 0;
  const d = new Date(today);
  if (applies(d) && !(byDate[iso(d)] && did(byDate[iso(d)]))) d.setDate(d.getDate() - 1);
  for (let i = 0; i < 400; i++) {
    if (applies(d)) {
      const p = byDate[iso(d)];
      if (p && did(p)) n++; else break;
    }
    d.setDate(d.getDate() - 1);
  }
  return n;
}
const showUp = chain(() => true, (p) => p.log);
const writeChain = chain((d) => [0, 2, 4].includes(d.getDay()), (p) => (p.write_min || 0) > 0); // Sun, Tue, Thu
const studyChain = chain((d) => d.getDay() >= 1 && d.getDay() <= 5, (p) => p.class || (p.study_min || 0) > 0);

const QUESTS = questsFor(weeks[mondayOf(todayIso)] || []);

const bar = (v, max, w = 10) => {
  const f = Math.max(0, Math.min(w, Math.round((v / max) * w)));
  return "▰".repeat(f) + "▱".repeat(w - f);
};
const exposures = pages.reduce((s, p) => s + (p.exposure || 0), 0);

// ---- views ----------------------------------------------------------------
if (mode === "today") {
  const p = byDate[dv.current().file.name] || dv.current();
  dv.paragraph(`**Today: ${xpOf(p)} XP** · Level ${lvl + 1} ${LEVELS[lvl][1]} · 🔥 ${showUp}-day show-up streak`);
} else {
  dv.paragraph(
    `### Level ${lvl + 1} · ${LEVELS[lvl][1]} *(${LEVELS[lvl][2]})*\n` +
    `${bar(pct, 100, 20)} **${total} XP**` + (next ? ` · ${next[0] - total} to **${next[1]}**` : " · max level") + `\n\n` +
    `🔥 Show-up **${showUp}** days · ✍️ Writing chain **${writeChain}** · 📘 Study chain **${studyChain}** · 📣 Exposures **${exposures}**`
  );
  dv.table(["This week's quests", "", "Progress"],
    QUESTS.map(([n, v, m]) => [n, bar(v, m), `${v} / ${m}` + (v >= m ? " ✅ +50" : "")]));
  const bosses = BOSSES.map(([n, start, end]) => {
    const k = Math.ceil((new Date(start) - today) / 86400000);
    const e = Math.ceil((new Date(end) - today) / 86400000);
    return [n, k > 0 ? `in ${k} days` : e >= 0 ? "⚔️ **fight now**" : "done"];
  });
  dv.table(["Boss fights", "When"], bosses);

  if (mode === "full") {
    const recent = pages.sort((a, b) => (day(a) < day(b) ? 1 : -1)).slice(0, 14);
    dv.table(["Day", "XP", "✍️", "📘", "❓", "📣", "📝"],
      recent.map((p) => [p.file.link, xpOf(p), p.write_min || 0, p.study_min || 0, p.exam_q || 0, p.exposure || 0, p.log ? "✓" : ""]));
  }
}
