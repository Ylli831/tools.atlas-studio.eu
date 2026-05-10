"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import type {
  Options as QrOptions,
  DotType,
  CornerSquareType,
  CornerDotType,
} from "qr-code-styling";
import ToolLayout from "@/components/ToolLayout";

type Preset = "text" | "url" | "wifi" | "email" | "phone";
type StylePreset = "brand" | "classic" | "soft" | "bold";

const PRESETS: { key: Preset; icon: string }[] = [
  { key: "text", icon: "T" },
  { key: "url", icon: "🔗" },
  { key: "wifi", icon: "📶" },
  { key: "email", icon: "✉" },
  { key: "phone", icon: "📞" },
];

const DOT_STYLES: DotType[] = [
  "square",
  "dots",
  "rounded",
  "classy",
  "classy-rounded",
  "extra-rounded",
];

const CORNER_SQUARE_STYLES: CornerSquareType[] = ["square", "dot", "extra-rounded"];
const CORNER_DOT_STYLES: CornerDotType[] = ["square", "dot"];

const MAX_LOGO_SIZE = 0.3;
const MIN_LOGO_SIZE = 0.15;

type StyleSnapshot = {
  dotStyle: DotType;
  cornerSquareStyle: CornerSquareType;
  cornerDotStyle: CornerDotType;
  fgColor: string;
  bgColor: string;
  cornerColor: string;
  useCornerColor: boolean;
  gradientEnabled: boolean;
  gradientColor: string;
  gradientType: "linear" | "radial";
};

const STYLE_PRESETS: Record<StylePreset, StyleSnapshot> = {
  brand: {
    dotStyle: "rounded",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    fgColor: "#37474b",
    bgColor: "#f5f3ef",
    cornerColor: "#cb6a3f",
    useCornerColor: true,
    gradientEnabled: false,
    gradientColor: "#487877",
    gradientType: "linear",
  },
  classic: {
    dotStyle: "square",
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
    fgColor: "#000000",
    bgColor: "#ffffff",
    cornerColor: "#000000",
    useCornerColor: false,
    gradientEnabled: false,
    gradientColor: "#000000",
    gradientType: "linear",
  },
  soft: {
    dotStyle: "dots",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    fgColor: "#487877",
    bgColor: "#ffffff",
    cornerColor: "#487877",
    useCornerColor: false,
    gradientEnabled: true,
    gradientColor: "#cb6a3f",
    gradientType: "linear",
  },
  bold: {
    dotStyle: "extra-rounded",
    cornerSquareStyle: "extra-rounded",
    cornerDotStyle: "dot",
    fgColor: "#0f172a",
    bgColor: "#ffffff",
    cornerColor: "#cb6a3f",
    useCornerColor: true,
    gradientEnabled: false,
    gradientColor: "#cb6a3f",
    gradientType: "linear",
  },
};

