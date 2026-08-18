# Provenance markers — detection only

Everything here is a leak: internal machinery that escaped into the output. Unlike the style
tells, these are **not stylistic problems to rewrite**. They are near-conclusive evidence that
a specific tool produced the text, and the only correct action is to delete them and check
what they were attached to — a leaked citation marker usually means the citation itself was
never verified by a human.

None of this should be used to accuse a person. Use it to clean a document and to know how
much of it needs fact-checking.

## Leaked markup by tool

**ChatGPT**
- `:contentReference[oaicite:0]{index=0}`, `oai_citation`, bare `oaicite`
- `citeturn0search0`, `turn0search1` and up (often wrapped in Private Use Area codepoints)
- `turn0image0`, `turn0news0`, `turn0file0`
- `({"attribution":{"attributableIndex":"0-1"}})`
- A trailing `+1` after a source name

**Gemini**
- `[cite: 1]`, `[cite: 3, 12, 13]`
- `[span_1](start_span)` and `[span_1](end_span)`

**Grok**
- `<grok-card data-id="...">` and similar XML-ish tags after citations
- `grok_render_citation_card_json`

**DeepSeek**
- Lenticular brackets with a dagger, e.g. the pattern `【85†L261-269】`

**Perplexity**
- `[attached_file:1]`, `[web:1]`
- Source URLs pointing at an S3 bucket containing `ppl-ai-file-upload`

**Unclassified (seen from mid-2026)**
- `:::writing{variant="document" id="12345"}` with a matching `:::` at the end

## Tracking parameters

Appended to the URLs of sources the tool fetched:

- `utm_source=chatgpt.com`, `utm_source=openai`
- `utm_source=copilot.com`
- `referrer=grok.com`

Near-definitive proof a tool touched the *sourcing*. Not proof it wrote the *prose* — some
writers use models only to find citations, which the edit history will show. Strip the
parameter either way; it leaks referral data and is not part of the URL.

## Placeholder text left unfilled

- `[Entertainer's Name]`, `[Your Company]`, `[Insert date here]`
- `(Add your channel URL here)`, `(If available)`
- Dates written as `2025-XX-XX` or `2026-xx-xx` in date fields
- HTML comments carrying instructions, e.g. "Add if available with citation"

## Communication meant for the operator

Chat register that survived the paste:

- "Certainly!", "Of course!", "Great question!", "You're absolutely right!"
- "I hope this helps", "Let me know if you'd like", "Is there anything else"
- "Would you like me to turn this into..."
- "Here's a more detailed breakdown:"
- Bracketed instructions to the user: "Delete this section before submission."
- Notes itemizing how the text complies with the destination's rules

Related: **knowledge-cutoff and gap disclaimers.** "As of my last training update", "While
specific details are limited", "not widely documented in available sources", "based on the
provided search results". When a model cannot find something it says so, then speculates about
what the answer probably is and why it matters. For people, this shows up as "maintains a low
profile" or "keeps personal details private" — invented, every time. Both the disclaimer and
the speculation are fabrication. Delete both.

## Fabricated and malformed citations

Check these before trusting any sourced draft:

- **Dead links in a brand-new document.** Several 404s or nonexistent domains in fresh text,
  with nothing in the Internet Archive, means the URLs were never real. (Distinguish from
  paywalled links, institutionally-accessed links, and URLs mangled in copying.)
- **Invalid ISBN checksums**, and **DOIs that resolve to unrelated papers.** A DOI that
  resolves is not a verified citation — open it. Fabricated references often carry real DOIs
  belonging to entirely different articles.
- **Book citations with no page number and no URL.** The book exists and is plausibly on
  topic; the claim is not in it.
- **Book citations whose page numbers do not verify.** Search the text for a distinctive word
  from the claim.
- **Named references defined but never cited**, or cited but never defined.
- **Impossible authorship** — check whether the cited author was alive and publishing in that
  venue in that year.
- **Hallucinated templates, categories, or tags** — plausible-sounding names that do not exist
  in the destination system, or ones renamed after the model's cutoff.
- A return-arrow character around footnotes, copied from a web footnote widget.

## Behavioral signals

Weaker, contextual, easy to misread:

- **Sudden style shift.** A writer's grammar becomes flawless, or their register jumps,
  between one piece and the next. Compare against writing predating November 2022 where
  possible.
- **Style drifting with the models.** Someone's 2023 writing reads like 2023 output and their
  2026 writing reads like 2026 output.
- **Dialect mismatch.** American spelling on a subject with strong ties elsewhere, from a
  writer located elsewhere — most models default to American English unprompted. Non-native
  speakers mix varieties constantly, so this misfires often.
- **Verbose first-person commit or edit messages** listing what was "ensured", "preserved", or
  "improved", in full sentences with no abbreviations, and mentioning material that was not
  changed at all.

## The standing caveat

Detection tools beat chance and little else, and light paraphrasing defeats them. Humans who
do not use models are at roughly chance; heavy users reach about 90%, meaning one in ten calls
even a confident reader makes is wrong. Human and model prose are converging as people absorb
these patterns from reading. **Clean the document. Do not render a verdict on a person.**
