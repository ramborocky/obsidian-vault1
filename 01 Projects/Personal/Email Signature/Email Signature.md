---
tags: [personal, admin]
status: active
date: 2026-09-07
---

# Email Signature — Ramadhani Mhina

Files here: `signature.html` (the block to paste), `extract-logo.sh` (pulls the
logo out of the old file), `preview.html` (open in a browser to check it).

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

**Gmail (easiest — skip the HTML file entirely):**

1. Settings → See all settings → General → Signature → Create new.
2. Type the text directly into the box.
3. For the logo, use the **Insert image** button in the signature toolbar and
   upload `logo.png`. This uploads it to Google's servers and inserts a real
   URL, which is exactly what you need. Do not try to embed it yourself.

**Gmail (keeping this exact layout):**

1. Host `logo.png` somewhere public and replace `LOGO_URL_HERE` in
   `signature.html` with that link. It must be `https://` and must not require
   a login — Google Drive share links do *not* work for this.
2. Open `preview.html` in a browser.
3. Select the whole signature block with the mouse, Ctrl+C.
4. Paste into the Gmail signature box with Ctrl+V.

**Outlook desktop:** paste the rendered block into
`%APPDATA%\Microsoft\Signatures\` → edit the `.htm` file, or just paste into
Signature → Edit.

## Getting logo.png

The logo is still embedded in the old file. Save that file into this folder,
then:

```
./extract-logo.sh old-signature.html
```

It writes `logo.png` (279 × 281 px). That is the file to upload.

## Check before you use it

- The old HTML said **1st Floor**. The printed card says **5th Floor**. I used
  5th Floor, from the card. Confirm which is right.
- The old HTML had a trailing bullet after "Benefit •" and read
  "Senior Accountant • Expenditure • Benefit •". I made it
  "Senior Accountant • Expenditure & Benefits". Change if the card wording is
  meant to be exact.
- The card shows an email icon next to the P.O. Box line and a pin next to the
  address. Those are the wrong icons for that content — a P.O. Box is postal,
  not email. I used plain T / P / A labels, which survive every client. Round
  coloured icons need to be images; Outlook renders `border-radius` as squares.

## Note on the public remote

`origin` is a public GitHub repo. `signature.html` carries your phone number
and office address. That is business-card information you hand out anyway, so
I have committed it — but say the word and I will pull it out and add it to
`.gitignore` instead.
