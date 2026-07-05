"""Visual Scan — read on-screen text + describe every part of a video.

Fully local & offline on macOS via Apple's Vision framework (no cloud, no torch):
 - on-screen TEXT via VNRecognizeTextRequest (TikTok captions / overlays)
 - what's SHOWING via VNClassifyImageRequest (scene/object tags) + face count

Frames are decoded with PyAV (no ffmpeg needed). We sample at a steady cadence
across the WHOLE clip (the frame budget is spread over the full duration) and
OCR every sample, so text that appears later in the video is never missed. The
OUTPUT is then de-duplicated: a line is emitted only when the on-screen text
meaningfully changes or the scene changes — so a persistent caption isn't
repeated, but a new/added caption always shows up with its timestamp.
"""
import difflib
import io
import re

from . import db

_DIGITS = re.compile(r"\d+")

VISUAL_DIR = db.DATA_DIR / "visual"

SAMPLE_EVERY = 1.5     # min seconds between sampled frames (denser = catches quick captions)
MAX_FRAMES = 60        # frame budget; on longer clips the interval stretches to still cover the end
MIN_TAG_CONF = 0.15    # drop low-confidence scene tags
MIN_OCR_CONF = 0.45    # drop low-confidence OCR lines (kills jittery garbage)
SAME_TEXT_RATIO = 0.85  # emit new text when it differs this much from the last emitted text
SCENE_SIM = 0.5        # emit a scene-only line when tag overlap drops below this
NO_CONTENT = "(no on-screen text or scene tags detected)"

_probe = None  # cache the availability check


def available():
    """True if Apple Vision + PyAV + Pillow are importable on this machine."""
    global _probe
    if _probe is None:
        try:
            import av  # noqa: F401
            import Vision  # noqa: F401
            import Quartz  # noqa: F401
            from PIL import Image  # noqa: F401
            _probe = (True, "")
        except Exception as e:  # pragma: no cover - platform dependent
            _probe = (False, str(e))
    return _probe[0]


def unavailable_reason():
    available()
    return _probe[1] or "Visual Scan needs macOS (Apple Vision) plus PyAV and Pillow."


def _fmt_ts(seconds):
    m, s = divmod(int(max(seconds, 0)), 60)
    return f"{m:02d}:{s:02d}"


def _keep_ocr(s):
    """Keep real overlay text; drop tiny single-word fragments and symbol soup.

    TikTok's auto-captions flash one blurry word at a time — those duplicate the
    Whisper transcript badly, so we require a phrase or a reasonably long token,
    plus a decent share of real letters/digits.
    """
    s = s.strip()
    if len(s) < 5 and len(s.split()) < 2:
        return False
    letters = sum(c.isalnum() or c.isspace() for c in s)
    return letters / len(s) >= 0.6 if s else False


def _scene_tags(scene):
    """Tag set for a scene string, ignoring the leading face count."""
    return frozenset(
        p.strip() for p in scene.split(",")
        if p.strip() and "face" not in p
    )


def _jaccard(a, b):
    if not a and not b:
        return 1.0
    union = a | b
    return len(a & b) / len(union) if union else 1.0


def _text_changed(norm, last):
    """True if `norm` is a meaningfully different caption than the last emitted one.

    A plain character-similarity ratio merges captions that differ in only a few
    characters — but a changed digit (price/phone/stat) or a changed leading word
    (before/after) IS the meaning. So force "changed" on those, then fall back to
    the ratio for reworded / OCR-jittered text.
    """
    if not norm:
        return False
    if not last:
        return True
    if _DIGITS.findall(norm) != _DIGITS.findall(last):
        return True
    nw, lw = norm.split(), last.split()
    if nw and lw and nw[0] != lw[0]:
        return True
    return difflib.SequenceMatcher(None, norm, last).ratio() < SAME_TEXT_RATIO


