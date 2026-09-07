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
| `signature.html` | The source. `LOGO_URL_HERE` is a placeholder. |
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
