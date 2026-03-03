"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const COUNTRY_NAMES: Record<string, string> = {
  AL: "Albania", AT: "Austria", BE: "Belgium", CH: "Switzerland",
  DE: "Germany", ES: "Spain", FR: "France", GB: "United Kingdom",
  IT: "Italy", NL: "Netherlands", PL: "Poland", SE: "Sweden",
  NO: "Norway", DK: "Denmark", FI: "Finland", CZ: "Czech Republic",
  HU: "Hungary", RO: "Romania", HR: "Croatia", SK: "Slovakia",
  PT: "Portugal", GR: "Greece", IE: "Ireland", LU: "Luxembourg",
};

const IBAN_LENGTHS: Record<string, number> = {
  AL: 28, AT: 20, BE: 16, CH: 21, DE: 22, ES: 24, FR: 27,
  GB: 22, IT: 27, NL: 18, PL: 28, SE: 24, NO: 15, DK: 18,
  FI: 18, CZ: 24, HU: 28, RO: 24, HR: 21, SK: 24, PT: 25,
  GR: 27, IE: 22, LU: 20,
};

function modulo(numStr: string, mod: number): number {
  let remainder = 0;
  for (const ch of numStr) {
    remainder = (remainder * 10 + parseInt(ch)) % mod;
  }
  return remainder;
}

function validateIban(raw: string): { valid: boolean; country: string; countryCode: string; length: number; expectedLength: number | null; formatted: string } {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  const countryCode = iban.slice(0, 2);
  const country = COUNTRY_NAMES[countryCode] ?? "Unknown";
  const expectedLength = IBAN_LENGTHS[countryCode] ?? null;
  const formatted = iban.replace(/(.{4})/g, "$1 ").trim();

  if (iban.length < 4) return { valid: false, country, countryCode, length: iban.length, expectedLength, formatted };
  if (expectedLength && iban.length !== expectedLength) return { valid: false, country, countryCode, length: iban.length, expectedLength, formatted };

  // Rearrange: move first 4 chars to end
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  // Convert letters to numbers (A=10, B=11, ...)
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  const valid = modulo(numeric, 97) === 1;

  return { valid, country, countryCode, length: iban.length, expectedLength, formatted };
}

export default function IbanValidatorTool() {
  const t = useTranslations("tools.iban-validator");
  const [iban, setIban] = useState("");

  const result = useMemo(() => {
    if (!iban.trim()) return null;
    return validateIban(iban);
  }, [iban]);

  return (
    <ToolLayout toolSlug="iban-validator">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t("input_label")}</label>
          <input
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder={t("input_placeholder")}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal uppercase tracking-wider"
          />
        </div>

        {result && (
          <div className={`rounded-xl border p-5 space-y-4 ${result.valid ? "border-green-200 bg-green-50 dark:bg-green-950/20" : "border-red-200 bg-red-50 dark:bg-red-950/20"}`}>
            {/* Status */}
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={result.valid ? "text-green-600" : "text-red-500"}
              >
                {result.valid
                  ? <><polyline points="20 6 9 17 4 12" /></>
                  : <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                }
              </svg>
              <span className={`font-semibold ${result.valid ? "text-green-700" : "text-red-600"}`}>
                {result.valid ? t("valid") : t("invalid")}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t("country"), value: result.country !== "Unknown" ? `${result.country} (${result.countryCode})` : result.countryCode },
                { label: t("length"), value: `${result.length}${result.expectedLength ? ` / ${result.expectedLength}` : ""}` },
              ].map((item) => (
                <div key={item.label} className="bg-white/60 dark:bg-black/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Formatted IBAN */}
            <div className="bg-white/60 dark:bg-black/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{t("formatted")}</p>
                <CopyButton text={result.formatted} />
              </div>
              <p className="font-mono font-medium text-foreground tracking-wider">{result.formatted}</p>
            </div>
          </div>
        )}

        {/* Sample IBANs */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-medium text-foreground mb-2">{t("examples")}</p>
          <div className="flex flex-wrap gap-2">
            {["AL47212110090000000235698741", "GB29NWBK60161331926819", "DE89370400440532013000"].map((ex) => (
              <button key={ex} onClick={() => setIban(ex)}
                className="text-xs font-mono text-teal hover:underline bg-teal/5 px-2 py-1 rounded"
              >
                {ex.replace(/(.{4})/g, "$1 ").trim()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
