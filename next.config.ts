import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"), // ✅ Ensures alias resolves correctly
    };
    return config;
  },
  output: "standalone", // ✅ Enables standalone mode for smaller Docker images
};

export default nextConfig;
