interface AutoReplyParams {
  name: string;
  locale: string;
}

const translations: Record<
  string,
  {
    subject: string;
    greeting: (name: string) => string;
    thankYou: string;
    expectation: string;
    closing: string;
    whatsapp: string;
    team: string;
  }
> = {
  en: {
    subject: "We received your message — Atlas Studio",
    greeting: (name) => `Hi ${name},`,
    thankYou: "Thank you for reaching out to Atlas Studio.",
    expectation:
      "We've received your message and our team will get back to you within 24 hours on business days.",
    closing:
      "In the meantime, feel free to reply to this email if you have any additional details to share.",
    whatsapp: "You can also reach us on WhatsApp for a quicker response:",
    team: "The Atlas Studio Team",
  },
  sq: {
    subject: "Kemi marrë mesazhin tuaj — Atlas Studio",
    greeting: (name) => `Përshëndetje ${name},`,
    thankYou: "Faleminderit që na kontaktuat në Atlas Studio.",
    expectation:
      "Kemi marrë mesazhin tuaj dhe ekipi ynë do t'ju përgjigjet brenda 24 orëve në ditë pune.",
    closing:
      "Ndërkohë, mos hezitoni t'i përgjigjeni këtij emaili nëse keni detaje shtesë për të ndarë.",
    whatsapp: "Mund të na kontaktoni edhe në WhatsApp për përgjigje më të shpejtë:",
    team: "Ekipi i Atlas Studio",
  },
};

export function buildAutoReplyHtml({
  name,
  locale,
}: AutoReplyParams): { subject: string; html: string } {
  const t = translations[locale] || translations.en;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #37474b; background: #f5f3ef; padding: 32px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="https://atlas-studio.eu/Images/atlas-studio-banner.png" alt="Atlas Studio" style="height: 48px; width: auto;" />
      </div>
      <div style="background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid rgba(55,71,75,0.1);">
        <p style="font-size: 18px; margin-bottom: 16px;">${t.greeting(name)}</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">${t.thankYou}</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${t.expectation}</p>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${t.closing}</p>
        <div style="margin: 24px 0; padding: 16px; background: #f5f3ef; border-radius: 12px; text-align: center;">
          <p style="font-size: 14px; color: #37474b; margin-bottom: 12px;">${t.whatsapp}</p>
          <a href="https://wa.me/38345957990" style="display: inline-block; background: #25D366; color: #ffffff; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none;">WhatsApp: +383 45 957 990</a>
        </div>
        <p style="font-size: 16px; margin-top: 32px; color: #487877; font-weight: 600;">${t.team}</p>
      </div>
      <div style="text-align: center; margin-top: 24px; font-size: 13px; color: #37474b80;">
        <p>Atlas Studio &middot; <a href="https://atlas-studio.eu" style="color: #487877;">atlas-studio.eu</a></p>
      </div>
    </div>
  `;

  return { subject: t.subject, html };
}
