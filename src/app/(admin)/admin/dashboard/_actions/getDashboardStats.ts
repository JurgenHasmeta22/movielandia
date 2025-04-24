"use server";

import { unstable_cacheLife as cacheLife } from "next/cache";
import { prisma } from "../../../../../../prisma/config/prisma";

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
	"use cache";

	cacheLife("hours");

	const [
		totalMovies,
		totalSeries,
		totalGenres,
		totalActors,
		totalEpisodes,
		totalSeasons,
		totalUsers,
	] = await Promise.all([
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
}
