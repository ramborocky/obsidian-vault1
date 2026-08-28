# Formatting and typography tells

The cheapest tells to spot and the cheapest to fake, so they carry little weight alone. Their
value is corroborative: formatting tells plus content tells is a much stronger signal than
either by itself.

## 1. Em dashes

Human writers use em dashes. Models use them more, and differently:

- **Spaced.** An em dash with spaces on both sides, contrary to most style guides. Writers who
  use em dashes habitually usually know their house convention and hold to it.
- **Formulaic.** Deployed to punch up a clause or stage a parallelism, where a comma, colon,
  or parenthesis would be the natural choice.
- **Clustered.** Several in a paragraph, then long stretches with none.

Notoriety has changed the picture: some models now suppress em dashes deliberately, and as of
2026 Claude uses them more than professional writers while ChatGPT uses them less. **Em dashes
alone prove nothing.** More common in chat and comments than in edited prose.

**Fix:** keep one or two per page for genuine interruption. Convert the rest to commas,
colons, or parentheses by what the clause is doing. If you keep them, close up the spacing or
use spaced en dashes consistently.

## 2. Boldface

Mechanical emphasis — every instance of a chosen term bolded, or a "key takeaways" pattern
where the important words in each sentence are bolded for the skimmer. Inherited from
READMEs, listicles, slide decks, and sales pages.

**Fix:** in prose, bold almost nothing. Emphasis lives in word order and sentence structure.

## 3. Inline-header vertical lists

The signature list shape is: marker, bolded header, colon, description.

    - **Route Details**: Starts at Medak, passes through Yellareddy...
    - **Timeline and Impact**: Phase 3 construction is 40% complete...

Sometimes the colon is missing. Sometimes the bullet is a literal bullet character, en dash,
or emoji instead of real list syntax, because the text was copied off a rendered screen and
lost its markup. Line breaks are often lost in the same paste.

**Fix:** if the items are genuinely parallel and scannable, keep a list but drop the bold
headers. If they are prose, make them prose — which usually reveals that two of the four
"items" were the same point.

## 4. Headings

- **Title Case On Every Main Word** — strong tendency, regardless of surrounding style.
- **"X and Y" headings** — "Awards and Recognition", "Challenges and Legacy", "Impact and
  Influence". Near-ubiquitous.
- **Empty parent headings** — a heading whose only content is more headings.
- **Skipped levels** — jumping from H1 to H3, or starting sections at H3.
- **Level-1 overuse** — several H1s in a document that should have one, an artifact of
  converting Markdown into some other format.
- **Title heading** — the document's own title repeated as a heading at the top, because the
  model does not know the title already exists in the container.
- **Emoji headings** — a rocket before "Getting Started". Less common now than in 2025, still
  around.

**Fix:** sentence case, one H1, no emoji, no heading that is not followed by text. Rename
"X and Y" headings to whichever of X or Y the section is actually about.

## 5. Thematic breaks between every section

A horizontal rule separating each section — normal in rendered chat output, unusual in a
document. Delete them; headings already separate sections.

## 6. Curly quotes and apostrophes

ChatGPT and DeepSeek typically emit curly quotation marks and apostrophes; Claude and Gemini
typically do not. Mixed straight and curly in the same document is more suspicious than either
alone.

**Heavy caveat.** Word's smart quotes, macOS and iOS defaults, LanguageTool, Chicago style,
and every professionally typeset publication produce curly quotes. Some fonts render them
identically to straight ones. This is weak evidence at best — and if your target is print or
web, curly quotes are *correct*.

## 7. Markdown where Markdown does not belong

Markdown syntax pasted into a system that does not render it: literal asterisks, hash-mark
headings, and bracket-paren links showing up raw in a wiki, a CMS, an email, or a forum post.

Strongest form: a fenced code block wrapper left in place around the whole document, or
Markdown and the destination's own syntax mixed together in one file. That combination is
close to conclusive.

**Caveat:** Markdown alone is not a tell. Obsidian, GitHub, Reddit, Discord, and Slack have
made it ambient. Judge by whether it is *wrong for the destination*.

## 8. Unnecessary tables

Two-column tables holding three facts that belong in a sentence, usually titled "Key
Statistics" or "Key Highlights". **Fix:** write the sentence.

## 9. Emoji as structure

Emoji leading section headings or bullets, decorating an outline. Was common through 2025, now
rarer. Almost always means the text was pasted straight out of a chat window.
