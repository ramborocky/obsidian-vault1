# Language and rhythm tells

How the sentences are built. Cheaper to fix than content tells, and also cheaper to fake —
which is why density across several categories matters more than any single hit.

## 1. AI vocabulary

Certain words spiked in written English after late 2022. One appearance means nothing; they
travel in packs, and a pack is one of the strongest signals available.

**The vocabulary shifts by model era.** Matching a draft to an era is often more informative
than the raw count:

| Era | Characteristic words |
|---|---|
| 2023 – mid-2024 (GPT-4) | delve, tapestry, testament, meticulous, intricate, interplay, pivotal, bolstered, garner, boasts, crucial, vibrant, landscape, enduring, valuable, additionally |
| mid-2024 – mid-2025 (GPT-4o) | align with, enhance, foster, showcase, emphasize, underscore, highlight, pivotal, crucial, vibrant, bolstered |
| mid-2025 onward (GPT-5) | emphasizing, enhance, highlighting, showcasing — plus the coverage/notability vocabulary |
| Grok, any era | causal, empirical, correlate, consolidate, "X rather than Y", still underscores |
| Claude | fewer of the above; heavier em-dash use than professional writers |

**Words that decayed:** `delve` was the signature of 2023–early 2024 and fell off sharply in
2025. Its presence dates a draft more than it condemns one.

**Read in context.** A synonym of an overused word is not itself overused. `underscore` can
mean an underline or incidental music. `key` as an adjective is ordinary English. Density and
co-occurrence are the test, not any single word.

## 2. Copula avoidance

**Watch for:** serves as / stands as / functions as / operates as / represents / marks /
boasts / features / offers / maintains / refers to — where `is` or `has` would do.

Measured decline in the frequency of `is` and `are` in text written after 2023. The model
reaches for a marketing verb instead of the plain one, and asking a model to "revise" a
sentence reliably strips the copula out.

| Model output | Plain |
|---|---|
| The gallery serves as the association's exhibition space. | The gallery is where the association exhibits. |
| The building features four floors. | The building has four floors. |
| It stands as the oldest of its kind. | It is the oldest of its kind. |
| He ventured into politics as a candidate. | He ran for office. |
| She began her career as a nurse. | She was a nurse. |

The last two matter: recent output prefers an elaborate verb phrase over a simple state.

**Fix:** restore `is`/`has`, then reread. Half these sentences turn out to say nothing once
the verb stops doing the work.

## 3. Negative parallelisms

Three shapes, all common enough in human writing to be forgivable once and damning six times.

**Not just X, but Y** — `not only ... but also`, `it's not just a ..., it's a ...`,
`this isn't merely ..., it's ...`

**Not X, but Y** — `it's not ..., it's ...`, `no ..., no ..., just ...`

**X rather than Y** — the reversed form, especially frequent in Grok output.

All three stage a misconception nobody held so the sentence can correct it. They generate a
feeling of insight without adding information.

> It wasn't just a factory closure — it was the end of the town's identity.

**Fix:** assert the second half and drop the first. "The closure ended the town's identity as
a manufacturing center." Or, better, describe what actually happened and let the reader draw
it.

## 4. Rule of three

Triples everywhere: three adjectives, three short phrases, three bullets, three examples,
three-part section structures. Used to make a shallow observation look thorough.

> a bold, ambitious, and deeply personal record

Human writers use tricolons too — for cadence, at a peak, occasionally. The tell is
*mechanical* use: every list is three long, every modifier comes in threes, the count never
varies.

**Fix:** vary the count. Two items, or four, or one good one. Then check whether the three
items were actually three things or one thing said three ways.

## 5. Elegant variation

Repetition penalties push the model to rename the same thing every time it comes up. Across
one passage: "the artists" → "these creators" → "the non-conformists" → "such visionaries."
Frequently paired with high adjective density, because each renaming drags a new modifier in.

**Caveat:** this one has the highest false-positive rate on the list. Avoiding repetition is
explicitly taught in Italian and French schools, and is a hallmark of some human styles.

**Fix:** pick one name for the thing and use it. English tolerates repeated nouns far better
than writers fear.

## 6. Rhythm and shape

Not on the Wikipedia list, but the most audible tell once you know it, and the hardest for a
model to avoid.

- **Uniform sentence length.** Model prose clusters at 15–25 words with little variance. Human
  prose swings.
- **Uniform sentence shape.** Subject–verb–object, then a comma, then a subordinate clause.
  Over and over.
- **Paragraph symmetry.** Every paragraph three to four sentences. Nobody writes a one-line
  paragraph. Nobody runs on.
- **Every claim balanced.** A qualification for every assertion, a "however" for every point.
  Human writers commit, then contradict themselves later.
- **No dead ends.** Nothing digresses, nothing gets dropped, nothing is mentioned once and
  never picked up. Real writing has loose threads.

**Fix:** read aloud. Where you never run out of breath, the rhythm is flat. Add a fragment.
Let one sentence run long. Cut a paragraph to a single line. Leave something unresolved.

## 7. Transition tics

**Watch for:** sentence-initial `Additionally,` (the classic), `Moreover,` `Furthermore,`
`Notably,` `Importantly,` `In conclusion,` `Overall,` `Ultimately,` — one per paragraph,
mechanically.

Also the rhetorical-question-and-answer move (`So what does this mean? It means...`) and the
one-word paragraph for emphasis (`The result? Chaos.`).

**Fix:** most can be deleted outright. If the logical relation between two sentences isn't
already clear, a connective won't save it.
