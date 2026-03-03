"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import { generateLoremIpsum } from "@/lib/albanian-lorem";

export default function LoremIpsumTool() {
  const t = useTranslations("tools.lorem-ipsum-generator");
  const [language, setLanguage] = useState<"latin" | "albanian">("latin");
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    setOutput(generateLoremIpsum({ language, type, count, startWithLorem, includeHtml }));
  }, [language, type, count, startWithLorem, includeHtml]);

  return (
    <ToolLayout toolSlug="lorem-ipsum-generator">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("language")}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "latin" | "albanian")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value="latin">{t("latin")}</option>
              <option value="albanian">{t("albanian")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "words" | "sentences" | "paragraphs")}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value="words">{t("words")}</option>
              <option value="sentences">{t("sentences")}</option>
              <option value="paragraphs">{t("paragraphs")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("count")}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={generate}
              className="w-full bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
            >
              {t("generate")}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {language === "latin" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded border-border accent-teal"
              />
              {t("start_lorem")}
            </label>
          )}
          {type === "paragraphs" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={includeHtml}
                onChange={(e) => setIncludeHtml(e.target.checked)}
                className="rounded border-border accent-teal"
              />
              {t("include_html")}
            </label>
          )}
        </div>

        {output && (
          <div className="relative">
            <div className="absolute top-3 right-3">
              <CopyButton text={output} />
            </div>
            <textarea
              readOnly
              value={output}
              rows={12}
              className="w-full bg-card border border-border rounded-xl p-4 pr-24 text-sm font-serif leading-relaxed resize-y focus:outline-none"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
