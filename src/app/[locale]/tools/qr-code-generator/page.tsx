import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import QrCodeTool from "./QrCodeTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.qr-code-generator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/qr-code-generator`,
      languages: {
        en: `${baseUrl}/tools/qr-code-generator`,
        sq: `${baseUrl}/sq/tools/qr-code-generator`,
      },
    },
  };
}

export default async function QrCodePage({
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
              name: "QR Code Generator - Atlas Studio Tools",
              url: "https://tools.atlas-studio.eu/tools/qr-code-generator",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Generate a Print-Ready QR Code",
              step: [
                { "@type": "HowToStep", position: 1, name: "Enter content", text: "Type or paste the URL, text, WiFi credentials, email or phone number you want to encode." },
                { "@type": "HowToStep", position: 2, name: "Style it", text: "Pick a style preset or customize dot shape, corner shape, colors and gradient to match your brand." },
                { "@type": "HowToStep", position: 3, name: "Add your logo", text: "Optionally upload a PNG, JPG or SVG logo. A clean white halo is added automatically so the logo stays readable." },
                { "@type": "HowToStep", position: 4, name: "Download", text: "Export as vector SVG or PDF for print on business cards, or PNG for screen use." },
              ],
              tool: { "@type": "HowToTool", name: "Atlas Studio QR Code Generator" },
            },
          ]),
        }}
      />
      <QrCodeTool />
    </>
  );
}
