# TikTok Profile Archiver

Local web app that downloads **every video from a TikTok profile**, runs each one
through a **Whisper transcriber**, and keeps a local library that **never
re-downloads or re-transcribes** a video it already has. Functional replacement
for the "MyFaveTT" Chrome extension (export-to-MP4 + stay-in-sync), rebuilt from
scratch and extended with transcription and full-text search.

Everything runs and stays on this Mac — no cloud services, no accounts.

## Start it

Double-click **`start.command`** in Finder (opens the app in your browser), or:

```bash
cd docs/tiktok-archiver
.venv/bin/python server.py
# → open http://127.0.0.1:8317
```

(First-time setup, already done on this machine: `uv venv --python 3.12 .venv &&
uv pip install --python .venv/bin/python -r requirements.txt`)

## Use it

1. **Add a profile** — paste `@username` or the full profile URL, click *Add profile*.
2. **Sync** — downloads every video it doesn't have yet, then transcribes every
   video without a transcript. Re-running Sync only fetches **new** videos.
   The *limit* box caps how many new videos one sync grabs (handy for a first test).
3. **Library** — play videos inline, read/copy transcripts, download `.txt`/`.srt`
   per video, search across all titles + transcripts, or *Export transcripts*
   as one combined text file.
4. **Auto-sync (optional)** — Settings → *Auto-sync all profiles* (hourly / 6h /
   daily). While the server is running it re-checks every profile on that
   schedule and downloads + transcribes only what's new — no clicking needed.

## TikTok login (needed if TikTok blocks anonymous access)

Settings → **TikTok access**:

- **Use my browser login** — log into tiktok.com in Chrome/Safari/Firefox first;
  the app reads that browser's cookies via yt-dlp. On macOS, Chrome cookie
  access can trigger a one-time Keychain prompt — click **Always Allow**.
  (Quit Chrome if it complains the cookie database is locked.)
- **Pasted cookies.txt** — install a cookie-export extension (e.g. "Get
  cookies.txt LOCALLY"), export while on tiktok.com, paste into Settings.
  Most reliable option.

**To know you're logged in:** Settings → **Check TikTok login**. It reads the
cookies for the mode you picked and asks TikTok to confirm the session —
✅ names the account it belongs to; ❌ tells you exactly what's missing.
Anonymous mode works for public profiles until TikTok rate-limits you, so
only set up login when downloads start failing (or to be safe up front).

## Where things live

```
data/
├── archive.db                 # library DB — the dedup source of truth
├── downloads/<user>/<id>.mp4  # videos (+ .jpg/.webp thumbnails)
├── transcripts/<user>/<id>.txt / .srt
└── cookies.txt                # only if you use the paste option (KEEP PRIVATE)
```

Videos are fetched at the best available quality (h264 preferred so they play
in any browser). Dedup is by TikTok video ID: if the file already exists on
disk it is reused even if the DB was reset.

## Whisper model choice (Settings)

| model | speed on M-series | accuracy |
|---|---|---|
| tiny | fastest | rough |
| base (default) | fast | good |
| small | ~2-3× slower | better |
| medium / large-v3 | slow | best |

The model downloads once (~75 MB–1.5 GB depending on size) into
`~/.cache/huggingface/`. Language: leave on auto-detect unless everything is
English — forcing `en` is slightly faster/more accurate.

## Limitations

- **Photo/slideshow posts** can't be saved as MP4 — they're marked
  `unsupported` and skipped forever (not retried).
- Scope is **public profile videos** (yours or anyone's). Liked/Favorites lists
  aren't reliably exposed by TikTok's web API; if you need those, favorite the
  creator's profile and sync the profile instead.
- One job runs at a time (downloads are sequential on purpose — parallel
  hammering gets an IP rate-limited by TikTok).
- Keep `data/cookies.txt` private — it grants access to your TikTok session.
  The whole `data/` dir is gitignored.

## Troubleshooting

- **"TikTok blocked the request" / empty list** → enable login cookies (above),
  or update yt-dlp: `.venv/bin/python -m pip install -U yt-dlp` (TikTok changes
  frequently; updating yt-dlp fixes most breakage).
- **Sync button stuck on Busy** → a job is running; watch the progress card.
- **Port in use** → edit the port at the bottom of `server.py`.
