export interface ToolDefinition {
  slug: string;
  icon: string;
  category: "generator" | "image" | "developer" | "text";
  hasFileUpload: boolean;
}

export const tools: ToolDefinition[] = [
  {
    slug: "qr-code-generator",
    icon: "qr",
    category: "generator",
    hasFileUpload: false,
  },
  {
    slug: "image-converter",
    icon: "image",
    category: "image",
    hasFileUpload: true,
  },
  {
    slug: "image-compressor",
    icon: "compress",
    category: "image",
    hasFileUpload: true,
  },
  {
    slug: "background-remover",
    icon: "scissors",
    category: "image",
    hasFileUpload: true,
  },
  {
    slug: "color-picker",
    icon: "palette",
    category: "generator",
    hasFileUpload: false,
  },
  {
    slug: "base64-encoder",
    icon: "code",
    category: "developer",
    hasFileUpload: true,
  },
  {
    slug: "json-formatter",
    icon: "braces",
    category: "developer",
    hasFileUpload: false,
  },
  {
    slug: "lorem-ipsum-generator",
    icon: "text",
    category: "text",
    hasFileUpload: false,
  },
  {
    slug: "password-generator",
    icon: "lock",
    category: "generator",
    hasFileUpload: false,
  },
  {
    slug: "word-counter",
    icon: "counter",
    category: "text",
    hasFileUpload: false,
  },
  {
    slug: "css-gradient-generator",
    icon: "gradient",
    category: "generator",
    hasFileUpload: false,
  },
  {
    slug: "markdown-preview",
    icon: "markdown",
    category: "text",
    hasFileUpload: false,
  },
  {
    slug: "url-encoder",
    icon: "link",
    category: "developer",
    hasFileUpload: false,
  },
  {
    slug: "timestamp-converter",
    icon: "clock",
    category: "developer",
    hasFileUpload: false,
  },
];

export const categories = ["image", "generator", "developer", "text"] as const;
