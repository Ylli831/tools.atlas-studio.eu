import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AsciiArtGeneratorTool from "./AsciiArtGeneratorTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.ascii-art-generator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/ascii-art-generator`,
      languages: { en: `${baseUrl}/tools/ascii-art-generator`, sq: `${baseUrl}/sq/tools/ascii-art-generator` },
    },
  };
}

export default async function AsciiArtGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "ASCII Art Generator - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/ascii-art-generator",
        applicationCategory: "UtilityApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <AsciiArtGeneratorTool />
    </>
  );
}
