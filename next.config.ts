/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        useCache: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
                port: "4000",
            },
            {
                protocol: "https",
                hostname: "movielandia-avenger22s-projects.vercel.app",
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
