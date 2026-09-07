#!/usr/bin/env bash
# Pull the base64 logo out of the old signature file and write it as logo.png.
#   ./extract-logo.sh old-signature.html
set -euo pipefail
src="${1:?usage: ./extract-logo.sh <html-file-containing-a-data-uri>}"
grep -o 'data:image/png;base64,[A-Za-z0-9+/=]*' "$src" \
  | head -1 \
  | sed 's|data:image/png;base64,||' \
  | base64 -d > logo.png
echo "Wrote logo.png ($(wc -c < logo.png) bytes)"
