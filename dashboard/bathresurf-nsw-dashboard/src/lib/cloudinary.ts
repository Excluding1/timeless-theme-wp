const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const ASSET_FOLDER = 'timeless-resurfacing';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Upload a file to Cloudinary using an unsigned preset.
 * Images are stored in the asset folder for organization.
 * Returns a permanent Cloudinary URL (not base64, not blob).
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!isCloudinaryConfigured) {
    console.warn('Cloudinary not configured — using local blob URL (not persistent)');
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', ASSET_FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error('Cloudinary upload error:', {
      status: res.status,
      cloud: CLOUD_NAME,
      preset: UPLOAD_PRESET,
      error: errorBody,
    });
    throw new Error(errorBody?.error?.message || `Cloudinary upload failed: ${res.status}`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

/**
 * Get Cloudinary URL for an already-uploaded image by public ID.
 */
export function getCloudinaryUrl(publicId: string, transforms?: string): string {
  if (!CLOUD_NAME) return publicId;
  const t = transforms ? `${transforms}/` : '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t}${publicId}`;
}
