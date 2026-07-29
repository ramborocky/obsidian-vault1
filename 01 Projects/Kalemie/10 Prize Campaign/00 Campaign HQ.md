---
tags: [kalemie, chantal, prize, campaign, hub]
story: Kalemie
date: 2026-07-27
status: active
cssclasses:
  - wide-page
---

# 🏆 CAMPAIGN HQ

> [!abstract] The whole operation on one page
> **Submission:** [[2026-07-26 — Chantal (Djamela POV, Draft 2 — Barrett Pass)|Chantal]] · Djamela, first person · **3,407 words** · scored **40/45**
> **Target:** Commonwealth Short Story Prize · **window 1 Sep – 1 Nov 2026**
> **Detailed plan:** [[Chantal — Prize Plan]] · **Instrument:** [[01 The Six — Analysis Instrument]] · **Data:** [[02 Comparison Board]]

---

## The Campaign

```mermaid
flowchart TD
    A["4 drafts · 0 submissions<br/>17 fixes aimed at the wrong draft"]
    A -->|"27 Jul — scored cold"| B["<b>CHANTAL CHOSEN</b><br/>40/45 vs master draft's 24"]
    B --> C{"Two tracks,<br/>run in parallel"}

    C --> D["<b>TRACK 1 — FIX THE DRAFT</b>"]
    C --> E["<b>TRACK 2 — LEARN THE PRIZE</b>"]

    D --> D1["EX 1 · Read-aloud rebalance<br/>57% short → 30-40%"]
    D --> D2["EX 3 · The mother<br/>+450 words of prose"]
    D --> D3["EX 2 · Six words & the ships<br/>30 min"]

    E --> E1["Build <b>The Six</b>"]
    E1 --> E2["10 winners measured<br/>Caine + Commonwealth"]
    E2 --> E3["3 practice projects<br/>each attacking one finding"]

    D1 --> F["Re-score Nine Axes"]
    D2 --> F
    D3 --> F
    E3 --> F

    F --> G(["<b>SUBMIT</b><br/>window 1 Sep – 1 Nov 2026"])

    style B fill:#1f6f3f,color:#fff,stroke:#0d3b21
    style G fill:#7a1f1f,color:#fff,stroke:#3d0f0f
    style D fill:#2b4c7e,color:#fff
    style E fill:#5c3a7a,color:#fff
```

---

## Where the score comes from

```mermaid
flowchart LR
    subgraph M["MASTER DRAFT — 24/45"]
        direction TB
        M1["Opening 2"]:::bad
        M2["Turn 2"]:::bad
        M3["Gap 2"]:::bad
        M4["Economy 2"]:::bad
        M5["Close 1"]:::worst
    end

    subgraph CH["CHANTAL — 40/45"]
        direction TB
        C1["Opening 5"]:::good
        C2["Interiority 5"]:::good
        C3["Close 5"]:::good
        C4["Something to say 5"]:::good
        C5["Prose control 4"]:::mid
    end

    M -->|"POV change<br/>Daudi → Djamela"| CH

    classDef bad fill:#7a1f1f,color:#fff
    classDef worst fill:#4a0f0f,color:#fff
    classDef good fill:#1f6f3f,color:#fff
    classDef mid fill:#8a6d1f,color:#fff
```

**The decisive axis was 3, not 9.** Both drafts have something to say. Only one knows what the girl won't say — because she is the one saying it.

---

## 14 weeks

```mermaid
gantt
    title Road to 1 November 2026
    dateFormat YYYY-MM-DD
    axisFormat %d %b

    section Track 1 — Draft
    EX1 Read-aloud rebalance      :active, a1, 2026-07-28, 10d
    EX3 The mother (+450w)        :a2, after a1, 7d
    EX2 Six words & ships         :a3, after a2, 2d
    Re-score Nine Axes            :milestone, m1, after a3, 0d

    section Track 2 — Analysis
    The Six on 10 winners         :active, b1, 2026-07-28, 14d
    Findings written up           :b2, after b1, 5d

    section Track 3 — Practice
    3 practice projects           :c1, after b2, 35d

    section Submission
    Window OPENS                  :milestone, crit, m2, 2026-09-01, 0d
    Final pass on Chantal         :d1, 2026-10-05, 18d
    SUBMIT                        :milestone, crit, m3, 2026-10-25, 0d
    Window CLOSES                 :milestone, crit, m4, 2026-11-01, 0d
```

> [!warning] Submit by 25 October, not 1 November
> A week of margin. Nothing about this prize rewards submitting on the last day, and everything about a portal at midnight punishes it.

---

## Status board

| | Item | State |
| :--: | --- | --- |
| ✅ | Submission draft chosen | Chantal · 40/45 |
| ✅ | Deadline found | **1 Sep – 1 Nov**, annually |
| ✅ | Old apparatus retired | 53 questions + 3 hybrids |
| ✅ | Analysis instrument built | [[01 The Six — Analysis Instrument]] |
| ✅ | **Draft 3 written** | 3,569w · **49%** · [[2026-07-28 — Chantal (Draft 3, Prize Pass)]] |
| ✅ | **EX 1 — read-aloud rebalance** | **done and validated** — 57% → 49%, inside the measured band |
| ✅ | Late reframe implemented | 85.1% · [[05 The Late Reframe]] · independently validated by story 2 |
| ✅ | Pregnancy destiny settled | Barrett's rule closed |
| ✅ | Stories 1–2 of 10 measured | Giorgis · Uwazuruike |
| 🔴 | Controlling idea for Chantal | **still undecided** — the last open decision |
| 🟡 | EX 3 — the mother | commentary rationing now lifted |
| 🟡 | EX 3 — the mother | not started |
| 🟡 | EX 2 — six words & ships | not started |
| 🟡 | Stories 2–10 | not started |
| 🟢 | 3 practice projects | undefined — generated *by* the analysis |
| 🟢 | Motherboard cut from Daudi drafts | only one story may hold it |

---

## Map of this folder

```mermaid
mindmap
  root(("🏆<br/>Campaign"))
    ("00 Campaign HQ")
      ["you are here"]
    ("01 The Six")
      ["the instrument"]
      ["the prompt"]
      ["six-count.ps1"]
    ("02 Comparison Board")
      ["aggregate table"]
      ["rhythm bars"]
      ["live findings"]
    ("03 Story Sheets")
      ["Giorgis ✅"]
      ["9 to go"]
    ("04 Craft Laws")
      ["every rule in play"]
      ["live vs retired"]
```

## Elsewhere in the vault

- [[Chantal — Prize Plan]] — the detailed draft-level plan, exercises, open decisions
- [[Dashboard]] — **archive** below the Craft Cheat Sheet; aimed at a draft that is not shipping
- [[The Judging Rubric — Nine Axes]] — the scoring instrument
- [[Collection Tracker]] — story-cycle planning; the motherboard exclusivity problem lives here
