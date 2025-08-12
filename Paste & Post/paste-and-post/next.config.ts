 import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
      serverComponentsExternalPackages: ['cheerio']
    }
  };

  export default nextConfig;
