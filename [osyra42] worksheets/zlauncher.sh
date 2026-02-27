#!/usr/bin/env bash
set -e

echo "============================================"
echo "  Osyra's Worksheets - Environment Check"
echo "============================================"
echo

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INDEX="$SCRIPT_DIR/worksheets/index.html"

# Check that worksheet files exist
if [ ! -f "$INDEX" ]; then
    echo "[FAIL] Worksheet files not found!"
    echo "       Expected: $INDEX"
    echo "       Make sure you extracted the full zip."
    exit 1
fi
echo "[OK] Worksheet files found."

# Check for fonts
if [ -f "$SCRIPT_DIR/worksheets/fonts/DancingScript-Regular.ttf" ]; then
    echo "[OK] Cursive fonts found."
else
    echo "[WARN] Cursive fonts missing - cursive worksheet may not render correctly."
fi

# Check for internet (needed for Definitions worksheet)
if ping -c 1 -W 2 api.dictionaryapi.dev >/dev/null 2>&1; then
    echo "[OK] Internet connection detected - all worksheets available."
else
    echo "[WARN] No internet connection - Definitions worksheet requires internet."
fi

# Detect and launch browser
echo
echo "Launching in your default browser..."
echo

OPENED=false

# macOS
if command -v open >/dev/null 2>&1; then
    open "$INDEX"
    OPENED=true
# Linux with xdg-open
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$INDEX"
    OPENED=true
# WSL
elif command -v wslview >/dev/null 2>&1; then
    wslview "$INDEX"
    OPENED=true
# Fallback: try common browsers
else
    for browser in firefox google-chrome chromium-browser chromium brave-browser; do
        if command -v "$browser" >/dev/null 2>&1; then
            "$browser" "$INDEX" &
            OPENED=true
            break
        fi
    done
fi

if [ "$OPENED" = false ]; then
    echo "[FAIL] Could not detect a browser."
    echo "       Please open this file manually:"
    echo "       $INDEX"
    exit 1
fi

echo "Worksheets launched successfully!"
