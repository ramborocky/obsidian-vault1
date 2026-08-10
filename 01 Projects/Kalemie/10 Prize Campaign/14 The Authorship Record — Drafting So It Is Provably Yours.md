---
tags: [prize, rules, authorship, evidence, process, protocol, de-slop]
aliases: [The Authorship Record, Rule 3e Protocol]
date: 2026-08-05
status: standing protocol
applies_to: everything written between now and 25 October
author: Claude — instrument, not story prose
---

# 14 · THE AUTHORSHIP RECORD
### Drafting so that the work is provably yours

> [!info] What this is for
> You are writing the story yourself, by hand, then typing it. **So the problem is not concealment — it is a false accusation.** Rule 3e requires the story to be your own work, and in June 2026 the Foundation investigated allegations by examining working drafts, timestamped documents and notes. This note is about making sure that if anyone ever looks, the record answers for you.
>
> **The line, stated once:** everything below is about defending real authorship — building evidence and removing prose habits that read as machine-made. None of it is a method for passing off text you did not write. If a sentence is not yours, no protocol here helps, and the honest fix is to write it again worse and own it. → [[12 The Rules — Source of Truth]]

---

## Part 1 · The record

**The evidence you actually want is a record of the work happening**, not a finished file. Four rules.

**1 · Draft *in* the doc, not into it.**
Type the sentences in Google Docs and let them be bad first. Docs keeps revision history at keystroke level and it is the strongest single piece of evidence available to you.

**The one pattern to avoid: a large block of finished text appearing in one paste.** That is what a suspicious version history looks like — regardless of where the text came from. If you have written a page on paper, **retype it rather than dictating or pasting it in**, and let the typing show you changing things, because you will.

**2 · Keep the paper.**
The handwritten pages are the part nobody can fake convincingly and nobody can generate. Do not throw out a sheet because the version on it is worse. Photograph each session's pages at the end of the day — the phone timestamps them for free — and keep the physical stack in order.

**3 · Do not backfill, and do not tidy.**
A history showing a story arriving fully formed on one afternoon is worse than a messy one showing four weeks of stops, dead ends and restored cuts. **The mess is the proof.** Never reconstruct earlier drafts after the fact to make the trail look better; a fabricated trail is a far worse position than an untidy one.

**4 · The vault's git history keeps running underneath.**
Commit at the end of every block, as the Atelier already instructs. It corroborates the Docs history from a second, independent system with its own timestamps.

```bash
git add -A && git commit -m "practice: $(date +%F-%H%M)"
```

**And the negative rule, which does more than the other four together: do not run the story through anything.** No AI polish, no AI rewrite, no "make this flow better", no grammar tool that offers to rephrase rather than correct. A single pass of that over your own prose is what would actually put a machine signature into a document you wrote yourself.

---

## Part 2 · The prose habits that read as machine-made

These are the tells. Note that **they are also, independently, prose faults** — which is why the fix costs you nothing. The vault already has the instrument: [[The De-Slop Pass — English Prose]]. Run it by hand on paper.

| Tell | What it looks like | The fix |
| --- | --- | --- |
| **Even rhythm** | Sentence lengths clustering near the average; paragraphs of similar size down the page | Vary hard. A two-word paragraph next to a forty-word one |
| **The tricolon** | Three-item lists, especially with a rhythmic third | Keep the ones that earn it. Cut to two, or push to four |
| **Antithesis** | *It was not X. It was Y.* | **Budget: one per story.** Yours is *It was not shame. It was arithmetic.* Everything else in that shape spends it early — this is exactly what the D4 de-slop cuts were doing |
| **Everything lands** | Every paragraph ending on a beat | Let paragraphs end flat — on an object, a fact, the weather. The Atelier's Day 4 marks eight of them |
| **Regular aphorism** | A formulation every three or four paragraphs, arriving on a schedule | Withhold two or three conclusions and let the reader reach them |
| **Em-dash density** | Em-dashes doing the work commas or full stops should do | Count them by hand. Most can go |
| **Hedge-free balance** | Clauses that weigh both sides evenly and resolve neatly | Real speech is lopsided. Let a sentence lean |
| **Uniform register** | Vocabulary that never slips out of its band | Let her be crude, or wrong, or childish, in a way the surrounding prose does not apologise for |

---

## Part 3 · The thing that actually reads as human

**Idiosyncrasy that cannot be justified.**

Every tell above is a form of *smoothness*. What no generator produces reliably, and what no reader mistakes, is a choice with no defence — a word slightly off, an image that does not quite work but is clearly the writer's own, a digression that goes nowhere and stays anyway, a detail nobody would have selected.

So: **when you find something in your draft you cannot explain, do not fix it. That is the signature.** The instinct to tidy is the same instinct that produces the smoothness, and this vault's whole diagnosis of Chantal — *nothing in it is loose* — is the same finding wearing different clothes.

Related: this is why leakage matters twice. Surplus detail makes a world believable **and** it is the least machine-like thing a story can contain, because it is unjustifiable by construction. → [[The X-Factor]]

---

## Part 4 · The two-version test — running now, decided by 26 August

**The open question:** the third-person register feels right and the instruments say first person. Neither a gut nor a note settles it. **An ear does.**

**The test.** Take one scene — **the police station**, because it is the densest scene in the story and where the language work lives — and write it out twice, by hand, from the shapes in [[Portable Shapes — What Survives Out of the Experiments|the shapes brief]] and from nothing else.

1. **Version A** — first person, as Draft 4 already has it
2. **Version B** — close third, written fresh, not transposed

Then read **three** things aloud, cold, in a different order than you wrote them: A, B, and Draft 4's existing scene. **Do not score them.** Note only which one you stop believing in first.

**Decide by the full-moon read-aloud, 25–26 August**, which the calendar already reserves. → [[09 The Practice — Calendar, Ritual and Ilmu Huruf]]

> [!warning] The timing is the constraint, not the craft
> A person change on a 3,900-word story is two to three weeks of writing plus a full re-score. **That is affordable in August and impossible in October.** If the answer is going to be third person, it has to be found this month.

**And two things the test does not put at risk.** Point of view is not a device anyone owns — writing your own story in close third is just writing, and costs nothing in authorship terms. And whichever version wins, it will have been written by hand from a page of shapes, which is the whole of what Part 1 is protecting.

## Related
- [[12 The Rules — Source of Truth]] — rule 3e, rule 3f, and the June 2026 investigation
- [[The De-Slop Pass — English Prose]] — the instrument for Part 2 · [[The X-Factor]] — leakage
- [[Portable Shapes — What Survives Out of the Experiments]] — the only page to keep open while drafting
- [[The Three-Week Atelier]] — Days 4, 12 and 13 already run parts of this by hand
- [[Home]] · [[Craft Log]]
