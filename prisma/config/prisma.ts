import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const connectionString =
	process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error(
		"DATABASE_URL or POSTGRES_PRISMA_URL environment variable is not set",
	);
}

const adapter = new PrismaPg({
	connectionString,
});

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "info", "warn", "error"]
				: ["warn", "error"],
		errorFormat: "pretty",
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
