"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Bucket = "profile-photos" | "project-images" | "certificate-badges" | "cv-files";

export interface CropAspect {
  label: string;
  value: number | null;
}

interface StorageUploaderProps {
  bucket: Bucket;
  value: string;
  onChange: (url: string) => void;
  label: string;
  accept: string;
  maxSizeMb: number;
  aspects?: CropAspect[];
}

const DEFAULT_ASPECTS: Record<Bucket, CropAspect[]> = {
  "profile-photos": [{ label: "1 : 1", value: 1 }],
  "certificate-badges": [{ label: "1 : 1", value: 1 }],
  "project-images": [
    { label: "16 : 10", value: 16 / 10 },
    { label: "16 : 9", value: 16 / 9 },
    { label: "4 : 3", value: 4 / 3 },
    { label: "Bebas", value: null },
  ],
  "cv-files": [],
};

function outputMimeFor(inputType: string) {
  if (inputType === "image/png" || inputType === "image/webp") return inputType;
  return "image/jpeg";
}

function extensionFor(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

async function cropToBlob(image: HTMLImageElement, crop: PixelCrop, mime: string) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(crop.width * scaleX));
  canvas.height = Math.max(1, Math.round(crop.height * scaleY));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser tidak mendukung canvas.");
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.92));
  if (!blob) throw new Error("Gagal memproses hasil crop.");
  return blob;
}

export default function StorageUploader({
  bucket,
  value,
  onChange,
  label,
  accept,
  maxSizeMb,
  aspects,
}: StorageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previewUrlRef = useRef("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const resolvedAspects = aspects ?? DEFAULT_ASPECTS[bucket];
  const [activeAspect, setActiveAspect] = useState<number | null>(resolvedAspects[0]?.value ?? null);

  const closeCropper = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
    setPreviewUrl("");
    setPendingFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (inputRef.current) inputRef.current.value = "";
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pendingFile) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCropper();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [pendingFile, closeCropper]);

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number | null) {
    if (aspect == null) {
      return centerCrop({ unit: "%", x: 5, y: 5, width: 90, height: 90 }, mediaWidth, mediaHeight);
    }
    return centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
      mediaWidth,
      mediaHeight,
    );
  }

  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget;
    setCrop(centerAspectCrop(width, height, activeAspect));
  }

  function changeAspect(next: number | null) {
    setActiveAspect(next);
    const img = imgRef.current;
    if (img?.width && img?.height) setCrop(centerAspectCrop(img.width, img.height, next));
  }

  async function uploadBlob(blob: Blob, filename: string, mime: string) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
    const path = `${crypto.randomUUID()}-${filename}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, blob, {
      cacheControl: "3600",
      contentType: mime,
      upsert: false,
    });
    if (uploadError) throw new Error(uploadError.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Maksimal ${maxSizeMb}MB.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const isPdfFlow = accept === "application/pdf";
    const validType = isPdfFlow ? file.type === "application/pdf" : file.type.startsWith("image/");
    if (!validType) {
      setError("Tipe file tidak didukung.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (isPdfFlow || resolvedAspects.length === 0) {
      void uploadDirect(file);
      return;
    }

    setActiveAspect(resolvedAspects[0]?.value ?? null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = URL.createObjectURL(file);
    setPreviewUrl(previewUrlRef.current);
    setPendingFile(file);
  }

  async function uploadDirect(file: File) {
    setUploading(true);
    try {
      const url = await uploadBlob(file, file.name, file.type || "application/octet-stream");
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function confirmCrop() {
    const img = imgRef.current;
    if (!pendingFile || !img) return;
    if (!completedCrop || completedCrop.width < 2 || completedCrop.height < 2) {
      setError("Pilih area crop terlebih dahulu.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const mime = outputMimeFor(pendingFile.type);
      const blob = await cropToBlob(img, completedCrop, mime);
      const baseName = pendingFile.name.replace(/\.[^.]+$/, "") || "image";
      const url = await uploadBlob(blob, `${baseName}-cropped.${extensionFor(mime)}`, mime);
      onChange(url);
      closeCropper();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Crop gagal.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="storage-uploader">
      <div className="storage-uploader__row">
        <span>{label}</span>
        <button ref={triggerRef} type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : value ? "Replace file" : "Choose file"}
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} hidden />
      </div>
      {value && <span className="storage-uploader__value">URL saved / {value.split("/").pop()}</span>}
      {error && !pendingFile && <span className="storage-uploader__error">{error}</span>}

      {pendingFile && (
        <div className="crop-modal" role="dialog" aria-modal="true" aria-label={`Crop ${label}`}>
          <div className="crop-modal__card">
            <div className="crop-modal__header">
              <div>
                <span className="mono-label">Crop selection</span>
                <h3>Atur area gambar</h3>
              </div>
              <button ref={closeRef} type="button" className="crop-modal__close" onClick={closeCropper} aria-label="Batalkan crop">
                ✕
              </button>
            </div>

            {resolvedAspects.length > 1 && (
              <div className="crop-modal__aspects" role="group" aria-label="Rasio crop">
                {resolvedAspects.map((aspect) => (
                  <button
                    key={aspect.label}
                    type="button"
                    className={activeAspect === aspect.value ? "is-active" : ""}
                    onClick={() => changeAspect(aspect.value)}
                  >
                    {aspect.label}
                  </button>
                ))}
              </div>
            )}

            <div className="crop-modal__canvas">
              {previewUrl && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, nextCrop) => setCrop(nextCrop)}
                  onComplete={(nextCrop) => setCompletedCrop(nextCrop)}
                  aspect={activeAspect ?? undefined}
                  minWidth={32}
                  minHeight={32}
                >
                  {/* Object URL crop preview: next/image cannot optimize blob URLs */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imgRef} src={previewUrl} alt="Pratinjau crop" onLoad={onImageLoad} />
                </ReactCrop>
              )}
            </div>

            {error && <span className="storage-uploader__error">{error}</span>}

            <div className="crop-modal__footer">
              <span className="crop-modal__hint">Seret untuk memilih area, geser sudut untuk resize.</span>
              <div className="crop-modal__actions">
                <button type="button" className="button button--outline" onClick={closeCropper} disabled={uploading}>
                  Batal
                </button>
                <button type="button" className="button button--primary" onClick={() => void confirmCrop()} disabled={uploading}>
                  <span>{uploading ? "Mengupload…" : "Crop & Upload"}</span>
                  <span className="button__arrow" aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
