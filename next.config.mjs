import { withPigment } from "@pigment-css/nextjs-plugin";
import { experimental_extendTheme as extendTheme } from "@mui/material";

/** @type {import('next').NextConfig} */

const nextConfig = {
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

/**
 * @type {import('@pigment-css/nextjs-plugin').PigmentOptions}
 */
const pigmentConfig = { theme: extendTheme() };

export default withPigment(nextConfig, pigmentConfig);
