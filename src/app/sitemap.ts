import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tools.atlas-studio.eu";
  const locales = ["sq", "en"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === "sq" ? "" : `/${locale}`;

    entries.push({
      url: `${baseUrl}${prefix}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    });

    entries.push({
      url: `${baseUrl}${prefix}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    });

    for (const tool of tools) {
      entries.push({
        url: `${baseUrl}${prefix}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
