"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";
import CopyButton from "@/components/CopyButton";

type ExifData = Record<string, unknown>;

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (val instanceof Date) return val.toLocaleString();
  if (typeof val === "object" && !Array.isArray(val)) return JSON.stringify(val);
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

const IMPORTANT_KEYS = [
  "Make", "Model", "DateTimeOriginal", "DateTime", "ExposureTime",
  "FNumber", "ISO", "FocalLength", "Flash", "GPSLatitude", "GPSLongitude",
  "ImageWidth", "ImageHeight", "Orientation", "Software", "ColorSpace",
  "WhiteBalance", "ExposureMode", "MeteringMode", "SceneCaptureType",
];

export default function ExifViewerTool() {
  const t = useTranslations("tools.exif-viewer");
  const tc = useTranslations("common");
  const [exif, setExif] = useState<ExifData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleFile = async ([file]: File[]) => {
    setError("");
    setExif(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const exifr = (await import("exifr")).default;
      const data = await exifr.parse(file, { translateKeys: true, translateValues: true, reviveValues: true });
      setExif(data ?? {});
    } catch {
      setError(t("no_exif"));
      setExif({});
    } finally {
      setLoading(false);
    }
  };

  const stripExif = () => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.download = "clean-image.jpg";
        a.href = URL.createObjectURL(blob);
        a.click();
      }, "image/jpeg", 0.95);
    };
    img.src = preview;
  };

  const entries = exif ? Object.entries(exif) : [];
  const importantEntries = entries.filter(([k]) => IMPORTANT_KEYS.includes(k));
  const displayEntries = showAll ? entries : importantEntries;
  const exportJson = exif ? JSON.stringify(exif, null, 2) : "";

  return (
    <ToolLayout toolSlug="exif-viewer">
      <div className="space-y-5">
        <FileUpload
          accept="image/*"
          onFileSelect={handleFile}
        />

        {loading && (
          <div className="text-center py-8 text-muted-foreground text-sm">{tc("processing")}</div>
        )}

        {preview && exif && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preview */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full object-contain max-h-48" />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 justify-center">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{t("found_tags", { count: entries.length })}</p>
                  <p className="text-xs text-muted-foreground">{t("strip_description")}</p>
                </div>
                <button onClick={stripExif}
                  className="flex items-center gap-2 bg-terracotta text-white font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                  {t("strip_download")}
                </button>
                {exportJson && <CopyButton text={exportJson} />}
              </div>
            </div>

            {/* EXIF table */}
            {entries.length > 0 && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="divide-y divide-border">
                  {displayEntries.map(([key, val]) => (
                    <div key={key} className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface/50">
                      <span className="text-xs font-medium text-muted-foreground w-44 flex-shrink-0 pt-0.5">{key}</span>
                      <span className="text-sm text-foreground break-all">{formatValue(val)}</span>
                    </div>
                  ))}
                </div>
                {!showAll && entries.length > importantEntries.length && (
                  <button onClick={() => setShowAll(true)}
                    className="w-full py-3 text-sm text-teal hover:underline border-t border-border"
                  >
                    {t("show_all", { count: entries.length - importantEntries.length })}
                  </button>
                )}
              </div>
            )}

            {entries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {error || t("no_exif")}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
