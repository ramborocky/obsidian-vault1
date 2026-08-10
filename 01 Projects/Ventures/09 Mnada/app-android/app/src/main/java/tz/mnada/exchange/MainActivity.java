package tz.mnada.exchange;

import android.Manifest;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Insets;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
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
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;

/**
 * MNADA collateral-custody shell.
 *
 * The custody record lives in assets/app/index.html and runs entirely offline. This Activity is
 * the native container. It owns the window chrome, routes the hardware back button into the app's
 * own navigation stack, and exposes the four device capabilities the custody workflow actually
 * needs: haptics, a camera/file chooser for the evidence photograph, a GPS fix for where the
 * animal was seen, and a writer for the export pack the lender receives.
 *
 * There is deliberately no INTERNET permission. Nothing this app records leaves the phone except
 * through a file the agent hands over.
 */
public class MainActivity extends Activity {

    private static final String APP_URL = "file:///android_asset/app/index.html";

    private static final int REQ_FILE = 1001;
    private static final int REQ_LOCATION = 1002;

    private WebView web;

    private ValueCallback<Uri[]> filePathCallback;
    private Uri pendingCameraUri;

    private LocationManager locationManager;
    // Written on the UI thread by the listener, read on the JavascriptInterface thread.
    private volatile Location lastFix;
    private final LocationListener locationListener = new LocationListener() {
        @Override public void onLocationChanged(Location location) { lastFix = location; }
        @Override public void onProviderEnabled(String provider) { }
        @Override public void onProviderDisabled(String provider) { }
        @SuppressWarnings("deprecation")
        @Override public void onStatusChanged(String provider, int status, Bundle extras) { }
    };

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
        // The custody record persists in localStorage; photographs persist in IndexedDB. Both
        // require DOM storage, and neither survives a reinstall — hence the export pack.
        s.setDomStorageEnabled(true);
        s.setLoadWithOverviewMode(false);
        s.setUseWideViewPort(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        // Local assets only. No remote content is loaded and the app holds no network permission.
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);   // the camera returns a content:// uri
        s.setMediaPlaybackRequiresUserGesture(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            s.setAlgorithmicDarkeningAllowed(false);
        }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("file:///android_asset/")) {
                    return false;
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, request.getUrl()));
                } catch (Exception ignored) {
                    // No handler on device — swallow rather than crash.
                }
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                return showPicker(callback, params);
            }
        });

        web.addJavascriptInterface(new Bridge(), "Android");

        root.addView(web);
        setContentView(root);

        applySystemBars(root, dark);

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        web.loadUrl(APP_URL);
    }

    private boolean isDarkMode() {
        int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return mode == Configuration.UI_MODE_NIGHT_YES;
    }

    private void applySystemBars(final View root, boolean dark) {
        View decor = getWindow().getDecorView();
        int flags = decor.getSystemUiVisibility();
        flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        decor.setSystemUiVisibility(flags);
        getWindow().setStatusBarColor(Color.parseColor("#0B1512"));
        getWindow().setNavigationBarColor(Color.parseColor("#0B1512"));

        // From API 35 the window is edge-to-edge and the WebView would run under the status and
        // gesture bars. WebView does not surface those insets to CSS env(safe-area-inset-*), so
        // inset the container here and let the page assume a clean rectangle.
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

    /* ---------------- evidence photograph ---------------- */

    /**
     * Offers the camera and the gallery in one chooser. The camera writes full resolution into a
     * MediaStore entry, so no FileProvider (and therefore no AndroidX) is needed; the page
     * downscales what it gets and keeps the SHA-256 of the frame it hashed.
     */
    private boolean showPicker(ValueCallback<Uri[]> callback, WebChromeClient.FileChooserParams params) {
        if (filePathCallback != null) {
            filePathCallback.onReceiveValue(null);
        }
        filePathCallback = callback;
        pendingCameraUri = null;

        Intent camera = null;
        try {
            ContentValues cv = new ContentValues();
            cv.put(MediaStore.Images.Media.DISPLAY_NAME, "mnada-" + System.currentTimeMillis() + ".jpg");
            cv.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
            pendingCameraUri = getContentResolver()
                    .insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv);
            if (pendingCameraUri != null) {
                camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                camera.putExtra(MediaStore.EXTRA_OUTPUT, pendingCameraUri);
                camera.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                if (camera.resolveActivity(getPackageManager()) == null) {
                    camera = null;
                }
            }
        } catch (Exception e) {
            camera = null;
            pendingCameraUri = null;
        }

        try {
            Intent pick = params.createIntent();
            Intent chooser = new Intent(Intent.ACTION_CHOOSER);
            chooser.putExtra(Intent.EXTRA_INTENT, pick);
            if (camera != null) {
                chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
            }
            startActivityForResult(chooser, REQ_FILE);
            return true;
        } catch (Exception e) {
            filePathCallback = null;
            pendingCameraUri = null;
            return false;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != REQ_FILE) {
            super.onActivityResult(requestCode, resultCode, data);
            return;
        }
        if (filePathCallback == null) {
            return;
        }
        Uri[] result = null;
        if (resultCode == RESULT_OK) {
            if (data != null && data.getData() != null) {
                result = new Uri[]{ data.getData() };
            } else if (pendingCameraUri != null) {
                result = new Uri[]{ pendingCameraUri };
            }
        }
        // A null hand-back is required, or the page's file input jams on the next attempt.
        filePathCallback.onReceiveValue(result);
        filePathCallback = null;
        pendingCameraUri = null;
    }

    /* ---------------- location ---------------- */

    private boolean hasLocationPermission() {
        return checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void startLocationUpdates() {
        if (!hasLocationPermission() || locationManager == null) {
            return;
        }
        try {
            for (String provider : new String[]{ LocationManager.GPS_PROVIDER,
                                                 LocationManager.NETWORK_PROVIDER }) {
                if (locationManager.isProviderEnabled(provider)) {
                    locationManager.requestLocationUpdates(provider, 2000L, 0f, locationListener);
                    Location known = locationManager.getLastKnownLocation(provider);
                    if (known != null && (lastFix == null || known.getTime() > lastFix.getTime())) {
                        lastFix = known;
                    }
                }
            }
        } catch (SecurityException ignored) {
            // Permission revoked between the check and the call.
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        if (requestCode == REQ_LOCATION) {
            startLocationUpdates();
            return;
        }
        super.onRequestPermissionsResult(requestCode, permissions, results);
    }

    @Override
    protected void onResume() {
        super.onResume();
        startLocationUpdates();
    }

    @Override
    protected void onPause() {
        super.onPause();
        try {
            if (locationManager != null) {
                locationManager.removeUpdates(locationListener);
            }
        } catch (Exception ignored) {
        }
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

    /** Device capabilities the custody workflow genuinely uses. Nothing else is exposed. */
    private class Bridge {

        @JavascriptInterface
        public void haptic(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            int duration = Math.max(10, Math.min(ms, 400));
            v.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
        }

        /** Latest fix as JSON, or "" when there is none. The page treats "" as "ask again". */
        @JavascriptInterface
        public String location() {
            if (!hasLocationPermission()) return "";
            Location f = lastFix;
            if (f == null) return "";
            // A fix older than ten minutes is not evidence of where the agent is standing.
            if (System.currentTimeMillis() - f.getTime() > 600000L) return "";
            return "{\"lat\":" + f.getLatitude()
                 + ",\"lon\":" + f.getLongitude()
                 + ",\"acc\":" + (f.hasAccuracy() ? f.getAccuracy() : 0f)
                 + ",\"ts\":" + f.getTime() + "}";
        }

        @JavascriptInterface
        public void requestLocation() {
            runOnUiThread(() -> {
                if (hasLocationPermission()) {
                    startLocationUpdates();
                } else {
                    requestPermissions(new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION }, REQ_LOCATION);
                }
            });
        }

        /**
         * Writes the lender's export pack to the app's own Documents folder. Returns the absolute
         * path, or "" on failure so the page can fall back to sharing it as text.
         */
        @JavascriptInterface
        public String savePack(String name, String content) {
            if (name == null || content == null) return "";
            String safe = name.replaceAll("[^A-Za-z0-9._-]", "_");
            try {
                File dir = getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);
                if (dir == null) dir = getFilesDir();
                if (!dir.exists() && !dir.mkdirs()) return "";
                File out = new File(dir, safe);
                FileOutputStream fos = new FileOutputStream(out);
                try {
                    fos.write(content.getBytes(StandardCharsets.UTF_8));
                    fos.flush();
                } finally {
                    fos.close();
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
            return "MNADA " + BuildConfig.VERSION_NAME + " · Android " + Build.VERSION.RELEASE;
        }
    }
}
