import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SvgOptimizerTool from "./SvgOptimizerTool";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.svg-optimizer" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;
  return {
    title: t("name"), description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/svg-optimizer`,
      languages: { en: `${baseUrl}/tools/svg-optimizer`, sq: `${baseUrl}/sq/tools/svg-optimizer` },
    },
  };
}

export default async function SvgOptimizerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebApplication",
        name: "SVG Optimizer - Atlas Studio Tools",
        url: "https://tools.atlas-studio.eu/tools/svg-optimizer",
        applicationCategory: "MultimediaApplication", operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
      }) }} />
      <SvgOptimizerTool />
    </>
  );
}
