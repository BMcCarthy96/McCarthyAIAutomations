import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Deny framing (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Modern clickjacking protection (redundant with X-Frame-Options for broader coverage)
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Control referrer information sent to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict browser feature access
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 1 year (only applies in production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Disable legacy XSS filter (modern browsers ignore it; old IE could introduce vulnerabilities)
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      // Dead URLs referenced from nav and external links
      { source: "/portal", destination: "/dashboard", permanent: false },
      { source: "/consultation", destination: "/contact", permanent: false },
      { source: "/get-started", destination: "/contact", permanent: false },
      // Old service slugs redirected to their revenue-recovery equivalents
      { source: "/services/website-revamp-ai", destination: "/services/revenue-leak-audit", permanent: true },
      { source: "/services/ai-voice-agents", destination: "/services/speed-to-lead", permanent: true },
      { source: "/services/lead-capture-appointment", destination: "/services/no-dropped-leads", permanent: true },
      { source: "/services/website-ai-chatbots", destination: "/services/no-dropped-leads", permanent: true },
      { source: "/services/crm-workflow-automation", destination: "/services/revenue-ops-buildout", permanent: true },
      { source: "/services/custom-ai-integrations", destination: "/services/revenue-ops-buildout", permanent: true },
    ];
  },
};

export default nextConfig;
