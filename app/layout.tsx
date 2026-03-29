import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "McCarthy AI Automations | Premium AI Automation Agency",
    template: "%s | McCarthy AI Automations",
  },
  description:
    "McCarthy AI Automations helps businesses scale with AI: website revamps, voice agents, chatbots, lead capture, CRM automation, and custom integrations.",
  keywords: [
    "AI automation",
    "AI voice agents",
    "website chatbots",
    "lead capture",
    "CRM automation",
    "AI integrations",
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
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-premium min-h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
