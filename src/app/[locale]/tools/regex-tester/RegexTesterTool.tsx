"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

const COMMON_PATTERNS = [
  { key: "email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", sample: "Contact us at hello@example.com or support@atlas-studio.eu for help." },
  { key: "url", pattern: "https?://[\\w.-]+(?:\\.[a-zA-Z]{2,})(?:/[\\w./?#&=-]*)?", sample: "Visit https://atlas-studio.eu or http://example.com/path?q=test for more." },
  { key: "ipv4", pattern: "\\b(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b", sample: "Server IPs: 192.168.1.1, 10.0.0.255, 999.999.999.999 (invalid)." },
  { key: "phone", pattern: "\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}", sample: "Call us at +1-555-123-4567 or +355 69 123 4567." },
  { key: "date_iso", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", sample: "Events on 2026-03-13, 2026-12-25, and 2026-99-99 (invalid)." },
  { key: "hex_color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", sample: "Brand colors: #487877 (teal), #cb6a3f (terracotta), #f5f3ef (cream)." },
  { key: "html_tag", pattern: "</?[a-zA-Z][a-zA-Z0-9]*(?:\\s[^>]*)?>", sample: "<div class=\"container\"><p>Hello</p></div>" },
  { key: "credit_card", pattern: "\\b(?:4\\d{3}|5[1-5]\\d{2}|3[47]\\d{2}|6011)[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b", sample: "Cards: 4111-1111-1111-1111, 5500 0000 0000 0004." },
];

export default function RegexTesterTool() {
  const t = useTranslations("tools.regex-tester");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);

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

  const loadPattern = (p: typeof COMMON_PATTERNS[number]) => {
    setPattern(p.pattern);
    setTestString(p.sample);
    setFlags("g");
    setShowLibrary(false);
  };

  return (
    <ToolLayout toolSlug="regex-tester">
      <div className="space-y-6">
        {/* Pattern library toggle */}
        <div>
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="text-sm text-teal hover:underline flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            {t("pattern_library")}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showLibrary ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showLibrary && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_PATTERNS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => loadPattern(p)}
                  className="text-left bg-card border border-border rounded-lg px-3 py-2 hover:border-teal transition-colors"
                >
                  <span className="text-sm font-medium text-foreground block">{t(`lib_${p.key}`)}</span>
                  <span className="text-xs text-muted-foreground font-mono truncate block mt-0.5">{p.pattern.slice(0, 30)}…</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
              {flag}: {label}
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
                        {m.groups.length > 0 ? m.groups.join(", ") : "-"}
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
