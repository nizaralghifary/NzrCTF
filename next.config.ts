import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGIN?.split(",") ?? ["localhost:3000"]
    }
  }
};

export default nextConfig;
