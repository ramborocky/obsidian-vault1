---
name: ollama
description: Run prompts against a local Ollama model so vault contents never leave the machine — bulk summarizing, drafting, classifying, and first-pass rewrites across many notes. Use when the user asks to run something locally, offline, or privately; when a task means sending the same prompt over dozens of notes; or when they mention Ollama, a local model, or qwen. Not for work needing strong reasoning — the local model is a 7B running on CPU.
---

# Ollama (local model)

A local model on this machine. Two things make it worth reaching for, and only two:

1. **Privacy.** The text never leaves the laptop. Journal entries, unpublished drafts,
   anything the user would rather not hand to an API.
2. **Bulk.** Running one prompt over 60 notes costs nothing but time.

Everything else it is worse at than you are. It is a 7B model on CPU at ~4 tok/s, so a
50-word answer takes about 30 seconds. Do not route work to it for quality.

## Running it

```sh
node .claude/skills/ollama/scripts/ask.mjs "your prompt"
```

| Flag | Effect |
| --- | --- |
| `--file <path>` | Prepend a file's contents. Repeatable. |
| `--system <text>` | System prompt. This is where the instruction belongs. |
| `--model <name>` | Default `qwen2.5-coder:7b-32k`. |
| `--temp <n>` | 0 for classifying, 0.7+ for drafting. |
| `--json` | Force JSON output. Non-streamed. |
| `--quiet` | Suppress the timing line on stderr. |
| `--list` | Installed models. |

Stdin works, so it pipes:

```sh
cat "note.md" | node .claude/skills/ollama/scripts/ask.mjs --system "Three bullets."
```

Output streams to stdout; the `[model · tokens · rate]` line goes to stderr, so
redirecting stdout gives clean text.

## Using it well

**Put the instruction in `--system`, the material in `--file`.** A 7B model follows a
short system prompt far better than a long user turn with the instruction buried in it.

**Ask for one thing.** "Summarize and identify themes and suggest edits" produces three
mediocre answers. Split it into three calls; they are cheap.

**For anything structured, use `--json` and `--temp 0`,** then parse it. Do not trust
prose formatting to be consistent across a batch.

**Batch in a loop and write to disk.** At 30s a note, a 40-note run is 20 minutes, so
never hold results only in memory:

```sh
for f in "01 Projects"/**/*.md; do
  node .claude/skills/ollama/scripts/ask.mjs --file "$f" --quiet \
    --system "One sentence: what is this note about?" >> /tmp/index.txt
done
```

Tell the user the run will take minutes before starting one, and report progress.

## What it cannot do

**Tool calls.** `qwen2.5-coder:7b` emits tool calls as plain text instead of the tagged
format Ollama parses, so it cannot drive an agent loop. Give it text in, take text out.
Do not build anything that expects it to call a function.

**Long context.** The model is capped at 32k tokens and slows sharply as the prompt grows.
Chunk large inputs rather than concatenating them.

**Judgment.** It flattens specifics into generalities, the exact failure the
[humanize](../humanize/SKILL.md) skill exists to catch. Never let its prose reach a draft
unreviewed. Use it to triage and summarize, then do the real writing yourself.

## Checking on it

`--list` shows installed models. If the script reports it cannot reach the server, Ollama
is not running. Start it from the Start menu, or:

```sh
"C:/Users/rmhina/AppData/Local/Programs/Ollama/ollama.exe" serve
```
