# Obsidian Vault — Root Notes

This repository is an **Obsidian vault belonging to a fiction writer**, not a software project. Almost every file is prose, notes about prose, or an instrument for measuring prose. Treat markdown as the product.

**Start at [`Home.md`](Home.md).** It is the vault's real dashboard — current blockers at the top, live status table, links to every hub. Read it before proposing work; it usually already says what the next action is.

## The work in one paragraph

One short story, *Chantal* (3,896 words, first person, narrated by Djamela), is being prepared for the **Commonwealth Short Story Prize** — entries 1 September – 1 November 2026, with a self-imposed submit date of **25 October**. Around it sits a large craft apparatus: six knowledge bases, a nine-axis judging rubric, and an empirical campaign that measures real prize winners and corrects the rubric against them. Chantal is also story #1 of a planned cycle set in Mihogoni, by the lake. The apparatus is as much the project as the story is.

## Layout

| Path | What it is |
| --- | --- |
| `Home.md` | The dashboard. Start here. |
| `01 Projects/` | All active work. **Has its own `CLAUDE.md` — read it before touching anything inside.** |
| `01 Projects/Kalemie/` | The main story project: drafts, six craft bases, prize campaign, characters, scenes. |
| `01 Projects/00 Craft Atlas/` | Cross-index pinning each craft concept to the exact percentage point where it happens in each story. Built without modifying any source note — Obsidian backlinks do the reverse direction automatically. |
| `01 Projects/00The beat of my hurt/` | A second story (Ilunga, first person, drummer, unnamed lake town). Free invention, currently at Draft 4. Used as a control against Chantal. |
| `01 Projects/x-factor/` | **The AI sandbox — every file in it was written by Claude and none of it is the user's.** Craft experiments run at full length so an idea can be tested without touching the manuscript. **Nothing in here may cross into `01 Story Brain`.** Start at `x-factor.md`. Created 2026-07-31 by moving the AI drafts out of `Kalemie/`, where they were sitting two folders from the submission candidate. |
| `01 Projects/Personal/` | Unrelated admin — ACPA/NBAA accountancy study, expenses, an Airbnb retreat idea. Not part of the story work. |
| `.claude/` | `settings.json` plus the archive-before-edit hook. Deliberately tracked in git — see below. |
| `.obsidian/` | Plugin config. Workspace state and vendored plugin bundles are gitignored; each plugin's `data.json` is tracked so settings travel with the vault. |

Root-level loose files (`Immaculate.md`, `Antagonist.md`, `THE MILLENIAL MIND.md`, the `Untitled*` files, `${Antagonist-Jean-luc}.md`) are **legacy scratch from before the vault was organised.** Do not treat them as current; do not tidy them without being asked.

## The memory layer

`01 Projects/Personal/Operating Manual/00 Profile — The Memory.md` holds the standing personal
context — money, credential status, what is actually being built, and the named UNKNOWNs.
**Read it before answering anything about the user's life, work, money or plans**, and fix it first
when a fact changes; the rest of that folder is derived from it and goes stale silently otherwise.
The `second-brain` skill wires this up and re-derives the downstream notes.

## Three hard rules

**1 · Authorship. The user writes the prose. Claude does not.**
**This rule is settled. Do not re-explain it, do not cite prize clauses as backing for it, and do not raise it as a topic — the user knows why it exists.** Claude builds instruments, analysis, indexes, tooling and notes; Claude does not draft, rewrite or "polish" story prose unless explicitly asked for a clearly-labelled non-canon experiment. When `Home.md` marks a paragraph as owed by the user, that is not a formality — leave it.

Never add a `Co-Authored-By: Claude` trailer to a commit that merely tracks story prose Claude did not write; it would fabricate an authorship record against the user's interest. Use the trailer normally on notes, instruments and tooling Claude did author.

**2 · The remote is public.**
`origin` is `https://github.com/ramborocky/obsidian-vault1`, and anyone can read it. **Ask before pushing new story prose — it is the user's call, and they have made it once already.** State it as that one question; do not attach prize-rule reasoning to it. Never force-push; it has never been needed here.

**3 · No money moves through Claude.**
`01 Projects/Personal/Expenses.md` is a spending log in TZS. The division of labour is: the user logs, Claude analyses. Budgeting from the user's own numbers is fine. No payments, no transfers, and never enter banking or mobile-money credentials — this is recorded as a hard limit in the file itself.

## Archive before editing

A `PreToolUse` hook (`.claude/hooks/archive-before-edit.sh`, wired in `.claude/settings.json`) captures the pre-edit content of story prose to the Craft Log before any Write/Edit overwrites it. Cut material is trunk material for later stories in the cycle. The hook never blocks an edit — archiving is best-effort.

This hook was **lost once**, when the vault was copied to a new machine without its `.claude/` folder, because `.gitignore` had a blanket `.claude/` rule. That rule now carries explicit exceptions for `settings.json` and `hooks/` so the hook travels with the vault. `01 Projects/CLAUDE.md` holds the verification command and the recovery command for prior file versions.

## Conventions and quirks

- **The Writing Constitution is a hard constraint, not a suggestion:** *We write scenes, not explanations. Objects carry emotion. Dialogue reveals class.*
- **Wikilinks, not paths.** New notes link with `[[Note Name]]`. Dataview queries in `Home.md` and the dashboards depend on frontmatter (`tags`, `status`, `pov`, `words`, `date`) — preserve it when editing, and keep `words:` honest.
- **`claudey/`** is a stale duplicate of an older vault root. It is not a working copy; do not edit it, and do not use it as a source of truth.
- **Doubled `.md.md` extensions** appear throughout `Kalemie/00 Mackee/` and elsewhere, from a past import. Legacy, not a convention — new notes use a single `.md`.
- **Filenames containing `${...}`** are unrendered Templater placeholders, not intentional names.
- **Word counts drift between files.** Before quoting a length, re-measure rather than trusting a number in a table; the 2,000–5,000 gate is hard and several notes disagree with each other.
