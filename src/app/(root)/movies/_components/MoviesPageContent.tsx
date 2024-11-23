import { Box, Stack, Typography } from "@mui/material";
import { Movie } from "@prisma/client";
import { getLatestMovies, getMoviesWithFilters } from "@/actions/movie.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { LatestList } from "@/components/root/latestList/LatestList";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface MoviesPageContentProps {
    searchParams:
        | {
              moviesAscOrDesc?: string;
              page?: string;
              moviesSortBy?: string;
          }
        | undefined;
    session: any;
}

export default async function MoviesPageContent({ searchParams, session }: MoviesPageContentProps) {
    const ascOrDesc = searchParams?.moviesAscOrDesc ?? "";
    const page = searchParams?.page ? Number(searchParams.page) : 1;
    const sortBy = searchParams?.moviesSortBy ?? "";

    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const itemsPerPage = 12;
    const moviesData = await getMoviesWithFilters(queryParams, Number(session?.user?.id));
    const movies = moviesData.movies;
    const moviesCarouselImages: Movie[] = moviesData.movies.slice(0, 5);

    const latestMovies = await getLatestMovies();

    const moviesCount = moviesData.count;
    const pageCount = Math.ceil(moviesCount / itemsPerPage);

    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, moviesCount);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
            }}
            component={"section"}
        >
            <Box component={"section"}>
                <Carousel data={moviesCarouselImages} type="movies" />
            </Box>
            <Stack
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent={"space-between"}
                alignItems={{ xs: "flex-start", sm: "center" }}
                component="section"
                sx={{
                    ml: 3,
                    mr: 3,
                    rowGap: { xs: 2, sm: 0 },
                    flexWrap: "wrap",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    columnGap={1}
                    textAlign={{ xs: "left", sm: "center" }}
                >
                    <Typography fontSize={22} variant="h2">
                        Movies
                    </Typography>
                    <Typography variant="h5" sx={{ pt: 0.5 }}>
                        {startIndex} – {endIndex} of {moviesCount} movies
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", sm: "flex-end" },
                        alignItems: "center",
                        mt: { xs: 2, sm: 0 },
                    }}
                >
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="movies" />
                </Box>
            </Stack>
            <Box
                component={"section"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    pl: 5,
                    pr: 3,
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems={"start"}
                    columnGap={5}
                    rowGap={5}
                    sx={{
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "start",
                            lg: "start",
                        },
                    }}
                >
                    {movies.map((movie: Movie) => (
                        <Box key={movie.id}>
                            <CardItem data={movie} type="movie" />
                        </Box>
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
            </Box>
            <LatestList data={latestMovies} type="Movies" />
        </Box>
    );
}