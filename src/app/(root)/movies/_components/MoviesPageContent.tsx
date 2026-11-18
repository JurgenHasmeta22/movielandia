import { Box, Typography } from "@mui/material";
import { Movie } from "@prisma/client";
import {
	getLatestMovies,
	getMoviesTotalCount,
	getMoviesWithFilters,
} from "@/actions/movie.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { LatestList } from "@/components/root/latestList/LatestList";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface MoviesPageContentProps {
	searchParams:
		| {
				moviesAscOrDesc?: string;
				pageMovies?: string;
				moviesSortBy?: string;
		  }
		| undefined;
	session: any;
}

export default async function MoviesPageContent({
	searchParams,
	session,
}: MoviesPageContentProps) {
	const { ascOrDesc, page, sortBy } = {
		ascOrDesc: searchParams?.moviesAscOrDesc ?? "",
		page: searchParams?.pageMovies ? Number(searchParams.pageMovies) : 1,
		sortBy: searchParams?.moviesSortBy ?? "",
	};

	const queryParams = { ascOrDesc, page, sortBy };
	const userId = session?.user?.id;

	const moviesData = await getMoviesWithFilters(queryParams, Number(userId));
	const movies = moviesData.movies;
	const moviesCount = await getMoviesTotalCount();

	const latestMovies = await getLatestMovies();
	const moviesCarouselImages = movies.slice(0, 5);

	const itemsPerPage = 12;
	const pageCount = Math.ceil(moviesCount / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage + 1;
	const endIndex = Math.min(startIndex + itemsPerPage - 1, moviesCount);

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: { xs: 2, sm: 3, md: 4 },
			}}
		>
			<Box component="section">
				<Carousel data={moviesCarouselImages} type="movies" />
			</Box>
			<Box
				component="section"
				sx={{
					maxWidth: "1320px",
					margin: "0 auto",
					width: "100%",
					px: { xs: 2, sm: 3, md: 4, xl: 0 },
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
						flexDirection: { xs: "column", sm: "row" },
						gap: { xs: 2, sm: 3 },
						mb: { xs: 2.5, md: 3 },
						pb: { xs: 2, md: 2.5 },
						borderBottom: "1px solid",
						borderColor: "divider",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							gap: 0.75,
						}}
					>
						<Typography
							variant="h2"
							component="h1"
							sx={{
								fontSize: { xs: 30, sm: 36, md: 42 },
								fontWeight: 700,
								color: "text.primary",
								letterSpacing: "-0.05em",
							}}
						>
							Movies
						</Typography>
						<Typography
							variant="body2"
							sx={{
								fontSize: { xs: 14, sm: 15 },
								color: "text.secondary",
							}}
						>
							{startIndex} – {endIndex} of {moviesCount} movies
						</Typography>
					</Box>
					<Box sx={{ alignSelf: { xs: "stretch", sm: "center" } }}>
						<SortSelect
							sortBy={sortBy}
							ascOrDesc={ascOrDesc}
							type="list"
							dataType="movies"
						/>
					</Box>
				</Box>
				<Box
					sx={{
						width: "100%",
						overflow: "visible",
						mt: { xs: 2.5, md: 3.5 },
					}}
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "repeat(2, minmax(0, 1fr))",
								sm: "repeat(3, minmax(0, 1fr))",
								md: "repeat(4, minmax(0, 1fr))",
								lg: "repeat(5, minmax(0, 1fr))",
								xl: "repeat(6, minmax(0, 1fr))",
							},
							gap: { xs: 1.5, sm: 2.5, md: 3 },
							mb: { xs: 3, md: 4 },
						}}
					>
						{movies.map((movie: Movie) => (
							<CardItem
								key={movie.id}
								data={movie}
								type="movie"
								presentation="poster"
							/>
						))}
					</Box>
					<PaginationControl
						currentPage={Number(page)}
						pageCount={pageCount}
						urlParamName="pageMovies"
					/>
				</Box>
			</Box>
			<LatestList data={latestMovies} type="Movies" />
		</Box>
	);
}
