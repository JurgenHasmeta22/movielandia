"use server";

import { prisma } from "../../prisma/config/prisma";
import { FilterOperator } from "@/types/filterOperators";
import { cacheLife } from "next/cache";
import { Genre, Prisma } from "../../prisma/generated/prisma/client";

type RatingsMap = {
	[key: number]: {
		averageRating: number;
		totalReviews: number;
	};
};

interface GenreModelParams {
	sortBy?: string;
	ascOrDesc?: string;
	perPage?: number;
	page?: number;
	name?: string | null;
	type?: string | null;
	filterValue?: number | string;
	filterNameString?: string | null;
	filterOperatorString?: FilterOperator;
}

// #region "GET Methods"
export async function getGenresWithFilters({
	sortBy,
	ascOrDesc,
	perPage = 12,
	page = 1,
	name,
	filterValue,
	filterNameString,
	filterOperatorString,
}: GenreModelParams): Promise<{ rows: Genre[]; count: number }> {
	const filters: any = {};
	const orderByObject: any = {};

	const skip = (page - 1) * perPage;
	const take = perPage;

	if (name) filters.name = { contains: name };

	if (filterValue !== undefined && filterNameString && filterOperatorString) {
		if (filterOperatorString === "contains") {
			filters[filterNameString] = { contains: filterValue };
		} else {
			const operator =
				filterOperatorString === ">"
					? "gt"
					: filterOperatorString === "<"
						? "lt"
						: "equals";
			filters[filterNameString] = { [operator]: filterValue };
		}
	}

	orderByObject[sortBy || "name"] = ascOrDesc || "asc";

	const genres = await prisma.genre.findMany({
		where: filters,
		orderBy: orderByObject,
		skip,
		take,
	});

	const genresCount = await prisma.genre.count();

	return { rows: genres, count: genresCount };
}

export async function getGenres(): Promise<Genre[] | null> {
	"use cache";

	cacheLife("days");

	const genres = await prisma.genre.findMany();

	if (genres) {
		return genres;
	} else {
		return null;
	}
}

