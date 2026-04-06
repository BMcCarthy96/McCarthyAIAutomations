import { NextResponse } from "next/server";
import { runWidgetAssistantQuery } from "@/lib/assistant/run-widget-assistant";

/**
 * Site-wide assistant widget — JSON API.
 * Mode (public / demo / client) is resolved on the server from Clerk + portal link + demo flags.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body.", openAiConfigured: false },
      { status: 400 }
    );
  }

  const o = body as Record<string, unknown>;
  const question = typeof o.question === "string" ? o.question : "";
  const pathname = typeof o.pathname === "string" ? o.pathname : "/";

  const result = await runWidgetAssistantQuery({ question, pathname });
  const status = result.success ? 200 : 400;
  return NextResponse.json(result, { status });
}
