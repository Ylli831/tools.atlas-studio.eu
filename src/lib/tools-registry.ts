export interface ToolDefinition {
  slug: string;
  icon: string;
  category: "generator" | "image" | "developer" | "text" | "pdf" | "business" | "design" | "security";
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
  { slug: "loan-calculator", icon: "coins", category: "business", hasFileUpload: false, isNew: true },
  { slug: "percentage-calculator", icon: "percent-circle", category: "business", hasFileUpload: false, isNew: true },
  { slug: "bmi-calculator", icon: "heart-pulse", category: "business", hasFileUpload: false, isNew: true },
  { slug: "tip-calculator", icon: "wallet", category: "business", hasFileUpload: false, isNew: true },
  // Design Tools
  { slug: "box-shadow-generator", icon: "layers", category: "design", hasFileUpload: false, isNew: true },
  // Security Tools
  { slug: "password-strength-checker", icon: "shield", category: "security", hasFileUpload: false, isNew: true },
  // Business Tools (continued)
  { slug: "date-calculator", icon: "calendar-range", category: "business", hasFileUpload: false, isNew: true },
  // Sprint 1 - PDF
  { slug: "pdf-rotate", icon: "file-rotate", category: "pdf", hasFileUpload: true, isNew: true },
  // Sprint 1 - Image
  { slug: "image-to-base64", icon: "file-code", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-metadata-remover", icon: "eye-off", category: "image", hasFileUpload: true, isNew: true },
  // Sprint 1 - Generator
  { slug: "placeholder-image-generator", icon: "frame", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "emoji-picker", icon: "smile", category: "generator", hasFileUpload: false, isNew: true },
  // Sprint 1 - Text
  { slug: "text-to-speech", icon: "volume", category: "text", hasFileUpload: false, isNew: true },
  // Sprint 1 - Developer
  { slug: "html-entity-encoder", icon: "code-xml", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "xml-formatter", icon: "file-xml", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "chmod-calculator", icon: "terminal", category: "developer", hasFileUpload: false, isNew: true },
  // Sprint 2 - PDF
  { slug: "pdf-compress", icon: "file-compress", category: "pdf", hasFileUpload: true, isNew: true },
  { slug: "pdf-password-protect", icon: "file-lock", category: "pdf", hasFileUpload: true, isNew: true },
  // Sprint 2 - Image
  { slug: "image-cropper", icon: "crop", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-watermark", icon: "droplet", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-filter", icon: "sliders", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-flip", icon: "flip-horizontal", category: "image", hasFileUpload: true, isNew: true },
  { slug: "color-palette-extractor", icon: "pipette", category: "image", hasFileUpload: true, isNew: true },
  // Sprint 2 - Generator
  { slug: "signature-generator", icon: "pen-tool", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "cron-expression-generator", icon: "timer", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "fake-data-generator", icon: "user-fake", category: "generator", hasFileUpload: false, isNew: true },
  // Sprint 2 - Text
  { slug: "text-to-handwriting", icon: "pen-line", category: "text", hasFileUpload: false, isNew: true },
  { slug: "text-encryptor", icon: "lock-keyhole", category: "text", hasFileUpload: false, isNew: true },
  { slug: "html-to-markdown", icon: "arrow-down-to-line", category: "text", hasFileUpload: false, isNew: true },
  { slug: "json-to-yaml", icon: "file-json", category: "text", hasFileUpload: false, isNew: true },
  { slug: "readability-checker", icon: "book-open", category: "text", hasFileUpload: false, isNew: true },
  // Sprint 2 - Developer
  { slug: "json-to-typescript", icon: "file-type", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "html-preview", icon: "monitor", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "sql-formatter", icon: "database", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "diff-checker", icon: "git-compare", category: "developer", hasFileUpload: false, isNew: true },
  // Sprint 2 - Design
  { slug: "flexbox-playground", icon: "layout-grid", category: "design", hasFileUpload: false, isNew: true },
  { slug: "font-pair-previewer", icon: "type", category: "design", hasFileUpload: false, isNew: true },
  // Sprint 2 - Security
  { slug: "privacy-policy-generator", icon: "scroll", category: "security", hasFileUpload: false, isNew: true },
];

export const categories = ["pdf", "image", "generator", "text", "developer", "business", "design", "security"] as const;
