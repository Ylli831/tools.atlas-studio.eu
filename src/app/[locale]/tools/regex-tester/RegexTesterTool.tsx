"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTesterTool() {
  const t = useTranslations("tools.regex-tester");
  const tc = useTranslations("common");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState("");

  const { matches, highlighted } = useMemo(() => {
    if (!pattern || !testString) return { matches: [] as MatchResult[], highlighted: "" };
    try {
      const regex = new RegExp(pattern, flags);
      setError("");
      const results: MatchResult[] = [];
      let match;

      if (flags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (!match[0]) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Build highlighted string
      let html = "";
      let lastIndex = 0;
      results.forEach((r) => {
        html += escapeHtml(testString.slice(lastIndex, r.index));
        html += `<mark class="bg-teal/20 text-teal rounded px-0.5">${escapeHtml(r.match)}</mark>`;
        lastIndex = r.index + r.match.length;
      });
      html += escapeHtml(testString.slice(lastIndex));

      return { matches: results, highlighted: html };
    } catch (e) {
      setError((e as Error).message);
      return { matches: [] as MatchResult[], highlighted: "" };
    }
  }, [pattern, flags, testString]);

  const flagOptions = [
    { flag: "g", label: t("global") },
    { flag: "i", label: t("case_insensitive") },
    { flag: "m", label: t("multiline") },
    { flag: "s", label: t("dotall") },
  ];

  const toggleFlag = (flag: string) => {
    setFlags((prev) => prev.includes(flag) ? prev.replace(flag, "") : prev + flag);
  };

  return (
    <ToolLayout toolSlug="regex-tester">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("pattern")}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-lg">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t("pattern_placeholder")}
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
            />
            <span className="text-muted-foreground text-lg">/</span>
            <span className="text-sm font-mono text-teal">{flags}</span>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {flagOptions.map(({ flag, label }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                flags.includes(flag)
                  ? "bg-teal text-white border-teal"
                  : "bg-surface border-border hover:border-teal"
              }`}
            >
              {flag} — {label}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("test_string")}
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder={t("test_placeholder")}
            rows={6}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
          />
        </div>

        {highlighted && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("highlighted")}
            </label>
            <div
              className="bg-card border border-border rounded-xl p-4 text-sm font-mono whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        )}

        {matches.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              {t("matches")} ({matches.length})
            </p>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">#</th>
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("match")}</th>
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("index")}</th>
                    <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("groups")}</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2 font-mono text-teal">{m.match || t("empty_match")}</td>
                      <td className="px-3 py-2 text-muted-foreground">{m.index}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {m.groups.length > 0 ? m.groups.join(", ") : "—"}
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

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
