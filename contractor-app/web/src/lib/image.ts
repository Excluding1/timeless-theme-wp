// lib/image.ts — on-device photo compression before queueing. A phone camera shot is 3-12MB;
// resized to max 1600px JPEG it's ~300-500KB — uploads fast on bad site reception and stays far
// under the backend's size cap. Falls back to the original file if decoding fails.

const MAX_DIM = 1600;
const QUALITY = 0.82;

async function decode(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try { return await createImageBitmap(file); } catch { /* fall through to <img> */ }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
    img.src = url;
  });
}

export async function compressImage(file: Blob): Promise<{ blob: Blob; contentType: string }> {
  try {
    const img = await decode(file);
    const w = 'width' in img ? img.width : 0;
    const h = 'height' in img ? img.height : 0;
    if (!w || !h) throw new Error('no dimensions');

    const scale = Math.min(1, MAX_DIM / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    ctx.drawImage(img as CanvasImageSource, 0, 0, canvas.width, canvas.height);
    if ('close' in img) img.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
    if (!blob || blob.size === 0) throw new Error('toBlob failed');
    return { blob, contentType: 'image/jpeg' };
  } catch {
    // Keep the original — the backend caps size; better a big photo than a lost one.
    return { blob: file, contentType: file.type || 'image/jpeg' };
  }
}

/** Blob -> base64 (no data: prefix) for the JSON upload body. */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const s = String(reader.result ?? '');
      resolve(s.slice(s.indexOf(',') + 1));
    };
    reader.onerror = () => reject(new Error('read failed'));
    reader.readAsDataURL(blob);
  });
}
