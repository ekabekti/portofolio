"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

interface StorageUploaderProps {
  bucket: "profile-photos" | "project-images" | "certificate-badges" | "cv-files";
  value: string;
  onChange: (url: string) => void;
  label: string;
  accept: string;
  maxSizeMb: number;
}

export default function StorageUploader({
  bucket,
  value,
  onChange,
  label,
  accept,
  maxSizeMb,
}: StorageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Maksimal ${maxSizeMb}MB.`);
      return;
    }

    const validType = accept === "application/pdf"
      ? file.type === "application/pdf"
      : file.type.startsWith("image/");
    if (!validType) {
      setError("Tipe file tidak didukung.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Supabase belum dikonfigurasi.");
      return;
    }

    setUploading(true);
    const extension = file.name.split(".").pop() || "bin";
    const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="storage-uploader">
      <div className="storage-uploader__row">
        <span>{label}</span>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : value ? "Replace file" : "Choose file"}
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} hidden />
      </div>
      {value && <span className="storage-uploader__value">URL saved / {value.split("/").pop()}</span>}
      {error && <span className="storage-uploader__error">{error}</span>}
    </div>
  );
}
