import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import SvgToPngTool from "./SvgToPngTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.svg-to-png" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/svg-to-png`,
      languages: {
        en: `${baseUrl}/tools/svg-to-png`,
        sq: `${baseUrl}/sq/tools/svg-to-png`,
      },
    },
  };
}

export default async function SvgToPngPage({
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
            name: "SVG to PNG - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/svg-to-png",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
          }),
        }}
      />
      <SvgToPngTool />
    </>
  );
}
