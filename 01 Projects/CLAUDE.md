# 01 Projects — Working Directory Notes

This directory is an Obsidian vault subfolder (`01 Projects`, inside the larger "Obsidian Vault"). It contains:

- **`Kalemie/`** — an in-progress literary short story (target: Commonwealth Short Story Prize), planned as story #1 in a linked story cycle set in the same world. See `Kalemie/Collection Tracker.md` for the cycle plan and `Kalemie/00 Mackee/` for a compact, application-focused knowledge base built from Robert McKee's *Story*.
- **`Personal/`** — unrelated personal to-do/admin files (NBAA/ACPA study, an Airbnb retreat idea, a general to-do list). Not part of the Kalemie project.

## Standing Rule: Archive Before Editing (Kalemie prose)

Before any Edit/Write touches story-prose content under `Kalemie/06 Scenes`, `Kalemie/STORY PROGRESSION & DRAFTS`, `Kalemie/02 Characters`, or `Kalemie/01 Story Brain`, the **pre-edit content is automatically archived** into `Kalemie/07 Narrative Craft/Craft Log.md` (under "Cut / Original Material Archive") by a `PreToolUse` hook (`.claude/hooks/archive-before-edit.sh`, wired in `.claude/settings.json`). Nothing in those folders is silently destroyed — cut material is trunk material for other stories in the cycle. The `00 Mackee` knowledge base and the Craft Log itself are excluded from archiving (no need to archive reference notes).

When making a craft-driven fix (not just a typo), also add a one-line entry to the Craft Log's **Pattern Log** naming what broke and which McKee principle applied — this is how recurring failure modes become visible over time, separate from the raw archive.

## Kalemie: How to Work On It

- **Dashboard**: `Kalemie/00 Dashboard/Dashboard.md` — the live action plan, craft cheat sheet (McKee structure rules + Cleland sentence-level rules), and status tracker. Read this first for current priorities.
- **Craft knowledge base**: `Kalemie/00 Mackee/` — start at `Story structure by robert mackee.md.md` (the index/map of content). Every note ends with a "For Kalemie" application section and "Questions for AI" — use these directly when reviewing or drafting a scene rather than re-deriving McKee's theory from scratch.
- **Collection strategy**: `Kalemie/Collection Tracker.md` — Kalemie is being written as the first entry in a story cycle (shared world, motifs, and minor characters reusable across future stories). Only one story should be in active "Drafting" status at a time.
- **Writing Constitution**: quoted in full at the bottom of the Dashboard — *"We write scenes, not explanations. Objects carry emotion. Dialogue reveals class..."* — treat this as a hard style constraint, not a suggestion.

## Vault Tooling Already Installed (Obsidian plugins)

Enabled: Templater, QuickAdd, Dataview, Tasks, Calendar, Canvas + Advanced Canvas, Excalidraw, Homepage, **StoryLine** (book-planning: corkboard/kanban/timeline/plotlines — the natural home for story-cycle planning, complementing `Collection Tracker.md`), **Eventide Quill** (novelist-focused feedback/word-count tool — currently only tracking the `00 Dashboard` folder, should be pointed at the real draft folders), **Vault-as-MCP** and **Local REST API with MCP** (both expose the vault as an MCP server if deeper Obsidian↔LLM integration is ever wanted).

Installed but disabled: Codex Narrative Engine (consistency linting / dead-link detection — would help catch orphaned subplots automatically), Copilot, Grimoire, Hindsight, **Claudian** (embeds Claude Code directly inside Obsidian as a panel — an alternative to running Claude Code in a separate terminal), AI Commit.

## Known Quirks

- Many existing files in `Kalemie/00 Mackee/` and elsewhere carry a doubled `.md.md` extension from a past import — this is legacy, not a naming convention to imitate for new files. Newly created notes use a single `.md`.
- No git repository exists at this working directory — don't assume git-based workflows (branches, commits) apply here.