export async function getGenreById(
	genreId: number,
	{
		sortBy,
		ascOrDesc,
		perPage,
		page,
		name,
		type,
		filterValue,
		filterNameString,
		filterOperatorString,
	}: GenreModelParams,
	userId?: number,
): Promise<any | null> {
	const filters: any = {};
	const skip = perPage
		? page
			? (page - 1) * perPage
			: 0
		: page
			? (page - 1) * 12
			: 0;
	const take = perPage || 12;

	if (name) filters.name = { contains: name };

	if (filterValue !== undefined && filterNameString && filterOperatorString) {
		if (filterOperatorString === "contains") {
			filters[filterNameString] = { contains: filterValue };
		} else {
			const operator =
				filterOperatorString === ">"
					? "gt"
					: filterOperatorString === "<"
						? "lt"
						: "equals";
			filters[filterNameString] = { [operator]: filterValue };
		}
	}

	const orderByObject: any = {};

	orderByObject[sortBy || "title"] = ascOrDesc || "asc";

	const genre = await prisma.genre.findFirst({
		where: {
			id: genreId,
		},
	});

	if (genre) {
		if (type === "movie") {
			const result = await prisma.movieGenre.findMany({
				where: {
					genreId: genre?.id,
				},
				orderBy: {
					// @ts-expect-error fix
					movie: orderByObject,
				},
				skip,
				take,
				select: {
					// @ts-expect-error fix
					movie: true,
				},
			});

			const count = await prisma.movieGenre.count({
				where: {
					genreId: genre?.id,
				},
			});

			if (result) {
				const movies = await Promise.all(
					result.map(async (item) => {
						const isBookmarked = userId
							? await prisma.userMovieFavorite.findFirst({
									where: {
										userId,
										// @ts-expect-error fix
										movieId: item.movie.id,
									},
								})
							: null;

						return {
							// @ts-expect-error fix
							...item.movie,
							isBookmarked: !!isBookmarked,
						};
					}),
				);

				const movieIds = movies.map((movie) => movie.id);

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

				const movieRatingsMap: RatingsMap = movieRatings.reduce(
					(map, rating) => {
						map[rating.movieId] = {
							averageRating: rating._avg.rating || 0,
							totalReviews: rating._count.rating,
						};

						return map;
					},
					{} as RatingsMap,
				);

				const formattedMovies = movies.map((movie) => {
					const ratingsInfo = movieRatingsMap[movie.id] || {
						averageRating: 0,
						totalReviews: 0,
					};
					return { ...movie, ...ratingsInfo };
				});

				return { genre, movies: formattedMovies, count };
			}
		} else if (type === "serie") {
			const result = await prisma.serieGenre.findMany({
				where: {
					genreId: genre?.id,
				},
				orderBy: {
					// @ts-expect-error fix
					serie: orderByObject,
				},
				skip,
				take,
				select: {
					// @ts-expect-error fix
					serie: true,
				},
			});

			const count = await prisma.serieGenre.count({
				where: {
					genreId: genre?.id,
				},
			});

			if (result) {
				const series = await Promise.all(
					result.map(async (item) => {
						const isBookmarked = userId
							? await prisma.userSerieFavorite.findFirst({
									where: {
										userId,
										// @ts-expect-error fix
										serieId: item.serie.id,
									},
								})
							: null;

						return {
							// @ts-expect-error fix
							...item.serie,
							isBookmarked: !!isBookmarked,
						};
					}),
				);

				const serieIds = series.map((serie) => serie.id);

				const serieRatings = await prisma.serieReview.groupBy({
					by: ["serieId"],
					where: { serieId: { in: serieIds } },
					_avg: {
						rating: true,
					},
					_count: {
						rating: true,
					},
				});

				const serieRatingsMap: RatingsMap = serieRatings.reduce(
					(map, rating) => {
						map[rating.serieId] = {
							averageRating: rating._avg.rating || 0,
							totalReviews: rating._count.rating,
						};

						return map;
					},
					{} as RatingsMap,
				);

				const formattedSeries = series.map((serie) => {
					const ratingsInfo = serieRatingsMap[serie.id] || {
						averageRating: 0,
						totalReviews: 0,
					};
					return { ...serie, ...ratingsInfo };
				});

				return { genre, series: formattedSeries, count };
			}
		} else {
			return null;
		}
	} else {
		throw new Error("Genre not found");
	}
}

export async function getGenreByIdAdmin(
	genreId: number,
): Promise<Genre | null> {
	const genre = await prisma.genre.findFirst({
		where: {
			id: genreId,
		},
	});

	if (genre) {
		return genre;
	} else {
		return null;
	}
}

