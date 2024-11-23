import React from "react";
import { Box } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenreById } from "@/actions/genre.actions";
import { notFound } from "next/navigation";
import GenreList from "../_components/GenreList";

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
}: GenrePageContentProps): Promise<React.JSX.Element> {
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                paddingTop: 6,
            }}
        >
            <GenreList
                title={`All Movies of Genre ${genre.name}`}
                data={moviesByGenre}
                count={moviesByGenreCount}
                sortBy={moviesSortBy}
                ascOrDesc={moviesAscOrDesc}
                page={Number(pageMovies)}
                pageCount={pageCountMovies}
                dataType="Movies"
                cardType="movie"
            />
            <GenreList
                title={`All Series of Genre ${genre.name}`}
                data={seriesByGenre}
                count={seriesByGenreCount}
                sortBy={seriesSortBy}
                ascOrDesc={seriesAscOrDesc}
                page={Number(pageSeries)}
                pageCount={pageCountSeries}
                dataType="Series"
                cardType="serie"
            />
        </Box>
    );
}
