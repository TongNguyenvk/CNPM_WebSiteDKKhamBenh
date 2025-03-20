import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "phuongnamvina.com", // Thêm hostname của ảnh remote
      },
    ],
    domains: ["phuongnamvina.com"], // Nếu ảnh load từ stywin.com
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
