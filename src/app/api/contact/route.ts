import { NextRequest, NextResponse } from "next/server";
import { buildAutoReplyHtml } from "./autoReplyTemplate";

// Simple in-memory rate limiter: 5 requests per 60 seconds per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get access token: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  const { name, email, subject, message, locale = "en" } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#37474b">
      <h2 style="font-size:24px;margin-bottom:24px;border-bottom:2px solid #487877;padding-bottom:12px">
        New message - Atlas Studio Tools
      </h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;font-weight:600;width:120px">Name</td><td style="padding:8px 0">${name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#487877">${email}</a></td></tr>
        ${subject ? `<tr><td style="padding:8px 0;font-weight:600">Subject</td><td style="padding:8px 0">${subject}</td></tr>` : ""}
      </table>
      <div style="margin-top:24px">
        <p style="font-weight:600;margin-bottom:8px">Message</p>
        <div style="background:#f5f3ef;border-radius:8px;padding:16px;white-space:pre-wrap">${message}</div>
      </div>
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
            subject: `[Tools] New message from ${name}${subject ? ` - ${subject}` : ""}`,
            body: { contentType: "HTML", content: html },
            from: {
              emailAddress: { address: sender, name: "Atlas Studio Tools" },
            },
            toRecipients: [{ emailAddress: { address: recipient } }],
            replyTo: [{ emailAddress: { address: email, name } }],
          },
        }),
      }
    );

    if (!graphRes.ok) {
      const err = await graphRes.text();
      console.error("Graph API error:", err);
      throw new Error("Graph API send failed");
    }

    // Send auto-reply
    const { subject: replySubject, html: replyHtml } = buildAutoReplyHtml({
      name,
      locale,
    });

    const replyRes = await fetch(
      `https://graph.microsoft.com/v1.0/users/${sender}/sendMail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: replySubject,
            body: { contentType: "HTML", content: replyHtml },
            from: {
              emailAddress: { address: sender, name: "Atlas Studio" },
            },
            toRecipients: [{ emailAddress: { address: email, name } }],
          },
        }),
      }
    );

    if (!replyRes.ok) {
      console.error("Auto-reply send error:", await replyRes.text());
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json(
      {
        error:
          "Failed to send message. Please email us directly at info@atlas-studio.eu",
      },
      { status: 500 }
    );
  }
}
