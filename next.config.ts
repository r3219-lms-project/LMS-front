import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {source: '/screens/:path', destination: "/:path"}
    ];
  }
};

export default nextConfig;
