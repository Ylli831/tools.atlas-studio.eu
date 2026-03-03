import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tools.atlas-studio.eu";
  const locales = ["en", "sq"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;

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

    entries.push({
      url: `${baseUrl}${prefix}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
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
