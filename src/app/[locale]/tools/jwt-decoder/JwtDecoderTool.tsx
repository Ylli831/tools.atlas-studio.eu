"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  try {
    return decodeURIComponent(atob(padded).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
  } catch {
    return atob(padded);
  }
}

interface JwtParts {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  isExpired: boolean;
  isValid: boolean;
}

function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { header: null, payload: null, signature: "", isExpired: false, isValid: false };
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    const isExpired = typeof payload.exp === "number" && payload.exp < now;
    return { header, payload, signature: parts[2], isExpired, isValid: true };
  } catch {
    return { header: null, payload: null, signature: "", isExpired: false, isValid: false };
  }
}

function formatTimestamp(val: unknown): string {
  if (typeof val !== "number") return String(val);
  try {
    return new Date(val * 1000).toLocaleString();
  } catch {
    return String(val);
  }
}

function JsonView({ data }: { data: Record<string, unknown> }) {
  const timestampKeys = ["iat", "exp", "nbf"];
  return (
    <div className="font-mono text-sm space-y-1">
      {Object.entries(data).map(([k, v]) => (
        <div key={k} className="flex gap-2 flex-wrap">
          <span className="text-teal font-medium">{k}:</span>
          <span className="text-foreground break-all">{JSON.stringify(v)}</span>
          {timestampKeys.includes(k) && typeof v === "number" && (
            <span className="text-muted-foreground text-xs">({formatTimestamp(v)})</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function JwtDecoderTool() {
  const t = useTranslations("tools.jwt-decoder");
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<JwtParts | null>(null);

  useEffect(() => {
    if (!token.trim()) { setDecoded(null); return; }
    setDecoded(decodeJwt(token));
  }, [token]);

  const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  return (
    <ToolLayout toolSlug="jwt-decoder">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-foreground">{t("token_label")}</label>
            <button onClick={() => setToken(SAMPLE)} className="text-xs text-teal hover:underline">{t("load_sample")}</button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={t("token_placeholder")}
            rows={4}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
          />
        </div>

        {token && !decoded?.isValid && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 px-4 py-2.5 rounded-lg border border-red-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {t("invalid_token")}
          </div>
        )}

        {decoded?.isExpired && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 rounded-lg border border-amber-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {t("expired")}
          </div>
        )}

        {decoded?.isValid && (
          <div className="space-y-4">
            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate">{t("header")}</h3>
                <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
              </div>
              {decoded.header && <JsonView data={decoded.header} />}
            </div>

            {/* Payload */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate">{t("payload")}</h3>
                <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
              </div>
              {decoded.payload && <JsonView data={decoded.payload} />}
            </div>

            {/* Signature */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate">{t("signature")}</h3>
                <CopyButton text={decoded.signature} />
              </div>
              <p className="font-mono text-sm text-muted-foreground break-all">{decoded.signature}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
