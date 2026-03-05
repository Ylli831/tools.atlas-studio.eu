"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Rule {
  id: string;
  userAgent: string;
  allow: string[];
  disallow: string[];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function RobotsTxtGeneratorTool() {
  const t = useTranslations("tools.robots-txt-generator");
  const tc = useTranslations("common");
  const [rules, setRules] = useState<Rule[]>([
    { id: generateId(), userAgent: "*", allow: ["/"], disallow: [] },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");

  const addRule = useCallback(() => {
    setRules((prev) => [
      ...prev,
      { id: generateId(), userAgent: "*", allow: [], disallow: [] },
    ]);
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRule = useCallback(
    (id: string, field: keyof Rule, value: string | string[]) => {
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    },
    []
  );

  const addPath = useCallback(
    (ruleId: string, type: "allow" | "disallow") => {
      setRules((prev) =>
        prev.map((r) =>
          r.id === ruleId ? { ...r, [type]: [...r[type], "/"] } : r
        )
      );
    },
    []
  );

  const updatePath = useCallback(
    (ruleId: string, type: "allow" | "disallow", index: number, value: string) => {
      setRules((prev) =>
        prev.map((r) => {
          if (r.id !== ruleId) return r;
          const paths = [...r[type]];
          paths[index] = value;
          return { ...r, [type]: paths };
        })
      );
    },
    []
  );

  const removePath = useCallback(
    (ruleId: string, type: "allow" | "disallow", index: number) => {
      setRules((prev) =>
        prev.map((r) => {
          if (r.id !== ruleId) return r;
          const paths = r[type].filter((_, i) => i !== index);
          return { ...r, [type]: paths };
        })
      );
    },
    []
  );

  const output = useMemo(() => {
    const lines: string[] = [];

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (i > 0) lines.push("");
      lines.push(`User-agent: ${rule.userAgent}`);

      if (crawlDelay && rule.userAgent === "*") {
        lines.push(`Crawl-delay: ${crawlDelay}`);
      }

      for (const path of rule.disallow) {
        if (path.trim()) lines.push(`Disallow: ${path.trim()}`);
      }
      for (const path of rule.allow) {
        if (path.trim()) lines.push(`Allow: ${path.trim()}`);
      }
    }

    if (sitemapUrl.trim()) {
      lines.push("");
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    return lines.join("\n");
  }, [rules, sitemapUrl, crawlDelay]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "robots.txt";
    link.click();
    URL.revokeObjectURL(url);
  }, [output]);

  return (
    <ToolLayout toolSlug="robots-txt-generator">
      <div className="space-y-4">
        {rules.map((rule, ruleIndex) => (
          <div key={rule.id} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                {t("user_agent")} #{ruleIndex + 1}
              </label>
              {rules.length > 1 && (
                <button
                  onClick={() => removeRule(rule.id)}
                  className="text-xs text-danger hover:text-danger/80 transition-colors"
                >
                  {tc("remove")}
                </button>
              )}
            </div>

            <input
              type="text"
              value={rule.userAgent}
              onChange={(e) => updateRule(rule.id, "userAgent", e.target.value)}
              placeholder="*"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
            />

            {/* Disallow paths */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("disallow")}
                </label>
                <button
                  onClick={() => addPath(rule.id, "disallow")}
                  className="text-xs text-teal hover:text-teal-hover transition-colors font-medium"
                >
                  + {t("add_rule")}
                </button>
              </div>
              {rule.disallow.map((path, pathIndex) => (
                <div key={pathIndex} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => updatePath(rule.id, "disallow", pathIndex, e.target.value)}
                    placeholder="/private/"
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-teal"
                  />
                  <button
                    onClick={() => removePath(rule.id, "disallow", pathIndex)}
                    className="text-xs text-danger px-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            {/* Allow paths */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("allow")}
                </label>
                <button
                  onClick={() => addPath(rule.id, "allow")}
                  className="text-xs text-teal hover:text-teal-hover transition-colors font-medium"
                >
                  + {t("add_rule")}
                </button>
              </div>
              {rule.allow.map((path, pathIndex) => (
                <div key={pathIndex} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => updatePath(rule.id, "allow", pathIndex, e.target.value)}
                    placeholder="/"
                    className="flex-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-teal"
                  />
                  <button
                    onClick={() => removePath(rule.id, "allow", pathIndex)}
                    className="text-xs text-danger px-2"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addRule}
          className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm w-full"
        >
          + {t("add_rule")}
        </button>

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t("sitemap_url")}
            </label>
            <input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Crawl-delay
            </label>
            <input
              type="number"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              placeholder="10"
              min="0"
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleDownload}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("generate")}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">
              {t("output_label")}
            </label>
            <CopyButton text={output} />
          </div>
          <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre">
            {output}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}
