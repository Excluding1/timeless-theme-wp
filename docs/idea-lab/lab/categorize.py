"""Fast keyword categorizer.

Runs over every idea locally (no LLM) so the whole ~16k-row corpus gets a
category the moment it's fetched — app vs physical vs product vs content etc.
The LLM polish pass can still refine an individual idea's category later; this
just guarantees the filter is never empty.

Order matters: the FIRST matching rule wins, so the list is arranged from most
specific/decisive signal to most generic (saas/other as the catch-alls).
"""
import re
import threading

from . import db

# Human-facing category slugs (what the filter shows) → the signal words.
# Kept broad and lowercase; matched against "title + description".
CATEGORY_RULES = [
    ("game", [
        "game", "gaming", "roblox", "unity3d", "unreal engine", "godot", "gamedev",
        "game engine", "multiplayer", "rpg", "roguelike", "puzzle game", "indie game",
        "steam game", "board game", "mobile game", "game jam", "pixel art game"]),
    ("fintech", [
        "fintech", "payments", "payment processing", "invoicing", "invoice", "billing",
        "accounting", "bookkeeping", "payroll", "banking", "neobank", "crypto", "bitcoin",
        "ethereum", "web3", "defi", "wallet", "lending", "loans", "mortgage", "insurance",
        "tax filing", "expense", "budgeting app", "trading", "stocks", "brokerage"]),
    ("ecommerce", [
        "shopify", "ecommerce", "e-commerce", "dropship", "dropshipping", "online store",
        "amazon fba", "fba seller", "etsy", "storefront", "wholesale", "print on demand",
        "print-on-demand", "sell physical", "product listings", "shopping cart",
        "d2c", "dtc brand", "merch", "apparel brand", "supplement brand"]),
    ("hardware", [
        "hardware", "iot device", "sensor", "wearable", "smartwatch", "robotics", "robot",
        "drone", "3d print", "3d-print", "gadget", "raspberry pi", "arduino", "circuit board",
        "prototype device", "manufactured", "physical device", "smart home device"]),
    ("physical-service", [
        "cleaning service", "plumbing", "resurfacing", "regrouting", "landscaping", "lawn care",
        "hvac", "painting service", "roofing", "handyman", "salon", "barber", "gym ",
        "fitness studio", "restaurant", "cafe", "food truck", "catering", "mobile mechanic",
        "auto repair", "pest control", "pool cleaning", "removalist", "moving company",
        "local service", "in-person", "trades business", "tradie", "on-site", "franchise",
        "brick and mortar", "brick-and-mortar", "detailing", "car wash", "childcare",
        "tutoring center", "dental", "physiotherapy", "veterinary"]),
    ("content", [
        "newsletter", "youtube channel", "faceless youtube", "faceless", "podcast",
        "blog", "content site", "media company", "substack", "creator economy",
        "online course", "cohort course", "info product", "digital course", "membership site",
        "affiliate site", "niche site", "tiktok account", "instagram page", "community"]),
    ("marketplace", [
        "marketplace", "two-sided", "two sided", "connects buyers", "connect buyers",
        "connects sellers", "gig economy", "gig marketplace", "booking platform",
        "directory of", "listings platform", "peer-to-peer", "peer to peer", "rental platform",
        "freelance marketplace", "job board"]),
    ("agency", [
        "agency", "done-for-you", "done for you", "freelance", "freelancing", "consultancy",
        "consulting", "we build", "we design", "outsourcing", "white label", "white-label",
        "productized service", "productised service", "studio for hire", "dev shop",
        "marketing agency", "seo agency", "growth agency"]),
    ("ai", [
        "ai ", " ai", "a.i.", "artificial intelligence", "machine learning", "deep learning",
        "llm", "gpt", "chatgpt", "chatbot", "computer vision", "generative", "neural network",
        "ai agent", "ai-powered", "ai powered", "copilot", "prompt", "rag ", "embeddings",
        "transcription", "speech-to-text", "text-to-speech", "image generation", "stable diffusion"]),
    ("dev-tool", [
        "developer tool", "dev tool", "sdk", "api for", "rest api", "cli tool", "framework",
        "open source", "open-source", "self-host", "self host", "devops", "ci/cd", "kubernetes",
        "docker", "database", "observability", "monitoring tool", "logging", "webhooks",
        "boilerplate", "code generator", "npm package", "library for"]),
    ("saas", [
        "saas", "software as a service", "dashboard", "crm", "erp", "management software",
        "management tool", "automation", "workflow", "b2b software", "subscription software",
        "analytics platform", "tracker", "web app", "platform for", "tool for", "app for",
        "scheduling", "project management", "team collaboration", "help desk", "helpdesk",
        "email marketing", "landing page builder", "form builder", "no-code", "no code"]),
]

_LABELS = [c for c, _ in CATEGORY_RULES] + ["other"]

# precompile: for each category, one regex that matches any of its phrases as
# whole-ish tokens (word boundaries where the phrase is alphanumeric).
_COMPILED = []
for cat, words in CATEGORY_RULES:
    parts = []
    for w in words:
        w = w.strip()
        if not w:
            continue
        # \b only works around word chars; for phrases with spaces/punctuation just escape.
        core = re.escape(w)
        if re.match(r"^[a-z0-9]", w) and re.search(r"[a-z0-9]$", w):
            parts.append(rf"\b{core}\b")
        else:
            parts.append(core)
    _COMPILED.append((cat, re.compile("|".join(parts), re.I)))


def classify(title, description=""):
    """Return the best-guess category slug for one idea."""
    text = f"{title or ''} {description or ''}"
    for cat, rx in _COMPILED:
        if rx.search(text):
            return cat
    return "other"


_state = {"running": False, "done": 0, "total": 0}
_lock = threading.Lock()


def status():
    with _lock:
        return dict(_state)


def categorize_all(only_missing=True):
    """Assign a category to ideas. Returns the number updated. only_missing keeps
    LLM-refined categories intact and only fills the blanks."""
    rows = db.uncategorized_ideas() if only_missing else \
        [{"id": r["id"], "title": r["title"], "description": r.get("description")}
         for r in db.ideas(limit=1000000)]
    pairs = [(r["id"], classify(r["title"], r.get("description"))) for r in rows]
    return db.bulk_set_categories(pairs)


def categorize_all_bg(only_missing=True):
    """Background sweep so a 16k-row classify never blocks the request."""
    with _lock:
        if _state["running"]:
            return False
        _state.update(running=True, done=0, total=0)

    def go():
        try:
            rows = db.uncategorized_ideas() if only_missing else \
                [{"id": r["id"], "title": r["title"], "description": r.get("description")}
                 for r in db.ideas(limit=1000000)]
            with _lock:
                _state["total"] = len(rows)
            pairs = [(r["id"], classify(r["title"], r.get("description"))) for r in rows]
            db.bulk_set_categories(pairs)
            with _lock:
                _state["done"] = len(pairs)
        finally:
            with _lock:
                _state["running"] = False

    threading.Thread(target=go, daemon=True).start()
    return True
