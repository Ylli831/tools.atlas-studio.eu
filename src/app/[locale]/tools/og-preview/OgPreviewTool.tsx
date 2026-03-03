"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface OgData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
  type: string;
}

export default function OgPreviewTool() {
  const t = useTranslations("tools.og-preview");
  const tc = useTranslations("common");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [ogData, setOgData] = useState<OgData | null>(null);
  const [error, setError] = useState("");

  const fetchOg = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setOgData(null);
    try {
      const res = await fetch(`/api/og-fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOgData(data);
    } catch {
      setError(t("fetch_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolSlug="og-preview">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {t("url_label")}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOg()}
              placeholder={t("url_placeholder")}
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
            <button
              onClick={fetchOg}
              disabled={loading || !url.trim()}
              className="bg-teal text-white font-medium px-6 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? tc("processing") : t("preview")}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {ogData && (
          <div className="space-y-6">
            {/* Meta Tags Table */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">{t("meta_tags")}</h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["og:title", ogData.title],
                      ["og:description", ogData.description],
                      ["og:image", ogData.image],
                      ["og:site_name", ogData.siteName],
                      ["og:url", ogData.url],
                      ["og:type", ogData.type],
                    ].filter(([, v]) => v).map(([key, val]) => (
                      <tr key={key} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">{key}</td>
                        <td className="px-3 py-2 break-all">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Social Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook/LinkedIn Preview */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">{t("facebook_preview")}</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-w-md">
                  {ogData.image && (
                    <img src={ogData.image} alt="" className="w-full h-48 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-xs text-gray-500 uppercase">{ogData.siteName || new URL(url).hostname}</p>
                    <p className="font-semibold text-gray-900 line-clamp-2">{ogData.title || url}</p>
                    {ogData.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{ogData.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Twitter/X Preview */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">{t("twitter_preview")}</h3>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm max-w-md">
                  {ogData.image && (
                    <img src={ogData.image} alt="" className="w-full h-48 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{ogData.title || url}</p>
                    {ogData.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{ogData.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                      {new URL(url).hostname}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
