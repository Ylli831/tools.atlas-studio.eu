"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { format } from "sql-formatter";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, o.order_id, o.total_amount FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE u.is_active = 1 AND o.created_at >= '2024-01-01' GROUP BY u.id, u.name, u.email, o.order_id, o.total_amount HAVING o.total_amount > 100 ORDER BY o.total_amount DESC LIMIT 50`;

type SqlDialect = "sql" | "mysql" | "postgresql" | "transactsql" | "plsql";

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "sql", label: "SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "transactsql", label: "T-SQL" },
  { value: "plsql", label: "PL/SQL" },
];

export default function SqlFormatterTool() {
  const t = useTranslations("tools.sql-formatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<SqlDialect>("sql");
  const [indent, setIndent] = useState<number>(2);
  const [uppercase, setUppercase] = useState(true);
  const [error, setError] = useState("");

  const formatSql = useCallback(() => {
    if (!input.trim()) return;
    try {
      const result = format(input, {
        language: dialect,
        tabWidth: indent,
        keywordCase: uppercase ? "upper" : "preserve",
      });
      setOutput(result);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Format error");
      setOutput("");
    }
  }, [input, dialect, indent, uppercase]);

  const loadSample = () => {
    setInput(SAMPLE_SQL);
    setError("");
  };

  return (
    <ToolLayout toolSlug="sql-formatter">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("language")}
            </label>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as SqlDialect)}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              {DIALECTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("indent")}
            </label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal"
            >
              <option value={2}>{t("spaces_2")}</option>
              <option value={4}>{t("spaces_4")}</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-teal w-4 h-4"
            />
            {t("uppercase")}
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-foreground">{t("input_label")}</label>
            <button
              onClick={loadSample}
              className="text-xs text-teal hover:text-teal-hover transition-colors"
            >
              {t("load_sample")}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder={t("input_placeholder")}
            rows={8}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={formatSql}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm"
          >
            {t("name")}
          </button>
          {error && (
            <span className="text-sm text-danger font-medium flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {error}
            </span>
          )}
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-foreground">{t("output_label")}</label>
              <CopyButton text={output} />
            </div>
            <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
