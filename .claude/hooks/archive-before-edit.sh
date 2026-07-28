#!/usr/bin/env bash
# archive-before-edit.sh — PreToolUse hook for the Kalema vault.
#
# Captures the pre-edit content of any story-prose file under the protected
# folders and appends it verbatim to the Craft Log's "Cut / Original Material
# Archive", so nothing is silently overwritten.
#
# Rebuilt 2026-07-26. The original lived on a previous machine
# (C:\Users\lijumba\...) and was lost when the vault was copied without its
# .claude/ folder — see 01 Projects/CLAUDE.md.
#
# Contract: reads the PreToolUse JSON payload on stdin, ALWAYS exits 0.
# This hook must never block an edit; archiving is best-effort by design.

set -uo pipefail

PAYLOAD="$(cat)"

# --- parse the payload (no jq on this machine, so use perl) ----------------
read -r TOOL_NAME FILE_PATH <<EOF
$(printf '%s' "$PAYLOAD" | perl -0777 -ne '
    my ($tool) = /"tool_name"\s*:\s*"((?:[^"\\]|\\.)*)"/;
    my ($path) = /"file_path"\s*:\s*"((?:[^"\\]|\\.)*)"/;
    for ($tool, $path) {
        $_ = "" unless defined;
        s/\\\\/\x01/g; s/\\"/"/g; s/\\\//\//g; s/\x01/\\/g;
    }
    $path =~ s/\s+$//;
    print "$tool $path";
' 2>/dev/null)
EOF

[ -n "${FILE_PATH:-}" ] || exit 0

case "$TOOL_NAME" in
    Write|Edit|MultiEdit|NotebookEdit) ;;
    *) exit 0 ;;
esac

# --- normalise to forward slashes for matching ----------------------------
NORM="${FILE_PATH//\\//}"

# --- only protect story prose --------------------------------------------
PROTECTED=0
case "$NORM" in
    */01\ Projects/Kalemie/06\ Scenes/*)                    PROTECTED=1 ;;
    */01\ Projects/Kalemie/STORY\ PROGRESSION\ \&\ DRAFTS/*) PROTECTED=1 ;;
    */01\ Projects/Kalemie/02\ Characters/*)                PROTECTED=1 ;;
    */01\ Projects/Kalemie/01\ Story\ Brain/*)              PROTECTED=1 ;;
esac
[ "$PROTECTED" -eq 1 ] || exit 0

# --- never archive reference material or the log itself -------------------
case "$NORM" in
    *Craft\ Log.md|*/00\ Mackee/*|*/00\ Jane\ Cleland/*|*/01\ John\ Gardner/*|*/Learning\ Curve/*)
        exit 0 ;;
esac

# --- nothing to archive if the file doesn't exist yet ---------------------
[ -f "$FILE_PATH" ] && [ -s "$FILE_PATH" ] || exit 0

# --- locate the Craft Log relative to the edited file ---------------------
VAULT_KALEMIE="${NORM%%/01 Projects/Kalemie/*}/01 Projects/Kalemie"
CRAFT_LOG="$VAULT_KALEMIE/07 Narrative Craft/Craft Log.md"
[ -f "$CRAFT_LOG" ] || exit 0

# --- don't re-archive identical content back to back ----------------------
LAST_SRC="$(grep -o '^> \*\*Source:\*\* .*' "$CRAFT_LOG" | tail -1)"
THIS_SRC="> **Source:** \`$FILE_PATH\`"
LAST_HASH_FILE="$VAULT_KALEMIE/07 Narrative Craft/.last-archived"
THIS_HASH="$(printf '%s' "$FILE_PATH" | md5sum 2>/dev/null | cut -d' ' -f1)-$(md5sum <"$FILE_PATH" 2>/dev/null | cut -d' ' -f1)"
if [ -f "$LAST_HASH_FILE" ] && [ "$THIS_HASH" = "$(cat "$LAST_HASH_FILE" 2>/dev/null)" ]; then
    exit 0
fi

# --- append the entry, matching the existing format exactly ---------------
{
    printf '\n'
    printf '> **Date:** %s (auto-archived pre-edit)\n' "$(date '+%Y-%m-%d %H:%M:%S')"
    printf '%s\n' "$THIS_SRC"
    printf '> **Reason cut:** (auto-captured before Edit/Write — annotate manually if useful)\n'
    printf '> **Original text:**\n'
    printf '> ```\n'
    sed 's/^/> /' "$FILE_PATH"
    printf '> ```\n'
} >>"$CRAFT_LOG" 2>/dev/null

printf '%s' "$THIS_HASH" >"$LAST_HASH_FILE" 2>/dev/null

exit 0
