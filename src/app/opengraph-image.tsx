import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Atlas Studio Tools — Free Online Developer & Design Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#f5f3ef",
          fontFamily: "sans-serif",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#487877",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              A
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#37474b80",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase" as const,
              }}
            >
              Atlas Studio
            </div>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#37474b",
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            Free Online Tools
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#cc6a3f",
              fontWeight: 500,
              marginTop: 16,
            }}
          >
            60+ Developer, Design & Business Tools
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#37474b80",
              lineHeight: 1.6,
              marginTop: 20,
              maxWidth: 520,
            }}
          >
            PDF tools, image converters, QR generators, text utilities, dev
            tools, and more — all free, all client-side.
          </div>
          <div
            style={{
              fontSize: 16,
              color: "#37474b50",
              marginTop: "auto",
            }}
          >
            tools.atlas-studio.eu
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
