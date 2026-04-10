import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Dead URLs referenced from nav and external links
      { source: "/portal", destination: "/dashboard", permanent: false },
      { source: "/consultation", destination: "/contact", permanent: false },
      { source: "/get-started", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
