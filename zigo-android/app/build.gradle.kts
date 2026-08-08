plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

/*
 * The whole app is one self-contained HTML file in ../zigo/. It is not
 * duplicated here — this task copies it into assets at build time so the APK
 * and the browser prototype can never drift apart.
 */
val appHtml: File = rootDir.parentFile.resolve("zigo/zigo-app.html")

require(appHtml.isFile) {
    "Cannot find the Zigo app at:\n  ${appHtml.absolutePath}\n" +
        "This project is a wrapper around that file — build from inside the repo."
}

val generatedAssets = layout.buildDirectory.dir("generated/zigoAssets")

val copyApp by tasks.registering(Copy::class) {
    description = "Copies the Zigo prototype HTML into the APK's assets."
    from(appHtml) { rename { "index.html" } }
    into(generatedAssets)
}

android {
    namespace = "tz.zigo.app"
    compileSdk = 34
    defaultConfig {
        applicationId = "tz.zigo.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "0.1-pitch"
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

tasks.named("preBuild") { dependsOn(copyApp) }

dependencies {
    implementation("androidx.activity:activity-ktx:1.9.3")
    implementation("androidx.core:core-ktx:1.13.1")
}
