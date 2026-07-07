"""faster-whisper transcription. Model is loaded lazily and cached per size."""
import threading

from . import db

TRANSCRIPTS_DIR = db.DATA_DIR / "transcripts"

MODEL_CHOICES = ("tiny", "base", "small", "medium", "large-v3")


class Cancelled(Exception):
    """Raised when a Stop is requested mid-transcription so the batch can bail out."""


_model = None
_model_size = None
_model_lock = threading.Lock()


def _get_model(size):
    global _model, _model_size
    from faster_whisper import WhisperModel  # deferred import: heavy
    with _model_lock:
        if _model is None or _model_size != size:
            _model = WhisperModel(size, device="cpu", compute_type="int8")
            _model_size = size
        return _model


def _fmt_ts(seconds):
    ms = int(round(max(seconds, 0) * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def transcribe(media_path, subdir, vid, size=None, language=None,
               progress_cb=None, should_cancel=None):
    """Transcribe a media file → (text, txt_path, srt_path). Paths are DATA_DIR-relative.

    subdir: "<platform>/<username>" folder the .txt/.srt are written under.
    should_cancel: optional callable checked between segments; if it returns True
    the transcription is abandoned (raises Cancelled) so Stop works mid-video.
    """
    size = size or db.get_setting("whisper_model") or "base"
    if size not in MODEL_CHOICES:
        size = "base"
    if language is None:
        language = db.get_setting("language")
    language = None if (not language or language == "auto") else language

    model = _get_model(size)
    segments, info = model.transcribe(str(media_path), language=language, vad_filter=True)

    outdir = TRANSCRIPTS_DIR / subdir
    outdir.mkdir(parents=True, exist_ok=True)

    lines, srt_blocks = [], []
    n = 0
    for seg in segments:  # generator — transcription happens as we iterate
        if should_cancel and should_cancel():
            raise Cancelled()
        text = seg.text.strip()
        if not text:
            continue
        n += 1
        lines.append(text)
        srt_blocks.append(f"{n}\n{_fmt_ts(seg.start)} --> {_fmt_ts(seg.end)}\n{text}\n")
        if progress_cb and info.duration:
            progress_cb(min(seg.end / info.duration, 1.0))

    text = "\n".join(lines).strip()
    txt_path = outdir / f"{vid}.txt"
    srt_path = outdir / f"{vid}.srt"
    txt_path.write_text(text + "\n", encoding="utf-8")
    srt_path.write_text("\n".join(srt_blocks) + ("\n" if srt_blocks else ""), encoding="utf-8")
    return text, db.rel_path(txt_path), db.rel_path(srt_path)
