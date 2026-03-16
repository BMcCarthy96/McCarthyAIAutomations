import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || "onboarding@resend.dev";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY. Set it in Vercel environment variables and redeploy." },
      { status: 503 }
    );
  }
  if (!toEmail) {
    return NextResponse.json(
      { error: "Missing CONTACT_EMAIL. Set it in Vercel environment variables and redeploy." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: "Test email from McCarthy AI Automations",
      html: "<p>Your email system is working 🎉</p>",
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
