---
description: Measure a draft honestly — prose words, em-dash and tricolon density, gate headroom
argument-hint: <note name or path, or a folder>
allowed-tools: Read, Glob, Bash(bash:*), Bash(wc:*), Bash(find:*), Bash(awk:*), Bash(grep:*)
---

# Measure $1

**Never quote a number from a table or a frontmatter field. Measure it.** Word counts
in this vault disagree with each other, the 2,000–5,000 Commonwealth gate is hard, and
on 2026-08-08 Draft 3's frontmatter was found to be wrong by 326 words while Dataview
was reading it into the dashboard.

## What counts as prose

Strip, in this order: **leading YAML frontmatter only** (the first `---` block — a
later `---` is a horizontal rule inside the note and must not start a second strip),
`>` callout and blockquote lines, headings, horizontal rules, table rows, code fences.
Resolve `[[Note|alias]]` to the alias. Everything left is prose.

Run this from the vault root:

```bash
measure() {
  awk '
    NR==1 && $0=="---" { fm=1; next }
    fm==1 && $0=="---" { fm=0; next }
    fm==1 { next }
    /^>/ || /^#/ || /^---$/ || /^\|/ { next }
    /^```/ { code=!code; next }
    code { next }
    { print }
  ' "$1" | sed 's/\[\[\([^]|]*\)|\?[^]]*\]\]/\1/g' | wc -w
}
```

**Watch for drafts that carry their craft apparatus in the same file.** Draft 4 holds
~90 lines of un-quoted analysis above the prose; measuring the whole file gives 4,635
where the story is 3,933. Find where the prose actually starts and say which line that
is, so the number can be checked.

## Report

```
File:               ____
Measured prose:     ____ words
Frontmatter claims: ____        (say AGREES or DISAGREES BY n)
Gate 2,000–5,000:   pass/fail · ____ words of headroom

Em-dashes:      ____   ( ____ per 300 words · target < 1 )
Ellipses:       ____
Semicolons:     ____
Sentences:      ____   average length ____
Under 10 words: ____%  ( Draft 3 target was 48% )
```

If frontmatter disagrees with measurement, **say so plainly and offer to correct the
frontmatter** — Dataview reads that field and the dashboard repeats it. Do not correct
it silently, and never touch the prose while doing it.

Given a folder, measure every `.md` in it and return a table sorted by word count
descending. Use null-delimited iteration — **filenames in this vault contain spaces,
em-dashes and `×`**, and a bare `for f in $(find ...)` will shred them.
