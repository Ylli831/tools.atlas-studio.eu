export function GET() {
  const content = `# Atlas Studio Tools
> 100+ free online tools for developers, designers, and businesses. All tools run entirely client-side in the browser — no data is uploaded to servers. No account required.

## Tool Categories
- PDF Tools (7): Image to PDF, merge PDFs, PDF to image, page extractor, rotate, compress, password protect
- Image Tools (17): Compress, convert formats, resize, crop, remove background, favicon generator, SVG to PNG, EXIF viewer, image to Base64, metadata remover, watermark, filters, flip, palette extractor, SVG optimizer
- Generator Tools (14): QR code, password, color picker, CSS gradient, UUID, barcode, placeholder image, emoji picker, signature, cron expression, fake data, ASCII art, WiFi QR, random number
- Text Tools (16): Case converter, word counter, OCR, Lorem ipsum, Markdown preview, line sorter, URL slug, Morse code, find & replace, character limit checker, text to speech, HTML to Markdown, JSON to YAML, readability checker, text to binary, HTML to text
- Developer Tools (25+): Regex tester, JSON formatter, hash generator, Base64 encoder, URL encoder, timestamp converter, JWT decoder, CSV/JSON converter, number base converter, color contrast checker, HTML entity encoder, XML/SQL/CSS/JS formatters, diff checker, JSON to TypeScript, robots.txt generator, schema markup generator, sitemap generator, subnet calculator, user agent parser, HTTP status codes
- Business Tools (15): Invoice generator, OG preview, unit converter, age calculator, VAT calculator, IBAN validator, loan calculator, percentage calculator, BMI calculator, tip calculator, date calculator, meta tag generator, aspect ratio calculator, phone formatter, countdown creator
- Design Tools (9): Box shadow, CSS clip-path, CSS animation, glassmorphism, border radius, CSS triangle, text shadow, gradient text, CSS grid generator, color name finder
- Security Tools (4+): Password strength checker, privacy policy generator, bcrypt generator, HMAC generator, RSA key pair generator

## Key Features
- All processing happens in-browser (client-side JavaScript)
- No account or sign-up required
- No file uploads to external servers
- Free with no usage limits
- Works on any device with a modern browser

## Key Pages
- https://tools.atlas-studio.eu — Homepage with all categories and popular tools
- https://tools.atlas-studio.eu/tools — Browse all tools
- https://tools.atlas-studio.eu/tools?category=pdf — PDF tools
- https://tools.atlas-studio.eu/tools?category=image — Image tools
- https://tools.atlas-studio.eu/tools?category=developer — Developer tools
- https://tools.atlas-studio.eu/tools?category=generator — Generator tools
- https://tools.atlas-studio.eu/tools?category=text — Text tools
- https://tools.atlas-studio.eu/tools?category=business — Business tools
- https://tools.atlas-studio.eu/tools?category=design — Design tools
- https://tools.atlas-studio.eu/tools?category=security — Security tools
- https://tools.atlas-studio.eu/contact — Contact

## Contact
- Built by Atlas Studio (https://atlas-studio.eu)
- Email: info@atlas-studio.eu

## Languages
English (default), Albanian
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
