import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    formats: ['image/webp'],
    qualities: [75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.rockstarhub.ru',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig;