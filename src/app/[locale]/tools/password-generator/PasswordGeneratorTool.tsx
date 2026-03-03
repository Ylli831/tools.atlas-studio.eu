"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const AMBIGUOUS = "O0Il1";

function getStrength(
  length: number,
  charsetSize: number
): "weak" | "fair" | "strong" | "very_strong" {
  const entropy = length * Math.log2(charsetSize || 1);
  if (entropy < 36) return "weak";
  if (entropy < 60) return "fair";
  if (entropy < 80) return "strong";
  return "very_strong";
}

const STRENGTH_COLORS: Record<string, string> = {
  weak: "bg-red-400",
  fair: "bg-yellow-400",
  strong: "bg-teal",
  very_strong: "bg-green-500",
};

export default function PasswordGeneratorTool() {
  const t = useTranslations("tools.password-generator");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    let charset = "";
    if (uppercase) charset += CHARS.uppercase;
    if (lowercase) charset += CHARS.lowercase;
    if (numbers) charset += CHARS.numbers;
    if (symbols) charset += CHARS.symbols;
    if (!charset) charset = CHARS.lowercase;

    if (excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }

    const results: string[] = [];
    const arr = new Uint32Array(length);
    for (let i = 0; i < quantity; i++) {
      crypto.getRandomValues(arr);
      let pw = "";
      for (let j = 0; j < length; j++) {
        pw += charset[arr[j] % charset.length];
      }
      results.push(pw);
    }
    setPasswords(results);
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, quantity]);

  const charsetSize =
    (uppercase ? 26 : 0) +
    (lowercase ? 26 : 0) +
    (numbers ? 10 : 0) +
    (symbols ? CHARS.symbols.length : 0) -
    (excludeAmbiguous ? AMBIGUOUS.length : 0);

  const strength = getStrength(length, charsetSize);

  return (
    <ToolLayout toolSlug="password-generator">
      <div className="space-y-6">
        {/* Length slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-foreground">
              {t("length")}
            </label>
            <span className="text-sm font-mono text-teal">{length}</span>
          </div>
          <input
            type="range"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-teal"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { key: "uppercase", val: uppercase, set: setUppercase },
            { key: "lowercase", val: lowercase, set: setLowercase },
            { key: "numbers", val: numbers, set: setNumbers },
            { key: "symbols", val: symbols, set: setSymbols },
            { key: "exclude_ambiguous", val: excludeAmbiguous, set: setExcludeAmbiguous },
          ].map(({ key, val, set }) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => set(e.target.checked)}
                className="rounded border-border accent-teal"
              />
              {t(key)}
            </label>
          ))}
        </div>

        {/* Quantity + Generate */}
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("quantity")}
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(20, Number(e.target.value))))
              }
              className="w-24 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <button
            onClick={generate}
            className="bg-teal text-white font-medium px-6 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        </div>

        {/* Strength meter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">{t("strength")}</span>
            <span className="text-xs font-medium text-foreground">
              {t(strength)}
            </span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${STRENGTH_COLORS[strength]}`}
              style={{
                width: `${strength === "weak" ? 25 : strength === "fair" ? 50 : strength === "strong" ? 75 : 100}%`,
              }}
            />
          </div>
        </div>

        {/* Output */}
        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-card border border-border rounded-lg p-3"
              >
                <code className="flex-1 text-sm font-mono break-all select-all">
                  {pw}
                </code>
                <CopyButton text={pw} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
