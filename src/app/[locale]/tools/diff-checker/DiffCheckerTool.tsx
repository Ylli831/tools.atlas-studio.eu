"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { diffLines, diffWords } from "diff";
import ToolLayout from "@/components/ToolLayout";

type ViewMode = "inline" | "side";

export default function DiffCheckerTool() {
  const t = useTranslations("tools.diff-checker");
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("inline");

  const lineDiff = useMemo(() => {
    if (!original && !modified) return [];
    return diffLines(original, modified);
  }, [original, modified]);

  const wordDiff = useMemo(() => {
    if (!original && !modified) return [];
    return diffWords(original, modified);
  }, [original, modified]);

  const stats = useMemo(() => {
    let additions = 0;
    let deletions = 0;
    for (const part of lineDiff) {
      const lineCount = part.value.split("\n").filter((l) => l.length > 0).length || 1;
      if (part.added) additions += lineCount;
      else if (part.removed) deletions += lineCount;
    }
    return { additions, deletions };
  }, [lineDiff]);

  const hasDiff = original.length > 0 || modified.length > 0;

  const renderInlineDiff = useCallback(() => {
    return (
      <div className="bg-card border border-border rounded-xl p-4 overflow-auto max-h-[500px] font-mono text-sm">
        {lineDiff.map((part, i) => {
          const lines = part.value.split("\n");
          return lines.map((line, j) => {
            if (j === lines.length - 1 && line === "") return null;
            return (
              <div
                key={`${i}-${j}`}
                className={`px-2 py-0.5 ${
                  part.added
                    ? "bg-success/15 text-success"
                    : part.removed
                    ? "bg-danger/15 text-danger line-through"
                    : "text-foreground"
                }`}
              >
                <span className="inline-block w-5 mr-2 text-muted-foreground text-xs select-none">
                  {part.added ? "+" : part.removed ? "-" : " "}
                </span>
                {line || " "}
              </div>
            );
          });
        })}
      </div>
    );
  }, [lineDiff]);

  const renderSideBySide = useCallback(() => {
    const leftLines: { text: string; type: "removed" | "unchanged" | "empty" }[] = [];
    const rightLines: { text: string; type: "added" | "unchanged" | "empty" }[] = [];

    for (const part of lineDiff) {
      const lines = part.value.split("\n").filter((_, idx, arr) => !(idx === arr.length - 1 && arr[idx] === ""));

      if (part.added) {
        for (const line of lines) {
          leftLines.push({ text: "", type: "empty" });
          rightLines.push({ text: line, type: "added" });
        }
      } else if (part.removed) {
        for (const line of lines) {
          leftLines.push({ text: line, type: "removed" });
          rightLines.push({ text: "", type: "empty" });
        }
      } else {
        for (const line of lines) {
          leftLines.push({ text: line, type: "unchanged" });
          rightLines.push({ text: line, type: "unchanged" });
        }
      }
    }

    const maxLen = Math.max(leftLines.length, rightLines.length);

    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card border border-border rounded-xl p-3 overflow-auto max-h-[500px] font-mono text-sm">
          {Array.from({ length: maxLen }).map((_, i) => {
            const line = leftLines[i] || { text: "", type: "empty" as const };
            return (
              <div
                key={i}
                className={`px-2 py-0.5 min-h-[1.5em] ${
                  line.type === "removed"
                    ? "bg-danger/15 text-danger line-through"
                    : line.type === "empty"
                    ? "bg-surface/50"
                    : "text-foreground"
                }`}
              >
                {line.text || "\u00A0"}
              </div>
            );
          })}
        </div>
        <div className="bg-card border border-border rounded-xl p-3 overflow-auto max-h-[500px] font-mono text-sm">
          {Array.from({ length: maxLen }).map((_, i) => {
            const line = rightLines[i] || { text: "", type: "empty" as const };
            return (
              <div
                key={i}
                className={`px-2 py-0.5 min-h-[1.5em] ${
                  line.type === "added"
                    ? "bg-success/15 text-success"
                    : line.type === "empty"
                    ? "bg-surface/50"
                    : "text-foreground"
                }`}
              >
                {line.text || "\u00A0"}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [lineDiff]);

  return (
    <ToolLayout toolSlug="diff-checker">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("original")}
            </label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder={t("original_placeholder")}
              rows={10}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("modified")}
            </label>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder={t("modified_placeholder")}
              rows={10}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
              spellCheck={false}
            />
          </div>
        </div>

        {hasDiff && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-success/30 inline-block" />
                  <span className="text-foreground font-medium">{stats.additions}</span>
                  <span className="text-muted-foreground">{t("additions")}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-danger/30 inline-block" />
                  <span className="text-foreground font-medium">{stats.deletions}</span>
                  <span className="text-muted-foreground">{t("deletions")}</span>
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("inline")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === "inline" ? "bg-teal text-white" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {t("inline_view")}
                </button>
                <button
                  onClick={() => setViewMode("side")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    viewMode === "side" ? "bg-teal text-white" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {t("side_view")}
                </button>
              </div>
            </div>

            {viewMode === "inline" ? renderInlineDiff() : renderSideBySide()}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
