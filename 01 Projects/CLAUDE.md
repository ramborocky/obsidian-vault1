# 01 Projects — Working Directory Notes

This directory is an Obsidian vault subfolder (`01 Projects`, inside the larger "Obsidian Vault"). It contains:

- **`Kalemie/`** — an in-progress literary short story (target: Commonwealth Short Story Prize), planned as story #1 in a linked story cycle set in the same world. See `Kalemie/Collection Tracker.md` for the cycle plan, and five parallel craft knowledge bases: `Kalemie/00 Mackee/` (Robert McKee's *Story* — structure/plot), `Kalemie/00 Jane Cleland/` (Jane Cleland's *Mastering Suspense* — reader psychology/sentence-level suspense), `Kalemie/01 John Gardner/` (John Gardner's *The Art of Fiction* — the underlying theory: the vivid-and-continuous fictional dream, why victim-protagonists fail, sentimentality/frigidity/mannerism), `Kalemie/02 Charles Barrett/` (Barrett's *Short Story Writing*, 1900 — the short story as a form with edges, defined by what it must exclude), `Kalemie/03 Brian Kiteley/` (Kiteley's *The 3 A.M. Epiphany* — 200 exercises; prescribes rather than diagnoses), and `Kalemie/Learning Curve/` (the adversarial base — judging criteria, edit-pass order, and a standing diagnosis of the live draft).
- **`Personal/`** — unrelated personal to-do/admin files (NBAA/ACPA study, an Airbnb retreat idea, a general to-do list). Not part of the Kalemie project.
	- **`Personal/Expenses.md`** — a spending log the user appends to freely, in TZS. **Division of labour: they log, Claude analyses.** On "do the expenses": fill blank categories, normalise dates/amounts, total by month and category with the arithmetic shown, and flag the specific pressures — school fees have hard deadlines, the House build and the ACPA qualification compete for the same money. Never guess at an ambiguous row; flag it. **Hard limits recorded in the file: no payments, no transfers, never enter banking or mobile-money credentials, no investment advice.** Budgeting from the user's own logged numbers is fine; anything touching actual money is not.

## Standing Rule: Archive Before Editing (Kalemie prose)

> [!NOTE] Hook was missing, now rebuilt and tested — 2026-07-26
> This section described a `PreToolUse` hook that auto-archives pre-edit prose. On 2026-07-26 the hook was found **not to exist on this machine**: `.claude/` at the vault root held only `worktrees/`.
>
> It had existed. The Craft Log contains auto-captured entries sourced from `C:\Users\lijumba\Documents\Obsidian Vault\...` — so the rule worked on the previous machine and was lost when the vault was copied here without its `.claude/` folder. **The root cause was `.gitignore`, which contained a blanket `.claude/` rule**, so the hook was never in the repo to travel with the vault. That rule now has explicit exceptions for `settings.json` and `hooks/`.
>
> The hook has been rewritten, tested against eight cases (protected/unprotected paths, Windows backslash paths, missing files, non-edit tools, duplicate suppression, and both `CLAUDE_PROJECT_DIR` set and unset), and committed. It is real again.

Before any Edit/Write touches story-prose content under `Kalemie/06 Scenes`, `Kalemie/STORY PROGRESSION & DRAFTS`, `Kalemie/02 Characters`, or `Kalemie/01 Story Brain`, the **pre-edit content is automatically archived** to `Kalemie/07 Narrative Craft/Craft Log.md` under "Cut / Original Material Archive" by `.claude/hooks/archive-before-edit.sh`, wired in `.claude/settings.json`. Reference material is excluded — the four knowledge bases and the Craft Log itself. Identical consecutive content is not re-archived. The hook never blocks an edit; archiving is best-effort by design.

Cut material is trunk material for other stories in the cycle — see `Kalemie/Collection Tracker.md`.

**Verify the hook is live** (run after moving the vault, or if archiving seems to have stopped):

```bash
bash -c 'f="$PWD/01 Projects/Kalemie/02 Characters/Protagonist - Daudi.md"; n=$(grep -c "auto-archived" "$PWD/01 Projects/Kalemie/07 Narrative Craft/Craft Log.md"); printf "{\"tool_name\":\"Edit\",\"tool_input\":{\"file_path\":\"%s\"}}" "$f" | bash .claude/hooks/archive-before-edit.sh; m=$(grep -c "auto-archived" "$PWD/01 Projects/Kalemie/07 Narrative Craft/Craft Log.md"); [ "$m" -gt "$n" ] && echo "HOOK LIVE" || echo "HOOK NOT FIRING"'
```

**Recover a prior version of any tracked file:**

```bash
git show HEAD:"01 Projects/Kalemie/02 Characters/Supporting - Djamela.md"
```

When making a craft-driven fix (not just a typo), also add a one-line entry to the Craft Log's **Pattern Log** naming what broke and which McKee principle applied — this is how recurring failure modes become visible over time, separate from the raw archive.

## Kalemie: How to Work On It