export async function getGenreByName(
	nameGenre: string,
	{
		sortBy,
		ascOrDesc,
		perPage,
		page,
		name,
		type,
		filterValue,
		filterNameString,
		filterOperatorString,
	}: GenreModelParams,
): Promise<any | null> {
	const filters: any = {};
	const skip = perPage
		? page
			? (page - 1) * perPage
			: 0
		: page
			? (page - 1) * 20
			: 0;
	const take = perPage || 20;

	if (name) filters.name = { contains: name };

	if (filterValue !== undefined && filterNameString && filterOperatorString) {
		if (filterOperatorString === "contains") {
			filters[filterNameString] = { contains: filterValue };
		} else {
			const operator =
				filterOperatorString === ">"
					? "gt"
					: filterOperatorString === "<"
						? "lt"
						: "equals";
			filters[filterNameString] = { [operator]: filterValue };
		}
	}

	const orderByObject: any = {};

	if (sortBy && ascOrDesc) {
		orderByObject[sortBy] = ascOrDesc;
	}

	const genre = await prisma.genre.findFirst({
		where: {
			name: {
				equals: nameGenre,
			},
		},
	});

	if (genre) {
		if (type === "movie") {
			const result = await prisma.movieGenre.findMany({
				where: {
					genreId: genre?.id,
				},
				orderBy: {
					// @ts-expect-error fix
					movie: orderByObject,
				},
				skip,
				take,
				select: {
					// @ts-expect-error fix
					movie: { include: { genres: { select: { genre: true } } } },
				},
			});

			const count = await prisma.movieGenre.count({
				where: {
					genreId: genre?.id,
				},
			});

			if (result) {
				// @ts-expect-error fix
				const movies = result.map((item) => item.movie);
				const movieIds = movies.map((movie) => movie.id);
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

				type RatingsMap = {
					[key: number]: {
						averageRating: number;
						totalReviews: number;
					};
				};

				const movieRatingsMap: RatingsMap = movieRatings.reduce(
					(map, rating) => {
						map[rating.movieId] = {
							averageRating: rating._avg.rating || 0,
							totalReviews: rating._count.rating,
						};

						return map;
					},
					{} as RatingsMap,
				);

				const formattedMovies = movies.map((movie) => {
					const { genres, ...properties } = movie;
					// @ts-expect-error fix
					const simplifiedGenres = genres.map((genre) => genre.genre);
					const ratingsInfo = movieRatingsMap[movie.id] || {
						averageRating: 0,
						totalReviews: 0,
					};

					return {
						...properties,
						genres: simplifiedGenres,
						...ratingsInfo,
					};
				});

				return { movies: formattedMovies, count };
			}
		} else if (type === "serie") {
			const result = await prisma.serieGenre.findMany({
				where: {
					genreId: genre?.id,
				},
				orderBy: {
					// @ts-expect-error fix
					serie: orderByObject,
				},
				skip,
				take,
				select: {
					// @ts-expect-error fix
					serie: { include: { genres: { select: { genre: true } } } },
				},
			});

			const count = await prisma.serieGenre.count({
				where: {
					genreId: genre?.id,
				},
			});

			if (result) {
				// @ts-expect-error fix
				const series = result.map((item) => item.serie);
				const serieIds = series.map((serie) => serie.id);
				const serieRatings = await prisma.serieReview.groupBy({
					by: ["serieId"],
					where: { serieId: { in: serieIds } },
					_avg: {
						rating: true,
					},
					_count: {
						rating: true,
					},
				});

				type RatingsMap = {
					[key: number]: {
						averageRating: number;
						totalReviews: number;
					};
				};

				const serieRatingsMap: RatingsMap = serieRatings.reduce(
					(map, rating) => {
						map[rating.serieId] = {
							averageRating: rating._avg.rating || 0,
							totalReviews: rating._count.rating,
						};

						return map;
					},
					{} as RatingsMap,
				);

				const formattedSeries = series.map((serie) => {
					const { genres, ...properties } = serie;
					// @ts-expect-error fix
					const simplifiedGenres = genres.map((genre) => genre.genre);
					const ratingsInfo = serieRatingsMap[serie.id] || {
						averageRating: 0,
						totalReviews: 0,
					};

					return {
						...properties,
						genres: simplifiedGenres,
						...ratingsInfo,
					};
				});

				return { series: formattedSeries, count };
			}
		} else {
			return null;
		}
	} else {
		throw new Error("Genre not found");
	}
}
// #endregion

// #region "Other Methods UPDATE, CREATE, DELETE, and SEARCH"
export async function addGenre(
	genreData: Prisma.GenreCreateInput,
): Promise<Genre | null> {
	const genre = await prisma.genre.create({
		data: genreData,
	});

	if (genre) {
		return genre;
	} else {
		return null;
	}
}

export async function updateGenreById(
	genreData: Prisma.GenreUpdateInput,
	id: string,
): Promise<Genre | null> {
	const genreUpdated = await prisma.genre.update({
		where: {
			id: parseInt(id),
		},
		data: genreData,
	});

	if (genreUpdated) {
		return genreUpdated;
	} else {
		return null;
	}
}

export async function deleteGenreById(id: number): Promise<string | null> {
	try {
		const genreDeleted = await prisma.genre.delete({
			where: {
				id,
			},
		});

		if (genreDeleted) {
			return "Genre deleted successfully";
		} else {
			return null;
		}
	} catch (error) {
		throw new Error("Failed to delete genre");
	}
}

export async function searchGenresByName(
	name: string,
	page: number,
): Promise<Genre[] | null> {
	const perPage = 20;
	const skip = perPage * (page - 1);
	const genres = await prisma.genre.findMany({
		where: {
			name: {
				contains: name,
			},
		},
		orderBy: {
			name: "asc",
		},
		skip,
		take: perPage,
	});

	if (genres) {
		return genres;
	} else {
		return null;
	}
}
// #endregion
