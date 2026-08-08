package tz.mnada.exchange;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Insets;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowInsets;
import android.widget.FrameLayout;

/**
 * MNADA field-agent demo shell.
 *
 * The whole trading UI lives in assets/app/index.html and runs offline. This Activity is the
 * native container: it owns the window chrome, routes the hardware back button into the app's
 * own navigation stack, and exposes the handful of device capabilities the field workflow
 * actually needs (haptics on a tag read, share for a settlement note).
 */
public class MainActivity extends Activity {

    private static final String APP_URL = "file:///android_asset/app/index.html";

    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        boolean dark = isDarkMode();
        int chrome = dark ? Color.parseColor("#070D0B") : Color.parseColor("#12211C");

        FrameLayout root = new FrameLayout(this);
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        root.setBackgroundColor(chrome);

        web = new WebView(this);
        web.setBackgroundColor(chrome);
        web.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setLoadWithOverviewMode(false);
        s.setUseWideViewPort(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        // Local assets only. No remote content is loaded, so no network access is required.
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        s.setMediaPlaybackRequiresUserGesture(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            s.setAlgorithmicDarkeningAllowed(false);
        }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                // Everything in-app is a hash route. Anything else is external and leaves the app.
                String url = request.getUrl().toString();
                if (url.startsWith("file:///android_asset/")) {
                    return false;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, request.getUrl()));
                } catch (Exception ignored) {
                    // No handler on device — swallow rather than crash the demo.
                }
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");

        root.addView(web);
        setContentView(root);

        applySystemBars(root, dark);

        web.loadUrl(APP_URL);
    }

    private boolean isDarkMode() {
        int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return mode == Configuration.UI_MODE_NIGHT_YES;
    }

    private void applySystemBars(final View root, boolean dark) {
        // Keep the status bar icons legible against the app's dark green chrome.
        View decor = getWindow().getDecorView();
        int flags = decor.getSystemUiVisibility();
        flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        decor.setSystemUiVisibility(flags);
        getWindow().setStatusBarColor(Color.parseColor("#0B1512"));
        getWindow().setNavigationBarColor(Color.parseColor("#0B1512"));

        // From API 35 the window is edge-to-edge and the WebView would run under the status and
        // gesture bars. WebView does not surface those insets to CSS env(safe-area-inset-*), so
        // inset the container here instead and let the page assume a clean rectangle.
        root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override
            public WindowInsets onApplyWindowInsets(View v, WindowInsets insets) {
                int top, bottom, left, right;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    Insets bars = insets.getInsets(
                            WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                    top = bars.top; bottom = bars.bottom; left = bars.left; right = bars.right;
                } else {
                    top = insets.getSystemWindowInsetTop();
                    bottom = insets.getSystemWindowInsetBottom();
                    left = insets.getSystemWindowInsetLeft();
                    right = insets.getSystemWindowInsetRight();
                }
                v.setPadding(left, top, right, bottom);
                return WindowInsets.CONSUMED;
            }
        });
        root.requestApplyInsets();
    }

    @Override
    public void onBackPressed() {
        // Let the web app pop its own screen stack first; only exit when it says it is at root.
        if (web != null) {
            web.evaluateJavascript("window.MNADA && window.MNADA.onBack ? window.MNADA.onBack() : false",
                    value -> {
                        if (!"true".equals(value)) {
                            finish();
                        }
                    });
        } else {
            super.onBackPressed();
        }
    }

    /** Device capabilities the field workflow genuinely uses. Nothing else is exposed. */
    private class Bridge {

        @JavascriptInterface
        public void haptic(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            int duration = Math.max(10, Math.min(ms, 400));
            v.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
        }

        @JavascriptInterface
        public void share(String subject, String body) {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("text/plain");
            i.putExtra(Intent.EXTRA_SUBJECT, subject);
            i.putExtra(Intent.EXTRA_TEXT, body);
            startActivity(Intent.createChooser(i, subject));
        }

        @JavascriptInterface
        public String buildInfo() {
            return "MNADA " + BuildConfig.VERSION_NAME + " · Android " + Build.VERSION.RELEASE;
        }
    }
}
