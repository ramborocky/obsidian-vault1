---
tags: [ventures, prizes, commonwealth, risk, provenance, ai, pinned]
aliases: [Provenance, The AI Question, The Repo Question]
date: 2026-08-31
status: 🔴 live risk and live asset — needs a decision before 1 November
author: Claude — desk research 31 August 2026
---

# PROVENANCE — THE AI QUESTION AND THE PUBLIC REPO
### The thing that looks like the risk is also the strongest asset you own

> [!danger] Read this before submitting Chantal
> In 2026 the Commonwealth Foundation **investigated allegations of AI use in its own winning stories.** The method it used to investigate is the single most important fact in this note.

---

## What happened in 2026

Serious concerns were raised about alleged AI use in the 2026 Commonwealth Short Story Prize. The Foundation reviewed the winning stories and began a broader review of its processes.

**How they investigated:** they declined to use AI detection tools, citing artistic ownership and consent over unpublished work. Instead they **examined evidence related to the development of the stories — working drafts, time-stamped documents and notes.** They consulted the judges, and every shortlisted writer personally stated that no AI was used. The Foundation concluded it was satisfied AI had not been used.

Two things follow, and they point in opposite directions.

---

## 🔴 The risk: what is sitting next to the manuscript

`origin` is `https://github.com/ramborocky/obsidian-vault1` and **anyone can read it.** Tracked in that public repository, right now:

- `01 Projects/Kalemie/STORY PROGRESSION & DRAFTS/DRAFTS/Claude_s Version of Kalemie (AI Draft, Not Canon).md`
- the entire `01 Projects/x-factor/` folder — craft experiments written by Claude at full length

Both are honestly labelled. The filename says *AI Draft, Not Canon*. `x-factor.md` states plainly that every file in it was written by Claude and none of it is the user's. **That labelling is the right call and it was made before any of this was known.**

But consider the situation from outside. A prize administrator, or a rival, or a journalist, follows a link and finds a publicly readable repository containing an AI-written version of the same story, in a drafts folder, beside the submission candidate. **The disclaimer is inside the file. The alarming part is the filename, and the filename is what a search returns.**

Nothing here is dishonest. The exposure is not to a finding of wrongdoing — it is to **having to explain**, in a year when the Foundation has publicly said it is reviewing its processes, and when an allegation costs nothing to make and a great deal to answer.

## 🟢 The asset: almost nobody else has a provenance trail

Now read the Foundation's own method again. They wanted **working drafts, time-stamped documents and notes.**

You have a git repository containing every draft of Chantal, commit by commit, each one time-stamped, in order, with messages describing what changed and why. You have an archive hook that captures pre-edit prose to a Craft Log before any overwrite. You have six craft knowledge bases showing the reasoning behind specific revisions, and a Pattern Log naming recurring failure modes.

**That is a stronger evidentiary record of human authorship than a professional novelist could usually produce**, and it exists because of an archiving decision made for entirely different reasons.

> The same repository is simultaneously the exposure and the defence. **The difference between the two is organisation, not content.**

---

## What to do — three moves, none of them dishonest

**1 · Separate, do not delete.** Deleting AI files from a public repository does not remove them; git history keeps everything, and a deletion is itself a fact in the record. Deletion also destroys the labelling that currently protects you. **Move `x-factor/` and the AI draft into a separate private repository**, so the public vault holds only human-authored work and its history — and the AI material still exists, still labelled, still yours, still explainable.

**2 · Write the provenance note before it is needed.** One page: how Chantal was written, which commits show what, where the Craft Log entries sit, what the six bases are, and the plain statement that no AI wrote any of the prose. Written now it is a record. Written after a question arrives it is a defence, and reads like one.

**3 · Decide the repo question deliberately.** The remote being public was a considered choice and Draft 3 was pushed on explicit instruction. That decision was made before an AI controversy existed. **It deserves one fresh look**, not a reversal by default.

---

## The adjacent question nobody has asked: does a public repo count as *published*?

The 2026 rules treat online publication as publication — **with an explicit exception for personal blogs, personal websites and personal Facebook pages.** Magazines, anthologies and other public platforms are not exempt.

A personal GitHub repository is, on the natural reading, a personal website rather than a public platform. **On the natural reading.** That is not the same as a ruling, and the consequence of being wrong is disqualification of a story that cannot be entered twice.

**One email to the Foundation settles it.** Ask it without naming the story: *does work posted in a personal public code repository count as previously published under rule [x]?* A neutral question, asked early, from someone who reads the rules carefully.

## Sources
- [Commonwealth Foundation — 2026 Short Story Prize update](https://commonwealthfoundation.com/2026-cw-prize-update/) · [Locus — 2026 Commonwealth regional winners and AI controversy](https://locusmag.com/2026/06/2026-commonwealth-prize-regional-winners-and-ai-controversy/)
- [2026 Commonwealth Short Story Prize entry rules (PDF)](https://commonwealthfoundation.com/wp-content/uploads/dlm_uploads/2025/08/English-Entry-Rules-2026-1.pdf)
- The repository state above was read directly from `git ls-files`, 31 August 2026

## Related
- [[12 The Rules — Source of Truth]] · [[Morland 2026 — The Campaign]] · [[Prize Portfolio]] · [[Home]] · [[Unknown Unknowns — The Writing Side]]
