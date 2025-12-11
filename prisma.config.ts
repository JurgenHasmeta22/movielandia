import { loadEnvFile } from "node:process";

loadEnvFile();

export default {
	schema: "prisma/schema",
	datasource: {
		url: process.env.POSTGRES_PRISMA_URL || "",
	},
};