export default function QrCodeTool() {
  const t = useTranslations("tools.qr-code-generator");

  const containerRef = useRef<HTMLDivElement>(null);
  // Using `unknown` for the instance type to avoid pulling QRCodeStyling into the SSR bundle.
  const qrInstanceRef = useRef<unknown>(null);
  const QRCodeStylingRef = useRef<unknown>(null);

  const [text, setText] = useState("");
  const [preset, setPreset] = useState<Preset>("text");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [phone, setPhone] = useState("");

  const [size, setSize] = useState(1000);
  const [margin, setMargin] = useState(2);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");

  const [dotStyle, setDotStyle] = useState<DotType>(STYLE_PRESETS.brand.dotStyle);
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>(
    STYLE_PRESETS.brand.cornerSquareStyle,
  );
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>(
    STYLE_PRESETS.brand.cornerDotStyle,
  );
  const [fgColor, setFgColor] = useState(STYLE_PRESETS.brand.fgColor);
  const [bgColor, setBgColor] = useState(STYLE_PRESETS.brand.bgColor);
  const [cornerColor, setCornerColor] = useState(STYLE_PRESETS.brand.cornerColor);
  const [useCornerColor, setUseCornerColor] = useState(STYLE_PRESETS.brand.useCornerColor);
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor, setGradientColor] = useState(STYLE_PRESETS.brand.gradientColor);
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");

  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.25);
  const [logoMargin, setLogoMargin] = useState(6);
  const [logoIsDragging, setLogoIsDragging] = useState(false);

  const [pdfSizeMm, setPdfSizeMm] = useState(50);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);

  const getQrContent = useCallback((): string => {
    switch (preset) {
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      case "email":
        return `mailto:${emailTo}${
          emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""
        }`;
      case "phone":
        return `tel:${phone}`;
      default:
        return text;
    }
  }, [preset, text, wifiSsid, wifiPassword, wifiEncryption, emailTo, emailSubject, phone]);

  const content = getQrContent();
  const hasContent = content.trim().length > 0;
  const effectiveErrorCorrection = logoDataUrl ? "H" : errorCorrection;

  const buildOptions = useCallback((): Partial<QrOptions> => {
    const dots: NonNullable<QrOptions["dotsOptions"]> = { type: dotStyle, color: fgColor };
    if (gradientEnabled) {
      dots.gradient = {
        type: gradientType,
        rotation: gradientType === "linear" ? Math.PI / 4 : 0,
        colorStops: [
          { offset: 0, color: fgColor },
          { offset: 1, color: gradientColor },
        ],
      };
    }
    const finalCornerColor = useCornerColor ? cornerColor : fgColor;
    return {
      width: size,
      height: size,
      type: "svg",
      data: hasContent ? content : " ",
      margin: margin * 5,
      qrOptions: { errorCorrectionLevel: effectiveErrorCorrection },
      dotsOptions: dots,
      cornersSquareOptions: {
        type: cornerSquareStyle,
        color: finalCornerColor,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: finalCornerColor,
      },
      backgroundOptions: { color: bgColor },
      image: logoDataUrl ?? undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: logoMargin,
        imageSize: Math.min(MAX_LOGO_SIZE, Math.max(MIN_LOGO_SIZE, logoSize)),
        hideBackgroundDots: true,
        // saveAsBlob fetches the data URL through connect-src, which most
        // strict CSPs block. Keep the logo inline as a data URI instead.
        saveAsBlob: false,
      },
    };
  }, [
    dotStyle,
    fgColor,
    gradientEnabled,
    gradientType,
    gradientColor,
    useCornerColor,
    cornerColor,
    size,
    content,
    hasContent,
    margin,
    effectiveErrorCorrection,
    cornerSquareStyle,
    cornerDotStyle,
    bgColor,
    logoDataUrl,
    logoMargin,
    logoSize,
  ]);

  // Initial mount: lazy-load the library and attach the instance.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const mod = await import("qr-code-styling");
      const QRCodeStyling = mod.default;
      if (cancelled || !containerRef.current) return;
      QRCodeStylingRef.current = QRCodeStyling;
      const instance = new QRCodeStyling(buildOptions());
      qrInstanceRef.current = instance;
      containerRef.current.replaceChildren();
      instance.append(containerRef.current);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update instance when options change.
  useEffect(() => {
    const instance = qrInstanceRef.current as { update: (o: Partial<QrOptions>) => void } | null;
    if (!instance) return;
    instance.update(buildOptions());
  }, [buildOptions]);

  const applyStylePreset = (key: StylePreset) => {
    const s = STYLE_PRESETS[key];
    setDotStyle(s.dotStyle);
    setCornerSquareStyle(s.cornerSquareStyle);
    setCornerDotStyle(s.cornerDotStyle);
    setFgColor(s.fgColor);
    setBgColor(s.bgColor);
    setCornerColor(s.cornerColor);
    setUseCornerColor(s.useCornerColor);
    setGradientEnabled(s.gradientEnabled);
    setGradientColor(s.gradientColor);
    setGradientType(s.gradientType);
  };

  const handleLogoFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setLogoDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onLogoDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setLogoIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  };

  const downloadSVG = async () => {
    const instance = qrInstanceRef.current as
      | { download: (o: { name?: string; extension?: "svg" | "png" }) => Promise<void> }
      | null;
    if (!instance) return;
    await instance.download({ name: "qr-code", extension: "svg" });
  };

  const downloadPNG = async () => {
    const instance = qrInstanceRef.current as
      | { download: (o: { name?: string; extension?: "svg" | "png" }) => Promise<void> }
      | null;
    if (!instance) return;
    await instance.download({ name: "qr-code", extension: "png" });
  };

  const downloadPDF = async () => {
    const instance = qrInstanceRef.current as
      | { getRawData: (ext?: "svg" | "png") => Promise<Blob | null> }
      | null;
    if (!instance) return;
    setPdfBusy(true);
    try {
      const raw = await instance.getRawData("svg");
      if (!raw) return;
      const svgText = await (raw as Blob).text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl = svgDoc.documentElement as unknown as Element;
      const holder = document.createElement("div");
      holder.style.position = "fixed";
      holder.style.left = "-99999px";
      holder.style.top = "0";
      holder.appendChild(svgEl);
      document.body.appendChild(holder);

      const { jsPDF } = await import("jspdf");
      await import("svg2pdf.js");
      const mm = Math.max(20, Math.min(200, pdfSizeMm));
      const doc = new jsPDF({ unit: "mm", format: [mm, mm], orientation: "portrait" });
      await doc.svg(svgEl, { x: 0, y: 0, width: mm, height: mm });
      doc.save("qr-code.pdf");
      document.body.removeChild(holder);
    } finally {
      setPdfBusy(false);
    }
  };

  const copyToClipboard = async () => {
    const instance = qrInstanceRef.current as
      | { getRawData: (ext?: "svg" | "png") => Promise<Blob | null> }
      | null;
    if (!instance) return;
    try {
      const blob = await instance.getRawData("png");
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob as Blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not supported
    }
  };

  const stylePresetButtons: { key: StylePreset; labelKey: string }[] = useMemo(
    () => [
      { key: "brand", labelKey: "style_brand" },
      { key: "classic", labelKey: "style_classic" },
      { key: "soft", labelKey: "style_soft" },
      { key: "bold", labelKey: "style_bold" },
    ],
    [],
  );

  return (
    <ToolLayout toolSlug="qr-code-generator">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8">
        {/* Left: controls */}
        <div className="space-y-6 min-w-0">
          {/* Style presets */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("style_preset")}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {stylePresetButtons.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyStylePreset(p.key)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                >
                  {t(p.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Content type */}
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

          {/* Content inputs */}
          {(preset === "text" || preset === "url") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("input_label")}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={preset === "url" ? "https://example.com" : t("input_placeholder")}
                rows={3}
                className="w-full bg-card border border-border rounded-xl p-4 text-sm resize-y focus:outline-none focus:border-teal"
              />
            </div>
          )}

          {preset === "wifi" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("wifi_ssid")}
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="Network name"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("wifi_password")}
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("wifi_encryption")}
                </label>
                <select
                  value={wifiEncryption}
                  onChange={(e) =>
                    setWifiEncryption(e.target.value as "WPA" | "WEP" | "nopass")
                  }
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
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("email_to")}
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("email_subject")}
                </label>
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
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("phone_number")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          )}

          {/* Module / dot style */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("dot_style")}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DOT_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setDotStyle(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    dotStyle === s
                      ? "bg-teal text-white"
                      : "bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`dot_style_${s.replace(/-/g, "_")}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Corner styles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("corner_square_style")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CORNER_SQUARE_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setCornerSquareStyle(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      cornerSquareStyle === s
                        ? "bg-teal text-white"
                        : "bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`corner_style_${s.replace(/-/g, "_")}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("corner_dot_style")}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CORNER_DOT_STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setCornerDotStyle(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      cornerDotStyle === s
                        ? "bg-teal text-white"
                        : "bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(`corner_style_${s.replace(/-/g, "_")}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorField
              label={t("fg_color")}
              value={fgColor}
              onChange={setFgColor}
            />
            <ColorField
              label={t("bg_color")}
              value={bgColor}
              onChange={setBgColor}
            />
          </div>

          {/* Corner color */}
          <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={useCornerColor}
                onChange={(e) => setUseCornerColor(e.target.checked)}
                className="accent-[var(--teal)]"
              />
              {t("corner_color_same")}
            </label>
            {useCornerColor && (
              <ColorField
                label={t("corner_color")}
                value={cornerColor}
                onChange={setCornerColor}
              />
            )}
          </div>

          {/* Gradient */}
          <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={gradientEnabled}
                onChange={(e) => setGradientEnabled(e.target.checked)}
                className="accent-[var(--teal)]"
              />
              {t("gradient_enable")}
            </label>
            {gradientEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ColorField
                  label={t("gradient_color")}
                  value={gradientColor}
                  onChange={setGradientColor}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("gradient_type")}
                  </label>
                  <select
                    value={gradientType}
                    onChange={(e) =>
                      setGradientType(e.target.value as "linear" | "radial")
                    }
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
                  >
                    <option value="linear">{t("gradient_linear")}</option>
                    <option value="radial">{t("gradient_radial")}</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
            <div className="text-sm font-medium text-foreground">{t("logo")}</div>
            {!logoDataUrl ? (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setLogoIsDragging(true);
                }}
                onDragLeave={() => setLogoIsDragging(false)}
                onDrop={onLogoDrop}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed cursor-pointer p-6 transition-colors ${
                  logoIsDragging
                    ? "border-teal bg-teal/5"
                    : "border-border hover:border-teal/60"
                }`}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleLogoFile(f);
                    e.target.value = "";
                  }}
                />
                <span className="text-sm font-medium text-foreground">
                  {t("logo_upload")}
                </span>
                <span className="text-xs text-muted-foreground">{t("logo_hint")}</span>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoDataUrl}
                      alt="logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setLogoDataUrl(null)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-surface text-foreground hover:bg-border transition-colors"
                  >
                    {t("logo_remove")}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("logo_size")}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({Math.round(logoSize * 100)}%)
                    </span>
                  </label>
                  <input
                    type="range"
                    min={MIN_LOGO_SIZE}
                    max={MAX_LOGO_SIZE}
                    step={0.01}
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full accent-[var(--teal)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {t("logo_padding")}{" "}
                    <span className="text-muted-foreground font-normal">({logoMargin})</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    value={logoMargin}
                    onChange={(e) => setLogoMargin(Number(e.target.value))}
                    className="w-full accent-[var(--teal)]"
                  />
                </div>
                <div className="text-xs text-muted-foreground bg-surface/60 border border-border rounded-md px-3 py-2">
                  {t("logo_warning_h")}
                </div>
              </div>
            )}
          </div>

          {/* Advanced settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("error_correction")}
              </label>
              <select
                value={errorCorrection}
                onChange={(e) =>
                  setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")
                }
                disabled={!!logoDataUrl}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("margin")}
              </label>
              <div className="flex items-center gap-3 h-[42px]">
                <input
                  type="range"
                  min={0}
                  max={6}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="flex-1 accent-[var(--teal)]"
                />
                <span className="text-sm text-muted-foreground w-6 text-center">
                  {margin}
                </span>
              </div>
            </div>
          </div>

          {/* Output sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("size")} (px)
              </label>
              <input
                type="number"
                min={256}
                max={2048}
                step={64}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("pdf_size_mm")}
              </label>
              <input
                type="number"
                min={20}
                max={200}
                step={5}
                value={pdfSizeMm}
                onChange={(e) => setPdfSizeMm(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        {/* Right: preview + downloads */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center aspect-square relative">
            <div
              ref={containerRef}
              className={`w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:h-auto [&_svg]:w-auto ${
                hasContent ? "" : "invisible"
              }`}
              aria-label="QR code preview"
            />
            {!hasContent && (
              <p className="absolute text-muted-foreground text-sm text-center px-4">
                {t("input_label")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={downloadSVG}
              disabled={!hasContent}
              className="bg-teal text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("download_svg")}
            </button>
            <button
              onClick={downloadPDF}
              disabled={!hasContent || pdfBusy}
              className="bg-[var(--terracotta)] text-white font-medium px-4 py-2.5 rounded-lg hover:bg-[var(--terracotta-hover)] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfBusy ? "…" : t("download_pdf")}
            </button>
            <button
              onClick={downloadPNG}
              disabled={!hasContent}
              className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("download_png")}
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!hasContent}
              className="bg-surface text-foreground font-medium px-4 py-2.5 rounded-lg hover:bg-border transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? t("copied") : t("copy_image")}
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
        />
      </div>
    </div>
  );
}
