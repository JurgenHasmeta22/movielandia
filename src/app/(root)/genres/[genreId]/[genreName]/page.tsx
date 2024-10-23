import React from "react";
import { Box } from "@mui/material";
import { Metadata } from "next";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenreById } from "@/actions/genre.actions";
import { notFound } from "next/navigation";
import GenreList from "./_components/GenreList";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface IGenreProps {
    params: Promise<{
        genreId: string;
        genreName: string;
    }>;
    searchParams?: Promise<{
        moviesAscOrDesc?: string;
        pageMovies?: string;
        moviesSortBy?: string;
        seriesAscOrDesc?: string;
        pageSeries?: string;
        seriesSortBy?: string;
    }>;
}

interface IQueryParams {
    page: number;
    type: string;
    ascOrDesc?: string;
    sortBy?: string;
}

export async function generateMetadata(props: IGenreProps): Promise<Metadata> {
    const params = await props.params;
    const { genreId } = params;

    let genre: Genre;
    let genreData: any;

    try {
        genreData = await getGenreById(Number(genreId), { type: "movie" });
        genre = genreData.genre;
    } catch (error) {
        return notFound();
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_PROJECT_URL}/genres/${genre.id}/${genre.name}}`;

    return {
        title: `${genre.name} | Watch the Latest Movies and Series of the genre`,
        description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre.name}" in high quality. Our collection is always updated with the newest releases.`,
        openGraph: {
            type: "video.tv_show",
            url: pageUrl,
            title: `${genre.name} | Genre`,
            description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre.name}" in high quality. Our collection is always updated with the newest releases.`,
            siteName: "MovieLandia24",
        },
        twitter: {
            card: "summary_large_image",
            site: "@movieLandia24",
            creator: "movieLandia24",
            title: `${genre.name} | Genre`,
            description: `Discover and watch the latest and most amazing movies and series of genre titled "${genre.name}" in high quality. Our collection is always updated with the newest releases.`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GenrePage(props: IGenreProps): Promise<React.JSX.Element> {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);

    const genreId = params.genreId;

    // #region "Movies data"
    const pageMovies = Number(searchParams && searchParams.pageMovies) || 1;
    const moviesSortBy = searchParams && searchParams.moviesSortBy;
    const moviesAscOrDesc = searchParams && searchParams.moviesAscOrDesc;

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
    const pageCountMovies = Math.ceil(moviesByGenreCount / 10);
    // #endregion

    // #region "Series data"
    const pageSeries = Number(searchParams && searchParams.pageSeries) || 1;
    const seriesSortBy = searchParams && searchParams.seriesSortBy;
    const seriesAscOrDesc = searchParams && searchParams.seriesAscOrDesc;

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
            <GenreList
                title={`All Movies of Genre ${genre.name}`}
                data={moviesByGenre}
                count={moviesByGenreCount}
                sortBy={moviesSortBy!}
                ascOrDesc={moviesAscOrDesc!}
                page={Number(pageMovies)}
                pageCount={pageCountMovies}
                dataType="Movies"
                cardType="movie"
            />
            <GenreList
                title={`All Series of Genre ${params.genreName}`}
                data={seriesByGenre}
                count={seriesByGenreCount}
                sortBy={seriesSortBy!}
                ascOrDesc={seriesAscOrDesc!}
                page={Number(pageSeries)}
                pageCount={pageCountSeries}
                dataType="Series"
                cardType="serie"
            />
        </Box>
    );
}
