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
];

export const categories = ["image", "generator", "developer", "text"] as const;
