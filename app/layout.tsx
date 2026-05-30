import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AssistantWidgetRoot } from "@/components/assistant/AssistantWidgetRoot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Workflow Consulting & Automation Roadmaps | McCarthy AI Automations",
    template: "%s | McCarthy AI Automations",
  },
  description:
    "Audit-first AI workflow consulting for lead handling, follow-up, and operational handoffs. Diagnose bottlenecks, map deterministic automation and bounded AI steps, then implement only when the roadmap confirms it makes sense.",
  keywords: [
    "revenue recovery",
    "AI workflow systems",
    "missed leads",
    "lead follow-up automation",
    "pipeline bottleneck",
    "revenue leak audit",
    "AI automation",
  ],
  authors: [{ name: "McCarthy AI Automations" }],
  openGraph: {
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-premium min-h-screen`}>
          <div aria-hidden className="noise-overlay" />
          {children}
          <AssistantWidgetRoot />
        </body>
      </html>
    </ClerkProvider>
  );
}
