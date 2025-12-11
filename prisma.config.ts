import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema/main.prisma",
	datasource: {
		url: process.env.POSTGRES_PRISMA_URL || "",
	},
	migrations: {
		path: "prisma/schema/migrations",
	},
});
