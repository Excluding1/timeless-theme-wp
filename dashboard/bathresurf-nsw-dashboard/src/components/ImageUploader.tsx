import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ImagePlus, X, Clipboard, ZoomIn } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Attachment } from '../lib/database';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

interface ImageUploaderProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  maxImages?: number;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createAttachment(url: string, name: string, type: string): Attachment {
  return {
    id: crypto.randomUUID(),
    url,
    name,
    type,
    created_at: new Date().toISOString(),
  };
}

export function ImageUploader({ attachments, onChange, maxImages = 10 }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const canAdd = attachments.length < maxImages;

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    if (file.size > MAX_FILE_SIZE) return;
    const url = await fileToBase64(file);
    const att = createAttachment(url, file.name, file.type);
    onChange([...attachments, att]);
  }, [attachments, onChange]);

  // File picker handler
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      await processFile(file);
    }
    // Reset input so re-selecting the same file triggers onChange
    e.target.value = '';
  }, [processFile]);

  // Clipboard paste handler — listens on the whole document when component is mounted
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!canAdd) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) await processFile(file);
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [canAdd, processFile]);

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        await processFile(file);
      }
    }
  }, [processFile]);

  const removeAttachment = useCallback((id: string) => {
    onChange(attachments.filter(a => a.id !== id));
  }, [attachments, onChange]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Attachments
        <span className="text-slate-400 font-normal ml-1">({attachments.length}/{maxImages})</span>
      </label>

      {/* Existing images */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {attachments.map(att => (
            <div key={att.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={att.url}
                alt={att.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setPreviewUrl(att.url)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewUrl(att.url)}
                className="absolute bottom-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Preview"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {canAdd && (
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
            dragging
              ? "border-[#0D9488] bg-[#0D9488]/5"
              : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <ImagePlus className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-600">
                  Drop images, click to browse, or paste from clipboard
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, GIF, WebP · Max 5 MB each</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Clipboard className="w-3 h-3" />
              <span>Tip: Screenshot then Ctrl+V to paste directly</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Fullscreen preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setPreviewUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/** Read-only image gallery for displaying attachments in cards/previews */
export function ImageGallery({ attachments, maxShow = 4 }: { attachments: Attachment[]; maxShow?: number }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  if (!attachments || attachments.length === 0) return null;

  const visible = attachments.slice(0, maxShow);
  const overflow = attachments.length - maxShow;

  return (
    <>
      <div className={cn(
        "grid gap-1.5 mt-2",
        visible.length === 1 ? "grid-cols-1" : "grid-cols-2"
      )}>
        {visible.map((att, i) => (
          <div
            key={att.id}
            className="relative aspect-video rounded-md overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer group"
            onClick={() => setPreviewUrl(att.url)}
          >
            <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
            {i === maxShow - 1 && overflow > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+{overflow}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setPreviewUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
