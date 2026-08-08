---
description: Deconstruct a story into a Craft Atlas — craft moves pinned to measured percentage positions
argument-hint: <story note, path, or pasted text> [--new]
allowed-tools: Read, Grep, Glob, Write, Bash(wc:*), Bash(find:*)
---

# Build an Atlas

Deconstruct **$1** the way `01 Projects/00 Craft Atlas/` does it.

Read `01 Projects/00 Craft Atlas/Craft Atlas.md` and at least one existing annotated
atlas before starting — `Atlas — Sonny's Blues (annotated).md` for a published story,
`Atlas — Chantal (annotated).md` for one of ours. **Match their shape exactly.**

## The hard rule of this folder

**The source note is never modified.** Not a tag, not a line. The atlas is a separate
note that points at it; Obsidian's backlinks give the reverse direction for free.
If deconstructing seems to require editing the source, you have misunderstood the task.

## Method

1. **Measure the prose.** Strip leading frontmatter, `>` callouts, headings, tables,
   code fences. Get a real word count. Every position below is a **cumulative word
   count expressed as a percentage** — measured, never estimated by eye.

2. **Find the moments, not the plot.** An atlas entry is a place where a craft move
   *happens*, not a place where something happens. A summary of events is a failure
   of this command. Typical density: 8–14 entries for a 4,000-word story.

3. **For each entry:**
   - `## NN.N% · A short name for the move`
   - The anchor quote as a blockquote — short, searchable, the exact words. It must
     be findable with a text search in the source.
   - Base tags: `#atlas/mckee` `#atlas/cleland` `#atlas/gardner` `#atlas/barrett`
     `#atlas/kiteley` `#atlas/learning-curve` — only the ones actually in play.
   - Bulleted links to the craft principles, `[[Wikilink]]` form, each with one
     sentence saying **what the move does here** — not what the principle means in
     general. Cite the note, do not re-derive the theory.

4. **Name the plants and their detonations with both positions and the gap.**
   *"Planted at 27.6%, paid at 96.2% — a 69-point gap, the widest in the story."*
   That gap number is the single most useful thing the Atlas produces. See
   `Atlas — Plant and Detonate.md`.

5. **Where a principle is broken and the story is better for it, say so.** An atlas
   that only confirms the rubric is not measuring anything.

## For a story that is not ours

When $1 is a published story (a prize winner, a Sonny's Blues), also record:

- **What it does that our stories do not.** Be specific and positional.
- **Where it would score badly on our nine-axis rubric and win anyway.** This is the
  point of the whole campaign. The 2026 winner scores 31/45 and beat 7,806 entries;
  Chantal scores 40. **The rubric rewards architecture and the panel forgives it.**
  Every entry of this kind is evidence about the rubric, not about the story.
- Add a row to `01 Projects/Kalemie/10 Prize Campaign/02 Comparison Board.md` if the
  story belongs on the board.

## Output

With `--new`, write `01 Projects/00 Craft Atlas/Atlas — <Title> (annotated).md` with
frontmatter `tags: [atlas, craft, annotated]`, `source:`, `words:` (measured).

Without `--new`, print the atlas in the conversation and do not write anything.

Finish with **the three things this story knows that ours does not** — concrete,
positional, and usable in a revision. If you cannot name three, say how many you can.
