/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Output standalone for Docker deployment
  output: 'standalone',
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['t.me'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.telegram.org',
      },
    ],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
