import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const adapter = new PrismaPg({
	connectionString: process.env.POSTGRES_PRISMA_URL,
});

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
		log: ["query", "info", "warn", "error"],
		errorFormat: "pretty",
	});

if (process.env.VERCEL_ENV !== "production") globalForPrisma.prisma = prisma;
