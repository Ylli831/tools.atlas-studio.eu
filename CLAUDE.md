# Atlas Studio Tools — Free Online Tools Platform

## Purpose
Free online tools platform under the Atlas Studio brand. All tools run client-side in the browser — no server processing needed. SEO-optimized to drive traffic and generate leads for Atlas Studio.

## Tech Stack
- **Framework:** Next.js 16, App Router
- **i18n:** next-intl (`[locale]` routing segment, sq + en)
- **Styling:** Tailwind CSS v4, Atlas Studio light theme (cream/slate/teal/terracotta)
- **Fonts:** Inter (UI) + EB Garamond (body) via local fonts
- **Analytics:** Google Analytics (G-941JC17CBG)

## Key Files
- [`src/lib/tools-registry.ts`](src/lib/tools-registry.ts) — Central tool definitions
- [`src/lib/albanian-lorem.ts`](src/lib/albanian-lorem.ts) — Albanian lorem ipsum corpus
- [`src/components/ToolLayout.tsx`](src/components/ToolLayout.tsx) — Shared tool page wrapper
- [`src/components/FileUpload.tsx`](src/components/FileUpload.tsx) — Drag-and-drop file upload
- [`src/components/CopyButton.tsx`](src/components/CopyButton.tsx) — Copy-to-clipboard
- [`src/i18n/routing.ts`](src/i18n/routing.ts) — Locale routing config
- [`messages/`](messages/) — i18n translation files (sq.json, en.json)

## Tools (8 total)
| Tool | Route | Library |
|---|---|---|
| QR Code Generator | `/tools/qr-code-generator` | `qrcode` |
| Image Converter | `/tools/image-converter` | Canvas API |
| Image Compressor | `/tools/image-compressor` | `browser-image-compression` |
| Background Remover | `/tools/background-remover` | `@imgly/background-removal` |
| Color Picker | `/tools/color-picker` | Native (color math) |
| Base64 Encoder | `/tools/base64-encoder` | Native (`btoa`/`atob`) |
| JSON Formatter | `/tools/json-formatter` | Native (`JSON.parse`) |
| Lorem Ipsum | `/tools/lorem-ipsum-generator` | Custom (Albanian + Latin) |

## Brand Colors
- Background: `#f5f3ef` (cream)
- Text: `#37474b` (slate)
- Primary: `#487877` (teal)
- Accent: `#cb6a3f` (terracotta)

## Scripts
```bash
npm run dev            # Dev server
npm run build          # Production build
npm start              # Start production
npm run lint           # ESLint
```

## Deployment
- **Docker:** Multi-stage, node:20-alpine, standalone output
- **Port:** 3000
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)
