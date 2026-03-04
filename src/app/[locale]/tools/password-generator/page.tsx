import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import PasswordGeneratorTool from "./PasswordGeneratorTool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tools.password-generator" });
  const baseUrl = "https://tools.atlas-studio.eu";
  const localePath = locale === "en" ? "" : `/${locale}`;

  return {
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}${localePath}/tools/password-generator`,
      languages: {
        en: `${baseUrl}/tools/password-generator`,
        sq: `${baseUrl}/sq/tools/password-generator`,
      },
    },
  };
}

export default async function PasswordGeneratorPage({
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
              name: "Password Generator - Atlas Studio Tools",
              url: "https://tools.atlas-studio.eu/tools/password-generator",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              creator: { "@type": "Organization", name: "Atlas Studio", url: "https://atlas-studio.eu" },
            },
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to Generate a Secure Password",
              step: [
                { "@type": "HowToStep", position: 1, name: "Set length", text: "Choose your desired password length using the slider." },
                { "@type": "HowToStep", position: 2, name: "Select options", text: "Toggle uppercase, lowercase, numbers, and special characters." },
                { "@type": "HowToStep", position: 3, name: "Copy password", text: "Click the copy button to copy the generated password to your clipboard." },
              ],
              tool: { "@type": "HowToTool", name: "Atlas Studio Password Generator" },
            },
          ]),
        }}
      />
      <PasswordGeneratorTool />
    </>
  );
}
