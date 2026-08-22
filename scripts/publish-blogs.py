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
import argparse, base64, datetime, json, mimetypes, re, sys, urllib.request, urllib.parse
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BLOG_DIR = REPO / "docs/content/blog"
SECRET = REPO / ".secrets/wp-app-password.key"

# Publish order. Posts go live spaced days apart, not all at once: ten articles
# stamped with the same timestamp reads as a content dump to a reader and to Google,
# and it wastes the freshness signal that a steady cadence buys. Allan's call,
# 2026-08-22. Index here = position in the run; the spacing is --spacing-days apart,
# counting BACKWARDS from today so the newest post is today and the rest are dated
# behind it. Anything absent from this list falls to the end of the order.
# ONLY these ship. The folder holds ten HTML files; five are finished and Rule-8 passed,
# the rest are unaudited July drafts. Globbing the folder would have published all ten,
# including drafts nobody has read. Allan's instruction, 2026-08-23: post these five and
# nothing else. Adding a slug here is a deliberate act — do it only after the article
# scores >=85 with no BLOCKED line and has had a Rule 8 pass.
READY = [
    "bathroom-resurfacing-rental-property",
    "mouldy-shower-grout-fix",
    "cracked-bath-basin-repair",
    "can-you-paint-bathroom-tiles",
    "why-is-my-bathtub-peeling",
]

PUBLISH_ORDER = [
    "bathroom-resurfacing-rental-property",
    "mouldy-shower-grout-fix",
    "cracked-bath-basin-repair",
    "can-you-paint-bathroom-tiles",
    "why-is-my-bathtub-peeling",
    "leaking-shower-repair-without-removing-tiles",
    "regrout-or-retile-shower",
    "how-long-does-bath-resurfacing-last",
    "bathtub-chip-repair",
    "resurface-or-replace-bathtub",
]

