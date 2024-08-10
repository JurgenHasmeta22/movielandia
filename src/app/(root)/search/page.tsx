import CardItem from "@/components/root/ui/cardItem/CardItem";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { searchMoviesByTitle } from "@/actions/movie.actions";
import { searchSeriesByTitle } from "@/actions/serie.actions";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Movie, Serie } from "@prisma/client";
import type { Metadata } from "next";

interface ISearchProps {
    searchParams?: {
        moviesAscOrDesc?: string;
        pageMovies?: string;
        moviesSortBy?: string;
        seriesAscOrDesc?: string;
        pageSeries?: string;
        seriesSortBy?: string;
        term?: string;
    };
}

export const metadata: Metadata = {
    title: "Search the Latest Series | High-Quality and Always Updated",
    description:
        "Discover and search the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
};

export default async function Search({ searchParams }: ISearchProps) {
    const term = searchParams?.term;
    const pageMovies = Number(searchParams?.pageMovies) || 1;
    const moviesSortBy = searchParams?.moviesSortBy;
    const moviesAscOrDesc = searchParams?.moviesAscOrDesc;

    const pageSeries = Number(searchParams?.pageSeries) || 1;
    const seriesSortBy = searchParams?.seriesSortBy;
    const seriesAscOrDesc = searchParams?.seriesAscOrDesc;

    const queryParamsMovies: any = { page: pageMovies };
    const queryParamsSeries: any = { page: pageSeries };

    if (moviesSortBy) {
        queryParamsMovies.sortBy = moviesSortBy;
    }

    if (moviesAscOrDesc) {
        queryParamsMovies.ascOrDesc = moviesAscOrDesc;
    }

    if (seriesSortBy) {
        queryParamsSeries.sortBy = seriesSortBy;
    }

    if (seriesAscOrDesc) {
        queryParamsSeries.ascOrDesc = seriesAscOrDesc;
    }

    const moviesData = await searchMoviesByTitle(term!, queryParamsMovies);
    const movies: Movie[] = moviesData?.movies;
    const moviesCount: number = moviesData?.count;
    const pageCountMovies = Math.ceil(moviesCount / 10);

    const seriesData = await searchSeriesByTitle(term!, queryParamsSeries);
    const series: Serie[] = seriesData?.rows;
    const seriesCount: number = seriesData?.count;
    const pageCountSeries = Math.ceil(seriesCount / 10);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                rowGap: 2,
                marginTop: 4,
                marginBottom: 4,
            }}
            component={"section"}
        >
            {movies.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box>
                            <Typography fontSize={22} variant="h2">
                                Movies
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <SortSelect
                                sortBy={moviesSortBy!}
                                ascOrDesc={moviesAscOrDesc!}
                                type="list"
                                dataType="movies"
                            />
                        </Box>
                    </Box>
                    <Box
                        component={"section"}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 4,
                        }}
                        pl={3}
                        pr={3}
                    >
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent={"flex-start"}
                            alignItems={"start"}
                            rowGap={4}
                            columnGap={3}
                            sx={{
                                marginTop: `${term} ? 2.5 : 0.2}rem`,
                            }}
                        >
                            {movies.map((movie: Movie) => (
                                <CardItem data={movie} type="movie" key={movie.id} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageMovies)!}
                            pageCount={pageCountMovies}
                            dataType="Movies"
                        />
                    </Box>
                </Box>
            ) : (
                <>
                    <Box
                        sx={{
                            height: "50vh",
                            display: "flex",
                            placeItems: "center",
                            placeContent: "center",
                        }}
                        component={"section"}
                    >
                        <Typography component={"h1"} fontSize={24} textAlign={"center"}>
                            No search result, no movie found with that criteria.
                        </Typography>
                    </Box>
                </>
            )}
            {series.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box>
                            <Typography fontSize={22} variant="h2">
                                Series
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <SortSelect
                                sortBy={seriesSortBy!}
                                ascOrDesc={seriesAscOrDesc!}
                                type="list"
                                dataType="series"
                            />
                        </Box>
                    </Box>
                    <Box
                        component={"section"}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 4,
                        }}
                        pl={3}
                        pr={3}
                    >
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent={"flex-start"}
                            alignItems={"start"}
                            rowGap={4}
                            columnGap={3}
                            sx={{
                                marginTop: `${term} ? 2.5 : 0.2}rem`,
                            }}
                        >
                            {series.map((serie: Serie) => (
                                <CardItem data={serie} type="serie" key={serie.id} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageSeries)!}
                            pageCount={pageCountSeries}
                            dataType="Series"
                        />
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        height: "50vh",
                        display: "flex",
                        placeItems: "center",
                        placeContent: "center",
                    }}
                    component={"section"}
                >
                    <Typography component={"p"} fontSize={22} textAlign={"center"}>
                        No search result, no serie found with that criteria.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
