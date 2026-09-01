---
tags: [ventures, mnada, app, release, timetable, android]
aliases: [MNADA App Timetable, MNADA Release Plan, APK Plan]
date: 2026-08-11
status: APK built and tracked — debug-signed, still untested on a phone
author: Claude — planning. Not a credit offer, not investment advice.
---

# MNADA — GETTING THE APP OUT

→ [[MNADA — Due Diligence and Gap Analysis]] · [[Pilot Term Sheet — Plain English]] · `app-android/README.md`

---

## THE HONEST STATUS

*Corrected 11 August 2026. The previous version of this table said the build was blocked
for want of a toolchain. That was wrong — Android Studio, JDK 21, SDK 35 and build-tools
35.0.0 are all installed on this machine, and Gradle 8.12 was already in the wrapper cache.
The only thing actually missing was a `local.properties`.*

| | |
|---|---|
| **Source** | Complete and tested. Enrolment, reconciliation, hash chain, export pack all work |
| **APK** | **Built — `mnada-demo-v0.2.0-custody.apk`, 47 KB, tracked in git.** Verified to carry byte-identical assets to `app-preview.html` |
| **Signing** | **Debug key.** `keystore.properties` still does not exist, so the release build fell back as designed. Fine in a meeting, wrong for a bank, a custodian or a field agent |
| **Tested on a phone** | **No.** Camera, GPS, and the file writer have still never run on real hardware |
| **Shareable today** | **Both.** `app-preview.html` for a link that opens anywhere; the APK for anyone who wants it installed |

**To rebuild:** the build fails from this vault's own path — Gradle's SDK locator chokes on
something in it — so copy `app-android/` to a scratch directory and build there. Write
`local.properties` with **forward slashes**; backslashes are escape characters in a
`.properties` file and produce exactly the misleading `IOException: The filename, directory
name, or volume label syntax is incorrect` that this note previously mistook for a missing SDK.

```bash
printf 'sdk.dir=C:/Users/rmhina/AppData/Local/Android/Sdk\n' > local.properties
```

---

## WHAT CHANGED ON 11 AUGUST

**The app is now light and green.** It was near-black with a green cast, on the reasoning that
a photograph of an animal should be the brightest thing on screen. That reasoning was sound and
the result still read as a surveillance tool. The palette is now a pale green-white ground with
deep forest ink, and **green has taken over as the primary colour** — buttons, brand, active tab —
with ochre demoted to the warning tone, which was the only job it was really doing. Nineteen
hard-coded translucent fills were replaced with `--fill` / `--hair` tokens, so the next palette
change is one block, not a scavenger hunt.

**Counterparties are now named in the app.** The Lot screen carries a lender and a mortality
insurer, picked from horizontal strips of nine Tanzanian banks and eight insurers. Choosing one
appends a `lender.set` / `insurer.set` event to the hash chain like any other custody fact, and
both names travel in the export pack.

> [!warning] The marks are not the real logos
> They are original monograms — initials on one curated colour palette, deliberately not drawn
> from anybody's brand book. The strip says so on screen in both languages, and `buildPack()`
> repeats it in the JSON: *neither institution has reviewed, endorsed, or agreed to this
> facility.* **Keep that line intact.** The moment this app appears to carry a real bank's mark
> in a document sent to a third party, it stops being a demo and becomes a misrepresentation.
> If a bank ever does come on board, use their supplied assets under their written permission —
> not these placeholders.

---

## SHOW IT TODAY WITHOUT AN APK

`app-preview.html` is the same app, refreshed from source on 11 August 2026. Send the file, or put it on any web host and send the link.

**It is arguably the better thing to show.** An unsigned APK from a stranger triggers an install warning, needs Android, and looks amateur. A link opens instantly on anything, including the iPhone of whoever the CropSupply founders forward it to.

**One limitation, handled honestly:** a page opened from a file cannot read GPS. The app offers a clearly-marked **sample location** instead, and that mark is sealed into the hash chain, shown on the Record tab, and stated in the first line of any export pack — *"This pack is a demonstration and must not be relied on as custody evidence."* Nobody can mistake a demo pack for a real one, including you in six months.

> [!warning] Before sending it to CropSupply specifically
> They are the most likely competitor, they have $2m, and they told you livestock is on their roadmap. The evidence pipeline — required photo, GPS, hash chain, accrual-adjusted cover — **is the differentiated part**, and a demo shows all of it.
>
> That is your call to make and there are good reasons to make it: showing capability is how the Android-client conversation starts at all. But send it *after* the counsel's opinion comes back, not before — if livestock collateral turns out to be perfectible today, that email is worth far more with a signable structure behind it. **A week of patience costs nothing.**

---

## BUILDING THE APK — 30 MINUTES, ONCE

Nothing here needs a second machine. On the machine that has Android Studio:

**1 · Install the toolchain** *(skip if Android Studio is already installed)*
Android Studio bundles a JDK, the SDK and Gradle. Nothing else is needed — the project has no AndroidX and no third-party dependencies.

**2 · Point the build at the SDK.** Create `app-android/local.properties`:

```bash
echo "sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk" > local.properties
```

**3 · Generate a real signing key.** Once, and never again:

```bash
keytool -genkeypair -v -keystore mnada-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mnada
```

**4 · Create `app-android/keystore.properties`** — gitignored, never committed:

```
storeFile=C:/keys/mnada-release.jks
storePassword=...
keyAlias=mnada
keyPassword=...
```

**5 · Build:**

```bash
gradle :app:assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`.

**Or just open `app-android/` in Android Studio and press Run.** That is the whole thing.

> **Do not skip step 3.** Without `keystore.properties` the build silently signs with the debug key. A debug-signed APK cannot be updated by a properly signed one later, can be resigned by anyone, and reads as amateur to exactly the audience you want to impress.

---

## THE TIMETABLE

Two tracks. The left one is what you can do alone; the right one is what needs somebody else to say yes. **They run in parallel, and the right one is the real schedule.**

### Weeks 1–2 · Prove it runs

| | Work | Who | Done when |
|---|---|---|---|
| 1 | Build the signed APK | You | `app-release.apk` installs on your own phone |
| 2 | Walk your own phone through 20 imaginary animals | You | 20 photos, 20 real GPS fixes, one count, one export pack |
| 3 | Fix what breaks | You | Camera, location and file writer confirmed on hardware |
| 4 | **Instruct counsel on the security-interest question** | Lawyer | Written opinion commissioned |

**Week 2 is the decision point.** If counsel says a security interest over identified livestock cannot be registered in Tanzania today, everything below moves five years right, and you stop here with a working app and a clear answer. That is a good outcome for two weeks of work.

### Weeks 3–6 · Put it in a real pen

| | Work | Who | Done when |
|---|---|---|---|
| 5 | Find one feedlot that will let you tag and count 20–50 head | Feedlot | Permission, verbally |
| 6 | Enrol them properly. Walk the count twice, a week apart | You | Two counts, two packs, a real shortfall number |
| 7 | Get the five real quotes — feed rate, exit price, insurance, tags, interest | Custodian, buyer, insurer, S&J, bank | Five numbers replace five guesses |
| 8 | Rewrite the memo from [[Pilot Term Sheet — Plain English]] | You | One document, corrected, aimed at impact venture |

**This is the milestone that matters more than the APK.** A pack from a real pen with real photographs and a real reconciliation is the only artefact in this folder that a credit officer has never seen before. Everything else they have seen a hundred times.

### Weeks 7–12 · Find the lender

| | Work | Who | Done when |
|---|---|---|---|
| 9 | Take the pack, the app and the corrected term sheet to 3–5 banks | Banks | Meetings held |
| 10 | Apply for the WRRB collateral-manager licence on the crop side | WRRB | Application in |
| 11 | Insurance partner signed on distribution | UAP / Howden / ACRE | Terms agreed |

### Months 4–9 · The pilot

200 head, one lender, 45 days, all fees waived. **Success is the five criteria in the term sheet, and criterion 5 — realised price within 5% of your valuation — is the one that changes the bank's business.**

### Month 10 onward · The first fee

**Lot #2 is the first paid one.**

---

## WHAT "RICH" ACTUALLY LOOKS LIKE HERE

At your own 1.20% collateral-management fee:

```
One 200-head lot, assessed TZS 148.4m
Fee 1.20%                                TZS  1,780,800   per 45-day cycle
                                        ≈ USD 673
Cycles per year                                 8.1
One continuously running lot            ≈ USD 5,450 / year
```

| Milestone | What it takes |
|---|---|
| First USD 673 | Lot #2 |
| USD 50,000 / year | ~9 concurrent lots · ~1,800 head under custody |
| **USD 1,000,000 / year** | **~180 concurrent lots · ~37,000 head under custody** |

Tanzania has roughly 36 million cattle, so 37,000 is not the constraint. **The constraint is that every lot needs a bank willing to lend against it and an agent willing to walk the pen.** That is a field-operations business that happens to have an app, and it is the reason CropSupply has not entered in five years.

**Realistic:** first fee inside 12 months if counsel says yes. USD 50k/yr is a two-to-three year business. A million is a five-year business with staff, and only if the pilot proves criterion 5.

---

## THE THREE THINGS THAT WOULD BREAK THIS TIMETABLE

1. **Counsel says no.** Everything moves behind legislation. Week 2 tells you.
2. **The pilot's first real count comes back with a 3% shortfall.** The instrument is only as good as the reconciliation, and that is an operations problem no app fixes.
3. **Founder capacity.** [[00 The Board]]'s first line is that seven businesses is zero businesses, and MNADA is the eighth track. The ACPA call and the 25 October prize deadline both want the same hours as weeks 1–6.

---

> [!warning] Standing limits
> No payments, no transfers, no banking or mobile-money credentials, and no recommendation to invest. → [[Expenses]] · [[00 The Board]]

## Related
- [[MNADA — Due Diligence and Gap Analysis]] · [[Pilot Term Sheet — Plain English]] · [[Pilot Term Sheet]] · [[MNADA — Bank Pitch Memo]] · [[00 The Board]]
