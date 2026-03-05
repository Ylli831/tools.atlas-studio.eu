"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import QRCode from "qrcode";
import ToolLayout from "@/components/ToolLayout";

type EncryptionType = "WPA" | "WEP" | "nopass";

function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, "\\$1");
}

function buildWifiString(
  ssid: string,
  password: string,
  encryption: EncryptionType,
  hidden: boolean
): string {
  const escapedSsid = escapeWifiString(ssid);
  const escapedPassword = encryption !== "nopass" ? escapeWifiString(password) : "";
  const parts = [
    `T:${encryption}`,
    `S:${escapedSsid}`,
    ...(encryption !== "nopass" ? [`P:${escapedPassword}`] : []),
    ...(hidden ? ["H:true"] : []),
  ];
  return `WIFI:${parts.join(";")};;`;
}

export default function WifiQrCodeGeneratorTool() {
  const t = useTranslations("tools.wifi-qr-code-generator");
  const tc = useTranslations("common");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState<EncryptionType>("WPA");
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const generateQR = useCallback(async () => {
    if (!canvasRef.current || !ssid.trim()) return;
    const wifiString = buildWifiString(ssid, password, encryption, hidden);
    try {
      await QRCode.toCanvas(canvasRef.current, wifiString, {
        width: 280,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#37474b", light: "#ffffff" },
      });
    } catch {
      // Invalid input
    }
  }, [ssid, password, encryption, hidden]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(generateQR, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [generateQR]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wifi-${ssid || "qr"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <ToolLayout toolSlug="wifi-qr-code-generator">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("ssid")}
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              placeholder={t("ssid_placeholder")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("encryption")}
            </label>
            <select
              value={encryption}
              onChange={(e) => setEncryption(e.target.value as EncryptionType)}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>

          {encryption !== "nopass" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password_placeholder")}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-teal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-teal"
            />
            <span className="text-sm text-foreground">{t("hidden")}</span>
          </label>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[280px] gap-3">
            {ssid.trim() ? (
              <>
                <canvas ref={canvasRef} className="max-w-full" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">{ssid}</p>
                  <p className="text-xs text-muted-foreground">
                    {encryption === "nopass" ? "Open" : encryption}
                    {hidden ? " (Hidden)" : ""}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">{t("ssid_placeholder")}</p>
            )}
          </div>

          {ssid.trim() && (
            <button
              onClick={downloadPNG}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              {t("download")}
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
