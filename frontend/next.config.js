/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        // Disable image optimization for external URLs in Docker environment
        // This prevents server-side fetch issues when frontend can't reach localhost:8080
        unoptimized: process.env.NODE_ENV === 'production',
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'backend',
                port: '8080',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/images/**',
            },
        ],
        domains: ['avatars.githubusercontent.com', 'cdn.jsdelivr.net', 'localhost', 'backend'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        // Removed deprecated options for Next.js 15
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
}

module.exports = nextConfig 