import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query", "info", "warn", "error"],
        errorFormat: "pretty",
    }).$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY!, enable: process.env.VERCEL_ENV !== "production"}));

if (process.env.VERCEL_ENV !== "production") globalForPrisma.prisma = prisma;
