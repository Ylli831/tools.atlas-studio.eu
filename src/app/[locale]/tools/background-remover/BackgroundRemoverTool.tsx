"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function BackgroundRemoverTool() {
  const t = useTranslations("tools.background-remover");
  const tc = useTranslations("common");
  const [preview, setPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Clean up previous object URLs
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setPreview(URL.createObjectURL(file));
    setResultUrl(null);
    setError(null);
    setProcessing(true);
    setProgress(t("first_time"));

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setProgress(t("processing"));

      const blob = await removeBackground(file, {
        model: "isnet_fp16",
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            if (key.startsWith("fetch:")) {
              setProgress(`${t("downloading_model")} ${pct}%`);
            } else {
              setProgress(`${t("processing")} ${pct}%`);
            }
          }
        },
      });

      setResultUrl(URL.createObjectURL(blob));
      setError(null);
    } catch (err) {
      console.error("Background removal failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setProcessing(false);
    }
  }, [t, preview, resultUrl]);

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "no-background.png";
    a.click();
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setPreview(null);
    setResultUrl(null);
    setError(null);
    setProcessing(false);
    setProgress("");
  };

  return (
    <ToolLayout toolSlug="background-remover">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">{t("max_size_warning")}</p>

        <FileUpload
          accept="image/*"
          onFileSelect={handleFileSelect}
          maxSize={10 * 1024 * 1024}
          preview={preview}
        />

        {processing && (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{progress}</p>
          </div>
        )}

        {error && !processing && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-sm font-medium text-red-800 mb-2">{tc("error")}</p>
            <p className="text-xs text-red-600 mb-4 break-words">{error}</p>
            <button
              onClick={reset}
              className="text-sm bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              {t("try_again") || "Try again"}
            </button>
          </div>
        )}

        {resultUrl && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preview && (
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Original</p>
                  <img
                    src={preview}
                    alt="Original"
                    className="max-h-64 mx-auto rounded-lg object-contain"
                  />
                </div>
              )}
              <div
                className="rounded-xl p-4 text-center border border-border"
                style={{
                  background:
                    "repeating-conic-gradient(#e5e2dc 0% 25%, white 0% 50%) 50% / 16px 16px",
                }}
              >
                <p className="text-xs text-muted-foreground mb-2">Result</p>
                <img
                  src={resultUrl}
                  alt="No background"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={download}
                className="flex-1 bg-teal text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("download")}
              </button>
              <button
                onClick={reset}
                className="bg-card border border-border text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-surface transition-colors text-sm"
              >
                {t("try_again") || "New image"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
