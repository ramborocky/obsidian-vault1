#!/usr/bin/env bash
# Recover logo.png from the old signature's embedded base64.
#   ./extract-logo.sh                  # searches for a file containing a data URI
#   ./extract-logo.sh path/to/old.html # or point it straight at the file
set -euo pipefail

src="${1:-}"
if [ -z "$src" ]; then
  echo "Searching for a file with an embedded image..."
  src=$(grep -rl --include='*.html' --include='*.htm' --include='*.txt' --include='*.md' \
        -m1 'data:image/[a-z]*;base64,' . "$HOME/Downloads" "$HOME/Desktop" "$HOME/Documents" 2>/dev/null | head -1 || true)
  [ -n "$src" ] || { echo "None found. Save the old signature to a file and pass it as an argument." >&2; exit 1; }
  echo "Found: $src"
fi

grep -o 'data:image/[a-z]*;base64,[A-Za-z0-9+/=]*' "$src" | head -1 \
  | sed 's|data:image/[a-z]*;base64,||' | tr -d '\n' | base64 -d > logo.png

# Verify it is a real PNG and report its size.
python3 - <<'PY'
import struct, sys
d = open("logo.png","rb").read()
if d[:8] != b"\x89PNG\r\n\x1a\n":
    sys.exit("Decoded data is not a valid PNG — the base64 may be truncated.")
w, h = struct.unpack(">II", d[16:24])
print(f"Wrote logo.png — {w} x {h} px, {len(d)} bytes. Valid PNG.")
PY
