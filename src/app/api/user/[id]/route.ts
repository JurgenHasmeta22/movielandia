import { prisma } from "@/lib/prisma/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            favMovies: { include: { movie: true } },
            favSeries: { include: { serie: true } },
            favActors: { include: { actor: true } },
            favEpisodes: { include: { episode: true } },
            favSeasons: { include: { season: true } },
            movieReviews: { include: { movie: true } },
            serieReviews: { include: { serie: true } },
            seasonReviews: { include: { season: true } },
            episodeReviews: { include: { episode: true } },
            actorReviews: { include: { actor: true } },
            movieReviewsUpvoted: { include: { movieReview: true, movie: true } },
            movieReviewsDownvoted: { include: { movieReview: true, movie: true } },
            serieReviewsUpvoted: { include: { serieReview: true, serie: true } },
            serieReviewsDownvoted: { include: { serieReview: true, serie: true } },
            seasonReviewsUpvoted: { include: { seasonReview: true, season: true } },
            seasonReviewsDownvoted: { include: { seasonReview: true, season: true } },
            episodeReviewsUpvoted: { include: { episodeReview: true, episode: true } },
            episodeReviewsDownvoted: { include: { episodeReview: true, episode: true } },
            actorReviewsUpvoted: { include: { actorReview: true, actor: true } },
            actorReviewsDownvoted: { include: { actorReview: true, actor: true } },
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
            favActors: user.favActors,
            favSeasons: user.favSeasons,
            favEpisodes: user.favEpisodes,
            movieReviews: user.movieReviews,
            serieReviews: user.serieReviews,
            seasonReviews: user.seasonReviews,
            episodeReviews: user.episodeReviews,
            actorReviews: user.actorReviews,
            upvotedMovies: user.movieReviewsUpvoted,
            downvotedMovies: user.movieReviewsDownvoted,
            upvotedSeries: user.serieReviewsUpvoted,
            downvotedSeries: user.serieReviewsDownvoted,
            upvotedSeasons: user.seasonReviewsUpvoted,
            downvotedSeasons: user.seasonReviewsDownvoted,
            upvotedEpisodes: user.episodeReviewsUpvoted,
            downvotedEpisodes: user.episodeReviewsDownvoted,
            upvotedActors: user.actorReviewsUpvoted,
            downvotedActors: user.actorReviewsDownvoted,
        };

        return Response.json(userDetails, { status: 200 });
    }
}
