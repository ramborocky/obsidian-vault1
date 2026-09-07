#!/usr/bin/env bash
# Inject a logo URL into signature.html and rebuild the copy-from page.
#   ./build.sh https://example.com/logo.png
set -euo pipefail
url="${1:?usage: ./build.sh <https-url-to-logo.png>}"
case "$url" in https://*) ;; *) echo "Logo URL must start with https:// — email clients block http." >&2; exit 1;; esac

sed "s|LOGO_URL_HERE|${url//|/\\|}|g" signature.html > signature-ready.html

{
  cat <<'HEAD'
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Copy the block below</title></head>
<body style="margin:0;padding:40px;background:#f5f5f3;">
<p style="font:13px Arial,Helvetica,sans-serif;color:#68747c;max-width:640px;">
  Click just above the logo, drag to just below the dark bar, Ctrl+C.
  Then paste into your signature box. Do not copy this sentence.
</p>
<div style="background:#fff;display:inline-block;">
HEAD
  cat signature-ready.html
  printf '</div>\n</body>\n</html>\n'
} > preview.html

n=$(wc -c < signature-ready.html)
echo "Wrote signature-ready.html (${n} chars) and preview.html"
[ "$n" -gt 10000 ] && echo "WARNING: over Gmail's 10,000-character signature limit." >&2
echo "Now open preview.html in a browser and copy the block."
