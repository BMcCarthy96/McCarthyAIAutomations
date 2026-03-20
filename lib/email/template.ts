/**
 * Reusable HTML email template for client notifications.
 * Inline styles for maximum email client compatibility.
 * Explicit backgrounds for readable rendering in dark mode (e.g. Gmail).
 */

const COMPANY_NAME = "McCarthy AI Automations";
const FOOTER_TEXT =
  "You are receiving this email because you are a client of McCarthy AI Automations.";

export function renderEmailTemplate({
  title,
  content,
  actionText,
  actionUrl,
  /** Overrides default client footer (e.g. public consultation vs portal notifications). */
  footerText,
}: {
  title: string;
  content: string;
  actionText?: string;
  actionUrl?: string;
  footerText?: string;
}): string {
  const hasAction = Boolean(actionText && actionUrl);
  const footer = footerText ?? FOOTER_TEXT;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding: 32px 32px 24px 32px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: #111111;">${escapeHtml(COMPANY_NAME)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #ffffff;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111111; line-height: 1.3;">${escapeHtml(title)}</h1>
              <div style="font-size: 15px; line-height: 1.6; color: #111111; white-space: pre-wrap;">${escapeHtml(content)}</div>
              ${hasAction ? `
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td style="border-radius: 6px; background-color: #111111;">
                    <a href="${escapeHtml(actionUrl!)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #ffffff; text-decoration: none;">${escapeHtml(actionText!)}</a>
                  </td>
                </tr>
              </table>
              ` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; background-color: #ffffff; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">${escapeHtml(footer)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
