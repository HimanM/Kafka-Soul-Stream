import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://order-service:8000/:path*',
      },
      {
        source: '/ws',
        destination: 'http://order-service:8000/ws',
      },
    ];
  },
};

console.log('API_URL:', process.env.API_URL);
console.log('Rewriting to:', 'http://order-service:8000');

export default nextConfig;
