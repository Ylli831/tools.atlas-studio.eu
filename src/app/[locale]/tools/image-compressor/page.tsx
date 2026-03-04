import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ImageCompressorTool from "./ImageCompressorTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.image-compressor" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/image-compressor`,
      languages: {
        en: `${baseUrl}/tools/image-compressor`,
        sq: `${baseUrl}/sq/tools/image-compressor`,
      },
    },
  };
}

export default async function ImageCompressorPage({
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
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Image Compressor - Atlas Studio Tools",
              url: "https://tools.atlas-studio.eu/tools/image-compressor",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Compress Images Online",
              step: [
                { "@type": "HowToStep", position: 1, name: "Upload image", text: "Drag and drop or select the image file you want to compress." },
                { "@type": "HowToStep", position: 2, name: "Adjust quality", text: "Use the quality slider to balance file size and image quality." },
                { "@type": "HowToStep", position: 3, name: "Download", text: "Click download to save the compressed image to your device." },
              ],
              tool: { "@type": "HowToTool", name: "Atlas Studio Image Compressor" },
            },
          ]),
        }}
      />
      <ImageCompressorTool />
    </>
  );
}
