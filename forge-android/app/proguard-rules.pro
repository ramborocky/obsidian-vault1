# The page calls into Bridge by name across the JavaScript boundary, so the
# shrinker cannot see the call sites. Without this the app builds and then the
# share sheet, the clipboard and keep-awake all silently do nothing.
-keepclassmembers class net.mihogoni.forge.MainActivity$Bridge {
    public *;
}
-keepattributes JavascriptInterface
