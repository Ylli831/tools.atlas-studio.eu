import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PomodoroTimerTool from "./PomodoroTimerTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.pomodoro-timer" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/pomodoro-timer`,
      languages: { en: `${baseUrl}/tools/pomodoro-timer`, sq: `${baseUrl}/sq/tools/pomodoro-timer` },
    },
  };
}

export default async function PomodoroTimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "Pomodoro Timer - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/pomodoro-timer",
        applicationCategory: "UtilityApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <PomodoroTimerTool />
    </>
  );
}
