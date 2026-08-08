package tz.zigo.app

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback

/**
 * Zigo — pitch build.
 *
 * The entire prototype is one offline HTML file in assets. This activity gives
 * it a launcher icon, the hardware back button, an Android share sheet, and a
 * screen that does not sleep while somebody is walking through a demo.
 *
 * No INTERNET permission: this build is incapable of a network request.
 */
class MainActivity : ComponentActivity() {

    private companion object {
        const val GROUND_DARK = 0xFF14170F.toInt()   // --panel, dark
        const val GROUND_LIGHT = 0xFFFFFFFF.toInt()  // --panel, light
    }

    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val dark = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES

        web = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true          // the demo state lives here
            settings.setSupportZoom(false)
            settings.allowFileAccess = false           // assets still load
            settings.allowContentAccess = false
            addJavascriptInterface(Bridge(), "AndroidZigo")
            setBackgroundColor(if (dark) GROUND_DARK else GROUND_LIGHT)

            // A WebView with no WebChromeClient silently swallows confirm().
            webChromeClient = object : WebChromeClient() {
                override fun onJsConfirm(v: WebView?, u: String?, m: String?, r: JsResult): Boolean {
                    AlertDialog.Builder(this@MainActivity).setMessage(m)
                        .setPositiveButton(android.R.string.ok) { _, _ -> r.confirm() }
                        .setNegativeButton(android.R.string.cancel) { _, _ -> r.cancel() }
                        .setOnCancelListener { r.cancel() }.show()
                    return true
                }
                override fun onJsAlert(v: WebView?, u: String?, m: String?, r: JsResult): Boolean {
                    AlertDialog.Builder(this@MainActivity).setMessage(m)
                        .setPositiveButton(android.R.string.ok) { _, _ -> r.confirm() }
                        .setOnCancelListener { r.cancel() }.show()
                    return true
                }
            }
            webViewClient = WebViewClient()
        }
        setContentView(web)
        web.loadUrl("file:///android_asset/index.html")

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript("window.zigoBack ? window.zigoBack() : false") { r ->
                    if (r != "true") { isEnabled = false; onBackPressedDispatcher.onBackPressed() }
                }
            }
        })
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val dark = (newConfig.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES
        web.setBackgroundColor(if (dark) GROUND_DARK else GROUND_LIGHT)
    }

    inner class Bridge {
        @JavascriptInterface
        fun copy(text: String) = runOnUiThread {
            (getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager)
                .setPrimaryClip(ClipData.newPlainText("Zigo", text))
        }

        @JavascriptInterface
        fun share(text: String, subject: String) = runOnUiThread {
            val i = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_SUBJECT, subject)
                putExtra(Intent.EXTRA_TEXT, text)
            }
            startActivity(Intent.createChooser(i, getString(R.string.share_title)))
        }
    }
}
