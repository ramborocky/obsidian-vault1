# Getting the signature to the bottom of your email

The whole job is two things: **put the logo somewhere on the web**, then
**paste the rendered block** (not the code) into your mail client.

---

## Step 1 — get logo.png

The logo is still buried in the old signature file as base64. Save that file
anywhere, then from this folder run:

```
./extract-logo.sh
```

It hunts through this folder, Downloads, Desktop and Documents for a file with
an embedded image, decodes it, and checks the result is a real PNG. If it
can't find the file, point it at one:

```
./extract-logo.sh ~/Downloads/old-signature.html
```

You end up with `logo.png`, 279 × 281 px.

---

## Step 2 — put the logo on the web

It has to be a public `https://` link that needs no login. Pick one:

**GitHub (free, you already have the repo).** Drop `logo.png` into this folder,
commit and push, then your URL is:

```
https://raw.githubusercontent.com/ramborocky/obsidian-vault1/main/01%20Projects/Personal/Email%20Signature/logo.png
```

Note the `%20` — those replace the spaces in the folder names. Paste the URL
into a private browser window first; if the logo appears, it will work in email.

**Or an image host** — imgur.com or postimages.org, upload and copy the direct
image link (the one ending in `.png`, not the page link).

**Do not use Google Drive.** Its share links serve an HTML preview page rather
than the raw image, so mail clients show a broken box.

---

## Step 3 — build it

```
./build.sh https://your-link-to/logo.png
```

That writes `signature-ready.html` with your URL baked in, rebuilds
`preview.html`, and warns you if the result would exceed Gmail's limit.

---

## Step 4 — paste it in

### Gmail (web)

1. Open `preview.html` in your browser by double-clicking it.
2. Click just above the logo, drag to just below the dark blue bar. Don't
   include the grey instruction sentence.
3. **Ctrl+C**.
4. In Gmail: gear icon → **See all settings** → **General** tab → scroll to
   **Signature** → **Create new**, name it, then click into the big box.
5. **Ctrl+V**. The logo and layout should appear.
6. Underneath, set **Signature defaults** so it applies to new mail and to
   replies.
7. Tick **Insert signature before quoted text** — otherwise on replies your
   signature lands at the very bottom, under the whole quoted thread.
8. Scroll to the bottom and click **Save Changes**. This is the step people
   miss.

**If the logo still won't come through:** delete the broken image in the
signature box, put the cursor there, and use the **image icon** in the
signature toolbar to upload `logo.png` directly. Gmail hosts it for you and
Step 2 becomes unnecessary.

### Outlook (desktop, Windows)

1. Open `preview.html`, select the block, Ctrl+C.
2. Outlook → **File** → **Options** → **Mail** → **Signatures**.
3. **New**, name it, paste into the edit box, **OK**.
4. Set the **New messages** and **Replies/forwards** dropdowns to it.

Outlook renders with Word, so expect small differences: rounded corners become
square and spacing can shift a pixel or two. The layout here is built from
tables with `bgcolor` attributes precisely so it survives that.

### Apple Mail

1. **Mail** → **Settings** → **Signatures**.
2. Pick the account on the left, click **+**.
3. **Untick "Always match my default message font"** before you paste, or Mail
   strips your colours and sizes.
4. Paste, then choose it in **Choose Signature** at the bottom.

### Phone

Neither the Gmail nor Outlook mobile app can hold an HTML signature — they only
take plain text. If you set the signature in Gmail on the web, mail *sent from
the web* carries it; mail sent from the phone app uses the phone's plain-text
one. Keep a short text version there:

```
Ramadhani Mhina, CPA(T) | MBA(ITM)
Senior Accountant, NHIF
0739 888 999
```

---

## Testing it

Send one to yourself, then check it in a different client than the one you sent
from. Images are often blocked by default on first receipt, so also click
"display images" to confirm the logo resolves. Send one to a colleague on
Outlook if you can — that is where layout problems show up.
