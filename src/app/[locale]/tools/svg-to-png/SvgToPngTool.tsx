"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

export default function SvgToPngTool() {
  const t = useTranslations("tools.svg-to-png");
  const tc = useTranslations("common");
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [transparent, setTransparent] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  const handleFile = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setSvgContent(content);
      setPreview(URL.createObjectURL(files[0]));
      setResult(null);
    };
    reader.readAsText(files[0]);
  }, []);

  const convert = () => {
    if (!svgContent) return;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgEl = svgDoc.querySelector("svg");
    if (!svgEl) return;

    let w = parseFloat(svgEl.getAttribute("width") || "0");
    let h = parseFloat(svgEl.getAttribute("height") || "0");
    if (!w || !h) {
      const vb = svgEl.getAttribute("viewBox");
      if (vb) {
        const parts = vb.split(/[\s,]+/).map(Number);
        w = parts[2] || 300;
        h = parts[3] || 150;
      } else {
        w = 300;
        h = 150;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d")!;

    if (!transparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const img = new Image();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      setResult(pngUrl);
    };
    img.src = url;
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "converted.png";
    a.click();
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSvgContent(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <ToolLayout toolSlug="svg-to-png">
      <div className="space-y-6">
        <FileUpload accept=".svg,image/svg+xml" onFileSelect={handleFile} />

        {svgContent && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2">{t("svg_preview")}</p>
                <div className="flex items-center justify-center bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')] rounded-lg p-4 min-h-[160px]">
                  <img src={preview!} alt="" className="max-w-full max-h-48" />
                </div>
              </div>

              {result && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-2">{t("png_result")}</p>
                  <div className="flex items-center justify-center bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23f0f0f0%22%2F%3E%3C%2Fsvg%3E')] rounded-lg p-4 min-h-[160px]">
                    <img src={result} alt="" className="max-w-full max-h-48" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("scale")}
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                  <option value={4}>4x</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  {t("transparent_bg")}
                </label>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="rounded border-border text-teal focus:ring-teal"
                  />
                  <span className="text-sm">{t("transparent")}</span>
                </label>
              </div>

              {!transparent && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("bg_color")}
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-border"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={convert}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("convert")}
              </button>
              {result && (
                <button
                  onClick={download}
                  className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
                >
                  {tc("download")}
                </button>
              )}
              <button
                onClick={reset}
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
