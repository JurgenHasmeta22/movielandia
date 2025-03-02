"use server";

import { prisma } from "../../../../../../prisma/config/prisma";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TIMES } from "@/utils/cache.utils";

export type DashboardStats = {
    totalMovies: number;
    totalSeries: number;
    totalGenres: number;
    totalActors: number;
    totalEpisodes: number;
    totalSeasons: number;
    totalUsers: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
    const cachedStats = unstable_cache(
        async () => {
            const [totalMovies, totalSeries, totalGenres, totalActors, totalEpisodes, totalSeasons, totalUsers] =
                await Promise.all([
                    prisma.movie.count(),
                    prisma.serie.count(),
                    prisma.genre.count(),
                    prisma.actor.count(),
                    prisma.episode.count(),
                    prisma.season.count(),
                    prisma.user.count(),
                ]);

            return {
                totalMovies,
                totalSeries,
                totalGenres,
                totalActors,
                totalEpisodes,
                totalSeasons,
                totalUsers,
            };
        },
        ["dashboard-stats"],
        {
            revalidate: CACHE_TIMES.DAY,
            tags: Object.values(CACHE_TAGS),
        }
    );

    return cachedStats();
}
