---
tags: [atlas, index, moc, craft]
aliases: [Craft Atlas, The Atlas]
---

# 🧭 CRAFT ATLAS

> **Where every concept actually happens, in every story, at the exact point it happens.**
> The bases hold the theory. The stories hold the evidence. This folder pins one to the other, by percentage.

## How this works — and why nothing else was touched

**No existing file was modified to build this.** Not one story, not one base note. Everything lives here.

That is possible because of how Obsidian works, and it is worth understanding once:

> **Backlinks are automatic.** When a note here writes `[[Controlling Idea]]`, that McKee note *immediately* shows this one in its **Backlinks** pane at the bottom. You do not have to edit McKee's note. It happens on its own.

So the linking is already two-way:

- **Base → stories.** Open [[Controlling Idea]], scroll to Backlinks, and every atlas entry that uses it is listed. Same for [[What You Are Censoring]], [[Psychic Distance]], all of them.
- **Story → concepts.** Open [[2026-07-28 — Chantal (Draft 3, Prize Pass)|Chantal]], scroll to Backlinks, and its atlas map is there.
- **Concept → everywhere.** The tags below.

**Turn Backlinks on if you cannot see it:** Settings → Core plugins → Backlinks, and tick *Backlink in document* so it appears at the bottom of every note instead of in a side pane.

## Three ways in

### 1 · By story — annotated maps

Walk the story top to bottom. Every beat carries its position and the concepts firing there.

| Map | Story | Beats mapped |
| --- | --- | --: |
| [[Atlas — Chantal (annotated)]] | Chantal D3, 3,895 words | 18 |
| [[Atlas — Beat of My Hurt (annotated)]] | Beat of My Hurt D4, 3,477 words | 23 |
| [[Atlas — Sonny's Blues (annotated)]] | Baldwin, the benchmark | 7 |

### 2 · By concept — reverse index

One concept, every story it appears in, with the exact line.

| Note | The question it answers |
| --- | --- |
| [[Atlas — The Withheld Fact]] | What does each story refuse to tell you? **Six for six** |
| [[Atlas — The Active Protagonist]] | Who chooses, who only watches, and what it costs |
| [[Atlas — Plant and Detonate]] | Where each story buries a fact and where it goes off |

### 3 · By tag

Every entry carries tags. Click one to see every occurrence across all maps.

**By source:** `#atlas/mckee` · `#atlas/cleland` · `#atlas/gardner` · `#atlas/barrett` · `#atlas/kiteley` · `#atlas/learning-curve`
**By story:** `#atlas/chantal` · `#atlas/beat` · `#atlas/baldwin`

```dataview
TABLE WITHOUT ID file.link AS "Atlas note", length(file.outlinks) AS "Links out"
FROM "01 Projects/00 Craft Atlas"
WHERE file.name != this.file.name
SORT file.name ASC
```

---

## What is not here yet

Three of the seven stories have concept notes but no annotated map: **Uwazuruike**, **Giorgis**, and the **master draft**. Their positions are already measured in `03 Story Sheets/`, so building their maps is transcription, not analysis.

**Do them as part of the Saturday Reconstruction** in [[The Apprenticeship — Learning By Hand]] — one map a week and the atlas finishes itself while you are learning anyway.

## Rules for adding to this folder

1. **Never edit a story or a base note to add a link here.** The whole design depends on that.
2. **Always cite a position.** A concept without a percentage and a quoted trigger is an opinion.
3. **Prefix every new note `Atlas — `.** It prevents filename collisions with the base notes, which is what would break the backlinks.
4. Tag with the source base *and* the story.

## Related

- [[13 The Worked Examples — Concepts Against Stories]] — the prose argument this folder is the evidence for
- [[02 Comparison Board]] · [[08 Three Gates — Field Comparison]] · [[Learning Curve]]
