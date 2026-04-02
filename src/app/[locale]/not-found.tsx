import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center">
        <p className="text-sm font-semibold tracking-widest text-[#999] uppercase mb-8">
          Atlas Tools
        </p>

        <p className="text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter text-[#cb6a3f] select-none mb-6">
          404
        </p>

        <h1 className="text-xl sm:text-2xl font-bold text-[#37474b] mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-[#6b7b80] leading-relaxed mb-10 max-w-sm mx-auto">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {t("back_home")}
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7b80] hover:text-[#37474b] px-6 py-2.5 rounded-lg border border-[#ddd] hover:border-teal/30 transition-colors"
          >
            {t("back_tools")}
          </Link>
        </div>
      </div>
    </div>
  );
}
