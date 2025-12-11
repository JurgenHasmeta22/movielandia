import { loadEnvFile } from "node:process";

loadEnvFile();

export default {
	schema: "prisma/schema/main.prisma",
	datasource: {
		url: process.env.POSTGRES_PRISMA_URL || "",
	},
};
