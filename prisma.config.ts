import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema",
	datasource: {
		url: env("MOV_PRISMA_DATABASE_URL"),
	},
	migrations: {
		path: "prisma/schema/migrations",
	},
});
