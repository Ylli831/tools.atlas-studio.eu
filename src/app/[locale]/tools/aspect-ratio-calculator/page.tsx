import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import AspectRatioCalculatorTool from "./AspectRatioCalculatorTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.aspect-ratio-calculator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/aspect-ratio-calculator`,
      languages: { en: `${baseUrl}/tools/aspect-ratio-calculator`, sq: `${baseUrl}/sq/tools/aspect-ratio-calculator` },
    },
  };
}

export default async function AspectRatioCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "Aspect Ratio Calculator - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/aspect-ratio-calculator",
        applicationCategory: "UtilityApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <AspectRatioCalculatorTool />
    </>
  );
}
