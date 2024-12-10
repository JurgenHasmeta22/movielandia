import { Box, Typography } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenreById } from "@/actions/genre.actions";
import { notFound } from "next/navigation";
import GenreList from "./GenreList";
import GenreTabs from "./GenreTabs";

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

export default async function GenrePageContent({ params, searchParams, session }: GenrePageContentProps) {
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
        moviesByGenreData = await getGenreById(Number(genreId), queryParamsMovies, Number(session?.user?.id));
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
        seriesByGenreData = await getGenreById(Number(genreId), queryParamsSeries, Number(session?.user?.id));
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
        
        if (selectedFilters.includes("movies") && !selectedFilters.includes("series")) {
            return `Found ${moviesByGenreCount} movies in ${genre.name} genre`;
        }
        
        if (selectedFilters.includes("series") && !selectedFilters.includes("movies")) {
            return `Found ${seriesByGenreCount} series in ${genre.name} genre`;
        }
        
        return `Found ${totalCount} titles in ${genre.name} genre`;
    };

    return (
        <Box
            sx={{
                maxWidth: "1400px",
                margin: "0 auto",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    mb: { xs: 4, md: 6 },
                    mt: { xs: 4, md: 6 },
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: 28, sm: 32, md: 40 },
                        fontWeight: 800,
                        mb: 2,
                    }}
                >
                    All Movies of Genre {genre.name}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: "text.secondary",
                        fontSize: { xs: 16, sm: 18 },
                        maxWidth: "600px",
                        margin: "0 auto",
                    }}
                >
                    {getSubtitleText()}
                </Typography>
            </Box>

            <GenreTabs />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 6, md: 8 },
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
