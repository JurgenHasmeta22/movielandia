import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "50mb",
		},
	},
	cacheComponents: true,
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
};

export default nextConfig;
