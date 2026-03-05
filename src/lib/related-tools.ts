import { tools, type ToolDefinition } from "./tools-registry";

const manualRelations: Record<string, string[]> = {
  // Image workflow
  "image-compressor": ["image-converter", "image-resizer", "background-remover", "image-to-pdf", "image-watermark"],
  "image-converter": ["image-compressor", "image-resizer", "svg-to-png", "image-to-base64"],
  "image-resizer": ["image-compressor", "image-converter", "image-cropper", "favicon-generator"],
  "background-remover": ["image-compressor", "image-converter", "image-watermark"],
  "image-cropper": ["image-resizer", "image-compressor", "image-filter"],
  "image-watermark": ["image-compressor", "background-remover", "image-filter"],
  "image-filter": ["image-compressor", "image-cropper", "image-watermark"],
  "svg-to-png": ["svg-optimizer", "image-converter", "image-compressor"],
  "svg-optimizer": ["svg-to-png", "image-compressor", "css-minifier"],
  "favicon-generator": ["image-resizer", "image-converter", "image-compressor"],
  "image-to-base64": ["base64-encoder", "image-converter"],
  "color-palette-extractor": ["color-picker", "color-name-finder", "color-contrast-checker"],
  // PDF workflow
  "image-to-pdf": ["pdf-merge", "pdf-compress", "image-compressor"],
  "pdf-merge": ["pdf-page-extractor", "pdf-rotate", "pdf-compress"],
  "pdf-to-image": ["image-converter", "image-compressor", "ocr-image-to-text"],
  "pdf-page-extractor": ["pdf-merge", "pdf-rotate", "pdf-compress"],
  "pdf-rotate": ["pdf-merge", "pdf-page-extractor", "pdf-compress"],
  "pdf-compress": ["pdf-merge", "pdf-page-extractor", "pdf-password-protect"],
  "pdf-password-protect": ["pdf-compress", "pdf-merge"],
  // Developer tools
  "json-formatter": ["json-to-typescript", "json-to-xml", "json-to-csv", "json-to-yaml", "csv-json-converter"],
  "json-to-typescript": ["json-formatter", "json-to-xml", "json-to-csv"],
  "json-to-xml": ["xml-to-json", "json-formatter", "json-to-csv"],
  "xml-to-json": ["json-to-xml", "xml-formatter", "json-formatter"],
  "json-to-csv": ["csv-json-converter", "json-formatter", "json-to-xml"],
  "json-to-yaml": ["yaml-to-json", "json-formatter", "json-to-toml"],
  "yaml-to-json": ["json-to-yaml", "json-formatter", "toml-to-json"],
  "toml-to-json": ["json-to-toml", "yaml-to-json", "json-formatter"],
  "json-to-toml": ["toml-to-json", "json-to-yaml", "json-formatter"],
  "csv-json-converter": ["json-to-csv", "json-formatter"],
  "xml-formatter": ["xml-to-json", "json-to-xml", "html-minifier"],
  "sql-formatter": ["json-formatter", "css-beautifier"],
  "regex-tester": ["diff-checker", "json-formatter"],
  "base64-encoder": ["url-encoder", "hash-generator", "image-to-base64"],
  "url-encoder": ["base64-encoder", "url-slug-generator"],
  "hash-generator": ["bcrypt-generator", "hmac-generator", "password-generator"],
  "jwt-decoder": ["base64-encoder", "hash-generator"],
  "html-entity-encoder": ["url-encoder", "base64-encoder", "html-minifier"],
  // Minifiers
  "css-minifier": ["css-beautifier", "html-minifier", "javascript-minifier"],
  "javascript-minifier": ["css-minifier", "html-minifier"],
  "html-minifier": ["css-minifier", "javascript-minifier", "html-preview"],
  "css-beautifier": ["css-minifier", "sql-formatter", "json-formatter"],
  // Text tools
  "markdown-preview": ["markdown-to-html", "html-to-markdown", "html-preview"],
  "markdown-to-html": ["html-to-markdown", "markdown-preview", "html-to-text"],
  "html-to-markdown": ["markdown-to-html", "html-to-text", "markdown-preview"],
  "html-to-text": ["html-to-markdown", "markdown-to-html", "html-entity-encoder"],
  "text-to-binary": ["morse-code", "text-to-nato-alphabet", "base64-encoder"],
  "morse-code": ["text-to-binary", "text-to-nato-alphabet"],
  "text-to-nato-alphabet": ["morse-code", "text-to-binary", "case-converter"],
  "word-counter": ["case-converter", "lorem-ipsum-generator", "readability-checker"],
  "case-converter": ["word-counter", "find-replace", "url-slug-generator"],
  "ocr-image-to-text": ["pdf-to-image", "image-converter"],
  // Generators
  "qr-code-generator": ["wifi-qr-code-generator", "barcode-generator"],
  "wifi-qr-code-generator": ["qr-code-generator", "barcode-generator"],
  "barcode-generator": ["qr-code-generator", "wifi-qr-code-generator"],
  "password-generator": ["password-strength-checker", "hash-generator"],
  "color-picker": ["css-gradient-generator", "color-contrast-checker", "color-name-finder", "color-palette-extractor"],
  "css-gradient-generator": ["color-picker", "gradient-text-generator", "glassmorphism-generator"],
  // Design tools
  "box-shadow-generator": ["text-shadow-generator", "glassmorphism-generator", "border-radius-generator"],
  "glassmorphism-generator": ["box-shadow-generator", "css-gradient-generator", "border-radius-generator"],
  "border-radius-generator": ["box-shadow-generator", "glassmorphism-generator", "css-clip-path-generator"],
  "css-clip-path-generator": ["border-radius-generator", "css-triangle-generator"],
  "css-animation-generator": ["css-clip-path-generator", "flexbox-playground", "css-grid-generator"],
  "css-triangle-generator": ["css-clip-path-generator", "border-radius-generator"],
  "text-shadow-generator": ["box-shadow-generator", "gradient-text-generator"],
  "gradient-text-generator": ["text-shadow-generator", "css-gradient-generator"],
  "css-grid-generator": ["flexbox-playground", "css-animation-generator"],
  "flexbox-playground": ["css-grid-generator", "css-animation-generator"],
  "font-pair-previewer": ["gradient-text-generator", "text-shadow-generator"],
  "color-name-finder": ["color-picker", "color-contrast-checker", "color-palette-extractor"],
  // Security
  "bcrypt-generator": ["hash-generator", "hmac-generator", "password-strength-checker"],
  "hmac-generator": ["hash-generator", "bcrypt-generator", "rsa-key-pair-generator"],
  "rsa-key-pair-generator": ["hmac-generator", "bcrypt-generator", "password-generator"],
  "password-strength-checker": ["password-generator", "bcrypt-generator"],
  // SEO tools
  "meta-tag-generator": ["og-preview", "schema-markup-generator", "robots-txt-generator"],
  "robots-txt-generator": ["sitemap-generator", "htaccess-generator", "meta-tag-generator"],
  "schema-markup-generator": ["meta-tag-generator", "og-preview"],
  "htaccess-generator": ["robots-txt-generator", "sitemap-generator"],
  "sitemap-generator": ["robots-txt-generator", "htaccess-generator", "meta-tag-generator"],
  "og-preview": ["meta-tag-generator", "schema-markup-generator"],
  // Business tools
  "pomodoro-timer": ["stopwatch-timer", "countdown-creator"],
  "stopwatch-timer": ["pomodoro-timer", "countdown-creator"],
  "countdown-creator": ["pomodoro-timer", "stopwatch-timer", "time-zone-converter"],
  "time-zone-converter": ["timestamp-converter", "countdown-creator", "date-calculator"],
  "aspect-ratio-calculator": ["image-resizer", "unit-converter"],
};

