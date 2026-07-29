---
tags: [kalemie, prize, campaign, reference, craft-laws]
story: Kalemie
date: 2026-07-27
status: active
---

# ⚖️ CRAFT LAWS — REFERENCE CARD

> [!abstract] Every rule currently acting on Chantal
> Ten bodies of theory, four of them new to this vault. Some are **live**. Some have been **retired** — and knowing which is retired matters more than adding another one.

---

## The map

```mermaid
flowchart LR
    subgraph SRC["THEORY"]
        direction TB
        MK["<b>McKee</b><br/><i>Story</i>"]
        CL["<b>Cleland</b><br/><i>Mastering Suspense</i>"]
        GA["<b>Gardner</b><br/><i>The Art of Fiction</i>"]
        BA["<b>Barrett</b> 1900<br/><i>Short Story Writing</i>"]
        KI["<b>Kiteley</b><br/><i>3 A.M. Epiphany</i>"]
        LA["<b>Labov</b><br/><i>evaluation model</i>"]:::new
        PI["<b>Piper</b><br/><i>narrative revelation</i>"]:::new
        GE["<b>Genette</b><br/><i>narrative discourse</i>"]:::new
        CP["<b>Habila / Ikheloa</b><br/><i>the prize aesthetic</i>"]:::new
    end

    subgraph MEA["WHAT IT MEASURES"]
        direction TB
        M1["scene turn · the gap<br/>controlling idea"]
        M2["sentence rhythm<br/>banned perception verbs"]
        M3["the resonant close<br/>the fictional dream"]
        M4["climax length<br/>words after climax<br/>bumpety-bump"]
        M5["<i>generates prose</i><br/>not analysis"]
        M6["evaluation density<br/>per 1,000 words"]
        M7["what's withheld,<br/>released when"]
        M8["scene / summary /<br/>ellipsis / pause"]
        M9["what the panel<br/>is tired of"]
    end

    subgraph AX["AXIS"]
        direction TB
        A45["4 · 5 · 7"]
        A2["2"]
        A8["8"]
        A6["6 · 8"]
        A3["3"]
        A9["9"]
    end

    MK --> M1 --> A45
    CL --> M2 --> A2
    GA --> M3 --> A8
    BA --> M4 --> A6
    KI --> M5 --> A3
    LA --> M6 --> A2
    PI --> M7 --> A6
    GE --> M8
    CP --> M9 --> A9

    classDef new fill:#5c3a7a,color:#fff,stroke:#2e1d3d
```

---

## 🟢 LIVE — these govern current work

| Law | The rule, stated | Chantal |
| --- | --- | --- |
| **Cleland — the 20-word rule** | Average sentence under 20 words. Long (30–70w) = mood. Short (4–10w) = action, shock | 12.8 avg ✅ |
| **Barrett — bumpety-bump** | Excess short sentences read as stammer, not style | **57% under 10w** 🔴 |
| **Barrett — climax and conclusion** | The climax proper runs about six words; the ending sits within a paragraph of it | ~45 words after ✅ |
| **Barrett — all destinies settled** | The climax must decide the fate of every character and scheme | Morisho paid off ✅ |
| **Gardner — the resonant close** | Every closing image must drag an earlier one behind it, planted twice | 4 echoes converge ✅ |
| **McKee — the Gap** | Character expects X, gets Y. Bigger gap = harder-working scene | back room ✅ |
| **McKee — every scene turns** | Someone's situation changes, or cut the scene | Mihogoni weakest 🟡 |
| **Labov — evaluation** | Narratorial judgement, counted per 1,000 words | needs re-count 🟡 |
| **Piper — revelation** | *Given what came before, how surprising is this passage?* Measured by position | pregnancy @72.4% ✅ |
| **Cleland — banned words** | Cut *saw, looked, heard, felt, noticed, realized, understood, knew* | 22 instances 🟡 |
| **The no-italics rule** | Swahili/French/Lingala never italicised — native register, not foreign flourish | ✅ absolute |

---

## 🔴 RETIRED — do not act on these

```mermaid
flowchart TD
    R1["<b>Kiteley's 20% rule</b><br/>cut any prose by a fifth"]
    R1 --> R1X["❌ Arithmetic off a<br/><b>3,941-word draft with no ending</b>.<br/>Chantal is 3,407 with an ending —<br/>cutting 20% removes muscle"]

    R2["<b>Barrett's two-speaking-character ceiling</b>"]
    R2 --> R2X["❌ Chantal has six.<br/><b>Test pending:</b> count how many of the<br/>10 winners obey it. Expect zero"]

    R3["<b>Controlling idea:</b><br/>'inaction is complicity'"]
    R3 --> R3X["❌ That is <b>Daudi's</b> idea.<br/>Chantal's narrator acts, decides,<br/>lies, calculates, hides evidence"]

    R4["<b>The 53 [!AI] questions</b>"]
    R4 --> R4X["❌ All interrogate a draft<br/>that is not shipping.<br/>Only ~13 were fiction questions"]

    R5["<b>Barrett on dialect</b>"]
    R5 --> R5X["❌ Would gut the code-switching.<br/>Overruled by vault policy"]

    style R1X fill:#7a1f1f,color:#fff
    style R2X fill:#7a1f1f,color:#fff
    style R3X fill:#7a1f1f,color:#fff
    style R4X fill:#7a1f1f,color:#fff
    style R5X fill:#7a1f1f,color:#fff
```

