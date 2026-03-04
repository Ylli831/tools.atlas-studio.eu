"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function ImageToBase64Tool() {
  const t = useTranslations("tools.image-to-base64");
  const tc = useTranslations("common");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [rawBase64, setRawBase64] = useState("");
  const [dataUri, setDataUri] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setDataUri(result);
      setPreview(result);
      // Extract raw base64 from data URI (remove "data:image/...;base64,")
      const base64 = result.split(",")[1] || "";
      setRawBase64(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(tc("copied"));
    } catch {
      // fallback
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleReset = () => {
    setFileInfo(null);
    setRawBase64("");
    setDataUri("");
    setPreview(null);
  };

  return (
    <ToolLayout toolSlug="image-to-base64">
      <div className="space-y-6">
        <FileUpload
          accept="image/*"
          onFileSelect={handleFileSelect}
          preview={preview}
        />

        {fileInfo && (
          <>
            {/* File Info */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {t("file_info")}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("file_name")}</span>
                  <p className="text-foreground font-medium truncate">{fileInfo.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("file_size")}</span>
                  <p className="text-foreground font-medium">{formatSize(fileInfo.size)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("file_type")}</span>
                  <p className="text-foreground font-medium">{fileInfo.type}</p>
                </div>
              </div>
            </div>

            {/* Raw Base64 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">
                  {t("raw_base64")}
                </h3>
                <button
                  onClick={() => copyToClipboard(rawBase64)}
                  className="bg-teal text-white font-medium px-4 py-1.5 rounded-lg hover:bg-teal-hover transition-colors text-xs"
                >
                  {t("copy_base64")}
                </button>
              </div>
              <textarea
                readOnly
                value={rawBase64}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-teal h-28 resize-none"
              />
            </div>

            {/* Data URI */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground">
                  {t("data_uri")}
                </h3>
                <button
                  onClick={() => copyToClipboard(dataUri)}
                  className="bg-teal text-white font-medium px-4 py-1.5 rounded-lg hover:bg-teal-hover transition-colors text-xs"
                >
                  {t("copy_data_uri")}
                </button>
              </div>
              <textarea
                readOnly
                value={dataUri}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-teal h-28 resize-none"
              />
            </div>

            <button
              onClick={handleReset}
              className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
            >
              {tc("reset")}
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
