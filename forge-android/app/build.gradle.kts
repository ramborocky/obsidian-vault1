plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

/*
 * Single source of truth.
 *
 * The trainer is one self-contained HTML file that lives in the vault, beside
 * the craft notes it quotes. It is NOT duplicated here. This task copies it
 * into a generated assets folder at build time, so the APK and the file you
 * open in a desktop browser can never drift apart.
 */
val trainerHtml: File = rootDir.parentFile
    .resolve("01 Projects/Kalemie/Learning Curve/The Forge — Commute Trainer.html")

// Checked while configuring, not while running: a Copy task with a missing
// source is silently skipped, and the app would install as a blank screen.
require(trainerHtml.isFile) {
    "Cannot find the trainer at:\n  ${trainerHtml.absolutePath}\n" +
        "This app is a wrapper around that file — build from inside the vault."
}

val generatedAssets = layout.buildDirectory.dir("generated/forgeAssets")

val copyTrainer by tasks.registering(Copy::class) {
    description = "Copies the vault's trainer HTML into the APK's assets."
    from(trainerHtml) { rename { "index.html" } }
    into(generatedAssets)
}

android {
    namespace = "net.mihogoni.forge"
    compileSdk = 34

    defaultConfig {
        applicationId = "net.mihogoni.forge"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }

    sourceSets["main"].assets.srcDir(generatedAssets)

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

// preBuild is a stable lifecycle anchor across AGP versions; variant-specific
// asset task names are not.
tasks.named("preBuild") { dependsOn(copyTrainer) }

dependencies {
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.core:core-ktx:1.13.1")
}
