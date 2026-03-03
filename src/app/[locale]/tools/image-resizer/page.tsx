import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ImageResizerTool from "./ImageResizerTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.image-resizer" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/image-resizer`,
      languages: {
        en: `${baseUrl}/tools/image-resizer`,
        sq: `${baseUrl}/sq/tools/image-resizer`,
      },
    },
  };
}

export default async function ImageResizerPage({
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
            name: "Image Resizer - Atlas Studio Tools",
            url: "https://tools.atlas-studio.eu/tools/image-resizer",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
          }),
        }}
      />
      <ImageResizerTool />
    </>
  );
}
