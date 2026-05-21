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
    default: "McCarthy AI Solutions | AI Workflow Systems That Recover Lost Revenue",
    template: "%s | McCarthy AI Solutions",
  },
  description:
    "McCarthy AI Solutions identifies where your business loses revenue through missed leads, slow follow-up, and broken workflows — then builds high-touch AI systems to recover it.",
  keywords: [
    "revenue recovery",
    "AI workflow systems",
    "missed leads",
    "lead follow-up automation",
    "pipeline bottleneck",
    "revenue leak audit",
    "AI automation",
  ],
  authors: [{ name: "McCarthy AI Solutions" }],
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
