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
  { slug: "pdf-page-extractor", icon: "file-crop", category: "pdf", hasFileUpload: true },
  // Image Tools
  { slug: "image-compressor", icon: "compress", category: "image", hasFileUpload: true },
  { slug: "image-converter", icon: "image", category: "image", hasFileUpload: true },
  { slug: "image-resizer", icon: "resize", category: "image", hasFileUpload: true },
  { slug: "background-remover", icon: "scissors", category: "image", hasFileUpload: true },
  { slug: "favicon-generator", icon: "star", category: "image", hasFileUpload: true },
  { slug: "svg-to-png", icon: "image-down", category: "image", hasFileUpload: true },
  { slug: "exif-viewer", icon: "info-circle", category: "image", hasFileUpload: true },
  // Generator Tools
  { slug: "qr-code-generator", icon: "qr", category: "generator", hasFileUpload: false },
  { slug: "password-generator", icon: "lock", category: "generator", hasFileUpload: false },
  { slug: "color-picker", icon: "palette", category: "generator", hasFileUpload: false },
  { slug: "css-gradient-generator", icon: "gradient", category: "generator", hasFileUpload: false },
  { slug: "uuid-generator", icon: "fingerprint", category: "generator", hasFileUpload: false },
  { slug: "barcode-generator", icon: "barcode", category: "generator", hasFileUpload: false },
  // Text Tools
  { slug: "case-converter", icon: "case", category: "text", hasFileUpload: false },
  { slug: "word-counter", icon: "counter", category: "text", hasFileUpload: false },
  { slug: "ocr-image-to-text", icon: "scan", category: "text", hasFileUpload: true },
  { slug: "lorem-ipsum-generator", icon: "text", category: "text", hasFileUpload: false },
  { slug: "markdown-preview", icon: "markdown", category: "text", hasFileUpload: false },
  { slug: "line-sorter", icon: "sort", category: "text", hasFileUpload: false },
  { slug: "url-slug-generator", icon: "slug", category: "text", hasFileUpload: false },
  { slug: "morse-code", icon: "signal", category: "text", hasFileUpload: false },
  { slug: "find-replace", icon: "find", category: "text", hasFileUpload: false },
  { slug: "character-limit-checker", icon: "limit", category: "text", hasFileUpload: false },
  // Developer Tools
  { slug: "regex-tester", icon: "regex", category: "developer", hasFileUpload: false },
  { slug: "json-formatter", icon: "braces", category: "developer", hasFileUpload: false },
  { slug: "hash-generator", icon: "hash", category: "developer", hasFileUpload: false },
  { slug: "base64-encoder", icon: "code", category: "developer", hasFileUpload: true },
  { slug: "url-encoder", icon: "link", category: "developer", hasFileUpload: false },
  { slug: "timestamp-converter", icon: "clock", category: "developer", hasFileUpload: false },
  { slug: "jwt-decoder", icon: "key", category: "developer", hasFileUpload: false },
  { slug: "csv-json-converter", icon: "table", category: "developer", hasFileUpload: false },
  { slug: "number-base-converter", icon: "binary", category: "developer", hasFileUpload: false },
  { slug: "color-contrast-checker", icon: "contrast", category: "developer", hasFileUpload: false },
  // Business Tools
  { slug: "invoice-generator", icon: "receipt", category: "business", hasFileUpload: false },
  { slug: "og-preview", icon: "share", category: "business", hasFileUpload: false },
  { slug: "unit-converter", icon: "ruler", category: "business", hasFileUpload: false },
  { slug: "age-calculator", icon: "calendar", category: "business", hasFileUpload: false },
  { slug: "vat-calculator", icon: "percent", category: "business", hasFileUpload: false },
  { slug: "iban-validator", icon: "bank", category: "business", hasFileUpload: false },
  { slug: "loan-calculator", icon: "coins", category: "business", hasFileUpload: false },
  { slug: "percentage-calculator", icon: "percent-circle", category: "business", hasFileUpload: false },
  { slug: "bmi-calculator", icon: "heart-pulse", category: "business", hasFileUpload: false },
  { slug: "tip-calculator", icon: "wallet", category: "business", hasFileUpload: false },
  // Design Tools
  { slug: "box-shadow-generator", icon: "layers", category: "design", hasFileUpload: false },
  // Security Tools
  { slug: "password-strength-checker", icon: "shield", category: "security", hasFileUpload: false },
  // Business Tools (continued)
  { slug: "date-calculator", icon: "calendar-range", category: "business", hasFileUpload: false },
  // Sprint 1
  { slug: "pdf-rotate", icon: "file-rotate", category: "pdf", hasFileUpload: true },
  { slug: "image-to-base64", icon: "file-code", category: "image", hasFileUpload: true },
  { slug: "image-metadata-remover", icon: "eye-off", category: "image", hasFileUpload: true },
  { slug: "placeholder-image-generator", icon: "frame", category: "generator", hasFileUpload: false },
  { slug: "emoji-picker", icon: "smile", category: "generator", hasFileUpload: false },
  { slug: "text-to-speech", icon: "volume", category: "text", hasFileUpload: false },
  { slug: "html-entity-encoder", icon: "code-xml", category: "developer", hasFileUpload: false },
  { slug: "xml-formatter", icon: "file-xml", category: "developer", hasFileUpload: false },
  { slug: "chmod-calculator", icon: "terminal", category: "developer", hasFileUpload: false },
  // Sprint 2 (latest)
  { slug: "pdf-compress", icon: "file-compress", category: "pdf", hasFileUpload: true, isNew: true },
  { slug: "pdf-password-protect", icon: "file-lock", category: "pdf", hasFileUpload: true, isNew: true },
  { slug: "image-cropper", icon: "crop", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-watermark", icon: "droplet", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-filter", icon: "sliders", category: "image", hasFileUpload: true, isNew: true },
  { slug: "image-flip", icon: "flip-horizontal", category: "image", hasFileUpload: true, isNew: true },
  { slug: "color-palette-extractor", icon: "pipette", category: "image", hasFileUpload: true, isNew: true },
  { slug: "signature-generator", icon: "pen-tool", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "cron-expression-generator", icon: "timer", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "fake-data-generator", icon: "user-fake", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "text-to-handwriting", icon: "pen-line", category: "text", hasFileUpload: false, isNew: true },
  { slug: "text-encryptor", icon: "lock-keyhole", category: "text", hasFileUpload: false, isNew: true },
  { slug: "html-to-markdown", icon: "arrow-down-to-line", category: "text", hasFileUpload: false, isNew: true },
  { slug: "json-to-yaml", icon: "file-json", category: "text", hasFileUpload: false, isNew: true },
  { slug: "readability-checker", icon: "book-open", category: "text", hasFileUpload: false, isNew: true },
  { slug: "json-to-typescript", icon: "file-type", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "html-preview", icon: "monitor", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "sql-formatter", icon: "database", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "diff-checker", icon: "git-compare", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "flexbox-playground", icon: "layout-grid", category: "design", hasFileUpload: false, isNew: true },
  { slug: "font-pair-previewer", icon: "type", category: "design", hasFileUpload: false, isNew: true },
  { slug: "privacy-policy-generator", icon: "scroll", category: "security", hasFileUpload: false, isNew: true },
  // Sprint 3 - Code Minifiers & Formatters
  { slug: "css-minifier", icon: "minimize", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "javascript-minifier", icon: "minimize-js", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "html-minifier", icon: "minimize-html", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "svg-optimizer", icon: "sparkles", category: "image", hasFileUpload: true, isNew: true },
  { slug: "css-beautifier", icon: "wand", category: "developer", hasFileUpload: false, isNew: true },
  // Sprint 3 - Data Format Converters
  { slug: "json-to-xml", icon: "file-xml", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "xml-to-json", icon: "braces", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "json-to-csv", icon: "table", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "toml-to-json", icon: "file-cog", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "json-to-toml", icon: "file-cog", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "markdown-to-html", icon: "markdown", category: "text", hasFileUpload: false, isNew: true },
  // Sprint 3 - SEO & Web Tools
  { slug: "meta-tag-generator", icon: "globe", category: "business", hasFileUpload: false, isNew: true },
  { slug: "robots-txt-generator", icon: "bot", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "schema-markup-generator", icon: "braces", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "htaccess-generator", icon: "server", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "sitemap-generator", icon: "sitemap", category: "developer", hasFileUpload: false, isNew: true },
  // Sprint 3 - CSS & Design Tools
  { slug: "css-clip-path-generator", icon: "clip-path", category: "design", hasFileUpload: false, isNew: true },
  { slug: "css-animation-generator", icon: "animation", category: "design", hasFileUpload: false, isNew: true },
  { slug: "glassmorphism-generator", icon: "glass", category: "design", hasFileUpload: false, isNew: true },
  { slug: "border-radius-generator", icon: "rounded-corner", category: "design", hasFileUpload: false, isNew: true },
  { slug: "aspect-ratio-calculator", icon: "ratio", category: "business", hasFileUpload: false, isNew: true },
  // Sprint 3 - Text & Encoding Tools
  { slug: "text-to-binary", icon: "binary", category: "text", hasFileUpload: false, isNew: true },
  { slug: "ascii-art-generator", icon: "text-art", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "html-to-text", icon: "strip", category: "text", hasFileUpload: false, isNew: true },
  { slug: "text-to-nato-alphabet", icon: "megaphone", category: "text", hasFileUpload: false, isNew: true },
  // Sprint 3 - Security & Crypto Tools
  { slug: "bcrypt-generator", icon: "shield-lock", category: "security", hasFileUpload: false, isNew: true },
  { slug: "hmac-generator", icon: "shield-check", category: "security", hasFileUpload: false, isNew: true },
  { slug: "rsa-key-pair-generator", icon: "key-round", category: "security", hasFileUpload: false, isNew: true },
  // Sprint 3 - Utility Tools
  { slug: "pomodoro-timer", icon: "tomato", category: "business", hasFileUpload: false, isNew: true },
  { slug: "stopwatch-timer", icon: "stopwatch", category: "business", hasFileUpload: false, isNew: true },
  // Sprint 4 - Network & System Tools
  { slug: "ipv4-subnet-calculator", icon: "network", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "user-agent-parser", icon: "user-search", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "http-status-codes", icon: "status-code", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "device-information", icon: "smartphone", category: "developer", hasFileUpload: false, isNew: true },
  // Sprint 4 - More Design Tools
  { slug: "css-triangle-generator", icon: "triangle", category: "design", hasFileUpload: false, isNew: true },
  { slug: "text-shadow-generator", icon: "text-shadow", category: "design", hasFileUpload: false, isNew: true },
  { slug: "gradient-text-generator", icon: "gradient-text", category: "design", hasFileUpload: false, isNew: true },
  { slug: "css-grid-generator", icon: "grid", category: "design", hasFileUpload: false, isNew: true },
  // Sprint 4 - More Converters & Generators
  { slug: "yaml-to-json", icon: "file-json", category: "developer", hasFileUpload: false, isNew: true },
  { slug: "phone-number-formatter", icon: "phone", category: "business", hasFileUpload: false, isNew: true },
  { slug: "wifi-qr-code-generator", icon: "wifi", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "countdown-creator", icon: "hourglass", category: "business", hasFileUpload: false, isNew: true },
  // Sprint 4 - More Utility
  { slug: "time-zone-converter", icon: "globe-clock", category: "business", hasFileUpload: false, isNew: true },
  { slug: "random-number-generator", icon: "dice", category: "generator", hasFileUpload: false, isNew: true },
  { slug: "color-name-finder", icon: "eye-dropper", category: "design", hasFileUpload: false, isNew: true },
];

export const categories = ["pdf", "image", "generator", "text", "developer", "business", "design", "security"] as const;
