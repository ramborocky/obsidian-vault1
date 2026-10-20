package tz.rhythm.soma;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * Hosts the same single-file app as the desktop build (assets/soma.html) in a WebView, and
 * exposes the few things a web page can't do on a phone: reminders, a timer alert while the
 * screen is off, keep-screen-on, haptics, and saving files to Downloads.
 */
public class MainActivity extends Activity {

    private static final String APP_URL = "file:///android_asset/soma.html";
    private static final int REQ_FILE = 1001;
    private static final int REQ_NOTIFY = 1002;
    private static final int BG = Color.parseColor("#0B0F14");

    private WebView web;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout root = new FrameLayout(this);
        root.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        root.setBackgroundColor(BG);

        web = new WebView(this);
        web.setBackgroundColor(BG);
        web.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // the whole study record lives in localStorage
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        s.setAllowFileAccess(false);           // the bundled asset still loads; nothing else does
        s.setAllowContentAccess(true);         // backup import hands back a content:// uri
        s.setMediaPlaybackRequiresUserGesture(false); // the end-of-timer chime
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) s.setAlgorithmicDarkeningAllowed(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("file:///android_asset/")) return false;
                // Course links go to the phone's browser; the app itself has no internet access.
                try { startActivity(new Intent(Intent.ACTION_VIEW, request.getUrl())); } catch (Exception ignored) { }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onConsoleMessage(ConsoleMessage m) { return true; }

            // The page's confirm() dialogs, titled "Soma" instead of 'The page at "file://" says'.
            @Override
            public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Soma")
                        .setMessage(message)
                        .setPositiveButton("Yes", (d, w) -> result.confirm())
                        .setNegativeButton("No", (d, w) -> result.cancel())
                        .setOnCancelListener(d -> result.cancel())
                        .show();
                return true;
            }

            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Soma")
                        .setMessage(message)
                        .setPositiveButton("OK", (d, w) -> result.confirm())
                        .setOnCancelListener(d -> result.confirm())
                        .show();
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = callback;
                try {
                    Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
                    pick.addCategory(Intent.CATEGORY_OPENABLE);
                    pick.setType("*/*");
                    startActivityForResult(Intent.createChooser(pick, "Choose a Soma backup"), REQ_FILE);
                    return true;
                } catch (Exception e) {
                    filePathCallback = null;
                    return false;
                }
            }
        });
        web.addJavascriptInterface(new Bridge(), "SomaNative");

        root.addView(web);
        setContentView(root);
        applySystemBars(root);
        Reminders.ensureChannel(this);
        web.loadUrl(APP_URL);
    }

    private void applySystemBars(final View root) {
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);
        // From API 35 the window is edge-to-edge; pad the container so the page gets a clean rectangle.
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int top, bottom, left, right;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                top = bars.top; bottom = bars.bottom; left = bars.left; right = bars.right;
            } else {
                top = insets.getSystemWindowInsetTop(); bottom = insets.getSystemWindowInsetBottom();
                left = insets.getSystemWindowInsetLeft(); right = insets.getSystemWindowInsetRight();
            }
            v.setPadding(left, top, right, bottom);
            return WindowInsets.CONSUMED;
        });
        root.requestApplyInsets();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != REQ_FILE) { super.onActivityResult(requestCode, resultCode, data); return; }
        if (filePathCallback == null) return;
        Uri[] result = (resultCode == RESULT_OK && data != null && data.getData() != null) ? new Uri[]{ data.getData() } : null;
        filePathCallback.onReceiveValue(result);   // a null hand-back is required, or the input jams next time
        filePathCallback = null;
    }

    // The page's visibilitychange event is how a focus break is counted, so pass lifecycle through.
    @Override protected void onPause() { super.onPause(); if (web != null) web.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }

    @Override
    public void onBackPressed() {
        if (web == null) { super.onBackPressed(); return; }
        web.evaluateJavascript("window.Soma && window.Soma.onBack ? window.Soma.onBack() : false",
                value -> { if (!"true".equals(value)) finish(); });
    }

    private boolean canNotify() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
                || checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }

    private void askToNotify() {
        if (!canNotify()) runOnUiThread(() -> requestPermissions(new String[]{ Manifest.permission.POST_NOTIFICATIONS }, REQ_NOTIFY));
    }

    /** What the page can ask of the phone. Nothing else is exposed. */
    private class Bridge {

        @JavascriptInterface
        public void haptic(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            v.vibrate(VibrationEffect.createOneShot(Math.max(10, Math.min(ms, 600)), VibrationEffect.DEFAULT_AMPLITUDE));
        }

        @JavascriptInterface
        public void keepAwake(boolean on) {
            runOnUiThread(() -> {
                if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            });
        }

        /** Returns "ok", or a sentence the page shows as it is. */
        @JavascriptInterface
        public String setReminders(String json) {
            try {
                Reminders.setAll(MainActivity.this, json);
                if (!"[]".equals(json.trim()) && !canNotify()) {
                    askToNotify();
                    return "Reminders set. Allow notifications when Android asks, or they won't show.";
                }
                return "ok";
            } catch (Exception e) {
                return "Couldn't set reminders: " + e.getMessage();
            }
        }

        /** atMs is a string because JavaScript numbers that large lose nothing as text. */
        @JavascriptInterface
        public void scheduleTimer(String atMs, String title) {
            try {
                askToNotify();
                Reminders.scheduleTimer(MainActivity.this, Long.parseLong(atMs), title);
            } catch (Exception ignored) { }
        }

        @JavascriptInterface
        public void cancelTimer() { Reminders.cancelTimer(MainActivity.this); }

        /** Saves to Download/Soma so the file is easy to find and move. Returns where, or "". */
        @JavascriptInterface
        public String saveFile(String name, String content) {
            if (name == null || content == null) return "";
            String safe = name.replaceAll("[^A-Za-z0-9 ._-]", "_");
            String mime = safe.endsWith(".md") ? "text/markdown" : safe.endsWith(".json") ? "application/json" : "text/plain";
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues cv = new ContentValues();
                    cv.put(MediaStore.MediaColumns.DISPLAY_NAME, safe);
                    cv.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Soma");
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                    if (uri == null) return "";
                    try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                        if (os == null) return "";
                        os.write(content.getBytes(StandardCharsets.UTF_8));
                    }
                    return "Download/Soma/" + safe;
                }
                File dir = getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
                if (dir == null) dir = getFilesDir();
                if (!dir.exists() && !dir.mkdirs()) return "";
                File out = new File(dir, safe);
                try (FileOutputStream fos = new FileOutputStream(out)) {
                    fos.write(content.getBytes(StandardCharsets.UTF_8));
                }
                return out.getAbsolutePath();
            } catch (Exception e) {
                return "";
            }
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
            return "Soma " + BuildConfig.VERSION_NAME + " · Android " + Build.VERSION.RELEASE;
        }
    }
}
