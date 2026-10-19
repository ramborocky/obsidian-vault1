---
tags: [home, dashboard]
cssclasses: [home]
---

# 🏠 Home

> [!example] 🎮 [[The Game]] · 📅 today's note: click today in the Calendar · 📘 [[MAF]] · 🖋️ [[Essays]]
> ```dataviewjs
> await dv.view("01 Projects/Personal/The Game/game", {mode: "home"})
> ```

> [!danger] ⛔ READ THIS FIRST — three things, nothing else matters until they're done
>
> ### 1 · ☎️ Answer the ACPA status question
> **Twenty minutes. Unblocks six tasks.** Are you a registered Graduate Accountant, and how many years are logged?
> `+255 22 2 211890` · `info@nbaa.go.tz` · → [[ACPA(T) NBAA To-Do]]
> - [ ] Answered and written into the file
>
> ### 2 · ✍️ Two small calls left in Draft 4 — **yours, not Claude's**
> ✅ **Both owed paragraphs were written by you on 31 July.** [[2026-07-29 — Chantal (Draft 4, Voice Pass — WORKING)|Draft 4]] is the submission candidate now; Draft 3 is superseded. What is still open is smaller and still yours:
> - [ ] **Is *"just before we reached 34"* deliberately unfinished?** If yes, leave it exactly as it is. If no, it needs an ending
> - [ ] **The tense wobble in the Daudi clause** — *he **would** grind his teeth* beside *and **clenched** his fists*. One of the two verbs wants to change; *that sounding thing* is also vague for a story this precise
>
> ### 3 · 🎯 VOICE, NOT STRUCTURE
> [[Nazir — The Serpent in the Grove|The 2026 winner]] scores **31/45** on our rubric and beat **7,806 entries.** Chantal scores 40. **That gap is a warning, not a win** — the rubric rewards architecture and this panel forgives architecture.
> **Nothing in Chantal gets cut for tightness again.** The gains left are prose control and controlling idea.

> [!success]- ✅ Miles Morland Scholarship 2026 — **DONE** · off the list until next July
> The 2026 round is closed and finished. Nothing more to do on it this year → [[Morland 2026 — The Campaign]]
> 🔔 **Reminder set for 1 July 2027:** the next window should open then. The task lives on [[Morland 2026 — The Campaign]] and shows under *Open tasks* below.

> [!danger] Commonwealth Short Story Prize — **postponed · opens 1 January 2027**
> **`$= Math.ceil((new Date("2027-01-01T00:00:00Z") - new Date()) / 86400000) + " days until it opens"`** · ⛔ **the usual 1 Sep – 1 Nov 2026 window did not run**
> The Foundation paused the prize to review its processes, entry rules and submission guidelines. **Closing date not yet announced.** Re-read the rules the day it reopens — they may have changed. Rules: [[12 The Rules — Source of Truth]]
>
> **Before submitting:** export `Chantal.docx` → **`Chantal.pdf`** · check Word's word count · your name nowhere in the file → [[README — Submission Format and Log]]

---

## 📍 Where things stand

| | |
| --- | --- |
| **Submission candidate** | [[2026-07-29 — Chantal (Draft 4, Voice Pass — WORKING)\|Chantal, Draft 4]] — since 31 Jul |
| **Length** | 3,936 words as the file states · gate is 2,000–5,000 · **Word's count is the authoritative one — re-measure before submitting** |
| **Gate 1 · Floor** | ✅ pass |
| **Gate 2 · Make** | **40 / 45** — *scored on Draft 3* |
| **Gate 3 · Fight** | **23 / 25** — *scored on Draft 3* |
| **Re-score owed** | Both gates predate the three insertions and two deletions. The numbers are indicative, not current |
| **Gate 4 · Afterlife** | ⚠️ **no evidence — no cold reader yet** |
| **Two open calls** | the unfinished *34* · the Daudi tense wobble — **see the box above** |
| **Git** | ✅ synced 1 Sep — laptop, GitHub and the cloud sessions are one history again |

**The one thing that would change the most:** name a cold reader. Four instruments depend on a human who is not you, and there is nobody. [[09 The Practice — Calendar, Ritual and Ilmu Huruf|The practice calendar]] has **Gate 4 answers due ~4 September** — three days out, with no reader to collect them from. → [[10 The Three Moves — Reader, Winners, Record]]

---

## ✍️ Today's practice

- [ ] 🕔 **Writing block (Tue/Thu 05:50 · Sun 07:00) · The Explaining Pass** — 15 min, one tier, top-down → [[The Explaining Sentences — Chantal Draft 3]]
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
| [[The Explaining Sentences — Chantal Draft 3]] | [[00 Campaign HQ]] | [[Personal To-Do]] |
| [[Learning Curve]] | [[02 Comparison Board]] | [[ACPA(T) NBAA To-Do]] |
| [[The Three Gates — Unified Instrument]] | [[01 The Six — Analysis Instrument]] | [[Personal To-Do]] |
| [[The Apprenticeship — Learning By Hand]] | [[08 Three Gates — Field Comparison]] | [[Expenses]] |
| [[The De-Slop Pass — English Prose]] | [[12 The Rules — Source of Truth]] | [[The Day Plan — 80-20, Pomodoro and Practice]] |
| [[Craft Log]] | [[09 The Practice — Calendar, Ritual and Ilmu Huruf]] | [[House - Airbnb Writers Retreat]] |
| [[Booklets]] | [[Two Campaigns — The Master Calendar]] | [[Operating Manual]] |
| [[Essays]] · [[Money and Motive]] | [[MAF]] | [[The Game]] |

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

> [!danger] 🕔 STANDING PASS · every writing block (17:00 is class now) — **no sentence explains the sentence before it**
> **Show, don't tell — and the specific fault is the gloss.** One sentence does the work; the next one says what the first one meant. The reader can feel it being done for them, and it is what holds axis 2 · prose control at **4** and *the slide* at **3**.
>
> **Every instance in Chantal D3 is located, tiered and line-numbered:** → **[[The Explaining Sentences — Chantal Draft 3]]**
> Tier 1 is free · Tier 2 is a hand over the second half of the sentence · Tier 3 costs a paragraph · **Tier 4 is protected — decide twice.**
>
> **This is not the tightness pass.** It removes explanation, not length. If a cut saves words, it is the wrong cut.

> [!warning] Standing reminders
> **The remote is public.** Anything pushed to `github.com/ramborocky/obsidian-vault1` is readable by anyone — see [[12 The Rules — Source of Truth]] on why that matters for rule 3f.
> **Payments are yours alone.** No card, banking or mobile-money details ever go through Claude.
