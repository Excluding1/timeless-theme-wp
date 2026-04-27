# Day 3 Task D — Cloudflare + .htaccess Cache Configuration

**Goal:** make Cloudflare actually cache assets so visitors don't all hammer your VentraIP origin.

**Current state (verified by curl):**
- HTML pages: `cf-cache-status: DYNAMIC` (every request goes to origin)
- CSS / JS / fonts / images: `cf-cache-status: BYPASS` (every visitor downloads fresh)
- Origin sends `cache-control: no-store, private` + `expires: 1984` which tells Cloudflare "don't cache"

**After this task:**
- HTML cached at Cloudflare edge for 30 minutes
- Static assets (CSS / JS / fonts / images / WebP) cached for 1 year
- Cache invalidation handled automatically by our `?v=filemtime` query strings on every theme asset URL

---

## Two-step fix

There are TWO layers to configure. Both are required.

### Step 1: Upload `.htaccess` to the live site (~5 min)

This fixes the origin (VentraIP) headers so Cloudflare and browsers BOTH start caching properly.

1. **Open VentraIP cPanel** → File Manager → navigate to the WordPress root (where `wp-config.php` lives — usually `public_html/`)
2. Make sure "Show Hidden Files" is enabled (cPanel → File Manager → Settings → "Show Hidden Files (dotfiles)")
3. Find the existing `.htaccess` file → click → Edit (or download a backup first)
4. Look for the WordPress block — it's wrapped between `# BEGIN WordPress` and `# END WordPress`. **Don't modify that.**
5. Open `htaccess-security.txt` from this repo (Angela's Downloads folder when zipped) — copy ALL of its contents
6. **Paste it ABOVE the `# BEGIN WordPress` line** in `.htaccess`
7. Save

**Verify Step 1 worked:**
```bash
# Run from your laptop terminal:
curl -sI https://timelessresurfacing.com.au/wp-content/themes/timeless-theme-wp/assets/main.min.css | grep -iE "cache|expires"
```

Expected output:
```
cache-control: max-age=2592000           ← was "no-store"
expires: <some date 1 month from now>    ← was "1984"
```

If you still see `no-store` / `1984`, the .htaccess didn't take effect — common causes: wrong file location, syntax error breaks the file (try removing chunks until it works), or Apache `mod_expires` not enabled (rare on VentraIP — contact support if so).

### Step 2: Cloudflare Cache Rules (~10 min)

Even with origin headers fixed, Cloudflare needs to be told to cache HTML aggressively. Free plan supports this via **Cache Rules**.

#### Open Cloudflare dashboard
1. Log in: https://dash.cloudflare.com
2. Click the **timelessresurfacing.com.au** zone
3. Left sidebar → **Caching** → **Cache Rules**
4. Click **"+ Create rule"**

#### Rule 1: Cache HTML pages for 30 minutes

| Field | Value |
|---|---|
| Rule name | `Cache HTML pages` |
| When incoming requests match | Custom filter expression |
| Field | `URI Path` |
| Operator | `does not start with` |
| Value | `/wp-admin` |
| **AND** | (click "+ AND") |
| Field | `URI Path` |
| Operator | `does not contain` |
| Value | `wp-login.php` |
| **AND** | (click "+ AND") |
| Field | `URI Query String` |
| Operator | `does not contain` |
| Value | `s=` |
| Then... | |
| Cache eligibility | **Eligible for cache** |
| Edge TTL | Override origin: **30 minutes** |
| Browser TTL | Override origin: **30 seconds** (so updates show fast on reload) |

Click **Deploy**.

**Why these settings:**
- 30 min edge TTL = visitors share the same cached copy for 30 min, then origin gets one fresh fetch
- 30 sec browser TTL = if a user hits refresh within 30 sec, the browser uses its own cache; longer = users see stale content too long
- Skip wp-admin / wp-login / search to keep dynamic admin/search behavior intact

#### Rule 2: Cache static assets for 1 year

| Field | Value |
|---|---|
| Rule name | `Cache static assets` |
| When incoming requests match | Custom filter expression |
| Field | `URI Path` |
| Operator | `matches regex` |
| Value | `\.(css\|js\|woff2?\|ttf\|otf\|jpe?g\|png\|gif\|svg\|webp\|ico\|pdf)$` |
| Then... | |
| Cache eligibility | **Eligible for cache** |
| Edge TTL | Override origin: **1 year** |
| Browser TTL | Override origin: **1 year** |
| Respect Strong ETags | Off (we don't use them) |

Click **Deploy**.

**Why 1 year:** every static asset URL has a `?v=<filemtime>` query string. When you update a file, the URL changes, so browsers + Cloudflare fetch fresh. Old URLs cache forever (no harm, never accessed again).

#### Rule 3 (optional): Bypass cache for logged-in users

Already handled by Cloudflare's default behavior with WordPress cookies — when a user is logged in (cookie `wordpress_logged_in_*` is present), Cloudflare automatically bypasses cache. No rule needed.

If you want to be extra-explicit:

| Field | Value |
|---|---|
| Rule name | `Bypass logged-in users` |
| Field | `Cookie` |
| Operator | `contains` |
| Value | `wordpress_logged_in` |
| Then... | |
| Cache eligibility | **Bypass cache** |

#### Place the rules in the right order

Cloudflare evaluates rules top-to-bottom and stops at the first match. So:

1. Bypass logged-in (if you added it) — most specific, top
2. Cache static assets — by extension
3. Cache HTML pages — broadest

Drag-and-drop rules in the dashboard if needed.

### Step 3: Force a Cache Purge

After both steps, force Cloudflare to drop everything currently cached so the new rules take effect:

1. Cloudflare dashboard → **Caching** → **Configuration**
2. **"Purge Everything"** button → confirm

This is a one-time reset. Going forward, cache invalidates naturally based on TTL.

---

## Verification (after Steps 1 + 2 + 3)

Run these from your laptop:

```bash
# Fresh request (warms the cache)
curl -sI https://timelessresurfacing.com.au/ -o /dev/null

# Second request — should now show HIT
curl -sI https://timelessresurfacing.com.au/ | grep -i cf-cache-status
# Expected: cf-cache-status: HIT     (was: DYNAMIC)

# Static asset
curl -sI https://timelessresurfacing.com.au/wp-content/themes/timeless-theme-wp/assets/main.min.css -o /dev/null
curl -sI https://timelessresurfacing.com.au/wp-content/themes/timeless-theme-wp/assets/main.min.css | grep -iE "cf-cache-status|cache-control"
# Expected: cf-cache-status: HIT
#           cache-control: max-age=31536000  (1 year)
```

If you see HITs on both — task complete.

---

## Performance impact (expected)

| Metric | Before | After |
|---|---|---|
| TTFB (Time to First Byte) for repeat visitors | ~500-800ms (origin hit) | **~50-100ms (CF edge)** |
| Asset load (cold visitor, second-page navigation) | full re-download every navigation | **0 bytes (browser cache hit)** |
| Origin server load | every request | **~1 fresh fetch per asset per 30 min** |
| GTmetrix / Lighthouse "Serve static assets with efficient cache policy" | Failing | **Passing** |

---

## Rollback (if anything breaks)

- **Step 1 rollback**: edit `.htaccess` on cPanel → remove the block you added → save
- **Step 2 rollback**: Cloudflare → Caching → Cache Rules → toggle each rule OFF (or delete)
- **Step 3 rollback**: Cache will rebuild naturally from origin, no action needed

---

## When to re-run "Purge Everything"

Anytime you upload a new theme zip and want changes to show IMMEDIATELY (rather than waiting up to 30 min for the HTML cache to expire):

Cloudflare dashboard → Caching → Configuration → **Purge Everything**

You don't need to do this for every theme update — only when you want updates visible right now (e.g., testing a fix on production).
