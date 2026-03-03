"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import FileUpload from "@/components/FileUpload";

interface ImageItem {
  file: File;
  preview: string;
  id: string;
}

export default function ImageToPdfTool() {
  const t = useTranslations("tools.image-to-pdf");
  const tc = useTranslations("common");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(dragIndex, 1);
      copy.splice(index, 0, item);
      return copy;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const generatePdf = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const imgData = await readFileAsDataUrl(images[i].file);
        const dims = await getImageDimensions(imgData);
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const scale = Math.min(maxW / dims.width, maxH / dims.height);
        const w = dims.width * scale;
        const h = dims.height * scale;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;
        doc.addImage(imgData, "JPEG", x, y, w, h);
      }

      doc.save("images.pdf");
    } catch {
      // Error generating PDF
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  return (
    <ToolLayout toolSlug="image-to-pdf">
      <div className="space-y-6">
        <FileUpload
          accept="image/*"
          multiple
          onFileSelect={handleFiles}
        />

        {images.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">{t("drag_to_reorder")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group bg-card border border-border rounded-lg overflow-hidden cursor-move ${dragIndex === index ? "opacity-50" : ""}`}
                >
                  <img src={img.preview} alt="" className="w-full h-32 object-cover" />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 bg-black/60 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("orientation")}
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                >
                  <option value="portrait">{t("portrait")}</option>
                  <option value="landscape">{t("landscape")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("margin")} (mm)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generatePdf}
                disabled={processing}
                className="bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
              >
                {processing ? tc("processing") : t("generate_pdf")}
              </button>
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.src = dataUrl;
  });
}
