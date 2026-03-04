"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function ImageMetadataRemoverTool() {
  const t = useTranslations("tools.image-metadata-remover");
  const tc = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [cleanSize, setCleanSize] = useState(0);
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cleanFileName, setCleanFileName] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const stripMetadata = useCallback(
    async (imageFile: File) => {
      setProcessing(true);

      try {
        const bitmap = await createImageBitmap(imageFile);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();

        // Determine output type
        const isJpeg =
          imageFile.type === "image/jpeg" || imageFile.type === "image/jpg";
        const outputType = isJpeg ? "image/jpeg" : "image/png";
        const quality = isJpeg ? 0.95 : undefined;

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, outputType, quality)
        );

        if (!blob) return;

        if (cleanUrl) URL.revokeObjectURL(cleanUrl);

        const url = URL.createObjectURL(blob);
        setCleanUrl(url);
        setCleanSize(blob.size);

        const ext = isJpeg ? "jpg" : "png";
        const baseName = imageFile.name.replace(/\.[^.]+$/, "");
        setCleanFileName(`${baseName}-clean.${ext}`);
      } catch {
        // Error processing
      } finally {
        setProcessing(false);
      }
    },
    [cleanUrl]
  );

  const handleFileSelect = useCallback(
    (files: File[]) => {
      const selectedFile = files[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCleanUrl(null);
      setCleanSize(0);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      // Strip metadata
      stripMetadata(selectedFile);
    },
    [stripMetadata]
  );

  const handleDownload = () => {
    if (!cleanUrl) return;
    const a = document.createElement("a");
    a.href = cleanUrl;
    a.download = cleanFileName;
    a.click();
  };

  const handleReset = () => {
    if (cleanUrl) URL.revokeObjectURL(cleanUrl);
    setFile(null);
    setPreview(null);
    setOriginalSize(0);
    setCleanSize(0);
    setCleanUrl(null);
    setCleanFileName("");
  };

  return (
    <ToolLayout toolSlug="image-metadata-remover">
      <div className="space-y-6">
        <FileUpload
          accept="image/*"
          onFileSelect={handleFileSelect}
          preview={preview}
        />

        {processing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t("processing")}
          </div>
        )}

        {file && cleanUrl && !processing && (
          <>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("original_size")}
                  </span>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {formatSize(originalSize)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t("clean_size")}
                  </span>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {formatSize(cleanSize)}
                  </p>
                </div>
              </div>
              {originalSize > cleanSize && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-teal">
                    {formatSize(originalSize - cleanSize)} of metadata removed
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("download_clean")}
              </button>
              <button
                onClick={handleReset}
                className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {tc("reset")}
              </button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
