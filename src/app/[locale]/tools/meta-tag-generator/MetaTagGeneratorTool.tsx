"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  twitterCard: string;
  twitterSite: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  viewport: string;
  charset: string;
  language: string;
}

function generateMetaTags(data: MetaData): string {
  const tags: string[] = [];

  if (data.charset) tags.push(`<meta charset="${data.charset}" />`);
  if (data.viewport) tags.push(`<meta name="viewport" content="${data.viewport}" />`);
  if (data.title) tags.push(`<title>${data.title}</title>`);
  if (data.description) tags.push(`<meta name="description" content="${data.description}" />`);
  if (data.keywords) tags.push(`<meta name="keywords" content="${data.keywords}" />`);
  if (data.author) tags.push(`<meta name="author" content="${data.author}" />`);
  if (data.robots) tags.push(`<meta name="robots" content="${data.robots}" />`);
  if (data.language) tags.push(`<meta http-equiv="content-language" content="${data.language}" />`);
  if (data.canonicalUrl) tags.push(`<link rel="canonical" href="${data.canonicalUrl}" />`);

  // Open Graph
  if (data.ogTitle || data.title) tags.push(`<meta property="og:title" content="${data.ogTitle || data.title}" />`);
  if (data.ogDescription || data.description) tags.push(`<meta property="og:description" content="${data.ogDescription || data.description}" />`);
  if (data.ogType) tags.push(`<meta property="og:type" content="${data.ogType}" />`);
  if (data.ogUrl || data.canonicalUrl) tags.push(`<meta property="og:url" content="${data.ogUrl || data.canonicalUrl}" />`);
  if (data.ogImage) tags.push(`<meta property="og:image" content="${data.ogImage}" />`);

  // Twitter Card
  if (data.twitterCard) tags.push(`<meta name="twitter:card" content="${data.twitterCard}" />`);
  if (data.twitterSite) tags.push(`<meta name="twitter:site" content="${data.twitterSite}" />`);
  if (data.twitterTitle || data.title) tags.push(`<meta name="twitter:title" content="${data.twitterTitle || data.title}" />`);
  if (data.twitterDescription || data.description) tags.push(`<meta name="twitter:description" content="${data.twitterDescription || data.description}" />`);
  if (data.twitterImage || data.ogImage) tags.push(`<meta name="twitter:image" content="${data.twitterImage || data.ogImage}" />`);

  return tags.join("\n");
}

export default function MetaTagGeneratorTool() {
  const t = useTranslations("tools.meta-tag-generator");
  const tc = useTranslations("common");
  const [data, setData] = useState<MetaData>({
    title: "",
    description: "",
    keywords: "",
    author: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    ogUrl: "",
    twitterCard: "summary_large_image",
    twitterSite: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1",
    charset: "UTF-8",
    language: "en",
  });

  const output = useMemo(() => generateMetaTags(data), [data]);

  const updateField = (field: keyof MetaData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const charCount = data.title.length;
  const descCharCount = data.description.length;

  return (
    <ToolLayout toolSlug="meta-tag-generator">
      <div className="space-y-6">
        {/* Basic Meta Tags */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">{t("basic_meta")}</h2>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">{t("title")}</label>
              <span className={`text-xs ${charCount > 60 ? "text-danger" : "text-muted-foreground"}`}>
                {charCount}/60
              </span>
            </div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder={t("title_placeholder")}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">{t("description_label")}</label>
              <span className={`text-xs ${descCharCount > 160 ? "text-danger" : "text-muted-foreground"}`}>
                {descCharCount}/160
              </span>
            </div>
            <textarea
              value={data.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder={t("description_placeholder")}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("keywords")}</label>
              <input
                type="text"
                value={data.keywords}
                onChange={(e) => updateField("keywords", e.target.value)}
                placeholder={t("keywords_placeholder")}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("author")}</label>
              <input
                type="text"
                value={data.author}
                onChange={(e) => updateField("author", e.target.value)}
                placeholder={t("author_placeholder")}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("canonical_url")}</label>
              <input
                type="url"
                value={data.canonicalUrl}
                onChange={(e) => updateField("canonicalUrl", e.target.value)}
                placeholder="https://example.com/page"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("robots")}</label>
              <select
                value={data.robots}
                onChange={(e) => updateField("robots", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">{t("open_graph")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("og_type")}</label>
              <select
                value={data.ogType}
                onChange={(e) => updateField("ogType", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("og_image")}</label>
              <input
                type="url"
                value={data.ogImage}
                onChange={(e) => updateField("ogImage", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        {/* Twitter Card */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">{t("twitter_card")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("twitter_card_type")}</label>
              <select
                value={data.twitterCard}
                onChange={(e) => updateField("twitterCard", e.target.value)}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              >
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("twitter_site")}</label>
              <input
                type="text"
                value={data.twitterSite}
                onChange={(e) => updateField("twitterSite", e.target.value)}
                placeholder="@username"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">{t("output_label")}</label>
            <CopyButton text={output} />
          </div>
          <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
            {output || tc("fill_fields")}
          </pre>
        </div>

        {/* Google Preview */}
        {data.title && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{t("google_preview")}</label>
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="text-blue-700 text-lg truncate">{data.title}</div>
              <div className="text-green-700 text-sm">{data.canonicalUrl || "https://example.com"}</div>
              <div className="text-gray-600 text-sm line-clamp-2">{data.description || t("no_description")}</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