def _analyse_image(img, Vision, Quartz):
    """Run OCR + classification + face count on one PIL image."""
    buf = io.BytesIO()
    img.save(buf, "PNG")
    data = buf.getvalue()
    cfdata = Quartz.CFDataCreate(None, data, len(data))
    src = Quartz.CGImageSourceCreateWithData(cfdata, None)
    cg = Quartz.CGImageSourceCreateImageAtIndex(src, 0, None)
    if cg is None:
        return "", ""
    handler = Vision.VNImageRequestHandler.alloc().initWithCGImage_options_(cg, None)

    ocr = Vision.VNRecognizeTextRequest.alloc().init()
    ocr.setRecognitionLevel_(1)  # 1 = accurate
    ocr.setUsesLanguageCorrection_(True)
    cls = Vision.VNClassifyImageRequest.alloc().init()
    faces = Vision.VNDetectFaceRectanglesRequest.alloc().init()
    handler.performRequests_error_([ocr, cls, faces], None)

    text = " ".join(
        cand.string()
        for obs in (ocr.results() or [])
        for c in [obs.topCandidates_(1)]
        for cand in ([c[0]] if c else [])
        if cand.confidence() >= MIN_OCR_CONF and _keep_ocr(cand.string())
    ).strip()

    tags = [o.identifier().replace("_", " ")
            for o in (cls.results() or [])[:6]
            if o.confidence() >= MIN_TAG_CONF]

    n_faces = len(faces.results() or [])
    scene = ", ".join(tags)
    if n_faces:
        scene = (f"{n_faces} " + ("face" if n_faces == 1 else "faces")
                 + (", " + scene if scene else ""))
    return text, scene


def analyse(media_path, username, vid, progress_cb=None):
    """Return (visual_track_text, rel_path). Raises if Vision is unavailable."""
    if not available():
        raise RuntimeError(unavailable_reason())
    import av
    import Vision
    import Quartz

    container = av.open(str(media_path))
    stream = container.streams.video[0]
    stream.thread_type = "AUTO"
    tb = stream.time_base or (stream.average_rate and (1 / stream.average_rate))
    duration = float(stream.duration * tb) if (stream.duration and tb) else None

    # spread the frame budget across the WHOLE clip so the end is covered too.
    # divide by (MAX_FRAMES-1) so the last of the N samples lands at ~duration,
    # not one interval short (which would leave the final CTA un-scanned).
    interval = SAMPLE_EVERY
    if duration and duration > SAMPLE_EVERY * (MAX_FRAMES - 1):
        interval = duration / (MAX_FRAMES - 1)

    entries = []             # (timestamp, text, scene)
    last_sample_t = None
    synth_t = 0.0            # fallback clock for streams with no usable pts/timebase
    last_text = ""           # last EMITTED (normalised) text — for dedup
    last_scene_key = None    # last EMITTED scene tag-set
    analysed = 0

    try:
        for frame in container.decode(stream):
            if analysed >= MAX_FRAMES:
                break
            if frame.pts is not None and tb:
                t = float(frame.pts * tb)
            else:                       # no presentation timestamp — synthetic clock
                t = synth_t
                synth_t += interval
            t = max(t, 0.0)
            if last_sample_t is not None and t - last_sample_t < interval - 0.05:
                continue
            last_sample_t = t

            img = frame.to_image()
            text, scene = _analyse_image(img, Vision, Quartz)
            analysed += 1
            if progress_cb and duration:
                progress_cb(min(t / duration, 1.0))

            norm = " ".join(text.split()).lower()
            text_changed = _text_changed(norm, last_text)
            scene_key = _scene_tags(scene)
            scene_changed = bool(scene_key) and (
                last_scene_key is None or _jaccard(scene_key, last_scene_key) < SCENE_SIM
            )
            if text_changed or scene_changed:
                entries.append((t, text if text_changed else "", scene))
                if text_changed:
                    last_text = norm
                last_scene_key = scene_key
    finally:
        container.close()

    lines = []
    for t, text, scene in entries:
        parts = [f"[{_fmt_ts(t)}]"]
        if text:
            parts.append(f'text: "{text}"')
        if scene:
            parts.append(f"scene: {scene}")
        lines.append(" ".join(parts))
    # a real scan that finds nothing still counts as done — a non-empty sentinel
    # keeps has_visual/dedup/UI consistent (empty string reads as "never scanned")
    track = "\n".join(lines).strip() or NO_CONTENT

    outdir = VISUAL_DIR / username
    outdir.mkdir(parents=True, exist_ok=True)
    path = outdir / f"{vid}.txt"
    path.write_text(track + "\n", encoding="utf-8")
    return track, db.rel_path(path)
