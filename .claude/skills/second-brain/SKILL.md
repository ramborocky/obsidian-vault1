---
name: second-brain
description: Run the seven self-teaching prompts against the user's real context instead of from cold, and write or refresh the answers in the Operating Manual. Use when the user asks to run the seven prompts, refresh the Operating Manual, "be my second brain", teach them what they've ignored, build a personal curriculum, design mental models, or plan how to make more money — and whenever a fact in their profile has changed and the downstream advice needs re-deriving.
---

# Second Brain

Seven prompts that stop producing generic advice the moment they are run against real context.
This skill is the wiring that supplies the context.

**Everything lives in `01 Projects/Personal/Operating Manual/`.**

## The rule this skill exists to enforce

Run cold, the seven prompts return competent advice the user has read a hundred times.
Run against the profile, prompt 1 names the three unread fields on a MEMS profile and prompt 7
prices a business at $350 a client. Same prompts. The difference is entirely the loaded context.

**So: never answer any of the seven without reading the memory first.**

## Procedure

### 1 · Load the memory, always
Read, in this order, before writing anything:
1. `01 Projects/Personal/Operating Manual/00 Profile — The Memory.md` — the facts
2. `01 Projects/Personal/Operating Manual/Due Diligence — What the Market Says.md` — what research has already settled
3. `01 Projects/Personal/Operating Manual/The Seven.md` — the prompt set and the re-run triggers

Then skim `Home.md`, `01 Projects/Personal/Expenses.md` and `ACPA(T) NBAA To-Do.md` for anything
that contradicts the profile. **A contradiction is the most valuable thing you can find** — surface it,
fix the profile first, and say what changed downstream.

### 2 · Decide what actually needs re-running
Do not re-run all seven by reflex. `The Seven.md` holds a trigger table mapping changed facts to
affected prompts. If nothing in the profile has changed since the notes were written, **say so and
stop.** Re-running for the feeling of progress is the exact failure mode these notes diagnose.

### 3 · Write the answers into the notes
One note per prompt, filenames as listed in `The Seven.md`. Preserve the frontmatter pattern
(`tags`, `aliases`, `date`, `status`, `author`), link with `[[Wikilinks]]` never paths, and cross-link
back to `[[00 Profile — The Memory]]` and `[[Operating Manual]]`.

When a rewrite reverses something the previous version said, **say so explicitly in the note** —
a callout naming what changed and why. The correction record is the most useful part of the file;
silently overwriting a wrong claim destroys the only evidence that the thinking moved.

### 4 · Update the index
`Operating Manual.md` carries the three-line thesis and the one instruction. Refresh both if the
answers moved. Keep it to three lines; it is an index, not an essay.

## How to write these answers

- **Ground every claim the profile can ground.** "Price is set, not discovered" is advice; "offshore
  bookkeepers bill $10–25/hour and AI-assisted practices charge $150–400 per client per month" is
  usable. Prefer the second, and go and look it up if it is not already in the due-diligence note.
- **Show arithmetic.** Divide the number. `$1,000,000 ÷ 36` closed a question no amount of prose could.
- **Name the uncomfortable thing once, precisely, without moralising**, then move on. It is asked for.
- **State assumptions rather than blocking on them.** Where a fact is missing, mark it UNKNOWN in the
  profile and carry on under a stated assumption.
- No hedging, no motivational register, no rule-of-three padding.

## Standing constraints from the vault

These are not negotiable and this skill does not override them:
- **The user writes the prose. Claude does not.** These notes are instruments, not story work — the
  `Co-Authored-By` trailer is correct on them and wrong on anything tracking the user's fiction.
- **The git remote is public.** Ask before pushing new story prose.
- **No money moves through Claude.** No payments, no transfers, no banking or mobile-money
  credentials, no investment advice. Budgeting and analysis from the user's own logged numbers is fine.

## The seven

1. **What I've ignored** — ten skills, ideas or models they're blind to, and why each matters more than they think → `Ten Things I Was Blind To.md`
2. **A year of wisdom in an hour** — psychology and philosophy, compressed, no fluff → `The Mentor Session — Seven Ideas.md`
3. **What school never did** — a curriculum for thinking clearly, acting strategically, persuading, adapting → `The Second Curriculum.md`
4. **How people become unstoppable** — the psychology and behaviours, practical and uncomfortable → `Unstoppable — The Architecture.md`
5. **Building a legacy** — the thinking that scales impact, influence and income → `Legacy — What Scales.md`
6. **Models I can't unsee** — five original models for decisions, people, failure, leverage → `Five Models I Can't Unsee.md`
7. **Ten years ahead** — what that operator knows, thinks and unlearned; a blueprint → `The Ten-Years-Ahead Operator.md`
