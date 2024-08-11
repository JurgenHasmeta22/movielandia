import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenreById } from "@/actions/genre.actions";
import CardItem from "@/components/root/ui/cardItem/CardItem";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { notFound } from "next/navigation";

interface IGenreProps {
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
    };
}

interface IQueryParams {
    page: number;
    type: string;
    ascOrDesc?: string;
    sortBy?: string;
}

export async function generateMetadata({ params }: IGenreProps): Promise<Metadata> {
    const { genreId } = params;

    let genre: Genre | null = null;
    let genreData: any = null;

    try {
        genreData = await getGenreById(Number(genreId), { type: "movie" });
        genre = genreData.genre;
    } catch (error) {
        return notFound();
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/genres/${genre?.id}/${genre?.name}}`;

    return {
        title: `${genre?.name} | Watch the Latest Movies and Series of the genre`,
        description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre?.name}" in high quality. Our collection is always updated with the newest releases.`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${genre?.name} | Genre`,
            description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre?.name}" in high quality. Our collection is always updated with the newest releases.`,
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${genre?.name} | Genre`,
            description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre?.name}" in high quality. Our collection is always updated with the newest releases.`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GenrePage({ searchParams, params }: IGenreProps): Promise<React.JSX.Element> {
    const genreId = params.genreId;

    // #region "Movies data"
    const pageMovies = Number(searchParams?.pageMovies) || 1;
    const moviesSortBy = searchParams?.moviesSortBy;
    const moviesAscOrDesc = searchParams?.moviesAscOrDesc;

    const queryParamsMovies: IQueryParams = { page: pageMovies, type: "movie" };

    if (moviesSortBy) {
        queryParamsMovies.sortBy = moviesSortBy;
    }

    if (moviesAscOrDesc) {
        queryParamsMovies.ascOrDesc = moviesAscOrDesc;
    }

    let moviesByGenreData = [];

    try {
        moviesByGenreData = await getGenreById(Number(genreId), queryParamsMovies);
    } catch (error) {
        return notFound();
    }

    const genre: Genre = moviesByGenreData.genre;

    const moviesByGenre: Movie[] = moviesByGenreData?.movies;
    const moviesByGenreCount: number = moviesByGenreData?.count;
    const pageCountMovies = Math.ceil(moviesByGenreCount / 10);
    // #endregion

    // #region "Series data"
    const pageSeries = Number(searchParams?.pageSeries) || 1;
    const seriesSortBy = searchParams?.seriesSortBy;
    const seriesAscOrDesc = searchParams?.seriesAscOrDesc;

    const queryParamsSeries: IQueryParams = { page: pageSeries, type: "serie" };

    if (seriesSortBy) {
        queryParamsSeries.sortBy = seriesSortBy;
    }

    if (seriesAscOrDesc) {
        queryParamsSeries.ascOrDesc = seriesAscOrDesc;
    }

    let seriesByGenreData = [];

    try {
        seriesByGenreData = await getGenreById(Number(genreId), queryParamsSeries);
    } catch (error) {
        return notFound();
    }

    const seriesByGenre: Serie[] = seriesByGenreData?.series;
    const seriesByGenreCount: number = seriesByGenreData?.count;
    const pageCountSeries = Math.ceil(seriesByGenreCount / 10);
    // #endregion

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                paddingTop: 6,
            }}
        >
            {moviesByGenre.length !== 0 ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography
                                sx={{
                                    fontSize: [16, 17, 20, 22, 24],
                                }}
                                variant="h2"
                                textAlign={"center"}
                            >
                                {`All Movies of Genre ${genre?.name}`}
                            </Typography>
                            <Typography variant="h5">
                                (showing {moviesByGenre.length} of {moviesByGenreCount})
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
                    </Box>
                </>
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
                        No search result, no movie found with this genre.
                    </Typography>
                </Box>
            )}
            {seriesByGenre.length !== 0 ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography
                                sx={{
                                    fontSize: [16, 17, 18, 22, 24],
                                }}
                                variant="h2"
                                textAlign={"center"}
                            >
                                {`All Series of Genre ${params.genreName}`}
                            </Typography>
                            <Typography variant="h5">
                                (showing {seriesByGenre.length} of {seriesByGenreCount})
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
                        >
                            {seriesByGenre.map((serie: Serie, index: number) => (
                                <CardItem data={serie} key={index} type="serie" />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageSeries)!}
                            pageCount={pageCountSeries}
                            dataType={"Series"}
                        />
                    </Box>
                </>
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
                        No search result, no serie found with this genre.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