---

## 🎯 The Nine Axes

```mermaid
flowchart TD
    subgraph S["SENTENCE & IMAGE — where this writer is strong"]
        X2["2 · Prose control"]
        X3["3 · Character interiority"]
        X9["9 · Something to say"]
    end
    subgraph A["ARCHITECTURE — where the master draft failed"]
        X1["1 · Opening authority"]
        X4["4 · Scene turn"]
        X5["5 · The gap"]
        X6["6 · Structural economy"]
        X8["8 · Resonant close"]
    end
    X7["7 · Controlling idea"]

    S -.->|"the good problem:<br/>architecture is learnable,<br/>the other thing is not"| A

    style S fill:#1f6f3f,color:#fff
    style A fill:#8a6d1f,color:#fff
```

**Reading the total:** below 27 → structural work · 27–35 → refinement · **above 36 → competing**. A single **1** anywhere caps the story regardless of total, because judges eliminate on faults, not averages.

**Chantal: 40/45.** No axis below 4.

---

## 🕵️ The fingerprint rules

*Not from any book — measured directly in this draft. These are the habits that read as machine-made, and each is a prose weakness first.*

| Tell | In Chantal | Fix |
| --- | --- | --- |
| **The "the way you—" simile frame** | **10 instances** in 3,407 words, two in one sentence | cut to 3 |
| **The balanced antithesis** — *"Not X. Y."* | 5 (was ~20 before the Barrett pass) | keep the best 2 |
| **The self-summarising paragraph** | present | let paragraphs stop mid-gesture |
| **Total load-bearing-ness** | every detail pays off | **add 3–4 inert details that mean nothing** |
| **Vocabulary slightly too apt** | no wrong words anywhere | let one near-miss word stand |

> [!note] The deep defence
> A machine supplies what it has read. It cannot supply what you have **done**. The real denominations in that envelope, the actual arithmetic of that back room, what the station smells like at 2pm — nobody can sniff a thing that could only have been written by someone who was there and can count.

---

## 🌍 The prize aesthetic — competitive intelligence

```mermaid
flowchart LR
    H["<b>Habila</b><br/>'poverty porn'"] --> D["The charge:<br/>African writing that represents<br/>the continent as a space of<br/>suffering and despair"]
    I["<b>Ikheloa</b><br/>'the Caine-prize aesthetic'"] --> D
    D --> T["<b>The trap:</b><br/>writers skewing perspective<br/>to fit what they imagine<br/>will sell to Western judges"]
    T --> W["<b>The way through</b><br/><i>Ikheloa's own qualifier:</i><br/>'It's not about the theme,<br/>it's about the writing'"]
    W --> C(["<b>CHANTAL'S COUNTER-MOVE</b><br/>'I am not asking to be forgiven.<br/>I am asking for it to be<br/>counted correctly.'<br/><br/><i>refuses sympathy,<br/>demands accounting</i>"])

    style T fill:#7a1f1f,color:#fff
    style C fill:#1f6f3f,color:#fff
```

A Tanzanian writer submitting a story about a sexually exploited child to a British-administered prize is entering this argument whether or not they know it exists. **Know it.** And hold the no-explanation line absolutely — *mia tano mia tano* stands, *shemeji* stands, no glossary, no italics.

---

## Sources

- [[Story structure by robert mackee.md|McKee]] · [[Mastering Suspense by Jane Cleland|Cleland]] · [[The Art of Fiction by John Gardner|Gardner]] · [[Short Story Writing by Charles Raymond Barrett|Barrett]] · [[The 3 AM Epiphany by Brian Kiteley|Kiteley]] · [[Learning Curve|Learning Curve]]
- **Piper, Xu & Kolaczyk**, *Modeling Narrative Revelation* — [paper](https://ceur-ws.org/Vol-3558/paper6166.pdf)
- **Labov & Waletzky**, the evaluation model — oral first-person narrative structure
- **Genette**, *Narrative Discourse* — order, duration, frequency, focalization *(held in reserve)*
- The prize-aesthetic debate — [Brittle Paper](https://brittlepaper.com/2013/12/caine-prize-poverty-pornstars-bulawayo-takes-swipe-helon-habila/)
