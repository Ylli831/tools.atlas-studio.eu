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

## Tools
83 tools across 8 categories: pdf, image, generator, text, developer, business, design, security. All definitions live in [`src/lib/tools-registry.ts`](src/lib/tools-registry.ts). Each tool has a `page.tsx` (server metadata + JSON-LD) and a client `*Tool.tsx` component under `src/app/[locale]/tools/<slug>/`.

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
