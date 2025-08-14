import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint during build to avoid generated file errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable Turbopack for faster builds
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react", "react-icons"],
  },
};

export default nextConfig;
