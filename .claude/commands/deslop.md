---
description: Run the De-Slop Pass on a draft — detect AI-ness, report findings, edit nothing without asking
argument-hint: <note name or path> [light|moderate|heavy]
allowed-tools: Read, Grep, Glob, Bash(wc:*), Bash(grep:*)
---

# The De-Slop Pass

Run the protocol in `01 Projects/Kalemie/Learning Curve/The De-Slop Pass — English Prose.md`
against: **$1**

Severity cap: **$2** (default `light` — 15%) if not given.

Read the protocol note first. It is the source of truth; this command is only the
runner. If the note and this file ever disagree, **the note wins** and you should
say so rather than silently following the command.

## Before anything else

1. **Read the target's craft callouts and find its protected list.** Every Chantal
   draft carries one — the lines the author has ruled untouchable. Law 5's corollary:
   **never override the author's own protected list.** A finding on a protected line
   is reported as protected and nothing else.
2. **Measure, do not trust a header.** Word counts drift between files in this vault.
   Count the prose only — strip leading frontmatter, `>` callouts, headings, tables
   and code fences. State the number you measured.
3. **Check whether this draft is under the standing "not applied" instruction.**
   The protocol note names Chantal, Found Things, Beat of My Hurt and the master
   draft as deliberately NOT run through this. If $1 is one of those, **stop and say
   so** — report what a pass would find, change nothing, and let the author decide.

## The pass, one tier at a time

Do not open all three tiers at once. Work in this order and report each separately.

**Tier 1 — structural.** Paragraphs that all land on a completed beat; the
summarising last sentence; the named emotion; tricolon as default rhythm;
the antithesis snap; metronomic contrast; no dead detail.

**Tier 2 — lexical.** Grep the banned list from the note. `a kind of` and its
family are the biggest single win — hedging where the writer should have chosen.

**Tier 3 — punctuation.** Em-dashes per 300 words. Ellipsis for hesitation.
Fragments arriving on a schedule. Semicolons in close narration.

## The three counts, reported as numbers

```
Words:                                    ____
Em-dashes:            ____    target: < 1 per 300 words
Tricolons:            ____    target: < 1 per 500 words
Antitheses:           ____    target: 1 per story, spent at the peak
Paragraphs landing:   ____ / ____   target: NOT all of them
[needs review] flags: ____
```

## The five laws, and they bind you

1. **Fewest words, biggest effect.** One word before one sentence, one sentence
   before a paragraph. Always preserve names, places, numbers, dialogue content,
   proper nouns.
2. **Deletion caps.** light 15% · moderate 25% · heavy 35%. Never delete a whole
   paragraph. Past the cap you are rewriting, not de-slopping.
3. **When unsure, flag — do not cut.** Mark `[needs review]` and move on.
4. **Change how it is said, never what is said.** Plot, character, direction and
   timeline are out of scope.
5. **The character-trait exception.** When a Tier 1 rule collides with a
   load-bearing character trait, **the character wins and the finding is flagged,
   not fixed.** Composure is the narrator in Chantal; a girl who explains herself
   *is* the characterisation. Check this before every edit.

## Output

**Report findings. Do not edit the file.** Produce a table:

| Tier | Position (%) | Quote | Finding | Verdict |

Verdict is one of: `cut` (proposed, with the replacement shown) · `flag` ·
`protected` · `character trait — Law 5`.

Then state the cap arithmetic: words proposed for deletion, as a percentage of
measured length, against the cap for this severity.

**Only edit if the author says so in a following turn**, and never touch prose the
author wrote for a draft that is a live submission candidate without that being
explicit. Rule 3e makes git history evidence of authorship.

> **Last: it is a detector, never a style.** Whatever the machine produces by
> default is the cliché — and a banned-list applied hard enough converges every
> writer on the same de-slopped voice, which becomes the next cliché. Say where to
> look. What goes in the gap is the author's.
>
> Never chase a detector score. No padding, no deliberate typos, no scrambled
> punctuation. Those are dishonest and they damage the prose.
