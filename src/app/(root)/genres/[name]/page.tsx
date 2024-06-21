import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { Movie, Serie } from "@prisma/client";
import { getGenreByName } from "@/lib/actions/genre.action";
import CardItem from "@/components/root/ui/cardItem/CardItem";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import DividerLine from "@/components/root/ui/dividerLine/DividerLine";

interface IGenreProps {
    params: {
        name: string;
    };
    searchParams?: {
        moviesAscOrDesc?: string;
        pageMovies?: string;
        moviesSortBy?: string;
        seriesAscOrDesc?: string;
        pageSeries?: string;
        seriesSortBy?: string;
    };
}

export async function generateMetadata({ params }: IGenreProps): Promise<Metadata> {
    const { name } = params;

    return {
        title: `${name} | Watch the Latest Movies and Series of the genre`,
        description: `Discover and watch the latest and most amazing movies and series of genre titled "${name}" in high quality. Our collection is always updated with the newest releases.`,
    };
}

export default async function Genre({ searchParams, params }: IGenreProps): Promise<React.JSX.Element> {
    const name = params?.name;

    const pageMovies = Number(searchParams?.pageMovies) || 1;
    const moviesSortBy = searchParams?.moviesSortBy;
    const moviesAscOrDesc = searchParams?.moviesAscOrDesc;

    const pageSeries = Number(searchParams?.pageSeries) || 1;
    const seriesSortBy = searchParams?.seriesSortBy;
    const seriesAscOrDesc = searchParams?.seriesAscOrDesc;

    const queryParamsMovies: any = { page: pageMovies, type: "movie" };
    const queryParamsSeries: any = { page: pageSeries, type: "serie" };

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

    const moviesByGenreData = await getGenreByName(name, queryParamsMovies);
    const moviesByGenre: Movie[] = moviesByGenreData?.movies;
    const moviesByGenreCount: number = moviesByGenreData?.count;
    const pageCountMovies = Math.ceil(moviesByGenreCount / 10);

    const seriesByGenreData = await getGenreByName(name, queryParamsSeries);
    const seriesByGenre: Serie[] = seriesByGenreData?.series;
    const seriesByGenreCount: number = seriesByGenreData?.count;
    const pageCountSeries = Math.ceil(seriesByGenreCount / 10);

    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    paddingTop: 4,
                }}
            >
                {moviesByGenre.length !== 0 ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: [16, 18, 20, 24, 26],
                                    }}
                                    variant="h2"
                                    textAlign={"center"}
                                >
                                    {`Movies of genre ${name}`}
                                </Typography>
                                <DividerLine />
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
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent={"start"}
                            alignContent={"center"}
                            rowGap={8}
                            columnGap={4}
                        >
                            {moviesByGenre.map((movie: any, index: number) => (
                                <CardItem data={movie} key={index} type="movie" />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageMovies)!}
                            pageCount={pageCountMovies}
                            dataType={"Movies"}
                        />
                        <DividerLine />
                    </>
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
                                No search result, no movie found with this genre.
                            </Typography>
                        </Box>
                        <DividerLine />
                    </>
                )}
                {moviesByGenre.length !== 0 ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: [16, 18, 20, 24, 26],
                                    }}
                                    variant="h2"
                                    textAlign={"center"}
                                >
                                    {`Series of genre ${params.name}`}
                                </Typography>
                                <DividerLine />
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
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent={"start"}
                            alignContent={"center"}
                            rowGap={8}
                            columnGap={4}
                        >
                            {seriesByGenre.map((serie: any, index: number) => (
                                <CardItem data={serie} key={index} type="serie" />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageSeries)!}
                            pageCount={pageCountSeries}
                            dataType={"Series"}
                        />
                    </>
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
                                No search result, no serie found with this genre.
                            </Typography>
                        </Box>
                        <DividerLine />
                    </>
                )}
            </Box>
        </Container>
    );
}
