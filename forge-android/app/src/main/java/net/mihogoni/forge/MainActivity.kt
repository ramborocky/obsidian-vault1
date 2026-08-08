package net.mihogoni.forge

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback

/**
 * The Forge — a wrapper, and deliberately nothing more.
 *
 * The whole trainer is one offline HTML file carried in assets. This activity
 * exists to give it four things a browser tab cannot: a launcher icon, the
 * hardware back button, a share sheet, and a screen that stays awake while the
 * drill timer is running.
 *
 * There is no network permission in the manifest. The app cannot phone home
 * even if something in it tried to — which matters, because everything the
 * writer types here is unpublished work.
 */
class MainActivity : ComponentActivity() {

    private companion object {
        /** Matches --ground in the trainer's stylesheet, so there is no flash. */
        const val GROUND_DARK = 0xFF14131C.toInt()
        const val GROUND_LIGHT = 0xFFEFEEF3.toInt()
    }

    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val dark = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES

        web = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.javaScriptEnabled = true
            // The trunk is localStorage. Without this the writing does not survive.
            settings.domStorageEnabled = true
            settings.setSupportZoom(false)
            settings.mediaPlaybackRequiresUserGesture = true
            // Blocks file:// access to the device. Assets under
            // file:///android_asset are unaffected and still load.
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            addJavascriptInterface(Bridge(), "AndroidForge")
            setBackgroundColor(if (dark) GROUND_DARK else GROUND_LIGHT)

            /*
             * Without a WebChromeClient a WebView silently suppresses
             * window.confirm() and hands the page back `false`. The trainer
             * uses confirm() to guard Delete, Clear trunk and leaving a run
             * mid-paragraph — all three would misbehave without this.
             */
            webChromeClient = object : WebChromeClient() {
                override fun onJsConfirm(
                    view: WebView?, url: String?, message: String?, result: JsResult
                ): Boolean {
                    AlertDialog.Builder(this@MainActivity)
                        .setMessage(message)
                        .setPositiveButton(android.R.string.ok) { _, _ -> result.confirm() }
                        .setNegativeButton(android.R.string.cancel) { _, _ -> result.cancel() }
                        .setOnCancelListener { result.cancel() }
                        .show()
                    return true
                }

                override fun onJsAlert(
                    view: WebView?, url: String?, message: String?, result: JsResult
                ): Boolean {
                    AlertDialog.Builder(this@MainActivity)
                        .setMessage(message)
                        .setPositiveButton(android.R.string.ok) { _, _ -> result.confirm() }
                        .setOnCancelListener { result.cancel() }
                        .show()
                    return true
                }
            }

            // Set before loadUrl, or onPageFinished fires on the wrong client.
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    // Tell the page which way the system theme points. Its own
                    // toggle still wins if the writer has made a choice.
                    view?.evaluateJavascript(
                        "window.forgeSystemTheme && " +
                            "window.forgeSystemTheme('${if (dark) "dark" else "light"}')",
                        null
                    )
                }
            }
        }
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Ask the page first — it knows whether a run is open.
                web.evaluateJavascript("window.forgeBack ? window.forgeBack() : false") { result ->
                    if (result != "true") {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            }
        })
    }

    /*
     * uiMode is in configChanges so a system theme switch does not recreate the
     * activity and throw away a half-written paragraph. The trade is that the
     * page has to be told by hand.
     */
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val dark = (newConfig.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES
        web.setBackgroundColor(if (dark) GROUND_DARK else GROUND_LIGHT)
        web.evaluateJavascript(
            "window.forgeSystemTheme && window.forgeSystemTheme('${if (dark) "dark" else "light"}')",
            null
        )
    }

    override fun onPause() {
        super.onPause()
        // Never hold the screen on into the background.
        window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    /** The only surface the page can reach. Three methods, all local. */
    inner class Bridge {

        @JavascriptInterface
        fun copy(text: String) {
            runOnUiThread {
                val cm = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                cm.setPrimaryClip(ClipData.newPlainText("Forge", text))
            }
        }

        @JavascriptInterface
        fun share(text: String, subject: String) {
            runOnUiThread {
                val send = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_SUBJECT, subject)
                    putExtra(Intent.EXTRA_TEXT, text)
                }
                startActivity(Intent.createChooser(send, getString(R.string.share_title)))
            }
        }

        /** Held only while a drill timer runs, and dropped on pause. */
        @JavascriptInterface
        fun keepAwake(on: Boolean) {
            runOnUiThread {
                if (on) window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                else window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            }
        }
    }
}
