import { prisma } from "@/lib/prisma/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);

    const user = await prisma.user.findUnique({
        where: { id },
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
        return Response.json({ error: "User not found" }, { status: 404 });
    } else {
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

        return Response.json(userDetails, { status: 200 });
    }
}
