import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://contract-service:8000/:path*',
      },

    ];
  },
};

console.log('API_URL:', process.env.API_URL);
console.log('Rewriting to:', 'http://contract-service:8000');

export default nextConfig;
