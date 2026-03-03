import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AtlasStudioBot/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
    }

    const html = await response.text();

    const getMeta = (property: string): string => {
      const patterns = [
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, "i"),
        new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`, "i"),
        new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`, "i"),
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return match[1];
      }
      return "";
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

    const data = {
      title: getMeta("og:title") || getMeta("twitter:title") || (titleMatch ? titleMatch[1] : ""),
      description: getMeta("og:description") || getMeta("twitter:description") || getMeta("description"),
      image: getMeta("og:image") || getMeta("twitter:image"),
      siteName: getMeta("og:site_name"),
      url: getMeta("og:url") || url,
      type: getMeta("og:type"),
    };

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
  }
}
