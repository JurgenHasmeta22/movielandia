import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
	const connectionString =
		process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error(
			"DATABASE_URL or POSTGRES_PRISMA_URL environment variable is not set",
		);
	}

	const { PrismaPg } = require("@prisma/adapter-pg");
	const adapter = new PrismaPg({
		connectionString,
	});

	return new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === "development"
				? ["query", "info", "warn", "error"]
				: ["warn", "error"],
		errorFormat: "pretty",
	});
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
