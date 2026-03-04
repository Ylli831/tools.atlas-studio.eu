"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// Permission bits: Owner (r=256, w=128, x=64), Group (r=32, w=16, x=8), Other (r=4, w=2, x=1)
const PERM_BITS = [
  [4, 2, 1], // owner: r,w,x in octal digit
  [4, 2, 1], // group
  [4, 2, 1], // other
];

const PRESETS = [
  { label: "644", value: 0o644, desc: "rw-r--r--" },
  { label: "755", value: 0o755, desc: "rwxr-xr-x" },
  { label: "777", value: 0o777, desc: "rwxrwxrwx" },
  { label: "600", value: 0o600, desc: "rw-------" },
  { label: "400", value: 0o400, desc: "r--------" },
];

function permToOctal(perms: boolean[][]): string {
  let result = "";
  for (let i = 0; i < 3; i++) {
    let digit = 0;
    if (perms[i][0]) digit += 4;
    if (perms[i][1]) digit += 2;
    if (perms[i][2]) digit += 1;
    result += digit;
  }
  return result;
}

function permToSymbolic(perms: boolean[][]): string {
  const chars = ["r", "w", "x"];
  let result = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      result += perms[i][j] ? chars[j] : "-";
    }
  }
  return result;
}

function octalToPerms(octal: string): boolean[][] | null {
  if (!/^[0-7]{3}$/.test(octal)) return null;
  return octal.split("").map((digit) => {
    const n = parseInt(digit, 10);
    return [!!(n & 4), !!(n & 2), !!(n & 1)];
  });
}

export default function ChmodCalculatorTool() {
  const t = useTranslations("tools.chmod-calculator");
  const [perms, setPerms] = useState<boolean[][]>([
    [true, true, true],   // owner: rwx
    [true, false, true],  // group: r-x
    [true, false, true],  // other: r-x
  ]);
  const [octalInput, setOctalInput] = useState("755");

  const octal = useMemo(() => permToOctal(perms), [perms]);
  const symbolic = useMemo(() => permToSymbolic(perms), [perms]);

  const togglePerm = useCallback((row: number, col: number) => {
    setPerms((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = !next[row][col];
      return next;
    });
    // Sync octal input
    setOctalInput((prev) => {
      const next = [...perms];
      next[row] = [...next[row]];
      next[row][col] = !next[row][col];
      return permToOctal(next);
    });
  }, [perms]);

  const handleOctalChange = (value: string) => {
    setOctalInput(value);
    if (/^[0-7]{3}$/.test(value)) {
      const newPerms = octalToPerms(value);
      if (newPerms) setPerms(newPerms);
    }
  };

  const applyPreset = (value: number) => {
    const octalStr = value.toString(8).padStart(3, "0");
    setOctalInput(octalStr);
    const newPerms = octalToPerms(octalStr);
    if (newPerms) setPerms(newPerms);
  };

  const entityLabels = [t("owner"), t("group"), t("other")];
  const permLabels = [t("read"), t("write"), t("execute")];

  return (
    <ToolLayout toolSlug="chmod-calculator">
      <div className="space-y-6">
        {/* Permission Grid */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-medium text-foreground px-4 py-3" />
                {permLabels.map((label) => (
                  <th key={label} className="text-center text-sm font-medium text-foreground px-4 py-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entityLabels.map((entity, row) => (
                <tr key={entity} className={row < 2 ? "border-b border-border" : ""}>
                  <td className="text-sm font-medium text-foreground px-4 py-3">{entity}</td>
                  {PERM_BITS[row].map((_, col) => (
                    <td key={col} className="text-center px-4 py-3">
                      <label className="inline-flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perms[row][col]}
                          onChange={() => togglePerm(row, col)}
                          className="w-5 h-5 rounded border-border text-teal focus:ring-teal/30 cursor-pointer accent-teal"
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">{t("octal")}</label>
              <CopyButton text={octal} />
            </div>
            <div className="text-3xl font-bold font-mono text-teal">{octal}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">{t("symbolic")}</label>
              <CopyButton text={symbolic} />
            </div>
            <div className="text-3xl font-bold font-mono text-teal">{symbolic}</div>
          </div>
        </div>

        {/* Octal Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("enter_octal")}
          </label>
          <input
            type="text"
            value={octalInput}
            onChange={(e) => handleOctalChange(e.target.value)}
            maxLength={3}
            placeholder="755"
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal max-w-[200px]"
          />
          {octalInput && !/^[0-7]{0,3}$/.test(octalInput) && (
            <p className="text-xs text-red-500 mt-1">{t("invalid_octal")}</p>
          )}
        </div>

        {/* Command Preview */}
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="block text-sm font-medium text-foreground mb-2">{t("command")}</label>
          <div className="flex items-center gap-2">
            <code className="bg-background rounded-lg px-4 py-2 text-sm font-mono text-foreground flex-1">
              chmod {octal} filename
            </code>
            <CopyButton text={`chmod ${octal} filename`} />
          </div>
        </div>

        {/* Presets */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">{t("presets")}</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.value)}
                className={`px-4 py-2 rounded-lg text-sm font-mono border transition-colors ${
                  octal === preset.label
                    ? "bg-teal text-white border-teal"
                    : "bg-card border-border text-foreground hover:border-teal"
                }`}
              >
                {preset.label} <span className="text-xs opacity-70">({preset.desc})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
