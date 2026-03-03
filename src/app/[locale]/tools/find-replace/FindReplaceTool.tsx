"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function FindReplaceTool() {
  const t = useTranslations("tools.find-replace");
  const tc = useTranslations("common");
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const { output, count, error } = useMemo(() => {
    if (!text || !find) return { output: text, count: 0, error: "" };
    try {
      let pattern = find;
      if (!useRegex) pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (wholeWord) pattern = `\\b${pattern}\\b`;
      const flags = caseSensitive ? "g" : "gi";
      const re = new RegExp(pattern, flags);
      const matches = text.match(re);
      const count = matches ? matches.length : 0;
      const output = text.replace(re, replace);
      return { output, count, error: "" };
    } catch (e) {
      return { output: text, count: 0, error: e instanceof Error ? e.message : tc("error") };
    }
  }, [text, find, replace, caseSensitive, useRegex, wholeWord, tc]);

  return (
    <ToolLayout toolSlug="find-replace">
      <div className="space-y-4">
        {/* Find / Replace inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t("find_label")}</label>
            <input type="text" value={find} onChange={(e) => setFind(e.target.value)}
              placeholder={t("find_placeholder")}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t("replace_label")}</label>
            <input type="text" value={replace} onChange={(e) => setReplace(e.target.value)}
              placeholder={t("replace_placeholder")}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            { key: "case", label: t("case_sensitive"), val: caseSensitive, set: setCaseSensitive },
            { key: "regex", label: t("use_regex"), val: useRegex, set: setUseRegex },
            { key: "word", label: t("whole_word"), val: wholeWord, set: setWholeWord },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} />
              <span className="text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {find && !error && (
          <div className={`text-sm px-3 py-2 rounded-lg border ${count > 0 ? "bg-teal/5 border-teal/20 text-teal" : "bg-card border-border text-muted-foreground"}`}>
            {count > 0 ? t("found_count", { count }) : t("no_matches")}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">{t("input_label")}</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder={t("input_placeholder")} rows={10}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">{t("output_label")}</label>
              {output && output !== text && <CopyButton text={output} />}
            </div>
            <pre className="w-full h-[250px] rounded-xl border border-border bg-surface px-4 py-3 text-sm font-mono text-foreground overflow-auto whitespace-pre-wrap">
              {output || <span className="text-muted-foreground">{t("output_placeholder")}</span>}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
