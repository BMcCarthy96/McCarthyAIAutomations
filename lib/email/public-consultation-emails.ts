/**
 * Best-effort HTML emails for public consultation / contact form submissions.
 * Uses the same layout as project update emails (lib/email/template.ts).
 */

import { Resend } from "resend";
import { renderEmailTemplate } from "@/lib/email/template";

const ADMIN_NOTIFICATION_FOOTER =
  "You are receiving this because CONTACT_EMAIL is set as the admin inbox for new consultation requests.";

const REQUESTER_CONFIRMATION_FOOTER =
  "You received this because you submitted a consultation request on our website. If you did not submit this request, you can ignore this email.";

function getAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  );
}

export type PublicConsultationEmailPayload = {
  requesterName: string;
  requesterEmail: string;
  /** Optional; included in admin notification only when set. */
  requesterPhone?: string;
  company: string;
  subject: string;
  message: string;
};

/**
 * Sends admin notification (CONTACT_EMAIL) and requester confirmation.
 * Never throws; logs on missing config or Resend errors. Safe to await after DB success.
 */
export async function sendPublicConsultationEmails(
  payload: PublicConsultationEmailPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";
  const adminTo = (process.env.CONTACT_EMAIL ?? "").trim();

  if (!apiKey) {
    console.warn(
      "[public-consultation-emails] RESEND_API_KEY missing; skipping emails"
    );
    return;
  }

  const resend = new Resend(apiKey);
  const baseUrl = getAppBaseUrl();
  const adminSupportUrl = baseUrl ? `${baseUrl}/admin/support` : "";

  if (adminTo) {
    try {
      const adminContent = [
        "A new consultation request was submitted from your website.",
        "",
        `Name: ${payload.requesterName}`,
        `Email: ${payload.requesterEmail}`,
        ...(payload.requesterPhone
          ? [`Phone: ${payload.requesterPhone}`]
          : []),
        `Subject: ${payload.subject}`,
        ...(payload.company ? [`Company: ${payload.company}`] : []),
        "",
        "Message:",
        payload.message,
      ].join("\n");

      const html = renderEmailTemplate({
        title: "New consultation request",
        content: adminContent,
        actionText: adminSupportUrl ? "View support requests" : undefined,
        actionUrl: adminSupportUrl || undefined,
        footerText: ADMIN_NOTIFICATION_FOOTER,
      });

      const result = await resend.emails.send({
        from: fromEmail,
        to: adminTo,
        replyTo: payload.requesterEmail,
        subject: `New consultation request: ${payload.subject}`,
        html,
      });

      if (result.error) {
        console.warn(
          "[public-consultation-emails] Admin notification failed:",
          result.error.message
        );
      }
    } catch (e) {
      console.warn(
        "[public-consultation-emails] Admin notification error:",
        e instanceof Error ? e.message : String(e)
      );
    }
  } else {
    console.warn(
      "[public-consultation-emails] CONTACT_EMAIL missing; skipping admin notification"
    );
  }

  try {
    const confirmContent = [
      `Hi ${payload.requesterName},`,
      "",
      "Thank you for reaching out. We've received your consultation request and will review it shortly.",
      "",
      "A member of our team will follow up with you soon—typically within one business day.",
      "",
      "If you have anything to add in the meantime, reply to this email and we'll see it.",
    ].join("\n");

    const html = renderEmailTemplate({
      title: "We received your consultation request",
      content: confirmContent,
      actionText: baseUrl ? "Visit our website" : undefined,
      actionUrl: baseUrl || undefined,
      footerText: REQUESTER_CONFIRMATION_FOOTER,
    });

    const result = await resend.emails.send({
      from: fromEmail,
      to: payload.requesterEmail,
      subject: "We received your consultation request",
      html,
    });

    if (result.error) {
      console.warn(
        "[public-consultation-emails] Requester confirmation failed:",
        result.error.message
      );
    }
  } catch (e) {
    console.warn(
      "[public-consultation-emails] Requester confirmation error:",
      e instanceof Error ? e.message : String(e)
    );
  }
}
