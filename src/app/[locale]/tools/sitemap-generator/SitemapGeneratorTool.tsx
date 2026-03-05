"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface SitemapEntry {
  id: string;
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function generateSitemapXml(entries: SitemapEntry[]): string {
  const validEntries = entries.filter((e) => e.url.trim());
  if (validEntries.length === 0) return "";

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of validEntries) {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(entry.url.trim())}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }
    xml += "  </url>\n";
  }

  xml += "</urlset>";
  return xml;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function SitemapGeneratorTool() {
  const t = useTranslations("tools.sitemap-generator");
  const tc = useTranslations("common");
  const [entries, setEntries] = useState<SitemapEntry[]>([
    {
      id: generateId(),
      url: "",
      lastmod: getTodayDate(),
      changefreq: "weekly",
      priority: "1.0",
    },
  ]);
  const [bulkUrls, setBulkUrls] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const output = useMemo(() => generateSitemapXml(entries), [entries]);

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      {
        id: generateId(),
        url: "",
        lastmod: getTodayDate(),
        changefreq: "weekly",
        priority: "0.5",
      },
    ]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateEntry = useCallback((id: string, field: keyof SitemapEntry, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }, []);

  const handleBulkAdd = useCallback(() => {
    const urls = bulkUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) return;

    const newEntries = urls.map((url) => ({
      id: generateId(),
      url,
      lastmod: getTodayDate(),
      changefreq: "weekly",
      priority: "0.5",
    }));

    setEntries((prev) => [...prev, ...newEntries]);
    setBulkUrls("");
    setShowBulk(false);
  }, [bulkUrls]);

  const setAllChangefreq = useCallback((value: string) => {
    setEntries((prev) => prev.map((e) => ({ ...e, changefreq: value })));
  }, []);

  const setAllPriority = useCallback((value: string) => {
    setEntries((prev) => prev.map((e) => ({ ...e, priority: value })));
  }, []);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClearAll = useCallback(() => {
    setEntries([
      {
        id: generateId(),
        url: "",
        lastmod: getTodayDate(),
        changefreq: "weekly",
        priority: "1.0",
      },
    ]);
  }, []);

  return (
    <ToolLayout toolSlug="sitemap-generator">
      <div className="space-y-6">
        {/* Bulk Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={addEntry}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            + {t("add_url")}
          </button>
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {t("bulk_add")}
          </button>
          <button
            onClick={handleClearAll}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {tc("clear")}
          </button>
          <span className="text-sm text-muted-foreground ml-auto">
            {entries.filter((e) => e.url.trim()).length} {t("urls")}
          </span>
        </div>

        {/* Bulk URL Input */}
        {showBulk && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <label className="text-sm font-medium text-foreground block">{t("bulk_urls_label")}</label>
            <textarea
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              placeholder={t("bulk_urls_placeholder")}
              rows={5}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal resize-y"
            />
            <button
              onClick={handleBulkAdd}
              disabled={!bulkUrls.trim()}
              className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
            >
              {t("add_urls")}
            </button>
          </div>
        )}

        {/* Batch Operations */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm font-medium text-foreground mb-3">{t("apply_to_all")}</div>
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-sm text-foreground">
              {t("changefreq")}
              <select
                onChange={(e) => setAllChangefreq(e.target.value)}
                className="bg-surface border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-teal"
                defaultValue=""
              >
                <option value="" disabled>{t("select")}</option>
                <option value="always">always</option>
                <option value="hourly">hourly</option>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
                <option value="never">never</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              {t("priority")}
              <select
                onChange={(e) => setAllPriority(e.target.value)}
                className="bg-surface border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-teal"
                defaultValue=""
              >
                <option value="" disabled>{t("select")}</option>
                <option value="1.0">1.0</option>
                <option value="0.9">0.9</option>
                <option value="0.8">0.8</option>
                <option value="0.7">0.7</option>
                <option value="0.6">0.6</option>
                <option value="0.5">0.5</option>
                <option value="0.4">0.4</option>
                <option value="0.3">0.3</option>
                <option value="0.2">0.2</option>
                <option value="0.1">0.1</option>
                <option value="0.0">0.0</option>
              </select>
            </label>
          </div>
        </div>

        {/* URL Entries */}
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div key={entry.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground">URL #{index + 1}</span>
                {entries.length > 1 && (
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-xs text-danger hover:text-danger/80 transition-colors"
                  >
                    {tc("remove")}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <input
                  type="url"
                  value={entry.url}
                  onChange={(e) => updateEntry(entry.id, "url", e.target.value)}
                  placeholder="https://example.com/page"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal"
                />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t("last_modified")}</label>
                    <input
                      type="date"
                      value={entry.lastmod}
                      onChange={(e) => updateEntry(entry.id, "lastmod", e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t("changefreq")}</label>
                    <select
                      value={entry.changefreq}
                      onChange={(e) => updateEntry(entry.id, "changefreq", e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-teal"
                    >
                      <option value="always">always</option>
                      <option value="hourly">hourly</option>
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                      <option value="never">never</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t("priority")}</label>
                    <select
                      value={entry.priority}
                      onChange={(e) => updateEntry(entry.id, "priority", e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-teal"
                    >
                      <option value="1.0">1.0</option>
                      <option value="0.9">0.9</option>
                      <option value="0.8">0.8</option>
                      <option value="0.7">0.7</option>
                      <option value="0.6">0.6</option>
                      <option value="0.5">0.5</option>
                      <option value="0.4">0.4</option>
                      <option value="0.3">0.3</option>
                      <option value="0.2">0.2</option>
                      <option value="0.1">0.1</option>
                      <option value="0.0">0.0</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">{t("output_label")}</label>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-teal text-white font-medium px-3 py-1.5 rounded-lg hover:bg-teal-hover transition-colors text-xs"
                >
                  {t("download_sitemap")}
                </button>
                <CopyButton text={output} />
              </div>
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
