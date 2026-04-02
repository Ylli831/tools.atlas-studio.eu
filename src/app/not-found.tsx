import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#fff", color: "#37474b", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ maxWidth: "28rem", width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.15em", color: "#999", textTransform: "uppercase" as const, marginBottom: "2rem" }}>
              Atlas Tools
            </p>

            <p style={{ fontSize: "10rem", fontWeight: "bold", lineHeight: 1, letterSpacing: "-0.05em", color: "#cb6a3f", userSelect: "none", margin: "0 0 1.5rem" }}>
              404
            </p>

            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.75rem", color: "#37474b" }}>
              This tool doesn&apos;t exist
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#6b7b80", lineHeight: 1.6, marginBottom: "2.5rem", maxWidth: "24rem", marginLeft: "auto", marginRight: "auto" }}>
              We have QR generators, image converters, and 20+ other tools, but this page isn&apos;t one of them.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#487877", color: "#fff", fontWeight: 500, padding: "0.625rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.875rem", textDecoration: "none" }}>
                Back to safety
              </Link>
              <Link href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#6b7b80", fontWeight: 500, padding: "0.625rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.875rem", textDecoration: "none", border: "1px solid #ddd" }}>
                Browse tools
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
