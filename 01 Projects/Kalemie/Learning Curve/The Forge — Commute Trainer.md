---
tags: [learning-curve, instrument, practice, drills, tooling]
aliases: [The Forge, Commute Trainer, The Forge app]
date: 2026-08-07
status: live
---

# THE FORGE — COMMUTE TRAINER

> One unit of the form, made in the time you have. **The machine measures the mechanics; you judge the rest.** It never adds the two together and it never writes a word for you.

**The file:** `The Forge — Commute Trainer.html`, in this folder. Open it in any phone browser. It works with no signal, stores everything on the device, and sends nothing anywhere.

## What problem it solves

[[Home]] has said the same thing for two weeks: two paragraphs are owed, by the author, not by Claude. The blocker is not knowing what to write — the briefs are written. The blocker is that the writing happens at a desk, and there is an hour on the road every day where a beat could have been made.

This is an instrument for that hour. It borrows [[The 3 AM Epiphany by Brian Kiteley|Kiteley's]] method exactly: **restriction generates material.** You get one constraint, a timer sized to a commute leg, and a page.

## The seven units

Not "prompts" — the actual load-bearing units of the short story form, one drill each.

| Unit | Time | What it makes | Marked on |
| --- | --: | --- | --- |
| **Beat** | 5′ | One exchange of action/reaction | Axis 4 · Axis 3 |
| **Turn** | 10′ | A value that changes charge | Axis 4 · Axis 6 |
| **Gap** | 7′ | Expectation against result | Axis 5 · Axis 4 |
| **Sentence** | 4′ | Ten sentences under a hard rule | Axis 2 |
| **Object** | 6′ | A thing planted while still worthless | Axis 3 · G4 |
| **Slide** | 8′ | Time or place moved without announcement | **G3** · Axis 2 |
| **Close** | 7′ | An image that drags an earlier one behind it | Axis 8 · Axis 7 |

**The Slide drill exists because of one number.** [[The Three Gates — Unified Instrument]] scores Chantal at 23/25 on Gate 3, and the two lost points are all in G3 — *a voice that announces its own retrospection cannot slide.* It is the only place on any instrument in this vault where Chantal loses more than one point. So it gets its own drill, and a badge at five runs.

Every constraint is an instruction, in Kiteley's manner. **No example prose is supplied anywhere in the app**, by design — see the authorship note below.

## Two scores, never one

The app splits the marking exactly the way [[The Three Gates — Unified Instrument]] does, and for the same reason.

**MEASURED** is mechanical and automatic — word count against target, sentence count, average length, share of short sentences, share of 30+ sentences, `is/are/was/were/be/being/been` density per 100 words, filter verbs (*looked, felt, seemed, realised*), and named emotions. It is a live readout that moves as you type. It carries the disclaimer on its own face: *this panel cannot see whether the writing is any good.*

**JUDGED** is you, on 1–5, against the **verbatim anchors** from [[The Judging Rubric — Nine Axes]] and Gate 3 of [[The Three Gates — Unified Instrument]]. Only the two or three axes that drill actually targets are shown, so the marking takes twenty seconds, not twenty minutes.

The verdict panel reports them side by side and refuses to sum them, restating the reason: the scores are not commensurable, and judges eliminate on faults, not averages.

### The rhythm ribbon

The live meter is not a progress bar. It draws **one tick per sentence, height proportional to that sentence's word count**, coloured green under 10 words, violet 11–29, amber 30+. [[Write Sentences That Work|Cleland's]] twenty-word average and her *five long ones in a row is fog, not lyricism* both become visible while you are still writing the paragraph, which is the only moment either is any use.

## The game part

- **XP** up to 25 per run from the mechanics, +10 for actually marking it, +5 for Outrun mode. Streak counted in consecutive days.
- **Levels** — Impromptu → Copyist → Apprentice → Journeyman → Compositor → Maker.
- **Outrun mode** — backspace and paste disabled for the whole run. [[Outrunning the Critic|Kiteley 190]], enforced.
- **Eight marks**, all tied to real faults: *The Slide* (five slide drills), *Clean Floor* (ten runs naming no emotion), *Under Twenty* (ten runs averaging under twenty words), *The Whole Form* (every unit at least once).

## The trunk, and how material gets back into the vault

Every run is kept on the device. **Copy as markdown** emits a note already shaped for this vault — frontmatter with `tags`, `date`, `drill`, `words`, the constraint as a callout, the prose, both scores, and wikilinks back to the two instruments. Paste it into [[Craft Log]] or straight into a scene file.

*Cut material is trunk material* — the same standing rule as the archive hook. Nothing made here is wasted; it belongs to the Mihogoni cycle whether or not Chantal takes it.

> [!warning] The trunk lives in one browser on one device
> Local storage is per-origin. Runs made in the phone browser do not appear in the desktop copy, and clearing site data deletes them. **Export into the vault at the end of the week** — that is also what makes them a timestamped record.

## On the phone as an actual app

`forge-android/` at the vault root wraps this same HTML file into an installable Android app. **The trainer is not duplicated** — the build copies it out of this folder at compile time, so editing the file here updates the app too.

**To get the APK:** GitHub → Actions → *Build the Forge APK* → Run workflow → download `forge-debug-apk` from the finished run. Roughly three minutes, and nothing to install on your machine. Full instructions in `forge-android/README.md`.

What the wrapper buys, over opening the HTML in Chrome: a launcher icon, the hardware back button wired to the views, a share sheet that pushes a run or the whole trunk into Obsidian as markdown, and a screen that stays awake while a drill timer runs.

> [!important] The app has no `INTERNET` permission
> Not "does not connect" — *cannot*. The manifest grants no network access at all, so nothing typed into it can leave the phone except through the share sheet, by your hand. For unpublished work under rule 3f that is worth more than an assurance.

**Three separate trunks.** Local storage is per-origin and per-app: runs made in the APK, in the desktop browser, and on the artifact URL do not see each other. Uninstalling the app deletes its trunk. Export weekly.

## Authorship

> [!danger] Nothing in this app is generated prose
> The constraints are instructions, exactly as a Kiteley exercise is an instruction. **Every word in the trunk is the author's.** The app has no model behind it, makes no network request, and contains no example sentences to be tempted by.
>
> Commonwealth rule 3e requires the story to be the entrant's own work, and in June 2026 the Foundation investigated AI-use allegations by examining working drafts, timestamped documents and notes. Exporting the trunk into the vault does not just move the words — **it builds exactly the evidence that rule contemplates**, in the author's hand, dated.

## Cross-links

- [[The Judging Rubric — Nine Axes]] — where the Gate 2 anchors come from, verbatim
- [[The Three Gates — Unified Instrument]] — Gate 3, and the rule against one number
- [[Write Sentences That Work]] — the twenty-word average the ribbon draws
- [[The Isolation Principle — One Emotion, One Incident]] — one incident, one emotion, in the craft tab
- [[Scene Analysis Method]] — the beat and the turn
- [[All the Small Things — Grief Through the Minor Object]] — the object drill
- [[Prescriptions for the Live Draft]] — the fault-to-exercise table this is the portable version of
- [[Craft Log]] — where exported runs land
