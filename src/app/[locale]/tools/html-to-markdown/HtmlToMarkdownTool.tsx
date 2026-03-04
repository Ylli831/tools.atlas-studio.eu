"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";
import TurndownService from "turndown";

const SAMPLE_HTML = `<h1>Welcome to My Article</h1>
<p>This is a <strong>sample HTML</strong> document that demonstrates the conversion.</p>
<h2>Features</h2>
<ul>
  <li>Converts <em>headings</em> to markdown</li>
  <li>Supports <a href="https://example.com">links</a></li>
  <li>Handles <code>inline code</code></li>
</ul>
<h3>Code Example</h3>
<pre><code>const greeting = "Hello, World!";
console.log(greeting);</code></pre>
<blockquote>
  <p>This is a blockquote with some important text.</p>
</blockquote>
<p>Here is an image: <img src="https://example.com/image.jpg" alt="Example Image" /></p>
<hr>
<p>That's all for now. Visit our <a href="https://atlas-studio.eu">website</a> for more.</p>`;

export default function HtmlToMarkdownTool() {
  const t = useTranslations("tools.html-to-markdown");
  const tc = useTranslations("common");
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");

  const convert = useCallback((input: string) => {
    if (!input.trim()) {
      setMarkdown("");
      return;
    }
    try {
      const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        emDelimiter: "*",
      });
      const result = turndownService.turndown(input);
      setMarkdown(result);
    } catch {
      setMarkdown("");
    }
  }, []);

  useEffect(() => {
    convert(html);
  }, [html, convert]);

  const handleLoadSample = () => {
    setHtml(SAMPLE_HTML);
  };

  return (
    <ToolLayout toolSlug="html-to-markdown">
      <div className="space-y-4">
        {/* Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="bg-surface text-foreground font-medium px-4 py-2 rounded-lg hover:bg-border transition-colors text-sm"
          >
            {t("load_sample")}
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HTML Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t("html_label")}
              </label>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder={t("html_placeholder")}
              rows={16}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
              spellCheck={false}
            />
          </div>

          {/* Markdown Output */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                {t("markdown_label")}
              </label>
              {markdown && <CopyButton text={markdown} />}
            </div>
            <textarea
              value={markdown}
              readOnly
              rows={16}
              className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
