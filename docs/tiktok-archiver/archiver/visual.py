"""Visual Scan — sample a video at scene changes and describe each keyframe.

Fully local & offline on macOS via Apple's Vision framework (no cloud, no torch):
 - on-screen TEXT via VNRecognizeTextRequest (TikTok captions / overlays)
 - what's SHOWING via VNClassifyImageRequest (scene/object tags) + face count

Frames are decoded with PyAV (no ffmpeg needed). We walk the video ~once per
second and only analyse a frame when it differs enough from the last analysed
one ("scan for new changes"), so static stretches are cheap.
"""
import difflib
import io

from . import db

VISUAL_DIR = db.DATA_DIR / "visual"

SAMPLE_EVERY = 2.0     # seconds between candidate frames
CHANGE_THRESH = 12     # mean abs diff (0-255, 32x32 gray) to count as a new scene
MAX_FRAMES = 40        # hard cap on analysed keyframes per video
MIN_TAG_CONF = 0.15    # drop low-confidence scene tags
MIN_OCR_CONF = 0.45    # drop low-confidence OCR lines (kills jittery garbage)
SAME_TEXT_RATIO = 0.6  # caption counted "unchanged" above this similarity
NO_CONTENT = "(no on-screen text or scene tags detected)"

_probe = None  # cache the availability check


def available():
    """True if Apple Vision + PyAV + Pillow are importable on this machine."""
    global _probe
    if _probe is None:
        try:
            import av  # noqa: F401
            import numpy  # noqa: F401
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
    m, s = divmod(int(seconds), 60)
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


def _analyse_image(img, Vision, Quartz):
    """Run OCR + classification + face count on one PIL image."""
    buf = io.BytesIO()
    img.save(buf, "PNG")
    data = buf.getvalue()
    cfdata = Quartz.CFDataCreate(None, data, len(data))
    src = Quartz.CGImageSourceCreateWithData(cfdata, None)
    cg = Quartz.CGImageSourceCreateImageAtIndex(src, 0, None)
    if cg is None:
        return "", []
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
    from PIL import Image
    import numpy as np

    container = av.open(str(media_path))
    stream = container.streams.video[0]
    stream.thread_type = "AUTO"
    tb = stream.time_base or stream.average_rate and (1 / stream.average_rate)
    duration = float(stream.duration * tb) if (stream.duration and tb) else None

    entries = []           # (timestamp, text, scene)
    last_small = None      # 32x32 gray array of the last analysed frame
    last_sample_t = None   # timestamp of the last frame we let through the gate
    synth_t = 0.0          # fallback clock for streams with no usable pts/timebase
    last_text = ""
    last_scene = None
    analysed = 0

    try:
        for frame in container.decode(stream):
            if analysed >= MAX_FRAMES:
                break
            if frame.pts is not None and tb:
                t = float(frame.pts * tb)
            else:                       # no presentation timestamp — use a synthetic clock
                t = synth_t
                synth_t += SAMPLE_EVERY
            t = max(t, 0.0)
            if last_sample_t is not None and t - last_sample_t < SAMPLE_EVERY:
                continue
            last_sample_t = t

            img = frame.to_image()
            small = np.asarray(img.convert("L").resize((32, 32)), dtype="int16")
            if last_small is not None:
                diff = float(np.abs(small - last_small).mean())
                if diff < CHANGE_THRESH:
                    continue  # too similar to the last keyframe — skip
            last_small = small

            text, scene = _analyse_image(img, Vision, Quartz)
            analysed += 1
            if progress_cb and duration:
                progress_cb(min(t / duration, 1.0))

            # collapse a caption that persists (with OCR jitter) across frames
            norm = " ".join(text.split()).lower()
            if norm:
                if difflib.SequenceMatcher(None, norm, last_text).ratio() >= SAME_TEXT_RATIO:
                    text = ""  # same caption still on screen — don't repeat it
                else:
                    last_text = norm
            # skip a frame that adds nothing new (no fresh text, same scene tags)
            if not text and scene == last_scene:
                continue
            last_scene = scene
            if text or scene:
                entries.append((t, text, scene))
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
