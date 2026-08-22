#!/usr/bin/env python3
"""
Publish/update the blog posts on the LIVE site via the WordPress REST API.
No theme upload involved — posts live in the WordPress database, so this never
touches templates, never re-deploys the site, and keeps every URL stable.

Setup (once):
  1. wp-admin -> Users -> Profile -> Application Passwords -> name it "clifford-publisher"
     -> copy the generated password.
  2. Save credentials (never committed; .secrets/ is gitignored):
       echo 'USERNAME:xxxx xxxx xxxx xxxx xxxx xxxx' > .secrets/wp-app-password.key
       chmod 600 .secrets/wp-app-password.key

Usage:
  python3 scripts/publish-blogs.py --dry-run          # show what would happen
  python3 scripts/publish-blogs.py                    # upsert all posts as DRAFTS
  python3 scripts/publish-blogs.py --publish          # upsert + set status publish
  python3 scripts/publish-blogs.py --slug bathtub-chip-repair --publish
  python3 scripts/publish-blogs.py --images ~/Downloads/blog-images  # also upload heroes

Safety: posts are created as DRAFT unless --publish is passed, so Rule 8
(both-CEO verification of customer-facing copy) stays enforceable — nothing
goes public without an explicit flag.
"""
import argparse, base64, json, mimetypes, re, sys, urllib.request, urllib.parse
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BLOG_DIR = REPO / "docs/content/blog"
SECRET = REPO / ".secrets/wp-app-password.key"

HERO_MAP = {
    "resurface-or-replace-bathtub": "hero-resurface-or-replace.jpg",
    "how-long-does-bath-resurfacing-last": "hero-how-long-resurfacing-lasts.jpg",
    "regrout-or-retile-shower": "hero-regrout-or-retile.jpg",
    "why-is-my-bathtub-peeling": "hero-peeling-bathtub.jpg",
    "bathtub-chip-repair": "hero-chip-repair.jpg",
    "mouldy-shower-grout-fix": "hero-mouldy-grout.jpg",
    "bathroom-resurfacing-rental-property": "hero-rental-property.jpg",
    "leaking-shower-repair-without-removing-tiles": "hero-leaking-shower.jpg",
}


def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def auth_header():
    if not SECRET.exists():
        die(f"missing {SECRET} — see setup in this script's docstring")
    creds = SECRET.read_text().strip()
    if ":" not in creds:
        die("wp-app-password.key must be USERNAME:app-password on one line")
    return "Basic " + base64.b64encode(creds.encode()).decode()


def api(site, path, method="GET", payload=None, raw=None, ctype="application/json", filename=None):
    url = site.rstrip("/") + "/wp-json/wp/v2/" + path
    data = raw if raw is not None else (json.dumps(payload).encode() if payload else None)
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", auth_header())
    req.add_header("Content-Type", ctype)
    req.add_header("User-Agent", "Mozilla/5.0 (timeless-publisher)")  # Cloudflare
    if filename:
        req.add_header("Content-Disposition", f'attachment; filename="{filename}"')
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def parse_post(path: Path):
    rawtext = path.read_text()
    m = re.match(r"\s*<!--(.*?)-->", rawtext, re.S)
    if not m:
        return None
    meta, body = m.group(1), rawtext[m.end():].strip()
    t = re.search(r"Post title \(H1\):\s*(.+)", meta)
    s = re.search(r"Slug:\s*(.+)", meta)
    if not t or not s:
        return None
    slug = re.sub(r"\s*\(URL.*$", "", s.group(1).strip()).strip("/ ").split("/")[-1]
    d = re.search(r"Meta description:\s*(.+?)\s*\(\d+ chars\)", meta)
    # strip any leaked JSON-LD (theme emits schema at template level)
    body = re.sub(r"<script\b[^>]*application/ld\+json.*?</script>", "", body, flags=re.S | re.I)
    # Strip EVERY html comment from the body. The front-matter block above is already
    # removed, but in-body notes are not: Cleo's Rule 8 pass on 2026-08-22 found
    # "<!-- TODO Allan: real process photo -->" and a TODO naming the case-study
    # suburb in an image filename, both being served on the rendered page. Editorial
    # notes belong in the repo, never in what a customer's browser downloads. Done
    # here rather than per-article so no future note can leak by being forgotten.
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return {"slug": slug, "title": t.group(1).strip(), "content": body.strip(),
            "excerpt": d.group(1).strip() if d else ""}


def find_by_slug(site, endpoint, slug):
    q = urllib.parse.urlencode({"slug": slug, "status": "any", "per_page": 1})
    try:
        hits = api(site, f"{endpoint}?{q}")
    except Exception:
        hits = api(site, f"{endpoint}?" + urllib.parse.urlencode({"slug": slug, "per_page": 1}))
    return hits[0] if hits else None


def upload_media(site, filepath: Path, slug):
    existing = find_by_slug(site, "media", filepath.stem)
    if existing:
        return existing["id"], "already uploaded"
    ctype = mimetypes.guess_type(filepath.name)[0] or "image/jpeg"
    media = api(site, "media", "POST", raw=filepath.read_bytes(), ctype=ctype, filename=filepath.name)
    return media["id"], "uploaded"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default="https://timelessresurfacing.com.au")
    ap.add_argument("--slug", help="only this post")
    ap.add_argument("--publish", action="store_true", help="status=publish (default: draft)")
    ap.add_argument("--images", help="folder of hero images to upload + set as featured")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    posts = [p for f in sorted(BLOG_DIR.glob("*.html")) if (p := parse_post(f))]
    if args.slug:
        posts = [p for p in posts if p["slug"] == args.slug]
    if not posts:
        die("no posts matched")

    for p in posts:
        status = "publish" if args.publish else "draft"
        if args.dry_run:
            print(f"DRY: would upsert '{p['slug']}' as {status}" +
                  (f" + hero {HERO_MAP.get(p['slug'])}" if args.images and p['slug'] in HERO_MAP else ""))
            continue
        payload = {"title": p["title"], "slug": p["slug"], "content": p["content"],
                   "excerpt": p["excerpt"], "status": status}
        if args.images and p["slug"] in HERO_MAP:
            hero = Path(args.images).expanduser() / HERO_MAP[p["slug"]]
            if hero.exists():
                mid, how = upload_media(args.site, hero, p["slug"])
                payload["featured_media"] = mid
                print(f"  hero {hero.name}: {how} (media id {mid})")
        existing = find_by_slug(args.site, "article", p["slug"])
        if existing:
            out = api(args.site, f"article/{existing['id']}", "POST", payload)
            print(f"UPDATED {p['slug']} (id {out['id']}, status {out['status']})")
        else:
            out = api(args.site, "article", "POST", payload)
            print(f"CREATED {p['slug']} (id {out['id']}, status {out['status']})")
    print("\nRemember: purge SpeedyCache + Cloudflare after publishing.")


if __name__ == "__main__":
    main()
