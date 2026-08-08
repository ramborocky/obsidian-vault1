# MNADA — Android demo app

The field-agent / trader demo that accompanies the bank pitch. Built for showing on a phone in a meeting.

## What it is

A native Android shell (`MainActivity.java`, plain `android.app.Activity` + `WebView`, **no** AndroidX or third-party dependencies) wrapping an offline trading UI in `app/src/main/assets/app/index.html`.

It is a **demonstration build**. All prices, bids and counterparties are generated on-device. There is no network permission in the manifest, nothing is transmitted, and no real trade or credit action can be executed.

## The four screens

| Tab | Swahili | What it demonstrates |
|---|---|---|
| Market | Soko | Live board of graded lots across nodes, bid book, accept-and-settle → issues an LDR |
| Register | Sajili | The core field workflow: read ear tag → grade (species, sex, weigh-band, dentition, BCS, node) → live lot code + index valuation → list |
| Custody | Zizi | LDRs held, custodian, days in custody, assessed value, 80% advance, request finance |
| Prices | Bei | Settled-price index by grade with sparklines, plus same-grade-by-node comparison |

Bilingual **Swahili / English** — toggle top right. Swahili is the default, because that is what the market agent at Nyamatala actually reads.

The grading logic is real, not cosmetic: `lotCode()` and `valueOf()` in `index.html` derive the lot code and index value from weigh-band, dentition-age adjustment, body-condition adjustment and a node basis factor.

## Build

Requires JDK 17+, Android SDK with platform 35 and build-tools 35.0.0.

Create `local.properties` in this directory:

```bash
echo "sdk.dir=C:/Users/rmhina/AppData/Local/Android/Sdk" > local.properties
```

Then:

```bash
gradle :app:assembleRelease
```

Output lands at `app/build/outputs/apk/release/app-release.apk`.

On this machine, Gradle isn't on PATH — use the cached distribution:

```bash
JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" "$USERPROFILE/.gradle/wrapper/dists/gradle-8.11.1-bin/bpt9gzteqjrbo1mjrsomdt32c/gradle-8.11.1/bin/gradle" :app:assembleRelease
```

Or just open the folder in Android Studio and hit Run.

## Signing — read before distributing

`app/build.gradle` signs the release build with the **debug keystore** so the APK installs straight from a file share without Play Store involvement. That is fine for a pitch meeting and wrong for anything else.

Before the app goes to any real user, generate a release keystore and replace `signingConfig signingConfigs.debug` with a proper `signingConfigs.release` block. Do not commit the keystore or its passwords to this repo.

## Installing on a phone

The APK is not from the Play Store, so Android will ask the user to allow installation from the app that opened it (usually Files or the browser). That prompt is expected.

```bash
adb install -r app-release.apk
```
