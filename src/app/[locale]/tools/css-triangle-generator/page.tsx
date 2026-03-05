import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import CssTriangleGeneratorTool from "./CssTriangleGeneratorTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.css-triangle-generator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/css-triangle-generator`,
      languages: {
        en: `${baseUrl}/tools/css-triangle-generator`,
        sq: `${baseUrl}/sq/tools/css-triangle-generator`,
      },
    },
  };
}

export default async function CssTriangleGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "CSS Triangle Generator - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/css-triangle-generator",
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
          }),
        }}
      />
      <CssTriangleGeneratorTool />
    </>
  );
}
