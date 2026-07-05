#!/bin/zsh
# Build "TikTok Archiver.app" — a clickable Mac app that launches the local
# server and opens it in your browser. Double-click this file once to (re)install.
# Re-run it any time you move the project folder or change the icon.
set -e
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PY="$APP_DIR/.venv/bin/python"
APP_NAME="TikTok Archiver"
URL="http://127.0.0.1:8317"

echo "Project: $APP_DIR"

# --- 1. icon ---------------------------------------------------------------
ICONSET="$(mktemp -d)/AppIcon.iconset"; mkdir -p "$ICONSET"
"$PY" - "$ICONSET/master.png" <<'PY'
import sys
from PIL import Image, ImageDraw
SZ = 1024
img = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, SZ, SZ], radius=230, fill=(14, 14, 22, 255))
d.rounded_rectangle([10, 10, SZ-10, SZ-10], radius=220, outline=(38, 38, 51, 255), width=6)
def tri(cx, cy, s, c):
    w = s*0.88
    d.polygon([(cx-w/2, cy-s/2), (cx-w/2, cy+s/2), (cx+w/2, cy)], fill=c)
cx, cy = SZ*0.52, SZ*0.42
tri(cx-26, cy, 340, (254, 44, 85, 255))
tri(cx+18, cy, 340, (37, 244, 238, 255))
for i, (wf, col) in enumerate([(0.52, (236, 238, 242, 255)), (0.40, (138, 142, 160, 255)), (0.30, (138, 142, 160, 255))]):
    y = SZ*0.72 + i*90
    d.rounded_rectangle([SZ*0.24, y, SZ*0.24+SZ*wf, y+52], radius=26, fill=col)
img.save(sys.argv[1])
PY
for s in 16 32 128 256 512; do
  sips -z $s $s "$ICONSET/master.png" --out "$ICONSET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) "$ICONSET/master.png" --out "$ICONSET/icon_${s}x${s}@2x.png" >/dev/null
done
rm "$ICONSET/master.png"
ICNS="$(mktemp -d)/AppIcon.icns"
iconutil -c icns "$ICONSET" -o "$ICNS"

# --- 2. choose install location (Applications, else ~/Applications) --------
DEST="/Applications"
[[ -w "$DEST" ]] || DEST="$HOME/Applications"
mkdir -p "$DEST"
APP="$DEST/$APP_NAME.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$ICNS" "$APP/Contents/Resources/AppIcon.icns"

# --- 3. Info.plist ---------------------------------------------------------
cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleName</key><string>$APP_NAME</string>
  <key>CFBundleDisplayName</key><string>$APP_NAME</string>
  <key>CFBundleIdentifier</key><string>com.local.tiktokarchiver</string>
  <key>CFBundleVersion</key><string>1.0</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleExecutable</key><string>launch</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>LSMinimumSystemVersion</key><string>11.0</string>
</dict></plist>
PLIST

# --- 4. launcher executable ------------------------------------------------
cat > "$APP/Contents/MacOS/launch" <<LAUNCH
#!/bin/zsh
APP_DIR="$APP_DIR"
URL="$URL"
PY="\$APP_DIR/.venv/bin/python"
# already running (e.g. started elsewhere)? just open the browser.
if /usr/bin/curl -s -o /dev/null --max-time 2 "\$URL/api/state"; then
  /usr/bin/open "\$URL"; exit 0
fi
# environment missing? tell the user instead of silently failing.
if [[ ! -x "\$PY" ]]; then
  /usr/bin/osascript -e 'display alert "TikTok Archiver" message "First-time setup needed — open Terminal in the project folder and run the setup in README.md." as critical'
  exit 1
fi
# open the browser as soon as the server answers, then run the server in front
( for i in {1..40}; do /usr/bin/curl -s -o /dev/null --max-time 1 "\$URL/api/state" && break; sleep 0.5; done; /usr/bin/open "\$URL" ) &
cd "\$APP_DIR"
exec "\$PY" server.py
LAUNCH
chmod +x "$APP/Contents/MacOS/launch"

# --- 5. register so Spotlight/Launchpad/Finder pick it up ------------------
touch "$APP"
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP" 2>/dev/null || true

echo "\n✅ Installed: $APP"
echo "Find it in Launchpad / Spotlight (\"TikTok Archiver\"), or drag it to your Dock."
open -R "$APP"
