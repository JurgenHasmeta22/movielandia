import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/config/prisma";
import { Movie } from "@prisma/client";

type RatingsMap = {
    [key: number]: {
        averageRating: number;
        totalReviews: number;
    };
};

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const title = searchParams.get("title") || "";
        const page = Number(searchParams.get("page")) || 1;
        const sortBy = searchParams.get("sortBy") || undefined;
        const ascOrDesc = searchParams.get("ascOrDesc") as "asc" | "desc" | undefined;
        const userId = searchParams.get("userId") ? Number(searchParams.get("userId")) : undefined;

        const orderByObject: any = {};
        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const query = {
            where: {
                title: { contains: title },
            },
            orderBy: orderByObject,
            skip: (page - 1) * 12,
            take: 12,
        };

        const movies = await prisma.movie.findMany(query);
        const movieIds = movies.map((movie: Movie) => movie.id);

        const movieRatings = await prisma.movieReview.groupBy({
            by: ["movieId"],
            where: { movieId: { in: movieIds } },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        const movieRatingsMap: RatingsMap = movieRatings.reduce((map, rating) => {
            map[rating.movieId] = {
                averageRating: rating._avg.rating || 0,
                totalReviews: rating._count.rating,
            };
            return map;
        }, {} as RatingsMap);

        const moviesFinal = await Promise.all(
            movies.map(async (movie) => {
                const { ...properties } = movie;
                let isBookmarked = false;

                if (userId) {
                    const existingFavorite = await prisma.userMovieFavorite.findFirst({
                        where: {
                            AND: [{ userId }, { movieId: movie.id }],
                        },
                    });
                    isBookmarked = !!existingFavorite;
                }

                const ratingsInfo = movieRatingsMap[movie.id] || { averageRating: 0, totalReviews: 0 };
                return { ...properties, ...ratingsInfo, ...(userId && { isBookmarked }) };
            }),
        );

        const count = await prisma.movie.count({
            where: {
                title: { contains: title },
            },
        });

        return NextResponse.json({ movies: moviesFinal, count });
    } catch (error) {
        console.error("Error searching movies:", error);
        return NextResponse.json({ error: "Failed to search movies" }, { status: 500 });
    }
}
