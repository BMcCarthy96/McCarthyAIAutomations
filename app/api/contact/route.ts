import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = (process.env.CONTACT_EMAIL ?? "").trim();
    const contactFromEmail = (process.env.CONTACT_FROM_EMAIL ?? "").trim();
    const fromEmail = contactFromEmail || "onboarding@resend.dev";

    if (!resendApiKey || !contactEmail) {
      const missing = [];
      if (!resendApiKey) missing.push("RESEND_API_KEY");
      if (!contactEmail) missing.push("CONTACT_EMAIL");
      return NextResponse.json(
        {
          error: "Contact form is not configured.",
          details: `Missing: ${missing.join(", ")}. Set these in Vercel → Project → Settings → Environment Variables and redeploy.`,
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const resend = new Resend(resendApiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject: `Contact: ${name}${company ? ` (${company})` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
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
