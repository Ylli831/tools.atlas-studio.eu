import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 300_000; // 5 minutes

function isRateLimited(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

async function getAccessToken(): Promise<string> {
  const tenantId = process.env.AZURE_TENANT_ID!;
  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to get access token");
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  const { idea, email } = await req.json();

  if (!idea || idea.trim().length < 3) {
    return NextResponse.json(
      { error: "Please describe your tool idea." },
      { status: 400 }
    );
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#37474b">
      <h2 style="font-size:24px;margin-bottom:24px;border-bottom:2px solid #487877;padding-bottom:12px">
        New Tool Suggestion
      </h2>
      <div style="background:#f5f3ef;border-radius:8px;padding:16px;white-space:pre-wrap">${idea}</div>
      ${email ? `<p style="margin-top:16px;font-size:14px;color:#8a9295">From: <a href="mailto:${email}" style="color:#487877">${email}</a></p>` : ""}
      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e2dc;font-size:13px;color:#8a9295">
        Sent from tools.atlas-studio.eu
      </div>
    </div>
  `;

  try {
    const accessToken = await getAccessToken();
    const sender = process.env.SMTP_USER!;
    const recipient = process.env.CONTACT_TO || "info@atlas-studio.eu";

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${sender}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: `[Tools] New tool suggestion${email ? ` from ${email}` : ""}`,
            body: { contentType: "HTML", content: html },
            from: { emailAddress: { address: sender, name: "Atlas Studio Tools" } },
            toRecipients: [{ emailAddress: { address: recipient } }],
            ...(email ? { replyTo: [{ emailAddress: { address: email } }] } : {}),
          },
        }),
      }
    );

    if (!graphRes.ok) throw new Error("Graph API send failed");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tool suggestion error:", err);
    return NextResponse.json({ error: "Failed to send suggestion." }, { status: 500 });
  }
}
