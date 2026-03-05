"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : "";
    return `<pre><code${langAttr}>${escapeHtml(code.trimEnd())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rules
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "<hr />");

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Unordered lists
  const lines = html.split("\n");
  let inUl = false;
  let inOl = false;
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[-*+]\s+(.+)$/);
    const olMatch = line.match(/^\d+\.\s+(.+)$/);

    if (ulMatch) {
      if (!inUl) {
        if (inOl) { processed.push("</ol>"); inOl = false; }
        processed.push("<ul>");
        inUl = true;
      }
      processed.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (!inOl) {
        if (inUl) { processed.push("</ul>"); inUl = false; }
        processed.push("<ol>");
        inOl = true;
      }
      processed.push(`<li>${olMatch[1]}</li>`);
    } else {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(line);
    }
  }
  if (inUl) processed.push("</ul>");
  if (inOl) processed.push("</ol>");
  html = processed.join("\n");

  // Paragraphs: wrap lines that aren't already in block elements
  const blockTags = /^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div|table|p|\/)/;
  const finalLines = html.split("\n");
  const result: string[] = [];
  let inParagraph = false;

  for (const line of finalLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      continue;
    }
    if (blockTags.test(trimmed)) {
      if (inParagraph) {
        result.push("</p>");
        inParagraph = false;
      }
      result.push(trimmed);
    } else {
      if (!inParagraph) {
        result.push("<p>");
        inParagraph = true;
      }
      result.push(trimmed);
    }
  }
  if (inParagraph) result.push("</p>");

  // Clean up empty paragraphs
  html = result.join("\n").replace(/<p>\s*<\/p>/g, "");

  return html;
}

export default function MarkdownToHtmlTool() {
  const t = useTranslations("tools.markdown-to-html");
  const tc = useTranslations("common");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [view, setView] = useState<"code" | "preview">("code");

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    const html = markdownToHtml(input);
    setOutput(html);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
  }, []);

  return (
    <ToolLayout toolSlug="markdown-to-html">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            {t("input_label")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("input_placeholder")}
            rows={10}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={handleConvert}
            disabled={!input.trim()}
            className="bg-teal text-white font-medium px-4 py-2 rounded-lg hover:bg-teal-hover transition-colors text-sm disabled:opacity-50"
          >
            {t("convert")}
          </button>
          <button
            onClick={handleClear}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {tc("clear")}
          </button>
        </div>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setView("code")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    view === "code" ? "bg-teal text-white" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {t("html_code")}
                </button>
                <button
                  onClick={() => setView("preview")}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    view === "preview" ? "bg-teal text-white" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {t("preview")}
                </button>
              </div>
              <CopyButton text={output} />
            </div>

            {view === "code" ? (
              <pre className="bg-card border border-border rounded-xl p-4 text-sm font-mono overflow-auto max-h-96 whitespace-pre-wrap">
                {output}
              </pre>
            ) : (
              <div
                className="bg-card border border-border rounded-xl p-4 prose prose-sm max-w-none overflow-auto max-h-96"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
