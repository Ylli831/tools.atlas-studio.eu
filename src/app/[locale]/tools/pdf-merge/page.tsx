import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PdfMergeTool from "./PdfMergeTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.pdf-merge" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/pdf-merge`,
      languages: {
        en: `${baseUrl}/tools/pdf-merge`,
        sq: `${baseUrl}/sq/tools/pdf-merge`,
      },
    },
  };
}

export default async function PdfMergePage({
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
            name: "PDF Merge - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/pdf-merge",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
          }),
        }}
      />
      <PdfMergeTool />
    </>
  );
}
