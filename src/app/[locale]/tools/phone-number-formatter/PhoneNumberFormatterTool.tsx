"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface CountryData {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  format: string;
  minLength: number;
  maxLength: number;
}

const countries: CountryData[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "\uD83C\uDDFA\uD83C\uDDF8", format: "(XXX) XXX-XXXX", minLength: 10, maxLength: 10 },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "\uD83C\uDDE8\uD83C\uDDE6", format: "(XXX) XXX-XXXX", minLength: 10, maxLength: 10 },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "\uD83C\uDDEC\uD83C\uDDE7", format: "XXXX XXXXXX", minLength: 10, maxLength: 10 },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "\uD83C\uDDE9\uD83C\uDDEA", format: "XXXX XXXXXXX", minLength: 10, maxLength: 11 },
  { code: "FR", name: "France", dialCode: "+33", flag: "\uD83C\uDDEB\uD83C\uDDF7", format: "X XX XX XX XX", minLength: 9, maxLength: 9 },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "\uD83C\uDDEE\uD83C\uDDF9", format: "XXX XXX XXXX", minLength: 9, maxLength: 10 },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "\uD83C\uDDEA\uD83C\uDDF8", format: "XXX XX XX XX", minLength: 9, maxLength: 9 },
  { code: "AL", name: "Albania", dialCode: "+355", flag: "\uD83C\uDDE6\uD83C\uDDF1", format: "XX XXX XXXX", minLength: 9, maxLength: 9 },
  { code: "XK", name: "Kosovo", dialCode: "+383", flag: "\uD83C\uDDFD\uD83C\uDDF0", format: "XX XXX XXX", minLength: 8, maxLength: 8 },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "\uD83C\uDDE6\uD83C\uDDF9", format: "XXXX XXXXXXX", minLength: 10, maxLength: 11 },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "\uD83C\uDDE8\uD83C\uDDED", format: "XX XXX XX XX", minLength: 9, maxLength: 9 },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "\uD83C\uDDF3\uD83C\uDDF1", format: "X XXXXXXXX", minLength: 9, maxLength: 9 },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "\uD83C\uDDE7\uD83C\uDDEA", format: "XXX XX XX XX", minLength: 9, maxLength: 9 },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "\uD83C\uDDF8\uD83C\uDDEA", format: "XX-XXX XX XX", minLength: 9, maxLength: 9 },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "\uD83C\uDDF3\uD83C\uDDF4", format: "XXX XX XXX", minLength: 8, maxLength: 8 },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "\uD83C\uDDE9\uD83C\uDDF0", format: "XX XX XX XX", minLength: 8, maxLength: 8 },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "\uD83C\uDDEB\uD83C\uDDEE", format: "XX XXX XXXX", minLength: 9, maxLength: 10 },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "\uD83C\uDDF5\uD83C\uDDF1", format: "XXX XXX XXX", minLength: 9, maxLength: 9 },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "\uD83C\uDDF5\uD83C\uDDF9", format: "XXX XXX XXX", minLength: 9, maxLength: 9 },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "\uD83C\uDDEC\uD83C\uDDF7", format: "XXX XXX XXXX", minLength: 10, maxLength: 10 },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "\uD83C\uDDF9\uD83C\uDDF7", format: "XXX XXX XXXX", minLength: 10, maxLength: 10 },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "\uD83C\uDDF7\uD83C\uDDFA", format: "XXX XXX-XX-XX", minLength: 10, maxLength: 10 },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "\uD83C\uDDEF\uD83C\uDDF5", format: "XX-XXXX-XXXX", minLength: 10, maxLength: 10 },
  { code: "CN", name: "China", dialCode: "+86", flag: "\uD83C\uDDE8\uD83C\uDDF3", format: "XXX XXXX XXXX", minLength: 11, maxLength: 11 },
  { code: "IN", name: "India", dialCode: "+91", flag: "\uD83C\uDDEE\uD83C\uDDF3", format: "XXXXX XXXXX", minLength: 10, maxLength: 10 },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "\uD83C\uDDE6\uD83C\uDDFA", format: "XXXX XXX XXX", minLength: 9, maxLength: 9 },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "\uD83C\uDDE7\uD83C\uDDF7", format: "XX XXXXX-XXXX", minLength: 11, maxLength: 11 },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "\uD83C\uDDF2\uD83C\uDDFD", format: "XX XXXX XXXX", minLength: 10, maxLength: 10 },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "\uD83C\uDDF0\uD83C\uDDF7", format: "XX-XXXX-XXXX", minLength: 10, maxLength: 11 },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "\uD83C\uDDF8\uD83C\uDDE6", format: "XX XXX XXXX", minLength: 9, maxLength: 9 },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "\uD83C\uDDE6\uD83C\uDDEA", format: "XX XXX XXXX", minLength: 9, maxLength: 9 },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "\uD83C\uDDFF\uD83C\uDDE6", format: "XX XXX XXXX", minLength: 9, maxLength: 9 },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "\uD83C\uDDF3\uD83C\uDDEC", format: "XXX XXX XXXX", minLength: 10, maxLength: 10 },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "\uD83C\uDDEE\uD83C\uDDEA", format: "XX XXX XXXX", minLength: 9, maxLength: 9 },
];

function formatPhone(digits: string, format: string): string {
  let digitIdx = 0;
  let result = "";
  for (const ch of format) {
    if (ch === "X") {
      if (digitIdx < digits.length) {
        result += digits[digitIdx];
        digitIdx++;
      }
    } else {
      if (digitIdx < digits.length) {
        result += ch;
      }
    }
  }
  while (digitIdx < digits.length) {
    result += digits[digitIdx];
    digitIdx++;
  }
  return result;
}

export default function PhoneNumberFormatterTool() {
  const t = useTranslations("tools.phone-number-formatter");
  const tc = useTranslations("common");

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("US");

  const country = countries.find((c) => c.code === countryCode) || countries[0];
  const digits = phone.replace(/\D/g, "");

  const formatted = useMemo(() => {
    if (!digits) return null;

    const national = formatPhone(digits, country.format);
    const e164 = `${country.dialCode}${digits}`;
    const international = `${country.dialCode} ${national}`;

    const isValid = digits.length >= country.minLength && digits.length <= country.maxLength;

    return { national, e164, international, isValid };
  }, [digits, country]);

  return (
    <ToolLayout toolSlug="phone-number-formatter">
      <div className="space-y-6">
        {/* Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("country")}
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-teal"
            >
              {countries.map((c) => (
                <option key={`${c.code}-${c.dialCode}`} value={c.code}>
                  {c.flag} {c.name} ({c.dialCode})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("input_label")}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("input_placeholder")}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* Country info */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{country.name}</p>
              <p className="text-xs text-muted-foreground">
                {t("format")}: {country.format} | {country.dialCode} |{" "}
                {country.minLength === country.maxLength
                  ? `${country.minLength}`
                  : `${country.minLength}-${country.maxLength}`}{" "}
                digits
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        {formatted && digits.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {formatted.isValid ? (
                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                  Valid
                </span>
              ) : (
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">
                  {digits.length < country.minLength ? "Too short" : "Too long"}
                </span>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: t("national"), value: formatted.national },
                    { label: t("international"), value: formatted.international },
                    { label: t("e164"), value: formatted.e164 },
                  ].map(({ label, value }, i) => (
                    <tr
                      key={label}
                      className={`border-b border-border last:border-0 ${
                        i % 2 === 0 ? "bg-card" : "bg-surface/50"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap w-1/3">
                        {label}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        <div className="flex items-center justify-between gap-2">
                          <span>{value}</span>
                          <CopyButton text={value} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
