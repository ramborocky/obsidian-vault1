---
tags: [journal, meta]
---

# Handwritten Journal — How This Works

No training, no teaching required — Claude reads the photo directly, same turn, using the same multimodal reading it uses on any image. This file just documents the pipeline so it stays consistent session to session.

## The Flow

1. **Drop the photo(s)** into `_inbox/` (see that folder's note for the transport options — cloud sync, manual drop, or pasted straight into a chat message).
2. **Say "process my journal inbox"** (or similar) in a Claude Code session.
3. Claude reads each photo, transcribes it **faithfully** — your actual words, not a summary or paraphrase — and creates or appends to a dated note in this folder: `YYYY-MM-DD.md`.
4. Anything genuinely illegible gets flagged inline as `[unclear: "..."]` rather than silently guessed.
5. The source photo moves to `_inbox/processed/YYYY-MM/` after transcription — nothing gets deleted.

## Improving Accuracy

- Flat page, even light, no shadow across the fold — photo quality matters more than handwriting quality.
- Proper nouns (people, places) are the real risk, not messy cursive. If your journal has recurring names/places outside the Kalemie story world, list them below so Claude gets them right on the first pass instead of guessing:

**Recurring names / places / terms:**
- (add as needed)

## Entry Format

```markdown
---
tags: [journal]
date: YYYY-MM-DD
source: handwritten
---

# Journal — YYYY-MM-DD

## Entry
[faithful transcription]

## Unclear / Flagged
[any words Claude couldn't read confidently — resolve these yourself and Claude will fix the entry]
```
