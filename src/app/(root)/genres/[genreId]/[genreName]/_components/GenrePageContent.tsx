import { Box, Typography } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenreById } from "@/actions/genre.actions";
import { notFound } from "next/navigation";
import GenreList from "./GenreList";
import GenreTabs from "./GenreTabs";
import { getGenreGradient } from "@/components/root/genreItem/genreGradient";

interface GenrePageContentProps {
	params: {
		genreId: string;
		genreName: string;
	};
	searchParams?: {
		moviesAscOrDesc?: string;
		pageMovies?: string;
		moviesSortBy?: string;
		seriesAscOrDesc?: string;
		pageSeries?: string;
		seriesSortBy?: string;
		filters?: string;
	};
	session: any;
}

interface IQueryParams {
	page: number;
	type: string;
	ascOrDesc?: string;
	sortBy?: string;
}

export default async function GenrePageContent({
	params,
	searchParams,
	session,
}: GenrePageContentProps) {
	const genreId = params.genreId;

	// #region "Movies data"
	const pageMovies = Number(searchParams?.pageMovies) || 1;
	const moviesSortBy = searchParams?.moviesSortBy ?? "";
	const moviesAscOrDesc = searchParams?.moviesAscOrDesc ?? "";
	const queryParamsMovies: IQueryParams = { page: pageMovies, type: "movie" };

	if (moviesSortBy) {
		queryParamsMovies.sortBy = moviesSortBy;
	}

	if (moviesAscOrDesc) {
		queryParamsMovies.ascOrDesc = moviesAscOrDesc;
	}

	let moviesByGenreData = [];

	try {
		moviesByGenreData = await getGenreById(
			Number(genreId),
			queryParamsMovies,
			Number(session?.user?.id),
		);
	} catch (error) {
		return notFound();
	}

	const genre: Genre = moviesByGenreData.genre;
	const moviesByGenre: Movie[] = moviesByGenreData.movies;
	const moviesByGenreCount: number = moviesByGenreData.count;
	const itemsPerPage = 12;
	const pageCountMovies = Math.ceil(moviesByGenreCount / itemsPerPage);
	// #endregion

	// #region "Series data"
	const pageSeries = Number(searchParams?.pageSeries) || 1;
	const seriesSortBy = searchParams?.seriesSortBy ?? "";
	const seriesAscOrDesc = searchParams?.seriesAscOrDesc ?? "";
	const queryParamsSeries: IQueryParams = { page: pageSeries, type: "serie" };

	if (seriesSortBy) {
		queryParamsSeries.sortBy = seriesSortBy;
	}

	if (seriesAscOrDesc) {
		queryParamsSeries.ascOrDesc = seriesAscOrDesc;
	}

	let seriesByGenreData = [];

	try {
		seriesByGenreData = await getGenreById(
			Number(genreId),
			queryParamsSeries,
			Number(session?.user?.id),
		);
	} catch (error) {
		return notFound();
	}

	const seriesByGenre: Serie[] = seriesByGenreData.series;
	const seriesByGenreCount: number = seriesByGenreData.count;
	const pageCountSeries = Math.ceil(seriesByGenreCount / itemsPerPage);
	// #endregion

	const totalCount = moviesByGenreCount + seriesByGenreCount;

	const shouldShowSection = (type: string) => {
		const selectedFilters = searchParams?.filters?.split(",") || ["all"];

		if (selectedFilters.includes("all")) {
			return true;
		}

		return selectedFilters.includes(type.toLowerCase());
	};

	const getSubtitleText = () => {
		const selectedFilters = searchParams?.filters?.split(",") || ["all"];

		if (selectedFilters.includes("all")) {
			return `Found ${totalCount} titles in ${genre.name} genre`;
		}

		if (
			selectedFilters.includes("movies") &&
			!selectedFilters.includes("series")
		) {
			return `Found ${moviesByGenreCount} movies in ${genre.name} genre`;
		}

		if (
			selectedFilters.includes("series") &&
			!selectedFilters.includes("movies")
		) {
			return `Found ${seriesByGenreCount} series in ${genre.name} genre`;
		}

		return `Found ${totalCount} titles in ${genre.name} genre`;
	};

	const heroGradient = getGenreGradient(genre.id);

	return (
		<Box
			sx={{
				maxWidth: "1320px",
				margin: "0 auto",
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 3, md: 5 },
			}}
		>
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					mb: { xs: 3, md: 4 },
					p: { xs: 3, sm: 5, md: 7 },
					borderRadius: { xs: "24px", md: "32px" },
					background: heroGradient.background,
					border: "1px solid rgba(243, 238, 230, 0.14)",
					boxShadow: `0 30px 70px ${heroGradient.from}44`,
					"&::before": {
						content: '""',
						position: "absolute",
						inset: 0,
						background:
							"radial-gradient(circle at 90% 0%, rgba(255,255,255,0.24), transparent 55%)",
						pointerEvents: "none",
					},
				}}
			>
				<Typography
					aria-hidden
					sx={{
						position: "absolute",
						right: { xs: -10, md: 30 },
						bottom: { xs: -30, md: -60 },
						fontFamily: "var(--font-display)",
						fontSize: { xs: "9rem", sm: "13rem", md: "18rem" },
						fontWeight: 800,
						lineHeight: 1,
						letterSpacing: "-0.05em",
						color: "rgba(255, 255, 255, 0.12)",
						userSelect: "none",
						whiteSpace: "nowrap",
					}}
				>
					{genre.name}
				</Typography>
				<Box sx={{ position: "relative", maxWidth: "820px" }}>
					<Typography
						variant="h1"
						sx={{
							fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
							color: "#FFFFFF",
							textWrap: "balance",
							mb: 1.5,
						}}
					>
						All Movies of Genre {genre.name}
					</Typography>
					<Typography
						variant="body1"
						sx={{
							color: "rgba(255, 255, 255, 0.82)",
							fontSize: { xs: 15, sm: 17 },
							lineHeight: 1.7,
						}}
					>
						{getSubtitleText()}
					</Typography>
				</Box>
			</Box>
			<GenreTabs />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: { xs: 4, md: 6 },
				}}
			>
				{shouldShowSection("movies") && (
					<GenreList
						title={`Movies in ${genre.name}`}
						data={moviesByGenre}
						count={moviesByGenreCount}
						sortBy={moviesSortBy}
						ascOrDesc={moviesAscOrDesc}
						page={Number(pageMovies)}
						pageCount={pageCountMovies}
						dataType="Movies"
						cardType="movie"
					/>
				)}
				{shouldShowSection("series") && (
					<GenreList
						title={`Series in ${genre.name}`}
						data={seriesByGenre}
						count={seriesByGenreCount}
						sortBy={seriesSortBy}
						ascOrDesc={seriesAscOrDesc}
						page={Number(pageSeries)}
						pageCount={pageCountSeries}
						dataType="Series"
						cardType="serie"
					/>
				)}
			</Box>
		</Box>
	);
}
