"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/ToolLayout";

const DEFAULT_HTML = `<div class="container">
  <h1>Hello World!</h1>
  <p>Edit the HTML, CSS, and JavaScript tabs to see live changes.</p>
  <button id="btn">Click me</button>
  <p id="output"></p>
</div>`;

const DEFAULT_CSS = `.container {
  font-family: system-ui, sans-serif;
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  text-align: center;
}

h1 {
  color: #487877;
}

button {
  background: #487877;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #3a6362;
}`;

const DEFAULT_JS = `let count = 0;
document.getElementById('btn').addEventListener('click', () => {
  count++;
  document.getElementById('output').textContent = 'Clicked ' + count + ' time' + (count !== 1 ? 's' : '');
});`;

type Tab = "html" | "css" | "js" | "preview";

export default function HtmlPreviewTool() {
  const t = useTranslations("tools.html-preview");
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [autoRun, setAutoRun] = useState(true);
  const [srcdoc, setSrcdoc] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildDocument = useCallback(() => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
  }, [html, css, js]);

  const run = useCallback(() => {
    setSrcdoc(buildDocument());
  }, [buildDocument]);

  useEffect(() => {
    if (!autoRun) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      run();
    }, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [html, css, js, autoRun, run]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "html", label: t("html_tab") },
    { key: "css", label: t("css_tab") },
    { key: "js", label: t("js_tab") },
    { key: "preview", label: t("preview_tab") },
  ];

  return (
    <ToolLayout toolSlug="html-preview">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-teal text-white"
                    : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="accent-teal w-4 h-4"
              />
              {t("auto_run")}
            </label>
            {!autoRun && (
              <button
                onClick={run}
                className="bg-teal text-white font-medium px-4 py-1.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                {t("run")}
              </button>
            )}
          </div>
        </div>

        {activeTab === "html" && (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={14}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        )}

        {activeTab === "css" && (
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            rows={14}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        )}

        {activeTab === "js" && (
          <textarea
            value={js}
            onChange={(e) => setJs(e.target.value)}
            rows={14}
            className="w-full bg-card border border-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-teal"
            spellCheck={false}
          />
        )}

        {activeTab === "preview" && (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <iframe
              srcDoc={srcdoc}
              sandbox="allow-scripts"
              className="w-full border-0"
              style={{ height: "400px" }}
              title="Preview"
            />
          </div>
        )}

        {activeTab !== "preview" && (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-3 py-1.5 bg-surface border-b border-border text-xs text-muted-foreground font-medium">
              {t("preview_tab")}
            </div>
            <iframe
              srcDoc={srcdoc}
              sandbox="allow-scripts"
              className="w-full border-0"
              style={{ height: "300px" }}
              title="Preview"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
