import { Box, Stack, Typography } from "@mui/material";
import { Movie } from "@prisma/client";
import { getLatestMovies, getMoviesTotalCount, getMoviesWithFilters } from "@/actions/movie.actions";
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

export default async function MoviesPageContent({ searchParams, session }: MoviesPageContentProps) {
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
                gap: { xs: 3, sm: 4, md: 5 },
            }}
        >
            <Box component="section">
                <Carousel data={moviesCarouselImages} type="movies" />
            </Box>
            <Box
                component="section"
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    width: "100%",
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 3 },
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "baseline" },
                            gap: { xs: 1, sm: 2 },
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: 24, sm: 28, md: 32 },
                                fontWeight: 800,
                                color: "text.primary",
                                position: "relative",
                                display: "inline-block",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: -8,
                                    left: 0,
                                    width: "100%",
                                    height: 3,
                                    bgcolor: "primary.main",
                                    borderRadius: 1,
                                },
                            }}
                        >
                            Movies
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { xs: 16, sm: 18 },
                                color: "text.secondary",
                                mt: { xs: 2, sm: 0 },
                                ml: { sm: 1 },
                                position: "relative",
                                top: { sm: 2 },
                            }}
                        >
                            {startIndex} – {endIndex} of {moviesCount} movies
                        </Typography>
                    </Box>
                    <Box>
                        <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="movies" />
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        mt: { xs: 4, md: 5 },
                    }}
                >
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        sx={{
                            columnGap: { xs: 1, sm: 2, md: 3 },
                            rowGap: { xs: 3, sm: 4, md: 5 },
                            justifyContent: {
                                xs: "center",
                                md: "flex-start",
                            },
                            mx: { xs: 1, sm: 2 },
                            mb: { xs: 3, md: 4 },
                        }}
                    >
                        {movies.map((movie: Movie) => (
                            <CardItem key={movie.id} data={movie} type="movie" />
                        ))}
                    </Stack>
                    <PaginationControl currentPage={Number(page)} pageCount={pageCount} urlParamName="pageMovies" />
                </Box>
            </Box>
            <LatestList data={latestMovies} type="Movies" />
        </Box>
    );
}
