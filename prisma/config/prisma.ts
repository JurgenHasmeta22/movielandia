import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
	const connectionString =
		process.env.MOV_DATABASE_URL_POOLED ||
		process.env.MOV_PRISMA_DATABASE_URL ||
		process.env.MOV_POSTGRES_URL;

	if (!connectionString) {
		throw new Error(
			"MOV_DATABASE_URL_POOLED, MOV_PRISMA_DATABASE_URL or MOV_POSTGRES_URL environment variable is not set",
		);
	}

	const adapter = new PrismaPg({
		connectionString,
		max: 5,
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