const chainNextMap: Record<string, string[]> = {
  "image-converter": ["image-compressor", "image-to-pdf"],
  "image-compressor": ["image-to-pdf", "image-watermark"],
  "image-resizer": ["image-compressor", "favicon-generator"],
  "background-remover": ["image-compressor", "image-to-pdf"],
  "image-cropper": ["image-compressor", "image-watermark"],
  "pdf-to-image": ["image-compressor", "ocr-image-to-text"],
  "ocr-image-to-text": ["word-counter", "case-converter"],
  "json-formatter": ["json-to-typescript", "json-to-csv"],
  "csv-json-converter": ["json-formatter", "json-to-typescript"],
  "svg-optimizer": ["svg-to-png", "image-compressor"],
  "css-minifier": ["html-minifier", "javascript-minifier"],
  "html-to-markdown": ["markdown-preview"],
  "markdown-to-html": ["html-preview"],
  "meta-tag-generator": ["schema-markup-generator", "robots-txt-generator"],
  "password-generator": ["hash-generator", "bcrypt-generator"],
};

export function getRelatedTools(slug: string, count = 6): ToolDefinition[] {
  const current = tools.find((t) => t.slug === slug);
  if (!current) return [];

  const slugSet = new Set<string>();
  const result: ToolDefinition[] = [];

  const addTool = (s: string) => {
    if (slugSet.has(s) || s === slug) return;
    const tool = tools.find((t) => t.slug === s);
    if (tool) {
      slugSet.add(s);
      result.push(tool);
    }
  };

  // 1. Manual curations first
  const manual = manualRelations[slug];
  if (manual) {
    manual.forEach(addTool);
  }

  // 2. Same category fill
  if (result.length < count) {
    tools
      .filter((t) => t.category === current.category && t.slug !== slug)
      .forEach((t) => addTool(t.slug));
  }

  return result.slice(0, count);
}

export function getChainNext(slug: string): ToolDefinition[] {
  const chain = chainNextMap[slug];
  if (!chain) return [];
  return chain
    .map((s) => tools.find((t) => t.slug === s))
    .filter((t): t is ToolDefinition => !!t);
}
