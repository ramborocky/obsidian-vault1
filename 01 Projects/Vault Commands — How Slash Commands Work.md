---
tags: [tooling, claude, vault, reference]
aliases: [Slash Commands, Vault Commands, How Commands Work]
date: 2026-08-08
---

# ⌨️ VAULT COMMANDS — HOW SLASH COMMANDS WORK

> **A slash command is a saved prompt in a file.** That is the whole idea. There is no
> plugin to install and no syntax to learn beyond markdown. If you can write a note,
> you can write a command.

## Where they live

```
.claude/commands/deslop.md   →  /deslop
.claude/commands/atlas.md    →  /atlas
.claude/commands/count.md    →  /count
```

**Filename becomes the command name.** Drop a file in, and `/thatfilename` exists in
the next session. Delete the file and the command is gone.

> [!danger] They are tracked in git on purpose — and it took an exception to do it
> `.gitignore` ignores `.claude/*` wholesale. That blanket rule is **how the
> archive-before-edit hook was lost** when the vault moved machines: CLAUDE.md went on
> claiming the hook existed while nothing was being archived.
>
> `!.claude/commands/` was added on 2026-08-08 **before the first command was written.**
> An untracked `/deslop` would vanish on the next machine and take the protocol's
> enforcement with it, silently, the same way.

## What is inside one

Two parts: frontmatter, then the prompt.

```markdown
---
description: What it does — this is the text you see in the / menu
argument-hint: <note name> [light|moderate|heavy]
allowed-tools: Read, Grep, Glob, Bash(wc:*)
---

Everything below is the prompt. Write it as instructions to Claude.
The target is $1. The severity is $2. All of it together is $ARGUMENTS.
```

| Field | What it does |
| --- | --- |
| `description` | The one-liner in the `/` autocomplete menu |
| `argument-hint` | Shows the expected arguments as you type |
| `allowed-tools` | **Limits what the command may touch.** `Read, Grep` cannot write |
| `model` | Optional — pin a specific model for this command |

**Arguments:** `$1`, `$2`, `$3` are positional. `$ARGUMENTS` is everything at once.
`/deslop Draft 4 heavy` gives `$1` = `Draft 4`, `$2` = `heavy`.

## Why `allowed-tools` matters here more than in a code project

`/deslop` is declared `Read, Grep, Glob` and **no Write.** That is deliberate and it
is a safety rail on rule 3e, not a nicety.

Commonwealth entry rule 3e requires the story to be your own work, and in June 2026
the Foundation investigated AI-use allegations by examining **working drafts,
timestamped documents and notes.** Git history is evidence. A de-slop command that
could write to a draft could put words in your story that you did not write, and the
commit would say you did.

**So it reports and you edit.** The rail is in the file.

## The three commands in this vault

| Command | Does | Writes? |
| --- | --- | --- |
| `/deslop <draft> [severity]` | Runs the four laws + Law 5 against a draft. Reports findings in a table with cap arithmetic | **No** |
| `/atlas <story> [--new]` | Deconstructs a story into measured percentage positions with anchor quotes and craft links | Only with `--new`, and only a **new** atlas note |
| `/count <file or folder>` | Measures prose honestly. Flags frontmatter that disagrees | **No** |

Each one is a runner, not a source of truth. `/deslop` defers to
[[The De-Slop Pass — English Prose]]; `/atlas` defers to [[Craft Atlas]]. **If a
command and its note disagree, the note wins** — every command says so in its own text.

## Writing your own

The useful test: *have I explained this same thing to Claude more than twice?* If yes,
it is a command. Write down what you actually say, including the exceptions and the
things you always have to correct.

The best material for a command is the part you always have to repeat — *measure it,
don't trust the header* · *never modify the source note* · *the character wins over
the structural rule.* Those corrections are the command.

Start by copying `count.md`; it is the simplest of the three.

## Related

- [[The De-Slop Pass — English Prose]] — what `/deslop` runs
- [[Craft Atlas]] — what `/atlas` builds
- `01 Projects/CLAUDE.md` — the archive-before-edit hook, the other piece of tracked `.claude/` tooling
