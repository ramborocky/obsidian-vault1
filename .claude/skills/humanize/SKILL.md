---
name: humanize
description: Detect and remove AI writing tells from prose — puffery, participial tails ("..., highlighting its role in..."), negative parallelisms ("not just X, but Y"), rule-of-three padding, copula avoidance, em-dash tics, bold-header lists, vague attribution, leaked chat markup — and rewrite for specificity. Use when asked to humanize, de-AI, de-slop, or make text sound human; when auditing a draft for AI signatures; before publishing anything an LLM touched; or when a reader says writing "sounds like ChatGPT."
---

# Humanize

Adapted from Wikipedia's *Signs of AI writing* (WP:AISIGNS), generalized from encyclopedia
text to prose of any kind.

## The actual problem

The tells are symptoms. The disease is **regression to the mean**: a model predicts the most
statistically likely continuation, so specific, odd, load-bearing facts get smoothed into
generic, positive, important-sounding ones. "Patented the knuckle coupler in 1873" becomes
"a revolutionary titan of industry." The subject gets simultaneously **less specific and more
exaggerated** — the portrait fades to a sketch while the frame gets gaudier.

This governs everything below:

> **Deleting a tell without restoring the specificity it replaced makes the text worse.**
> It becomes bland instead of gaudy, and harder to diagnose. If you strike "played a pivotal
> role in shaping the movement" and write "was involved in the movement," you have laundered
> the problem, not fixed it. Find out *what they actually did* and say that, or cut the
> sentence.

Two more things to hold onto:

- **These are signs, not sins.** Human writers use em dashes, tricolons, and the word
  "crucial." One tell means nothing. Density means everything. Judge per 1000 words.
- **Never accuse.** This skill improves text. It does not certify authorship. Detectors are
  unreliable and humans do barely better than chance. If asked "did an AI write this," give
  observations and density, never a verdict.

## Workflow

### 1. Scan

```bash
node .claude/skills/humanize/scripts/scan.mjs <file-or-dir>
```

Reports every hit with line number, grouped by category, plus a **tells-per-1000-words**
density score:

| Band | Density | Read as |
|---|---|---|
| clean | < 4 | Normal human variation |
| watch | 4–9 | A few habits worth breaking |
| heavy | 10–19 | Reads as machine-assisted |
| saturated | 20+ | Reads as unedited model output |

Calibrated against this vault: hand-written fiction here scores 0–1, a deliberately
model-flavored draft scores 170+. Read the output with three things in mind:

- **Density counts each rule at most five times.** One habitual tic — a writer who loves
  spaced em dashes — is a single habit, not fifty findings. **Breadth across rules matters
  more than the raw total**, so check the "across N rules" figure.
- **Format-only hits are usually just style.** If the scanner says almost everything is
  formatting, it's telling you the writer bolds a lot, not that a model wrote it.
- **Under 300 words the number is noise.** It says so when that happens.

`--json` for machine output, `--only <category>` to focus, `--quiet` for summaries alone,
`--min <n>` to filter a directory sweep down to the worst files. Provenance hits (leaked
markup, `utm_source=chatgpt.com`) are counted separately and are near-conclusive alone.

Two known deliberate blind spots: curly quotes are only reported when mixed with straight
ones (Word, macOS, and every typeset publication produce them), and code fences and YAML
frontmatter are stripped before scanning.

### 2. Triage, don't sweep

Sort hits into three piles:

- **Cut** — the sentence carries no information. Most participial tails and legacy sentences
  are pure filler. Deleting them loses nothing.
- **Replace** — the sentence gestures at something real but blurs it. This needs a fact you
  may not have. Ask the user, or mark it `[?]` rather than inventing one. **Never resolve
  vagueness by fabricating specificity.**
- **Keep** — the writer meant it, it's load-bearing, it isn't a tic. One em dash in a
  paragraph is punctuation. Six is a nervous habit.

### 3. Rewrite

See `references/rewrite-playbook.md` for each pattern with before/after. The five moves that
fix most drafts:

1. **Kill the tail.** Delete every `, highlighting/underscoring/reflecting/ensuring/cementing
   ...` clause hanging off the end of a sentence. They're editorial opinion glued on with a
   comma. The sentence is always better without.
2. **Restore the copula.** `serves as / stands as / functions as / represents / boasts /
   features` → `is / has`. Then check whether the shorter sentence still earns its place.
3. **Delete the legacy paragraph.** Anything about significance, enduring impact, broader
   trends, or what a thing "symbolizes." If the significance is real, it's demonstrated by
   the facts already on the page.
4. **Break the rhythm.** Model prose has one sentence length and one shape. Cut a tricolon to
   two items or four. Put a four-word sentence next to a thirty-word one. Start a sentence
   with "But."
5. **Recover the specific.** Named things, numbers, dates, quotes, the concrete noun instead
   of the abstract one. This is the only move that actually fixes the underlying problem;
   the other four are cleanup.

### 4. Verify

Re-scan. Then read it aloud — the surviving tells are the ones you hear. Confirm density
dropped **and** that word count didn't drop by more than a third: if it did, you cut instead
of replacing, and the text is now thin.

## Reference map

Load only what the draft needs.

| File | Covers |
|---|---|
| `references/tells-content.md` | Puffery, legacy/significance inflation, superficial analysis, vague attribution, "faces challenges" structure, notability padding |
| `references/tells-language.md` | AI vocabulary by model era, copula avoidance, negative parallelisms, rule of three, elegant variation, rhythm |
| `references/tells-format.md` | Em dashes, boldface, bold-header lists, title-case headings, curly quotes, emoji, Markdown leakage, thematic breaks |
| `references/tells-provenance.md` | Leaked internal markup by model, tracking params, placeholder text, collaborative chatter, fabricated citations — detection only, no rewriting |
| `references/rewrite-playbook.md` | Every pattern with a before/after fix |

## Rules of engagement

- **Preserve voice.** If the text is deliberately ornate, or the writer's own habits happen to
  overlap the list, leave them. The target is machine tic, not formality.
- **Don't over-rotate.** Purging every em dash, every "crucial," every tricolon produces
  writing that is visibly avoiding something. Aim for the low end of normal, not zero.
- **Non-native English is not an AI tell.** Elegant variation is taught in Italian and French
  schools. Formal register is code-switching. Flawless grammar is not evidence.
- **Fiction is different.** In dialogue, a character may absolutely say "it's not just a job,
  it's a calling." Voice tics belong to characters. Apply this skill to narration, not to
  speech, unless asked.
- **Report honestly.** Say what you changed and what you left. If a passage needs a fact you
  don't have, say so instead of smoothing over it.
