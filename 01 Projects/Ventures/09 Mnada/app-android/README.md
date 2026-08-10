# MNADA — Android custody app

The collateral manager's field tool for one pledged lot. **v0.2.0-custody** — rebuilt 10 August 2026
from the demo that preceded it.

## What changed, and why

The v0.1.0 build was a marketplace demo: a board of lots, a bid book, a price index, and an
LDR-issuing flow. Three findings in `../MNADA — Due Diligence and Gap Analysis.md` retired all of it:

- **CropSupply runs 163+ Tanzanian markets on a 30-minute refresh, free at the point of entry.**
  A four-screen price index on a phone cannot compete and should not try.
- **The LDR is doing branding work, not legal work.** What a lender needs is a registered security
  interest over identified animals, not an invented document of title. So the app no longer issues
  receipts; it records custody.
- **The business that survives is the collateral instrument** — one bank, one feedlot, one lot,
  45 days. The app's users are the custodian's field agent and the lender's credit officer. About
  five people, not a national market.

Everything the old build faked is gone: no simulated bids, no drifting prices, no `SYNC` chip that
syncs nothing, no "bound to keeper's NIDA" on a field that nobody verified.

## The four screens

| Tab | Swahili | What it does |
|---|---|---|
| Lot | **Fungu** | Cover today, the accruing line the lot must clear, day *n* of 45, setup |
| Enrol | **Sajili** | Tag → photo → GPS → grade → keeper → sealed into the chain |
| Count | **Hesabu** | The weekly walk: present / missing / dead, shortfall against the 1% default threshold |
| Record | **Kumbukumbu** | Event count, head hash, chain verification, export pack, wipe |

Bilingual Swahili / English, Swahili default.

## The two things that make it evidence

**1 · Cover is computed against accruing senior costs, not a fixed denominator.**

Cess and custody rank ahead of the lender and grow daily, so the break-even line moves:

```
gross needed(day) = ( principal·(1 + rate·day/365) + custody·head·day ) / (1 − cess)
cover             = value of live animals / gross needed(day)
```

At 200 head this reproduces the term sheet exactly: **TZS 120,296,169 on day 1 and
TZS 142,261,595 on day 45** — the number a static 108% trigger misses by twelve points.
100% cover means the lender breaks even; below that it takes a loss.

**2 · Every action is sealed into a SHA-256 hash chain.**

```
hash(n) = SHA-256( seq | timestamp | type | JSON(data) | hash(n−1) )
```

`Verify chain` re-reads what is **persisted**, not what the running session holds in memory —
tampering happens with the app closed, so checking the in-memory array would pass on a record that
has already been altered underneath it. Truncation is caught too: a chain that has had its tail
removed verifies perfectly on its own terms, so the check also compares lengths.

The SHA-256 is a local implementation (no `crypto.subtle` — a `file://` page is not a secure
context). It passes the NIST vectors for `""`, `"abc"` and the 56-byte multi-block case, and is
exposed as `window.MNADA.sha256` so a lender can recompute a pack's hashes independently.

## Storage

| What | Where | Note |
|---|---|---|
| Animals, counts, event log | `localStorage["mnada.custody.v2"]` | ~2.3 KB per animal; 200 head ≈ 460 KB |
| 96 px thumbnails | inside that record | ~1.4 KB each, kept out of the hashed payload |
| Full 1024 px photographs | IndexedDB `mnada-photos`, keyed by SHA-256 | not in the export pack |
| Export pack | `Android/data/tz.mnada.exchange/files/Documents/` | JSON, ~264 KB at 200 head |

The pack carries photo **hashes**, not images. The images stay on the capture device, which is what
lets the hash prove the phone had that exact frame at that time.

**There is no server and no `INTERNET` permission.** Data leaves the phone only as a file the agent
hands over. A wipe or a reinstall loses everything not exported — the Record tab says so in both
languages.

## Permissions

- `VIBRATE` — haptics on capture
- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` — where the animal was seen
- **no `CAMERA`** — the photograph is taken by the device camera app via `ACTION_IMAGE_CAPTURE`
- **no `INTERNET`** — deliberate; adding it is a data-protection decision, not a build convenience

## Still missing — do not claim otherwise

- **NIDA verification.** The keeper's ID is typed by the agent and displayed as *Unverified*. Real
  verification is a licensing exercise, not a feature.
- **No tag reader.** Tag numbers are typed. NFC/RFID needs hardware and a reader integration.
- **No sync, no backend, no multi-device.** One phone, one lot.
- **No mobile money, no payments, no insurance integration.**
- **Cover uses the entry index**, not a live market mark. Nobody should mistake it for one.
- **Untested on a physical handset** at the time of writing. The evidence pipeline (camera chooser,
  MediaStore capture, location bridge, pack writer) was verified in a desktop WebView-equivalent;
  the Android-specific paths need one pass on a real phone before a field trial.

## Build

Requires JDK 17+, Android SDK platform 35, build-tools 35.0.0.

```bash
echo "sdk.dir=C:/Users/rmhina/AppData/Local/Android/Sdk" > local.properties
```

```bash
gradle :app:assembleRelease
```

Gradle isn't on PATH on this machine — use the cached distribution:

```bash
JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" "$USERPROFILE/.gradle/wrapper/dists/gradle-8.11.1-bin/bpt9gzteqjrbo1mjrsomdt32c/gradle-8.11.1/bin/gradle" :app:assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`.

## Signing — read before this reaches anyone

The build now looks for `keystore.properties` in `app-android/` (gitignored):

```
storeFile=C:/keys/mnada-release.jks
storePassword=...
keyAlias=mnada
keyPassword=...
```

Create the key once:

```bash
keytool -genkeypair -v -keystore mnada-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mnada
```

**If `keystore.properties` is absent the build silently falls back to the debug key.** That was
acceptable for a pitch prop. It is not acceptable for an app that a field agent uses to create
evidence a bank will rely on. Generate the key before the first field trial, and never commit it or
its passwords.

## Installing

```bash
adb install -r app-release.apk
```

Not from the Play Store, so Android will ask permission to install from whichever app opened it.
That prompt is expected.
