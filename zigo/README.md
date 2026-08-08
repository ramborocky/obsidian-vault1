# Zigo

A load board for Tanzanian road freight: a sender posts a consignment, transporters
name their own price, the sender picks. Zero commission on the fare. Money is held
until the person receiving the load reads a six-digit code aloud.

**This folder is a venture prototype, not part of the Obsidian vault's writing.**
It sits here because the repo was the working place; nothing in it touches the
story project or the craft notes.

| File | What it is |
| --- | --- |
| `zigo-app.html` | The working prototype — both sides, corridor map, escrow, wallet |
| `landing.html` | The public landing page and pilot waitlist |

Both are self-contained: no build step, no dependencies, no network calls.
Open either in a browser.

## The Android build

`../zigo-android/` wraps `zigo-app.html` into an APK for demos. The HTML is not
duplicated — Gradle copies it into assets at build time, so the APK and the
browser version cannot drift apart.

**To get the APK:** Actions → *Build the Zigo pitch APK* → Run workflow →
download `zigo-pitch-apk` from the finished run.

The manifest requests **no permissions at all**. Without `INTERNET` the build is
incapable of a network request — everything it displays is generated on the
device. That is correct for a pitch build and it is worth saying out loud in the
room.

## Status

Pre-launch. Figures shown in the app and on the landing page come from a working
financial model, not from operations, and are labelled as such. The waitlist form
stores entries in the visitor's own browser and is not yet wired to a backend.
