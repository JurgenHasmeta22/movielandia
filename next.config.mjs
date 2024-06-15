/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
