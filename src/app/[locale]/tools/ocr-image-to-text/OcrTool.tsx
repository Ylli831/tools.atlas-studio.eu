"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function OcrTool() {
  const t = useTranslations("tools.ocr-image-to-text");
  const tc = useTranslations("common");
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [copied, setCopied] = useState(false);

  const handleFile = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const url = URL.createObjectURL(files[0]);
    setPreview(url);
    setText("");
    setProgress(0);
  }, []);

  const recognize = async () => {
    if (!preview) return;
    setProcessing(true);
    setProgress(0);
    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(preview, language, {
        logger: (m: { progress: number }) => {
          if (m.progress) setProgress(Math.round(m.progress * 100));
        },
      });
      setText(result.data.text);
    } catch {
      setText("");
    } finally {
      setProcessing(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setText("");
    setProgress(0);
  };

  const languages = [
    { code: "eng", label: "English" },
    { code: "deu", label: "Deutsch" },
    { code: "fra", label: "Français" },
    { code: "spa", label: "Español" },
    { code: "ita", label: "Italiano" },
    { code: "por", label: "Português" },
    { code: "nld", label: "Nederlands" },
    { code: "pol", label: "Polski" },
    { code: "rus", label: "Русский" },
    { code: "tur", label: "Türkçe" },
    { code: "ara", label: "العربية" },
    { code: "chi_sim", label: "中文 (简体)" },
    { code: "jpn", label: "日本語" },
    { code: "kor", label: "한국어" },
  ];

  return (
    <ToolLayout toolSlug="ocr-image-to-text">
      <div className="space-y-6">
        <FileUpload accept="image/*" onFileSelect={handleFile} preview={preview} />

        {preview && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("language")}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal max-w-xs"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={recognize}
                disabled={processing}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
              >
                {processing ? `${tc("processing")} ${progress}%` : t("extract_text")}
              </button>
              <button
                onClick={reset}
                className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {tc("reset")}
              </button>
            </div>

            {processing && (
              <div className="w-full bg-surface rounded-full h-2">
                <div
                  className="bg-teal h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {text && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">{t("result")}</label>
                  <button onClick={copy} className="text-xs text-teal hover:underline">
                    {copied ? tc("copied") : tc("copy")}
                  </button>
                </div>
                <textarea
                  value={text}
                  readOnly
                  rows={10}
                  className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none"
                />
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
