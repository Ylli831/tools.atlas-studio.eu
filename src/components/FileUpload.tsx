"use client";

import { useCallback, useState, useRef } from "react";
import { useTranslations } from "next-intl";

interface FileUploadProps {
  accept: string;
  maxSize?: number;
  multiple?: boolean;
  onFileSelect: (files: File[]) => void;
  preview?: string | null;
}

export default function FileUpload({
  accept,
  maxSize = 50 * 1024 * 1024,
  multiple = false,
  onFileSelect,
  preview,
}: FileUploadProps) {
  const t = useTranslations("common");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);

      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > maxSize) {
          setError(t("max_size", { size: `${Math.round(maxSize / 1024 / 1024)}MB` }));
          return;
        }
        validFiles.push(file);
      }
      onFileSelect(validFiles);
    },
    [maxSize, onFileSelect, t]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div>
      <div
        className={`drop-zone rounded-xl p-8 text-center cursor-pointer ${
          dragActive ? "active" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg object-contain"
            />
            <p className="text-sm text-muted-foreground">{t("upload_hint")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm font-medium text-foreground">{t("upload")}</p>
            <p className="text-xs text-muted-foreground">{t("upload_hint")}</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
