"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

interface DiffLine {
  type: "equal" | "added" | "removed";
  text: string;
  lineNum1?: number;
  lineNum2?: number;
}

export default function TextDiffTool() {
  const t = useTranslations("tools.text-diff");
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");

  const diff = useMemo(() => {
    if (!original && !modified) return [];
    return computeDiff(original, modified);
  }, [original, modified]);

  const stats = useMemo(() => {
    let added = 0, removed = 0, unchanged = 0;
    diff.forEach((line) => {
      if (line.type === "added") added++;
      else if (line.type === "removed") removed++;
      else unchanged++;
    });
    return { added, removed, unchanged };
  }, [diff]);

  return (
    <ToolLayout toolSlug="text-diff">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("original")}
            </label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder={t("original_placeholder")}
              rows={10}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t("modified")}
            </label>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder={t("modified_placeholder")}
              rows={10}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {diff.length > 0 && (
          <>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">+{stats.added} {t("added")}</span>
              <span className="text-red-500">-{stats.removed} {t("removed")}</span>
              <span className="text-muted-foreground">{stats.unchanged} {t("unchanged")}</span>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {diff.map((line, i) => (
                      <tr
                        key={i}
                        className={
                          line.type === "added"
                            ? "bg-green-50 dark:bg-green-950/20"
                            : line.type === "removed"
                            ? "bg-red-50 dark:bg-red-950/20"
                            : ""
                        }
                      >
                        <td className="px-2 py-0.5 text-muted-foreground text-right select-none w-10 border-r border-border">
                          {line.lineNum1 ?? ""}
                        </td>
                        <td className="px-2 py-0.5 text-muted-foreground text-right select-none w-10 border-r border-border">
                          {line.lineNum2 ?? ""}
                        </td>
                        <td className="px-2 py-0.5 select-none w-6 text-center">
                          {line.type === "added" ? (
                            <span className="text-green-600">+</span>
                          ) : line.type === "removed" ? (
                            <span className="text-red-500">-</span>
                          ) : null}
                        </td>
                        <td className="px-2 py-0.5 whitespace-pre-wrap break-all">
                          {line.text}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");

  // Simple LCS-based diff
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = m, j = n;
  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      stack.push({ type: "equal", text: linesA[i - 1], lineNum1: i, lineNum2: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: linesB[j - 1], lineNum2: j });
      j--;
    } else {
      stack.push({ type: "removed", text: linesA[i - 1], lineNum1: i });
      i--;
    }
  }

  while (stack.length) result.push(stack.pop()!);
  return result;
}
