import { NextResponse } from "next/server";
import { runMonthlyImpactReportEmails } from "@/lib/email/monthly-impact-report-runner";

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const headerSecret = req.headers.get("x-cron-secret")?.trim();
  const authHeader = req.headers.get("authorization")?.trim();
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  return headerSecret === secret || bearer === secret;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runMonthlyImpactReportEmails();
    return NextResponse.json(summary);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Cron job failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