HERO_MAP = {
    "cracked-bath-basin-repair": "cover-crack.jpg",
    "can-you-paint-bathroom-tiles": "cover-paint-tiles.jpg",
    "resurface-or-replace-bathtub": "cover-resurface-or-replace.jpg",
    "how-long-does-bath-resurfacing-last": "hero-how-long-resurfacing-lasts.jpg",
    "regrout-or-retile-shower": "hero-regrout-or-retile.jpg",
    "why-is-my-bathtub-peeling": "cover-peeling-bathtub.jpg",
    "bathtub-chip-repair": "hero-chip-repair.jpg",
    "mouldy-shower-grout-fix": "cover-mould.jpg",
    "bathroom-resurfacing-rental-property": "cover-rental-property.jpg",
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



# Body images. --images only ever uploaded the HERO covers, so every <img> and every
# before_after slider inside an article pointed at /wp-content/uploads/2026/07/... on the
# assumption someone had put them there by hand. On 2026-08-23 a dry run against live found
# all 24 of them returning 404. Uploading and then REWRITING the body to the URL WordPress
# actually returns is the only version that cannot drift: WP files uploads by the current
# month, so a hard-coded 2026/07 path is wrong the moment the month turns.
IMG_SEARCH = ["images/blog", "images/gallery", "images/services", "images/homepage",
              "images/about", "docs/templates/quote-generator/photos"]

def find_local_image(name):
    for d in IMG_SEARCH:
        for path in (REPO / d).rglob(name):
            return path
    return None


def upload_body_images(site, post, cache):
    """Upload every image the body references and rewrite it to the live URL."""
    body = post["content"]
    names = set(re.findall(r'(?:src|before|after)="[^"]*/wp-content/uploads/[^"]*?/([^"/]+\.(?:jpg|jpeg|png|webp))"', body))
    if not names:
        return body, []
    report = []
    for name in sorted(names):
        if name in cache:
            url = cache[name]; how = "reused"
        else:
            local = find_local_image(name)
            if not local:
                report.append((name, "NOT FOUND ON DISK — left as-is"))
                continue
            existing = find_by_slug(site, "media", local.stem)
            if existing:
                url = existing["source_url"]; how = "already on site"
            else:
                ctype = mimetypes.guess_type(local.name)[0] or "image/jpeg"
                media = api(site, "media", "POST", raw=local.read_bytes(), ctype=ctype, filename=local.name)
                url = media["source_url"]; how = "uploaded"
            cache[name] = url
        body = re.sub(r'([^"]*/wp-content/uploads/[^"]*?)' + re.escape(name), url, body)
        report.append((name, how))
    return body, report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default="https://timelessresurfacing.com.au")
    ap.add_argument("--slug", help="only this post")
    ap.add_argument("--publish", action="store_true", help="status=publish (default: draft)")
    ap.add_argument("--images", help="folder of hero images to upload + set as featured")
    ap.add_argument("--all", action="store_true",
                    help="ignore the READY list and process every file in the folder")
    ap.add_argument("--spacing-days", type=int, default=3,
                    help="days between consecutive posts' publish dates (default 3, 0 = leave dates alone)")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    posts = [p for f in sorted(BLOG_DIR.glob("*.html")) if (p := parse_post(f))]

    # Gate on READY before anything else, unless --all is passed explicitly.
    if not args.all:
        held = sorted({p["slug"] for p in posts} - set(READY))
        posts = [p for p in posts if p["slug"] in READY]
        if held:
            print(f"HELD BACK ({len(held)} not in READY): " + ", ".join(held))

    if args.slug:
        if not args.all and args.slug not in READY:
            die(f"'{args.slug}' is not in READY. Add it there first, or pass --all.")
        posts = [p for p in posts if p["slug"] == args.slug]
    if not posts:
        die("no posts matched")

    # Guard against a half-finished READY list silently publishing fewer than expected.
    missing = sorted(set(READY) - {p["slug"] for p in posts})
    if missing and not args.slug:
        die("READY names articles with no source file: " + ", ".join(missing))

    seen = {}
    for p in posts:
        if p["slug"] in seen:
            die(f"duplicate slug in the folder: {p['slug']}")
        seen[p["slug"]] = True
    print(f"PUBLISHING {len(posts)} article(s)\n")
    media_cache = {}

    def order_index(slug):
        return PUBLISH_ORDER.index(slug) if slug in PUBLISH_ORDER else len(PUBLISH_ORDER)

    posts.sort(key=lambda x: order_index(x["slug"]))
    last = max((order_index(x["slug"]) for x in posts), default=0)

    for p in posts:
        status = "publish" if args.publish else "draft"
        stamp = None
        if args.spacing_days:
            # UTC, not this machine's clock. The live site runs on UTC (gmt_offset 0) while
            # the Mac is AEST, so dates generated locally arrived 10 hours ahead of the site's
            # own time. On 2026-08-23 that put the newest post in WordPress's future and it
            # was silently SCHEDULED rather than published — four articles went live and the
            # fifth quietly did not, which is exactly the kind of failure nobody notices.
            #
            # An hour back from the top of the current UTC hour, so the newest post is always
            # unambiguously in the past no matter what time of day this runs. The old code
            # pinned 09:30 to "read more naturally", which breaks for anyone publishing
            # before 09:30.
            back = (last - order_index(p["slug"])) * args.spacing_days
            when = (datetime.datetime.utcnow().replace(minute=0, second=0, microsecond=0)
                    - datetime.timedelta(hours=1, days=back))
            stamp = when.isoformat()
        if args.dry_run:
            print(f"DRY: would upsert '{p['slug']}' as {status}" +
                  (f" dated {stamp[:10]}" if stamp else "") +
                  (f" + hero {HERO_MAP.get(p['slug'])}" if args.images and p['slug'] in HERO_MAP else ""))
            continue
        body, img_report = upload_body_images(args.site, p, media_cache)
        for name, how in img_report:
            print(f"  img {name}: {how}")
        payload = {"title": p["title"], "slug": p["slug"], "content": body,
                   "excerpt": p["excerpt"], "status": status}
        if stamp:
            # Send both. WordPress decides future-vs-publish on date_gmt; sending only
            # `date` lets it derive a gmt value that can land in the future.
            payload["date"] = stamp
            payload["date_gmt"] = stamp
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
            if out["status"] == "future":
                print(f"  !! {p['slug']} is SCHEDULED, not published — its date is in the site's future")
        else:
            out = api(args.site, "article", "POST", payload)
            print(f"CREATED {p['slug']} (id {out['id']}, status {out['status']})")
            if out["status"] == "future":
                print(f"  !! {p['slug']} is SCHEDULED, not published — its date is in the site's future")
    print("\nRemember: purge SpeedyCache + Cloudflare after publishing.")


if __name__ == "__main__":
    main()