- **Dashboard**: `Kalemie/00 Dashboard/Dashboard.md` — the live action plan, craft cheat sheet (McKee structure rules + Cleland sentence-level rules), and status tracker. Read this first for current priorities.
- **Craft knowledge bases** (six, same note pattern throughout — principle → "For Kalemie" application → "Questions for AI"; use these directly rather than re-deriving theory from scratch):
	- `Kalemie/00 Mackee/` — start at `Story structure by robert mackee.md.md`. Structure and plot: Spine, Acts, Turning Points, the Gap, Controlling Idea.
	- `Kalemie/00 Jane Cleland/` — start at `Mastering Suspense by Jane Cleland.md`. Reader psychology and sentence-level suspense craft: pacing, banned telling-words, the 20-word rule.
	- `Kalemie/01 John Gardner/` — start at `The Art of Fiction by John Gardner.md`. The theory underneath both: the vivid-and-continuous fictional dream, why a blank/passive protagonist breaks a story, sentimentality/frigidity/mannerism, the Fichtean curve.
	- `Kalemie/02 Charles Barrett/` — start at `Short Story Writing by Charles Raymond Barrett.md`. Charles Raymond Barrett's *Short Story Writing* (1900) — the only source in the vault about the short story **as a distinct form**. An argument from scarcity: one incident, one place, one predominant emotion, two speaking characters, no subplot, no chapter breaks, an ending within a paragraph of the climax. The most useful of the five for a story under a hard word ceiling. He states the first-page cut in 1900 in nearly the Commonwealth panel's words, and gives 3,000–5,000 as the ideal length. **Overrule him on three things**: his contempt for dialect writing (would gut Kalemie's code-switching), a passage of period sexism about women writers, and his claim that the form's object is "to amuse."
	- `Kalemie/03 Brian Kiteley/` — start at `Prescriptions for the Live Draft.md`. Brian Kiteley's *The 3 A.M. Epiphany* (2005) — 200 numbered writing exercises. **The only base that prescribes rather than diagnoses**, and the right one to reach for when the problem is that nothing is getting written rather than that nothing is understood. The Prescriptions note maps every open fault to a specific exercise with a word count, and includes a 7-day schedule to replace the Dashboard's stalled one. Key ideas: restriction generates material; cut any prose by 20%; the best fiction shows a writer learning, not teaching; every writer censors one major thing (Barthelme). **Caution: this book can become a way of not finishing** — use it targeted, never browsed.
	- `Kalemie/Learning Curve/` — start at `Kalemie — Standing Diagnosis.md`, then the index `Learning Curve.md`. The other three bases are generative (what to build); this one is adversarial (what gets cut, and by whom). Contains the Commonwealth Prize judging rubric, the fixed edit-pass order, cold-read prompts for extracting honest feedback, and a measured verdict on the live draft. Its second half deconstructs Lynda Clark's InGAME/Dundee *Creativity Amplification* research — most usefully the "funhouse mirror" (whatever a model generates by default is the cliché) and "all the small things" (grief arrives through the minor object).
- **Collection strategy**: `Kalemie/Collection Tracker.md` — Kalemie is being written as the first entry in a story cycle (shared world, motifs, and minor characters reusable across future stories). Only one story should be in active "Drafting" status at a time.
- **Writing Constitution**: quoted in full at the bottom of the Dashboard — *"We write scenes, not explanations. Objects carry emotion. Dialogue reveals class..."* — treat this as a hard style constraint, not a suggestion.

## Vault Tooling Already Installed (Obsidian plugins)

Enabled: Templater, QuickAdd, Dataview, Tasks, Calendar, Canvas + Advanced Canvas, Excalidraw, Homepage, **StoryLine** (book-planning: corkboard/kanban/timeline/plotlines — the natural home for story-cycle planning, complementing `Collection Tracker.md`), **Eventide Quill** (novelist-focused feedback/word-count tool — currently only tracking the `00 Dashboard` folder, should be pointed at the real draft folders), **Vault-as-MCP** and **Local REST API with MCP** (both expose the vault as an MCP server if deeper Obsidian↔LLM integration is ever wanted).

Installed but disabled: Codex Narrative Engine (consistency linting / dead-link detection — would help catch orphaned subplots automatically), Copilot, Grimoire, Hindsight, **Claudian** (embeds Claude Code directly inside Obsidian as a panel — an alternative to running Claude Code in a separate terminal), AI Commit.

## Known Quirks

- Many existing files in `Kalemie/00 Mackee/` and elsewhere carry a doubled `.md.md` extension from a past import — this is legacy, not a naming convention to imitate for new files. Newly created notes use a single `.md`.
- The vault is a git repository on this machine, but **it has no remote** (corrected 2026-07-28). It was copied here without its `.git` directory — the same way it lost `.claude/` — so the history at `github.com/ramborocky/obsidian-vault1` is *not* connected to this repo. Local history restarts at `62d0769`, branch `main`. **Do not `git push`, and do not add that remote and force-push**: this repo shares no history with it, so forcing would destroy whatever is there. To reconnect properly, clone the remote fresh and copy these files in on top. Commits are normal workflow; pushes need a remote set up deliberately first.
- **Hard submission constraint**: the Commonwealth Short Story Prize accepts 2,000–5,000 words. The draft prose currently measures ~3,941 words. Re-measure before any expansion — see `Kalemie/Learning Curve/Kalemie — Standing Diagnosis.md` for the running word budget.
