"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre class="md-code-block"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="md-h6">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="md-h5">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="md-h4">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="md-h1">$1</h1>');

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="md-link" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="md-image" />'
  );

  // Blockquote
  html = html.replace(
    /^>\s+(.+)$/gm,
    '<blockquote class="md-blockquote">$1</blockquote>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="md-hr" />');

  // Unordered lists
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li class="md-li">$1</li>');
  html = html.replace(
    /(<li class="md-li">.*<\/li>\n?)+/g,
    (match) => `<ul class="md-ul">${match}</ul>`
  );

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="md-oli">$1</li>');
  html = html.replace(
    /(<li class="md-oli">.*<\/li>\n?)+/g,
    (match) => `<ol class="md-ol">${match}</ol>`
  );

  // Paragraphs (lines that aren't already wrapped)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;
      return `<p class="md-p">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const DEFAULT_MD = `# Welcome to Markdown Preview

This is a **live preview** of your Markdown content.

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~
- [Links](https://atlas-studio.eu)
- Code blocks and \`inline code\`

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote

---

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3
`;

export default function MarkdownPreviewTool() {
  const t = useTranslations("tools.markdown-preview");
  const [markdown, setMarkdown] = useState(DEFAULT_MD);

  const rendered = useMemo(() => parseMarkdown(markdown), [markdown]);

  return (
    <ToolLayout toolSlug="markdown-preview">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">
              {t("editor")}
            </label>
            <CopyButton text={markdown} />
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full h-[500px] bg-card border border-border rounded-xl p-4 text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors"
          />
        </div>

        {/* Preview */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">
              {t("preview")}
            </label>
            <CopyButton text={rendered} />
          </div>
          <div
            className="w-full h-[500px] bg-card border border-border rounded-xl p-4 overflow-y-auto prose-atlas"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
