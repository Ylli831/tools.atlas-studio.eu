"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";

export default function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === "sq" ? "en" : "sq";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Switch language"
    >
      <Image
        src={locale === "sq" ? "/flags/gb.svg" : "/flags/xk.svg"}
        alt={locale === "sq" ? "English" : "Shqip"}
        width={20}
        height={14}
        className="rounded-sm"
      />
      <span>{locale === "sq" ? "EN" : "SQ"}</span>
    </button>
  );
}
