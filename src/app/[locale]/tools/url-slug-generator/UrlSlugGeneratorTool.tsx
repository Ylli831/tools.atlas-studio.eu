"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function slugify(text: string, opts: { separator: string; lowercase: boolean; removeStopWords: boolean }): string {
  const STOP_WORDS = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"]);

  let result = text
    // Normalize accents (e.g. ë → e, ç → c, ä → a)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace special chars
    .replace(/[&+]/g, "-and-")
    .replace(/[@]/g, "-at-")
    // Remove non-alphanumeric (except spaces and hyphens)
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim();

  if (opts.lowercase) result = result.toLowerCase();

  let words = result.split(/\s+/).filter(Boolean);
  if (opts.removeStopWords) words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));

  return words.join(opts.separator).replace(new RegExp(`[${opts.separator}]{2,}`, "g"), opts.separator);
}

export default function UrlSlugGeneratorTool() {
  const t = useTranslations("tools.url-slug-generator");
  const [input, setInput] = useState("Hello World! This is a Test Article");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);

  const slug = useMemo(() => {
    if (!input.trim()) return "";
    return slugify(input, { separator, lowercase, removeStopWords });
  }, [input, separator, lowercase, removeStopWords]);

  return (
    <ToolLayout toolSlug="url-slug-generator">
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">{t("input_label")}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={t("input_placeholder")} rows={3}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t("separator")}</label>
            <div className="flex gap-2">
              {["-", "_", "."].map((s) => (
                <button key={s} onClick={() => setSeparator(s)}
                  className={`w-10 py-1.5 rounded-lg border text-sm font-mono transition-colors ${separator === s ? "border-teal bg-teal/10 text-teal" : "border-border text-muted-foreground hover:border-teal"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
              <span>{t("lowercase")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={removeStopWords} onChange={(e) => setRemoveStopWords(e.target.checked)} />
              <span>{t("remove_stop_words")}</span>
            </label>
          </div>
        </div>

        {/* Result */}
        {slug && (
          <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">{t("result_label")}</label>
              <CopyButton text={slug} />
            </div>
            <p className="font-mono text-lg text-teal break-all">{slug}</p>
          </div>
        )}

        {/* Examples */}
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">{t("examples")}</p>
          <div className="space-y-1">
            {[
              "10 Best Tips for SEO in 2024",
              "Hëllo Wörld — Ça va?",
              "My Article: A Guide to Web Dev",
            ].map((ex) => (
              <button key={ex} onClick={() => setInput(ex)}
                className="block text-teal hover:underline text-sm"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
