/**
 * Delayed follow-up email for public consultation leads (booking CTA).
 * Styled via renderEmailTemplate like public-consultation and admin emails.
 */

import { Resend } from "resend";
import { renderEmailTemplate } from "@/lib/email/template";

const FOOTER =
  "You received this because you requested a consultation on our website. If you’re no longer interested, you can ignore this email.";

export type LeadFollowUpEmailPayload = {
  requesterName: string;
  requesterEmail: string;
  bookingUrl: string;
};

const DEFAULT_SUBJECT = "Still interested in automating your lead follow-up?";

/**
 * Sends a single lead follow-up email. Caller handles auth and DB updates.
 * Returns false if Resend is not configured or send fails (logs warning).
 */
export async function sendLeadFollowUpEmail(
  payload: LeadFollowUpEmailPayload
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail =
    (process.env.CONTACT_FROM_EMAIL ?? "").trim() || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("[lead-follow-up-email] RESEND_API_KEY missing; skipping send");
    return false;
  }

  const first = payload.requesterName.split(/\s+/)[0] || "there";
  const content = [
    `Hi ${first},`,
    "",
    "A little while ago you reached out about AI automation—we wanted to check in.",
    "",
    "If you’re still exploring ways to capture and follow up with leads automatically, the fastest next step is to grab a time on our calendar. We’ll align on your workflow and what to automate first.",
    "",
    "No pressure—just reply to this email if you’d rather talk async.",
  ].join("\n");

  const html = renderEmailTemplate({
    title: "Book a quick call",
    content,
    actionText: "Book a time",
    actionUrl: payload.bookingUrl,
    footerText: FOOTER,
  });

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromEmail,
      to: payload.requesterEmail,
      subject: DEFAULT_SUBJECT,
      html,
      replyTo: (process.env.CONTACT_EMAIL ?? "").trim() || undefined,
    });

    if (result.error) {
      console.warn(
        "[lead-follow-up-email] Resend error:",
        result.error.message
      );
      return false;
    }
    return true;
  } catch (e) {
    console.warn(
      "[lead-follow-up-email]",
      e instanceof Error ? e.message : String(e)
    );
    return false;
  }
}

export { DEFAULT_SUBJECT as LEAD_FOLLOW_UP_EMAIL_SUBJECT };
