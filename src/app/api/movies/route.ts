import { prisma } from "../../../../prisma/config/prisma";
import { NextRequest, NextResponse } from "next/server";
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
        const userId = searchParams.get("userId") ? Number(searchParams.get("userId")) : undefined;
        
        const filters: any = {};
        const orderByObject: any = {};

        const perPage = searchParams.get("perPage") ? Number(searchParams.get("perPage")) : 12;
        const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
        const skip = (page - 1) * perPage;
        const take = perPage;

        const title = searchParams.get("title") || undefined;
        if (title) filters.title = { contains: title };

        const filterValue = searchParams.get("filterValue") ? Number(searchParams.get("filterValue")) : undefined;
        const filterNameString = searchParams.get("filterNameString") || undefined;
        const filterOperatorString = searchParams.get("filterOperatorString") as ">" | "<" | "=" || undefined;

        if (filterValue !== undefined && filterNameString && filterOperatorString) {
            const operator = filterOperatorString === ">" ? "gt" : filterOperatorString === "<" ? "lt" : "equals";
            filters[filterNameString] = { [operator]: filterValue };
        }

        const sortBy = searchParams.get("sortBy") || undefined;
        const ascOrDesc = searchParams.get("ascOrDesc") as "asc" | "desc" || undefined;
        if (sortBy && ascOrDesc) {
            orderByObject[sortBy] = ascOrDesc;
        }

        const movies = await prisma.movie.findMany({
            where: filters,
            orderBy: orderByObject,
            skip,
            take,
        });

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

        const moviesCount = await prisma.movie.count();

        return NextResponse.json({ 
            movies: moviesFinal, 
            count: moviesCount 
        });

    } catch (error) {
        console.error("Error fetching movies:", error);
        
        return NextResponse.json(
            { error: "Failed to fetch movies" },
            { status: 500 }
        );
    }
}
