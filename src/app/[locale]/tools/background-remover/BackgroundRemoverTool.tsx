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

  const handleFileSelect = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResultUrl(null);
    setProcessing(true);
    setProgress(t("first_time"));

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      setProgress(t("processing"));

      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            setProgress(`${key}: ${pct}%`);
          }
        },
      });

      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Background removal failed:", err);
      setProgress(tc("error"));
    } finally {
      setProcessing(false);
    }
  }, [t, tc]);

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "no-background.png";
    a.click();
  };

  return (
    <ToolLayout toolSlug="background-remover">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">{t("max_size_warning")}</p>

        <FileUpload accept="image/*" onFileSelect={handleFileSelect} maxSize={10 * 1024 * 1024} preview={preview} />

        {processing && (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-teal border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{progress}</p>
          </div>
        )}

        {resultUrl && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preview && (
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-2">Original</p>
                  <img src={preview} alt="Original" className="max-h-64 mx-auto rounded-lg object-contain" />
                </div>
              )}
              <div className="rounded-xl p-4 text-center border border-border" style={{ background: "repeating-conic-gradient(#e5e2dc 0% 25%, white 0% 50%) 50% / 16px 16px" }}>
                <p className="text-xs text-muted-foreground mb-2">Result</p>
                <img src={resultUrl} alt="No background" className="max-h-64 mx-auto rounded-lg object-contain" />
              </div>
            </div>

            <button
              onClick={download}
              className="w-full bg-teal text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              {t("download")}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
