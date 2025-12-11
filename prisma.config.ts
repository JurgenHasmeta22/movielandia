import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema/main.prisma",
	datasource: {
		url: env("POSTGRES_PRISMA_URL"),
		shadowDatabaseUrl: env("POSTGRES_URL_NON_POOLING"),
	},
	migrations: {
		path: "prisma/schema/migrations",
	},
});
