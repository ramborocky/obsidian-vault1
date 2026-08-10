---
tags: [x-factor, hub, index, training, craft, ai-draft, not-canon]
aliases: [X-Factor, x-factor hub, The Atelier]
date: 2026-07-31
status: active — training folder
---

# 🎓 X-FACTOR — THE ATELIER

**A painter learns by copying in the gallery. This is the gallery.**

Three prize-level short stories, marked up line by line at the exact point each technique fires, with every observation backlinked to the craft base that names the principle. Plus the experiments that tested those principles at full length, and the research that says which of them a judge actually rewards.

> [!important] Four kinds of file live here — do not treat them the same
> | Folder | What it is | How to treat it |
> | --- | --- | --- |
> | **`Annotated/`** | **Published stories, marked up.** The training material | **Study.** Gitignored, copyright the authors' |
> | `Experiments/` · `MABANGA` | **Invented.** AI prose, non-canon | Quarantined. Read, measure, **never lift a sentence** |
> | `Research/` | **Verified fact, primary-sourced** | **Act on it** |
> | `_*.json` · `_*.ps1` | The annotation toolchain | Editable and re-runnable |

> [!danger] The rule that applies to `Experiments/` and `MABANGA`
> Commonwealth rule 3e requires an entry to be the entrant's own work, and in June 2026 the Foundation investigated by examining **working drafts, timestamped documents and notes.** Git history is evidence.
>
> **No invented prose in this folder may cross into `01 Story Brain`.** If a *shape* earns its place, rebuild it in your own hand. → [[12 The Rules — Source of Truth]]

---

## 📖 The gallery — `Annotated/`

Full text, annotation dropped at the paragraph where the thing happens, percentage computed from real character offsets.

| Story | Standing | Marks | Study it for |
| --- | --- | --: | --- |
| **[[The Serpent in the Grove — ANNOTATED]]** — Jamir Nazir | 🏆 **Overall winner 2026**, from 7,806 entries | 48 | **What a winner actually looks like, faults included.** Scores 31/45 and won. 45% aftermath. The coda states the theme |
| **[[Mothers Not Appearing in Search — ANNOTATED]]** — Joshua Lubwama | 🏆 Africa regional winner 2025 | 47 | **The child narrator as a structural device.** The reader knows; the narrator never does. Comedy carrying atrocity |
| **[[Dite — ANNOTATED]]** | Standing unknown — [[Dite — Story Sheet\|not a 2025 winner]] | 64 | **Instruction-as-epigraph.** One unexplained body-motif carrying a controlling idea across thirty years |

**159 annotations. 69 distinct techniques. Every backlink verified against a real note.**

### The reading order

1. **Lubwama first.** The clearest engine in the three, and the most imitable.
2. **Nazir second, and read the faults as hard as the strengths.** It is the only confirmed winner you have. Its architectural failures are the calibration.
3. ***Dite* last.** The most technically advanced and the least imitable — long-range plants at 79 percentage points, and a rhythm profile (17.5 avg, 20% short) that contradicts both winners.

---

## 🔧 The technique index

Every `🎓` line in an annotated file uses these codes. Edit `_techniques.json` to add more.

### McKee — structure and plot
[[Scene Analysis Method]] · [[Scene Design]] · [[Act Design]] · [[The Inciting Incident]] · [[Crisis, Climax, Resolution]] · [[Controlling Idea]] · [[The Principle of Antagonism]] · [[Character Dimension and Cast Design]] · [[Structure and Character]] · [[Active Vs Passive Protagonists.md|Active vs Passive Protagonists]] · [[Exposition]] · [[The Text]] · [[Casuality Vs Coincidence.md|Causality vs Coincidence]] · [[Linear Vs Non-Linear time.md|Linear vs Non-Linear Time]] · [[Closed Vs Opening Endings.md|Closed vs Open Endings]] · [[The Substance of Story]]

### Cleland — reader psychology and the sentence
[[Add Surprise Sparingly]] · [[Reveal Answers Slowly]] · [[Whisper Dont Shout]] · [[Write Sentences That Work]] · [[Get Into Your Readers Heads]] · [[Illuminate Fear and Dread]] · [[Isolate Your Protagonist]] · [[Set the Stage]] · [[Structure is King]] · [[Layer in Two Subplots]] · [[The Devil Made Me Do It]]

