export interface ToolDefinition {
  slug: string;
  icon: string;
  category: "generator" | "image" | "developer" | "text" | "pdf" | "business";
  hasFileUpload: boolean;
  isNew?: boolean;
}

export const tools: ToolDefinition[] = [
  // PDF Tools
  { slug: "image-to-pdf", icon: "file-image", category: "pdf", hasFileUpload: true },
  { slug: "pdf-merge", icon: "file-plus", category: "pdf", hasFileUpload: true },
  { slug: "pdf-to-image", icon: "file-down", category: "pdf", hasFileUpload: true },
  { slug: "pdf-page-extractor", icon: "file-crop", category: "pdf", hasFileUpload: true, isNew: true },
  // Image Tools
  { slug: "image-compressor", icon: "compress", category: "image", hasFileUpload: true },
  { slug: "image-converter", icon: "image", category: "image", hasFileUpload: true },
  { slug: "image-resizer", icon: "resize", category: "image", hasFileUpload: true },
  { slug: "background-remover", icon: "scissors", category: "image", hasFileUpload: true },
  { slug: "favicon-generator", icon: "star", category: "image", hasFileUpload: true },
  { slug: "svg-to-png", icon: "image-down", category: "image", hasFileUpload: true },
  { slug: "exif-viewer", icon: "info-circle", category: "image", hasFileUpload: true, isNew: true },
  // Generator Tools
  { slug: "qr-code-generator", icon: "qr", category: "generator", hasFileUpload: false },
  { slug: "password-generator", icon: "lock", category: "generator", hasFileUpload: false },
  { slug: "color-picker", icon: "palette", category: "generator", hasFileUpload: false },
  { slug: "css-gradient-generator", icon: "gradient", category: "generator", hasFileUpload: false },
  { slug: "uuid-generator", icon: "fingerprint", category: "generator", hasFileUpload: false },
  { slug: "barcode-generator", icon: "barcode", category: "generator", hasFileUpload: false, isNew: true },
  // Text Tools
  { slug: "case-converter", icon: "case", category: "text", hasFileUpload: false },
  { slug: "word-counter", icon: "counter", category: "text", hasFileUpload: false },
  { slug: "text-diff", icon: "diff", category: "text", hasFileUpload: false },
  { slug: "ocr-image-to-text", icon: "scan", category: "text", hasFileUpload: true },
  { slug: "lorem-ipsum-generator", icon: "text", category: "text", hasFileUpload: false },
  { slug: "markdown-preview", icon: "markdown", category: "text", hasFileUpload: false },
  { slug: "line-sorter", icon: "sort", category: "text", hasFileUpload: false, isNew: true },
  { slug: "url-slug-generator", icon: "slug", category: "text", hasFileUpload: false, isNew: true },
  { slug: "morse-code", icon: "signal", category: "text", hasFileUpload: false, isNew: true },
  { slug: "find-replace", icon: "find", category: "text", hasFileUpload: false, isNew: true },
  { slug: "character-limit-checker", icon: "limit", category: "text", hasFileUpload: false, isNew: true },
  // Developer Tools
  { slug: "regex-tester", icon: "regex", category: "developer", hasFileUpload: false },
  { slug: "json-formatter", icon: "braces", category: "developer", hasFileUpload: false },
  { slug: "hash-generator", icon: "hash", category: "developer", hasFileUpload: false },
  { slug: "base64-encoder", icon: "code", category: "developer", hasFileUpload: true },
  { slug: "url-encoder", icon: "link", category: "developer", hasFileUpload: false },
  { slug: "timestamp-converter", icon: "clock", category: "developer", hasFileUpload: false },
  { slug: "jwt-decoder", icon: "key", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "csv-json-converter", icon: "table", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "number-base-converter", icon: "binary", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "color-contrast-checker", icon: "contrast", category: "developer", hasFileUpload: false, isNew: true },
  // Business Tools
  { slug: "invoice-generator", icon: "receipt", category: "business", hasFileUpload: false },
  { slug: "og-preview", icon: "share", category: "business", hasFileUpload: false },
  { slug: "unit-converter", icon: "ruler", category: "business", hasFileUpload: false, isNew: true },
  { slug: "age-calculator", icon: "calendar", category: "business", hasFileUpload: false, isNew: true },
  { slug: "vat-calculator", icon: "percent", category: "business", hasFileUpload: false, isNew: true },
  { slug: "iban-validator", icon: "bank", category: "business", hasFileUpload: false, isNew: true },
];

export const categories = ["pdf", "image", "generator", "text", "developer", "business"] as const;
