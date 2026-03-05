import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import StopwatchTimerTool from "./StopwatchTimerTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.stopwatch-timer" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/stopwatch-timer`,
      languages: { en: `${baseUrl}/tools/stopwatch-timer`, sq: `${baseUrl}/sq/tools/stopwatch-timer` },
    },
  };
}

export default async function StopwatchTimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "Stopwatch & Timer - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/stopwatch-timer",
        applicationCategory: "UtilityApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <StopwatchTimerTool />
    </>
  );
}