### Gardner — the theory underneath
[[The Vivid and Continuous Fictional Dream]] · [[Show, Don't Tell — Needless Explanation]] · [[Psychic Distance]] · [[Point of View — From Barbaric First Person to Authorial Omniscient]] · [[Three Faults of Soul — Sentimentality, Frigidity, Mannerism]] · [[The Resonant Close]] · [[The Fichtean Curve]] · [[Interest, Free Will, and the Active Protagonist]] · [[Working Backward from the Climax — the Victim-Story Trap]] · [[Delay and the Anguish of Choice]] · [[Sentence Rhythm as Emotional Instrument]] · [[Vocabulary and the Buried Symbol]] · [[The Barn Exercise — Indirection and Symbolic Description]] · [[One Interconnected Gesture — Character, Plot, Setting]] · [[Exploration vs Demonstration]] · [[Profluence — Resolution, Logical Exhaustion, and Emphasis vs Function]]

### Barrett — the form's edges
[[The Art of Omission — Unity, Padding, and Proportion]] · [[The Beginning — Three Paragraphs at Most]] · [[Climax and Conclusion — The Story in Six Words]] · [[The Isolation Principle — One Emotion, One Incident]] · [[Inevitable but Unforeseen — Suspense and Surprise]] · [[Character by Salient Detail]] · [[Methods of Narration — The Author Must Vanish]] · [[Style — Simple, Easy, Concise]] · [[The Unities in Miniature]] · [[The Plot-Germ and the One-Sentence Test]] · [[Titles Good and Bad]] · [[Verisimilitude, Not Verity — The Use of Facts]]

### Kiteley — prescription
[[Point of View — The Reluctant I]] · [[Writing That Learns, Not Teaches]] · [[What You Are Censoring]] · [[Internal Structure — Shapes for an Ending]] · [[Emotion as Movement]] · [[The Method — Restrict and Liberate]]

### The vault's own instruments
[[The Judging Rubric — Nine Axes]] · [[The Underground Rubric — Risk, Afterlife and the Room]] · [[All the Small Things — Grief Through the Minor Object]] · [[The First-Page Cut]] · [[The NAPLAN Floor — Ten Mechanical Criteria]] · [[The De-Slop Pass — English Prose]] · [[Obfuscated Openness — Detail as Disguise]] · [[14 The Judges — Six Years of Chair Statements]]

> **Backlinks run both ways.** Open any craft note and its backlink pane now shows every place in three prize stories where that principle actually fires. **That is the atelier.**

### Rebuilding

Edit `_ann-*.json` (the notes) or `_x-*.json` (the technique codes) and run:

```bash
powershell -File "01 Projects/x-factor/Annotated/_build-annotated.ps1"
```

The story text is never hand-copied — it is read from `_source texts/` each time.

---

## 🔬 Research — `Research/`

### [[14 The Judges — Six Years of Chair Statements]]

Every Chair of Judges 2021–2026, verbatim, checked against the Commonwealth Foundation archives and the trade press.

> [!danger] It found the campaign is calibrated against a panel that has finished
> **Entries closing 1 November 2026 are the 2027 prize.** The 2026 cycle closed 1 November 2025 and was decided 30 June 2026. **Louise Doughty will not judge your entry** — and her sentence is the epigraph of [[The Judging Rubric — Nine Axes]].
>
> **The 2027 chair is not announced.** Historically it lands within weeks of entries opening on **1 September 2026**.

| Praised by chairs, 2021–2026 | Hit rate |
| --- | :-: |
| Emotional / moral force | **6 / 6** |
| Voice and prose | **6 / 6** |
| Something to say | **6 / 6** |
| Character | 4 / 6 |
| **Structure, economy, plot, shape** | **2 / 6, both glancing** |

**Read this before studying the annotations.** It tells you which marks in the gallery are worth copying and which are worth admiring and leaving alone.

### [[15 The Chair Test — Scoring the Hidden Factor]]

**The instrument built out of the two files above.** Five axes, each quoted from a chair's own words, each with a test you perform on the page — not a craft-theory axis anywhere in it.

| Axis | The test |
| --- | --- |
| **1 · The Move** | Point at it. Name the percentage. If you can't, you don't have one |
| **2 · The Voice** | The blind paragraph — could this be anyone's? |
| **3 · The Position** | State it, then find where the story says it. **If it says it, cap at 3** |
| **4 · The Person** | Who wants something the plot doesn't need? |
| **5 · The World** | Cut it — does the plot notice? |
| *6 · The Afterlife* | *Unscoreable by the author. Needs a cold reader and 24 hours* |

> [!danger] The result that justifies the instrument
> | | Nine Axes | Chair Test |
> | --- | :-: | :-: |
> | Nazir — **won**, from 7,806 | 31/45 | **22/25** |
> | Chantal Draft 4 | **40/45** | **16/25** |
> | Gap | Chantal **+5** | Nazir **+6** |
>
> **The Nine Axes rank Chantal above the story that beat 7,805 others. The Chair Test ranks it below.** Only one of those describes what happened in June 2026.
>
> All three gallery stories land **21–24**. Chantal lands **16**, and nine of the eleven missing points are in **The World (2)** and **The Person (3)** — both additive fixes, neither requiring a cut.

---

## 🧪 The experiments — `Experiments/` and `MABANGA`

| # | File | Question | Result |
| --: | --- | --- | --- |
| 1 | [[Chantal — AI Voice Benchmark Against Nazir (AI Draft, Not Canon)]] | Apply the winner's techniques to Chantal's material | **32/45.** Argued against itself — the fixes *stated* the controlling idea and drove sentences longer |
| 2 | [[Chantal × Beat — The Twenty-Eight Houses (AI Draft, Not Canon)]] | Fuse with Beat of My Hurt; govern time by cycle, moon, numerology | **36/45.** The **28 letters = 28 lunar mansions = 28 days** correspondence; the section break as a prose instrument |
| 3 | [[The X-Factor]] | Prize rules off, Congolese register, saturated with daily life | Built on **Leakage**. *Article 15*, **the Lukuga**, and the cost: a digression is a long sentence |
| 4 | [[MABANGA (New Story — AI Draft, Not Canon)]] | A wholly new story, benchmarked against *Dite* and *Mothers* | **Instruction-as-epigraph turned hostile** — a price list that knows what the narrator doesn't |
| 5 | [[mihogoni-2]] | The *Dite* object-chorus: four rusted ships, no body, no agency | The naive-narrator engine run for a whole story instead of once. **Cosmic indifference delivered by a commodity price** |
| 6 | [[mihogoni-3f]] | Chantal's material in **close third**, one ship carrying the ascendancy | The four-flag epigraph chain and the **after-deck clause**. Cost: the narrator |
| 7 | [[mihogoni-3g]] | **Controlled test** — 3f with the person flipped and nothing else changed | **Five of seven devices were free of person; two were being subsidised by it.** → [[19 The Third-Person Test — What Close Third Bought and Cost]] |

---

## The findings, ranked

1. **Leakage is the x-factor.** Surplus serving no plot function is what makes a world believed. *Cut it — does the plot notice? If not, and the story is poorer, it is leakage.* Nazir's clause about a letter for a mother whose son was held for cussing a policeman is seventeen words and earns the whole axis.
2. **The reader must know before the narrator does.** All three gallery stories run on it. Lubwama through a child; *Dite* through thirty years; Nazir through a legend frame that knows the ending on page one.
3. **One unexplained motif, placed five or six times, carries a controlling idea** better than any statement of it. *Dite*'s throat. Nazir's towel.
4. **Instruction-as-epigraph** — a flat procedural block above a scene carries irony the prose never has to state. And it can be made hostile.
5. **The section break is a prose instrument.** Hard breaks delete the transitional sentence, where feeling-explaining clauses live.
6. **A digression is a long sentence.** Leakage and a clipped sentence profile pull against each other. Nazir avoids both costs by keeping surplus in dialogue and objects.
7. **The rhythm metric predicts nothing.** Lubwama 10.5 · Nazir 11.3 · *Dite* **17.5**. Three accomplished stories, two opposite profiles. **Chantal's 14.8 is a register, not a defect.**
8. **Close third buys reach, not atmosphere — and it does not itemise the bill.** Flipping [[mihogoni-3f]] to first person with one variable changed left five of seven devices untouched and broke two, both for the same reason: third person was paying for access the narrator does not have. **A story about a girl kept out of rooms should not have a narrating position that can see into all of them.** → [[19 The Third-Person Test — What Close Third Bought and Cost]]

---

## 🧭 Method — `Method/`

**The findings above say what is true. These four say what to do about it.** Working aids, not theory — every one is safe to keep open while drafting.

| File | What it is | Reach for it when |
| --- | --- | --- |
| **[[How To Build A Short Story]]** | Seven stages, one written question each, with a flowchart. Stages 1–6 happen **before a word of the story** and take about three hours | You are starting something and don't yet have a germ, a position or a shape |
| **[[Portable Shapes ΓÇö What Survives Out of the Experiments\|Portable Shapes — What Survives Out of the Experiments]]** | The seven devices that survived the experiments, described as **shapes only — no sentences, no quoted prose**, so whatever fills them must be invented at the keyboard | You are drafting and need a device without risking a borrowed phrase |
| **[[The Letter to Zadie at Eighteen]]** | *NW* reduced to three engines and twelve effects, Kafka's five structural moves, and the three passages worth stealing outright — the dog sentence, the question ladder, the reversal clause | You want to understand **why** a move works before using it |
| **[[Six Moves — The Simple Guide]]** | The same material as a **tickable checklist** with timers and a calendar to 25 October. Four of the six moves are additive | You are stuck, scattered, or short on time and need one job for tonight |

> **The two halves.** [[The Letter to Zadie at Eighteen]] explains; [[Six Moves — The Simple Guide]] executes. Read the first once. Work from the second.

## Related

- [[Home]] · [[Dashboard|the Kalemie project]] · [[02 Comparison Board]] · [[Craft Log]]
- [[Nazir — The Serpent in the Grove]] · [[Mothers Not Appearing in Search — Story Sheet]] · [[Dite — Story Sheet]]
