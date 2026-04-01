import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Optional email-only contact endpoint (Resend).
 * The marketing /contact page saves to `support_requests` via `createPublicSupportRequestAction`
 * and does not call this route unless you wire it separately.
 */
export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = (process.env.CONTACT_EMAIL ?? "").trim();
    const contactFromEmail = (process.env.CONTACT_FROM_EMAIL ?? "").trim();
    const fromEmail = contactFromEmail || "onboarding@resend.dev";

    if (!resendApiKey || !contactEmail) {
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const visitorEmail = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const WEBSITE_MAX = 512;
    const NAME_MAX = 200;
    const EMAIL_MAX = 320;
    const COMPANY_MAX = 200;
    const MESSAGE_MAX = 10_000;

    const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    if (!name || !visitorEmail || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    if (
      name.length > NAME_MAX ||
      visitorEmail.length > EMAIL_MAX ||
      company.length > COMPANY_MAX ||
      message.length > MESSAGE_MAX
    ) {
      return NextResponse.json({ error: "Invalid form input." }, { status: 400 });
    }
    if (!looksLikeEmail(visitorEmail)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    // Basic bot trap: reject hidden honeypot field submissions.
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      if (body.website.trim().length > WEBSITE_MAX) {
        return NextResponse.json({ error: "Invalid form input." }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    // Always send to configured inbox; visitor email is replyTo only (required for Resend sandbox).
    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: visitorEmail,
      subject: `Contact: ${name}${company ? ` (${company})` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${visitorEmail}`,
        company ? `Company: ${company}` : null,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
