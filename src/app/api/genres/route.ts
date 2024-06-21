import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getGenres(): Promise<any | null> {
    const genres = await prisma.genre.findMany();
    const count = await prisma.genre.count();

    if (genres) {
        return { rows: genres, count };
    } else {
        return null;
    }
}

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const data = await getGenres();

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "No genres found" });
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
