import Link from "next/link";
import "./globals.css";

export default function RootNotFound() {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <p className="text-sm font-semibold tracking-widest text-muted-foreground/40 uppercase mb-8">
              Atlas Tools
            </p>

            <p className="text-[8rem] sm:text-[10rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-border to-transparent select-none mb-6">
              404
            </p>

            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              This tool doesn't exist
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-sm mx-auto">
              We have QR generators, image converters, and 20+ other tools, but this page isn't one of them.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-teal text-white font-medium px-6 py-2.5 rounded-lg hover:bg-teal-hover transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Back to safety
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-6 py-2.5 rounded-lg border border-border hover:border-teal/30 transition-colors"
              >
                Browse tools
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
