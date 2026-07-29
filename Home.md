---
tags: [home, dashboard]
cssclasses: [home]
---

# 🏠 Home

> [!danger] Commonwealth Short Story Prize — deadline 1 November 2026, 23:59 GMT
> **`$= Math.ceil((new Date("2026-11-01T23:59:00Z") - new Date()) / 86400000) + " days left"`** · entries open 1 September
> That is **02:59 on 2 November** in Tanzania. Rules: [[12 The Rules — Source of Truth]]

---

## 📍 Where things stand

| | |
| --- | --- |
| **Submission candidate** | [[2026-07-28 — Chantal (Draft 3, Prize Pass)\|Chantal, Draft 3]] |
| **Length** | 3,896 words · gate is 2,000–5,000 |
| **Gate 1 · Floor** | ✅ pass |
| **Gate 2 · Make** | **40 / 45** |
| **Gate 3 · Fight** | **23 / 25** |
| **Gate 4 · Afterlife** | ⚠️ **no evidence — no cold reader yet** |
| **Two open faults** | *shemeji* · the counting-fails paragraph |

**The one thing that would change the most:** name a cold reader. Four instruments depend on a human who is not you, and there is nobody. → [[10 The Three Moves — Reader, Winners, Record]]

---

## ✍️ Today's practice

- [ ] 🖊 **The Impromptu** — 15 min, one page, never finished, never revised
- [ ] 📖 **The Read** — 20 min, one published story
- [ ] 🔁 **Rotating slot** — copywork / technique / read aloud *(🔧 Reconstruction on Saturdays)*
- [ ] 📿 **100 salawat** — 33 Fajr · 33 Dhuhr · 34 Asr
- [ ] 🌙 Maghrib → Isha screenless

→ [[The Apprenticeship — Learning By Hand]] · [[The Day Plan — 80-20, Pomodoro and Practice]]

---

## 🗺️ The hubs

| Craft | Campaign | Life |
| --- | --- | --- |
| [[Learning Curve]] | [[00 Campaign HQ]] | [[Personal To-Do]] |
| [[The Three Gates — Unified Instrument]] | [[02 Comparison Board]] | [[ACPA(T) NBAA To-Do]] |
| [[The Apprenticeship — Learning By Hand]] | [[08 Three Gates — Field Comparison]] | [[Expenses]] |
| [[The De-Slop Pass — English Prose]] | [[12 The Rules — Source of Truth]] | [[The Day Plan — 80-20, Pomodoro and Practice]] |
| [[Craft Log]] | [[09 The Practice — Calendar, Ritual and Ilmu Huruf]] | [[House - Airbnb Writers Retreat]] |

---

## 📄 The drafts

```dataview
TABLE WITHOUT ID
  file.link AS "Draft",
  pov AS "POV",
  words AS "Words",
  status AS "Status"
FROM #draft OR #submission-candidate
SORT date DESC
LIMIT 10
```

## 🧭 Prize campaign

```dataview
LIST
FROM "01 Projects/Kalemie/10 Prize Campaign"
WHERE file.name != this.file.name
SORT file.name ASC
```

## 🕐 Recently touched

```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  dateformat(file.mtime, "EEE dd MMM · HH:mm") AS "Modified"
FROM "01 Projects"
SORT file.mtime DESC
LIMIT 10
```

## ☑️ Open tasks

```tasks
not done
limit 8
hide backlink
hide task count
```

---

## 🌙 The moon

Approximate — verify before building anything on it. → [[09 The Practice — Calendar, Ritual and Ilmu Huruf]]

| | Aug | Sep | Oct | Nov |
| --- | --- | --- | --- | --- |
| 🌑 **New** — *cut only* | 12–13 | 11 | 10–11 | 9 |
| 🌕 **Full** — *read aloud* | 27–28 | 26 | 25–26 | 24 |

---

> [!quote] The Writing Constitution
> We write scenes, not explanations. Objects carry emotion. Dialogue reveals class.

> [!warning] Standing reminders
> **The remote is public.** Anything pushed to `github.com/ramborocky/obsidian-vault1` is readable by anyone — see [[12 The Rules — Source of Truth]] on why that matters for rule 3f.
> **Payments are yours alone.** No card, banking or mobile-money details ever go through Claude.
