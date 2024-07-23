import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
            favMovies: { include: { movie: true } },
            favSeries: { include: { serie: true } },
            movieReviews: { include: { movie: true } },
            serieReviews: { include: { serie: true } },
            upvotedMovies: { include: { movieReview: true, movie: true } },
            downvotedMovies: { include: { movieReview: true, movie: true } },
            upvotedSeries: { include: { serieReview: true, serie: true } },
            downvotedSeries: { include: { serieReview: true, serie: true } },
        },
    });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const userDetails = {
        id: user.id,
        email: user.email,
        userName: user.userName,
        favMovies: user.favMovies,
        favSeries: user.favSeries,
        movieReviews: user.movieReviews,
        serieReviews: user.serieReviews,
        upvotedMovies: user.upvotedMovies,
        downvotedMovies: user.downvotedMovies,
        upvotedSeries: user.upvotedSeries,
        downvotedSeries: user.downvotedSeries,
    };

    res.status(200).json(userDetails);
}
