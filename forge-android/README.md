# The Forge — Android

A thin WebView wrapper that turns [[The Forge — Commute Trainer]] into an installable Android app.

**This folder contains no writing and no craft material.** The app is one Kotlin file and some XML. The trainer itself stays where it belongs — `01 Projects/Kalemie/Learning Curve/The Forge — Commute Trainer.html` — and the build copies it into the APK at compile time. There is exactly one copy of the trainer in this repository, and editing it updates both the browser version and the app.

It sits at the vault root rather than beside the craft notes because Gradle and the Android build tools are unreliable on paths containing spaces, and every folder under `01 Projects/` has them.

## Getting the APK without installing anything

Building an APK needs the Android SDK. You do not have to install it.

1. On GitHub, open **Actions** → **Build the Forge APK** → **Run workflow**.
2. Wait about three minutes.
3. Open the finished run and download **forge-debug-apk** from *Artifacts*.
4. Copy the `.apk` to the phone and tap it. Android will ask permission to install from an unknown source — allow it for your file manager or browser.

The workflow also runs by itself whenever the trainer HTML or anything in this folder changes.

It is a **debug-signed** build. That is the right thing for sideloading onto your own phone; it is not suitable for the Play Store, which needs a release key you would have to generate and keep private.

## Building it yourself

With Android Studio, or with the SDK and JDK 17 on the path:

```bash
cd forge-android
gradle wrapper --gradle-version 8.9   # first time only
./gradlew assembleDebug
# app/build/outputs/apk/debug/app-debug.apk
```

The build fails immediately, with the path it looked at, if the trainer HTML has moved.

## What the wrapper adds

A browser tab cannot do these four things, and they are the entire reason the app exists:

| | |
| --- | --- |
| **A launcher icon** | The rhythm ribbon — three ticks and a baseline. It opens straight into the deck |
| **The hardware back button** | Judge → page → deck, and it asks before abandoning a run with unsaved words |
| **A share sheet** | *Send to…* pushes a run, or the whole trunk, straight into Obsidian, mail or Drive as markdown |
| **A screen that stays awake** | Only while a drill timer is running, and dropped the moment the app goes to the background |

It also tells the page which way the system theme is pointing, without overriding the toggle inside the app, and keeps a half-written paragraph through a rotation or a phone call.

## What it deliberately does not do

> [!important] There is no `INTERNET` permission in the manifest
> The app is incapable of making a network request. Not "does not" — *cannot*. Everything typed into it stays on the phone until you choose to send it with the share sheet.
>
> This is the point rather than a detail. Commonwealth rule 3f requires the story to be unpublished, and the writing that happens in this app is the least published thing in the project. An app that could not leak it is worth more than one that promises not to.

There is also no analytics, no crash reporter, no ads, no accounts, and no dependency beyond two small AndroidX libraries.

## Where the writing lives

WebView `localStorage`, inside the app's private data directory. Consequences worth knowing:

- **It is per-app.** Runs made in the APK are not the runs made in the desktop browser or on the artifact URL. They are three separate trunks.
- **Uninstalling deletes it.** So does clearing the app's storage.
- Android's automatic backup is enabled, so a device-to-device transfer or a cloud backup carries the trunk — but do not rely on it.

**Export into the vault at the end of the week.** *Send to…* → Obsidian, paste into [[Craft Log]]. That is also what makes the drafting a timestamped record in your own hand, which is the thing rule 3e actually contemplates.

## Layout

```
forge-android/
├── settings.gradle.kts
├── build.gradle.kts              AGP 8.6.1 · Kotlin 1.9.25
├── gradle.properties
└── app/
    ├── build.gradle.kts          copies the trainer into assets at build time
    ├── proguard-rules.pro        keeps the JS bridge from being stripped
    └── src/main/
        ├── AndroidManifest.xml   no permissions at all
        ├── java/net/mihogoni/forge/MainActivity.kt
        └── res/                  theme, colours and the ribbon icon
```

minSdk 24 (Android 7.0) · targetSdk 34.
