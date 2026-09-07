---
tags: [personal, admin]
status: active
date: 2026-09-07
---

# Email Signature — Ramadhani Mhina

**Open `signature-tool.html` in a browser. That is the whole thing.** Paste
your logo link at the top, press Copy, paste into Gmail.

| File | What it is |
| --- | --- |
| `signature-tool.html` | **Start here.** Logo box, live preview, copy button, per-client steps. |
| `INSTALL.md` | The same steps in text, for reading in Obsidian. |
| `signature-icons.html` | **The current one.** Navy badge per contact row. |
| `signature-wide.html` | Horizontal layout. Contact details across one line. |
| `signature-plain.html` | Tall layout. Same content stacked, gold rule on the left. |
| `preview-wide.html` | Open in a browser to see the wide one under a message. |
| `signature.html` | The logo version. Kept in case the logo is wanted again. |
| `logo.png` | **In use.** 200x174, padded onto white, dead black band cropped. |
| `logo.jpg` | Superseded. Flush to every edge, black bottom band. Kept as the source. |
| `extract-logo.sh` | Recovers `logo.png` from the old file's base64. |
| `build.sh` | Bakes your logo URL in, writes `signature-ready.html`. |
| `preview.html` | Open in a browser; copy the rendered block from here. |

## Why the old one didn't show

Four separate reasons, any one of which breaks it on its own.

**1. The logo was a base64 `data:` URI.** This is the main one. Gmail strips
`data:` image sources out of signatures, and Outlook on Windows refuses to
render them at all — its rendering engine is Word, which has never supported
them. The image either vanished or showed as a broken-image box.

**2. The signature was too long for Gmail.** Gmail caps a signature at 10,000
characters. The base64 blob alone was roughly 55,000. Gmail truncates or
rejects anything over the cap, so the signature was cut off mid-tag.

**3. It was probably pasted as source code.** A signature editor is a
*rich-text* box, not an HTML box. Pasting the raw markup makes it display the
markup. You have to render the HTML in a browser first, then copy the
*rendered* result.

**4. `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` and `<title>` get stripped.**
Every signature editor discards them. Harmless, but they were doing nothing.

Two smaller layout bugs that would have shown up once the above were fixed:
the vertical divider was a `<div>` with a `height`, which Outlook ignores
(it collapses to nothing), and `max-width` is unsupported in Outlook too.
Both are now table cells with `bgcolor` and `height` attributes instead.

## How to install it

Open `signature-tool.html`, or read [[INSTALL]] for the same steps as text.

## Why the plain version won

