"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import ToolLayout from "@/components/ToolLayout";

type Preset = "text" | "url" | "wifi" | "email" | "phone";

const PRESETS: { key: Preset; icon: string }[] = [
  { key: "text", icon: "T" },
  { key: "url", icon: "🔗" },
  { key: "wifi", icon: "📶" },
  { key: "email", icon: "✉" },
  { key: "phone", icon: "📞" },
];

export default function QrCodeTool() {
  const t = useTranslations("tools.qr-code-generator");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [fgColor, setFgColor] = useState("#37474b");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [preset, setPreset] = useState<Preset>("text");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // WiFi preset fields
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");

  // Email preset fields
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  // Phone preset
  const [phone, setPhone] = useState("");

  const getQrContent = useCallback((): string => {
    switch (preset) {
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailTo}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""}`;
      case "phone":
        return `tel:${phone}`;
      default:
        return text;
    }
  }, [preset, text, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, phone]);

  const generateQR = useCallback(async () => {
    const content = getQrContent();
    if (!canvasRef.current || !content.trim()) return;
    try {
      await QRCode.toCanvas(canvasRef.current, content, {
        width: size,
        margin,
        errorCorrectionLevel: errorCorrection,
        color: { dark: fgColor, light: bgColor },
      });
    } catch {
      // Invalid input
    }
  }, [getQrContent, size, margin, errorCorrection, fgColor, bgColor]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(generateQR, 300);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [generateQR]);

  const hasContent = getQrContent().trim().length > 0;

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const downloadSVG = async () => {
    const content = getQrContent();
    if (!content.trim()) return;
    try {
      const svg = await QRCode.toString(content, {
        type: "svg",
        width: size,
        margin,
        errorCorrectionLevel: errorCorrection,
        color: { dark: fgColor, light: bgColor },
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qr-code.svg";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Invalid input
    }
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvasRef.current!.toBlob(resolve, "image/png")
      );
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not supported
    }
  };

  return (
    <ToolLayout toolSlug="qr-code-generator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("preset")}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    preset === p.key
                      ? "bg-teal text-white"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`preset_${p.key}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Input fields based on preset */}
          {(preset === "text" || preset === "url") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("input_label")}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={preset === "url" ? "https://example.com" : t("input_placeholder")}
                rows={4}
                className="w-full bg-card border border-border rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-teal"
              />
            </div>
          )}

          {preset === "wifi" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("wifi_ssid")}</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Network name"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("wifi_password")}</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("wifi_encryption")}</label>
                <select
                  value={wifiEncryption}
                  onChange={(e) => setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{t("wifi_none")}</option>
                </select>
              </div>
            </div>
          )}

          {preset === "email" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("email_to")}</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t("email_subject")}</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder={t("email_subject_placeholder")}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
            </div>
          )}

          {preset === "phone" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("phone_number")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          )}

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("size")} (px)
              </label>
              <input
                type="number"
                min={128}
                max={1024}
                step={64}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("error_correction")}
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("margin")}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={6}
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="flex-1 accent-[var(--teal)]"
              />
              <span className="text-sm text-muted-foreground w-6 text-center">{margin}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("fg_color")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("bg_color")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center min-h-[280px]">
            {hasContent ? (
              <canvas ref={canvasRef} className="max-w-full" />
            ) : (
              <p className="text-muted-foreground text-sm">{t("input_label")}</p>
            )}
          </div>

          {hasContent && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={downloadPNG}
                className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("download_png")}
              </button>
              <button
                onClick={downloadSVG}
                className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {t("download_svg")}
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
              >
                {copied ? t("copied") : t("copy_image")}
              </button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
