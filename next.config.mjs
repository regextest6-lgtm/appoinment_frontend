/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export on Netlify
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Production source maps (optional - disable for smaller bundle)
  productionBrowserSourceMaps: false,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://appoinment-backend-gy1s.onrender.com/api/v1',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://appoinment-backend-gy1s.onrender.com/api/v1',
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  // Rewrites for API proxy (optional)
  async rewrites() {
    return {
      beforeFiles: [
        // API proxy to backend
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
