# Media Archiver — TikTok · YouTube · Instagram

Local web app that downloads **every video from a profile on TikTok, YouTube or
Instagram**, runs each one through a **Whisper transcriber**, and keeps a local
library that **never re-downloads or re-transcribes** a video it already has.
This is the multi-platform sibling of `docs/tiktok-archiver/` — that app keeps
running your existing TikTok library untouched on port **8317**; this one runs
on port **8318** with its own separate library.

Everything runs and stays on this Mac — no cloud services, no accounts.

## Start it

**Easiest — a real Mac app icon:** double-click **`make-app.command`** once. It
installs **"Media Archiver.app"** into your Applications folder. From then on,
launch it from **Launchpad / Spotlight / the Dock** like any app — it starts the
server and opens the app in your browser automatically, no Terminal, nothing to
type. Quitting the app (⌘Q) stops the server. Re-run `make-app.command` if you
ever move the project folder. (First launch: if macOS says "unidentified
developer", right-click the app → **Open** once.)

**Or** double-click **`start.command`** in Finder, **or** from a terminal:

```bash
cd docs/media-archiver
.venv/bin/python server.py
# → open http://127.0.0.1:8318
```

(First-time setup, already done on this machine: `uv venv --python 3.12 .venv &&
uv pip install --python .venv/bin/python -r requirements.txt`)

## Use it

1. **Add a profile** — paste any profile URL from TikTok (`tiktok.com/@user`),
   YouTube (`youtube.com/@handle`, `/channel/…`, `/c/…`, `/user/…`) or
   Instagram (`instagram.com/user`), and click *Add profile*. For a bare
   `@handle`, pick the platform in the dropdown first. The same handle can be
   archived on all three platforms independently.
2. **Sync** — downloads every video it doesn't have yet, then transcribes every
   video without a transcript. Re-running Sync only fetches **new** videos.
   The *limit* box caps how many new videos one sync grabs (handy for a first test).
3. **Library** — play videos inline, read/copy transcripts + the full **post
   caption/description** (hashtags and all), download `.txt`/`.srt` per video,
   search across titles + captions + transcripts, or *Export transcripts* as one
   combined text/markdown file (platform-tagged).
4. **Auto-sync (optional)** — Settings → *Auto-sync all profiles* (hourly / 6h /
   daily). While the server is running it re-checks every profile on that
   schedule and downloads + transcribes only what's new.
5. **Visual scan (optional, on/off)** — Settings → *Visual scan*. When On, each
   sync also walks the video at its scene changes and records the **on-screen
   text** (burned-in captions / overlays) plus **scene tags** (people, place,
   objects). Runs fully locally via Apple's Vision framework, a few seconds per
   video. Also available per-video via the **👁 Visual scan** button. Dedup
   applies: a video already scanned is never re-scanned.

## Per-platform notes

| Platform | Anonymous access | Notes |
|---|---|---|
| **TikTok** | Usually works for public profiles until rate-limited | Same behaviour as the TikTok-only app |
| **YouTube** | Works for public channels | Downloads capped at 720p to keep the library small; all channel-URL styles accepted |
| **Instagram** | **Needs a login** for almost everything | Set up cookies (below) before adding an Instagram profile |

## Login / cookies (Settings → access)

- **Use my browser login** — log into the platform in Chrome/Safari/Firefox
  first; the app reads that browser's cookies via yt-dlp. On macOS, Chrome
  cookie access can trigger a one-time Keychain prompt — click **Always Allow**.
  (Quit Chrome if it complains the cookie database is locked.)
- **Pasted cookies.txt** — install a cookie-export extension (e.g. "Get
  cookies.txt LOCALLY"), export while on the platform's site, paste into
  Settings. Most reliable option. One cookies file can hold sessions for all
  three platforms.

**To know you're logged in:** Settings → pick the platform → **Check login**.
✅ confirms cookies for that platform are present; ❌ tells you what's missing.

## Where things live

```
data/
├── archive.db                             # library DB — the dedup source of truth
├── downloads/<platform>/<user>/<id>.mp4   # videos (+ thumbnails)
├── transcripts/<platform>/<user>/<id>.txt / .srt
├── visual/<platform>/<user>/<id>.txt      # visual-scan output (if enabled)
└── cookies.txt                            # only if you use the paste option (KEEP PRIVATE)
```

Videos are fetched at the best available quality (h264 preferred so they play
in any browser; YouTube capped at 720p). Dedup is by the platform's video ID:
if the file already exists on disk it is reused even if the DB was reset.

## Whisper model choice (Settings)

| model | speed on M-series | accuracy |
|---|---|---|
| tiny | fastest | rough |
| base | fast | good |
| small (default) | ~2-3× slower | better |
| medium / large-v3 | slow | best |

The model downloads once (~75 MB–1.5 GB depending on size) into
`~/.cache/huggingface/` — shared with the TikTok-only app, so nothing new to
download if you've used that. Language: leave on auto-detect unless everything
is English.

## Limitations

- **Photo/slideshow posts** can't be saved as MP4 — marked `unsupported` and
  skipped forever (not retried). Instagram photo posts fall in this bucket;
  Reels download fine (with login).
- Scope is **public profile videos**. Liked/Favorites lists aren't reliably
  exposed; archive the creator's profile instead.
- One job runs at a time (downloads are sequential on purpose — parallel
  hammering gets an IP rate-limited).
- Keep `data/cookies.txt` private — it grants access to your logins. The whole
  `data/` dir is gitignored.
- This app does **not** share a library with `docs/tiktok-archiver/` — by
  design, so your existing TikTok workflow is unaffected. Archive a TikTok
  profile here too if you want it in this library.

## Troubleshooting

- **"blocked the request" / empty list** → enable login cookies (above), or
  update yt-dlp: `.venv/bin/python -m pip install -U yt-dlp` (platforms change
  frequently; updating yt-dlp fixes most breakage).
- **Instagram "login required"** → set up cookies, then Settings → Check login.
- **Sync button stuck on Busy** → a job is running; watch the progress card.
- **Port in use** → edit the port at the bottom of `server.py` (default 8318).
