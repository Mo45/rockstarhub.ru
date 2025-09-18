import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'data.rockstarhub.ru',
      'mc.yandex.ru'
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