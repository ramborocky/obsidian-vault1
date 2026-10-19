---
tags: [maf, hub, pinned]
area: maf
date: 2026-10-19
status: live
author: Claude — hub for the Master of Accounting and Finance
---

# 📘 MAF — Hub

**The plan:** [[MAF — Roadmap, Protocol and Timetable]] · **The game:** [[The Game]] · **The day:** today's note in `Personal/Daily/`

> [!important] How this folder grows
> **One note is created when it's needed, never in advance.**
> - When a module's first class happens, create `Modules/<Module name>.md` from the **MAF Module** template.
> - When the concept note is due (9–14 Dec), create `Dissertation/Concept Note.md`.
> - When you finish a book, give it one note in `Reading/`.
> Building folders before you need them is the apparatus pattern ([[00 Profile — The Memory]]). It earns 0 XP.

---

## ⏳ Deadlines

`$= const d=[["Concept note (9–14 Dec window)","2026-12-14"],["Semester 1 exams (approx.)","2027-02-15"],["Proposal defence (approx.)","2027-05-20"],["Dissertation semester starts","2027-06-01"],["Dissertation submission (approx.)","2027-09-15"]]; d.map(([n,t])=>{const k=Math.ceil((new Date(t)-new Date())/86400000); return (k<0?"✅ ":"⏳ **"+k+" days** · ")+n}).join("<br>")`

---

## 📚 Modules

```dataview
TABLE WITHOUT ID
  file.link AS "Module",
  semester AS "Sem",
  nbaa AS "NBAA paper",
  confidence AS "Confidence /5",
  next_due AS "Next due"
FROM "01 Projects/MAF/Modules"
SORT semester ASC, file.name ASC
```

## 🎓 Dissertation

```dataview
LIST
FROM "01 Projects/MAF/Dissertation"
SORT file.mtime DESC
```

## 📖 Reading

```dataview
TABLE WITHOUT ID file.link AS "Book", module AS "For", status AS "Status"
FROM "01 Projects/MAF/Reading"
SORT status ASC
```

## 📈 This semester's study minutes

```dataviewjs
const pages = dv.pages('"01 Projects/Personal/Daily"').where(p => p.study_min > 0 || p.class);
const total = pages.array().reduce((s, p) => s + (p.study_min || 0), 0);
const classes = pages.where(p => p.class).length;
const qs = pages.array().reduce((s, p) => s + (p.exam_q || 0), 0);
dv.paragraph(`**${Math.round(total / 60)} h** own study · **${classes}** classes attended · **${qs}** exam questions answered`);
```

---

## Related
[[MAF — Roadmap, Protocol and Timetable]] · [[ACPA(T) NBAA To-Do]] · [[The Game]] · [[Money and Motive]] · [[Home]]
