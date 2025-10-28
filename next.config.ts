import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js strict checks and warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable strict mode
  reactStrictMode: false,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Allow experimental features
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
  },
  // Reduce build strictness
  swcMinify: true,
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;