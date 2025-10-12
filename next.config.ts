import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: '/',
        destination: '/screens',
      },
      {
        source: '/:path*',
        destination: '/screens/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/screens/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