Chased the logo through four dead ends: base64 (stripped by Gmail, unsupported
by Outlook), a screenshot on a Windows drive Claude cannot reach, nhif.or.tz
(blocked by this environment's network policy), and a hosted GitHub URL that
previews fine at home but may be blocked on NHIF's own network. Every one of
them was a way for the signature to break somewhere.

Text and colour break nowhere. The gold rule down the left is a table cell with
a `bgcolor`, not an image, so nothing is fetched and nothing can be blocked.
`signature-plain.html` is 1,890 characters and needs no hosting at all.

The logo version is still here if it is ever wanted, and the hosting notes
below still apply to it.

## Wide vs tall

`signature-wide.html` runs about 700px across: name and credentials on one
line, then phone / email / P.O. Box side by side under a gold rule, with the
address full-width beneath because it is too long to sit in a column.

Those columns carry `white-space:nowrap` so they cannot collapse into a stack.
That is what keeps the layout horizontal in every client, but it also means a
narrow phone screen scrolls sideways rather than reflowing — email has no media
queries to fall back on. Drop the `nowrap` if wrapping is preferred to scrolling.

## Hosting (logo version only)

`logo.jpg` lives in this folder and is served publicly at:

```
https://raw.githubusercontent.com/ramborocky/obsidian-vault1/claude/email-signature-html-fho2m7/01%20Projects/Personal/Email%20Signature/logo.jpg
```

Verified live: HTTP 200, `image/jpeg`, byte-identical to the committed file.
If this branch is ever merged or deleted, swap `claude/email-signature-html-fho2m7`
for `main` in that URL and re-copy the signature.

The logo is **172 x 148** — landscape, not square. The image tag says
`width="126" height="108"` to hold that ratio. Change one and you must change
the other, or it squashes.

## Check before you use it

- The address is **1st Floor** (confirmed 2026-09-07). The printed card shows
  5th Floor, so the card is wrong — worth correcting before the next reprint.
- Tagline reads "Senior Accountant • Expenditure & Benefits" — settled
  2026-09-07, leave as is.
- The card shows an email icon next to the P.O. Box line and a pin next to the
  address. Those are the wrong icons for that content — a P.O. Box is postal,
  not email. I used plain T / P / A labels, which survive every client. Round
  coloured icons need to be images; Outlook renders `border-radius` as squares.

## Note on the public remote

`origin` is a public GitHub repo. `signature.html` carries your phone number
and office address. That is business-card information you hand out anyway, so
I have committed it — but say the word and I will pull it out and add it to
`.gitignore` instead.


## The badge version

`signature-icons.html` follows a reference the user supplied: a badge per
contact row, generous spacing, name and credentials stacked above. Four rows —
website, phone, email, address.

Two deliberate departures from that reference, both forced by email itself:

**The badges hold letters, not pictograms.** The reference used SVG line icons
for globe, phone, envelope and pin. SVG does not render in email — Gmail strips
it and Outlook never supported it. Real icons would mean hosted PNGs, which is
the same fragility as the logo. Letters render identically everywhere and load
nothing.

**Outlook renders the circles as squares.** `border-radius` is unsupported by
Word's engine, which is what Outlook on Windows draws with. Navy squares with
white letters still read as intentional. Every other client shows circles.

Swapping in hosted icon PNGs would fix both and reintroduce the hosting
dependency. Not done, and it should stay a conscious choice rather than drift.


## The logo is dark — diagnosed 2026-09-07

`logo.jpg` renders too dark to use. Measured: the top corners are pure white,
the bottom corners are `(10, 0, 16)` — effectively black.

**Cause.** The original logo was a PNG with a transparent background. JPEG has
no transparency, so on conversion the transparent pixels flattened to *black*
rather than white. Nothing in the signature markup causes this; the file itself
carries the damage.

**Repair was attempted and rejected.** Flood-filling the black background back
to white, from the border inward, at thresholds of 18, 26 and 48. Every setting
that removed enough background also hollowed out the "NHIF" lettering — JPEG
compression has smeared those dark letters into the dark background, so no
threshold separates them. The output was checked visually and looked worse than
the original. Do not retry this approach on this file; the information is gone.

**The fix is a clean source.** The user's *original* signature embedded the logo
as a 279x281 PNG, which is undamaged. Getting that file into the repo (GitHub
web upload, or `./extract-logo.sh` against the old signature file) and pointing
the `img` at it resolves this. Until then, `signature-icons.html` carries no
logo at all and sidesteps the problem entirely.


## Padding — fixed 2026-09-07

`logo.jpg` measured margins of **L 0, R 0, B 0**: content ran flush to every
edge, so it read as cropped wherever it was placed. Its bottom rows were also
near-solid black (row 140 was 99%), left over from the transparency being
flattened.

`logo.png` is that file with the 2 genuinely dead rows cropped and a 14px white
margin baked in — 200x174. Only true black was cut, so the "Dedicated to
providing quality health Care" tagline survives and is legible.

The signature displays it at **138x120**, which matches the 1.149 ratio exactly.
Change one dimension and the other must change with it. The logo cell padding
also went from `16px 18px 16px 4px` to `18px 22px 18px 6px` so the badge is not
crammed against the gold divider.

Live URL, verified HTTP 200 / `image/png` / byte-identical:

```
https://raw.githubusercontent.com/ramborocky/obsidian-vault1/claude/email-signature-html-fho2m7/01%20Projects/Personal/Email%20Signature/logo.png
```

This fixed the framing, not the colour. The darkness is baked into the source
and still wants a clean PNG to resolve properly.


## The source image is corrupted — 2026-09-07

Magnifying the top-right quadrant of `logo.jpg` at 5x shows **transparency
checkerboard squares and rainbow noise blocks baked into the pixels**, sitting
directly over the "…RANCE FUND" arc lettering. This is not compression softness
and not a rendering problem. The file was made from a screenshot that captured
an image editor's transparency indicator, and those pixels are now image data.

Roughly 4% of pixels carry the artefact, concentrated in the ring where the arc
text sits — the worst possible place.

**Two repairs were attempted and both rejected by eye:**

1. *Flat-field correction* fixed the background gradient (white at top, grey
   ~149 mid, black at bottom) and genuinely worked — that part is kept.
2. *Median inpainting* of the artefact blocks destroyed the arc text. The
   lettering and the checkerboard are both high-contrast against white, so no
   local-contrast detector separates them. Flagging one flags the other.

**Do not attempt further repair of this file.** The lettering underneath the
checkerboard is not damaged-but-recoverable; it is absent. No amount of
processing reconstructs pixels that were overwritten before the file reached us.

**The fix is a clean source.** Any of:
- `./extract-logo.sh` against the user's original signature (a 279x281 PNG).
- Right-click and save the logo from www.nhif.or.tz in a browser.
- Ask NHIF communications for the official asset.

Until then `signature-icons.html` carries no logo and has none of these
problems.


## Resolved with the official asset — 2026-09-07

The user supplied the official logo from `selfservice.nhif.or.tz` (this session's
egress policy blocks that host, so they downloaded and uploaded it themselves;
it landed on `main` as `nhif-logo.png`).

It is 536x465 **RGBA with a real alpha channel** — the pristine asset, not a
screenshot. Flattening it onto white via `alpha_composite` produces a clean
logo: arc text sharp, family in colour, NHIF lettering crisp, tagline legible.
No checkerboard, no rainbow blocks, no black background.

This confirms the earlier diagnosis exactly. The old `logo.jpg` was the *same
artwork* saved to JPEG without compositing the alpha first, which is what turned
its transparent pixels black. The corruption was introduced in that conversion,
not present in the source.

Files now:

- `nhif-logo-source.png` — the pristine 536x465 RGBA original. Start from this.
- `nhif-official-2x.png` — 280x238, flattened on white, trimmed and padded 18px.
  Displayed at **140x119**, exactly half, which keeps it sharp.
- `logo.jpg` — the corrupted file. Kept only as the record of what went wrong.

`nhif-logo-2x.png` was deleted; it was derived from the corrupted source and is
strictly worse than what we now have.
