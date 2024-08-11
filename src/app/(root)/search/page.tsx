import { searchMoviesByTitle } from "@/actions/movie.actions";
import { searchSeriesByTitle } from "@/actions/serie.actions";
import { Box } from "@mui/material";
import { Actor, Episode, Movie, Season, Serie } from "@prisma/client";
import type { Metadata } from "next";
import { searchActorsByTitle } from "@/actions/actor.actions";
import { searchSeasonsByTitle } from "@/actions/season.actions";
import { searchEpisodesByTitle } from "@/actions/episode.actions";
import SearchList from "./_components/SearchList";

interface ISearchProps {
    searchParams?: {
        moviesAscOrDesc?: string;
        pageMovies?: string;
        moviesSortBy?: string;
        seriesAscOrDesc?: string;
        pageSeries?: string;
        seriesSortBy?: string;
        actorsAscOrDesc?: string;
        pageActors?: string;
        actorsSortBy?: string;
        seasonsAscOrDesc?: string;
        pageSeasons?: string;
        seasonsSortBy?: string;
        episodesAscOrDesc?: string;
        pageEpisodes?: string;
        episodesSortBy?: string;
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

    // #region "Movies data"
    const pageMovies = Number(searchParams?.pageMovies) || 1;
    const moviesSortBy = searchParams?.moviesSortBy;
    const moviesAscOrDesc = searchParams?.moviesAscOrDesc;
    const queryParamsMovies: any = { page: pageMovies };

    if (moviesSortBy) {
        queryParamsMovies.sortBy = moviesSortBy;
    }

    if (moviesAscOrDesc) {
        queryParamsMovies.ascOrDesc = moviesAscOrDesc;
    }

    const moviesData = await searchMoviesByTitle(term!, queryParamsMovies);
    const movies: Movie[] = moviesData?.movies;
    const moviesCount: number = moviesData?.count;
    const pageCountMovies = Math.ceil(moviesCount / 10);
    // #endregion

    // #region "Series data"
    const pageSeries = Number(searchParams?.pageSeries) || 1;
    const seriesSortBy = searchParams?.seriesSortBy;
    const seriesAscOrDesc = searchParams?.seriesAscOrDesc;
    const queryParamsSeries: any = { page: pageSeries };

    if (seriesSortBy) {
        queryParamsSeries.sortBy = seriesSortBy;
    }

    if (seriesAscOrDesc) {
        queryParamsSeries.ascOrDesc = seriesAscOrDesc;
    }

    const seriesData = await searchSeriesByTitle(term!, queryParamsSeries);
    const series: Serie[] = seriesData?.rows;
    const seriesCount: number = seriesData?.count;
    const pageCountSeries = Math.ceil(seriesCount / 10);
    // #endregion

    // #region "Actors data"
    const pageActors = Number(searchParams?.pageActors) || 1;
    const actorsSortBy = searchParams?.actorsSortBy;
    const actorsAscOrDesc = searchParams?.actorsAscOrDesc;
    const queryParamsActors: any = { page: pageActors };

    if (actorsSortBy) {
        queryParamsActors.sortBy = actorsSortBy;
    }

    if (actorsAscOrDesc) {
        queryParamsActors.ascOrDesc = actorsAscOrDesc;
    }

    const actorsData = await searchActorsByTitle(term!, queryParamsActors);
    const actors: Actor[] = actorsData?.actors;
    const actorsCount: number = actorsData?.count;
    const pageCountActors = Math.ceil(actorsCount / 10);
    // #endregion

    // #region "Episodes data"
    const pageEpisodes = Number(searchParams?.pageEpisodes) || 1;
    const episodesSortBy = searchParams?.episodesSortBy;
    const episodesAscOrDesc = searchParams?.episodesAscOrDesc;
    const queryParamsEpisodes: any = { page: pageEpisodes };

    if (episodesSortBy) {
        queryParamsEpisodes.sortBy = episodesSortBy;
    }

    if (episodesAscOrDesc) {
        queryParamsEpisodes.ascOrDesc = episodesAscOrDesc;
    }

    const episodesData = await searchEpisodesByTitle(term!, queryParamsEpisodes);
    const episodes: Episode[] = episodesData?.episodes;
    const episodesCount: number = episodesData?.count;
    const pageCountEpisodes = Math.ceil(episodesCount / 10);
    // #endregion

    // #region "Seasons data"
    const pageSeasons = Number(searchParams?.pageSeasons) || 1;
    const seasonsSortBy = searchParams?.seasonsSortBy;
    const seasonsAscOrDesc = searchParams?.seasonsAscOrDesc;
    const queryParamsSeasons: any = { page: pageSeasons };

    if (seasonsSortBy) {
        queryParamsSeasons.sortBy = seasonsSortBy;
    }

    if (seasonsAscOrDesc) {
        queryParamsSeasons.ascOrDesc = seasonsAscOrDesc;
    }

    const seasonsData = await searchSeasonsByTitle(term!, queryParamsSeasons);
    const seasons: Season[] = seasonsData?.seasons;
    const seasonsCount: number = seasonsData?.count;
    const pageCountSeasons = Math.ceil(seasonsCount / 10);
    // #endregion

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
            <SearchList
                title="Movies found"
                data={movies}
                count={moviesCount}
                sortBy={moviesSortBy!}
                ascOrDesc={moviesAscOrDesc!}
                page={Number(pageMovies)}
                pageCount={pageCountMovies}
                dataType="Movies"
                cardType="movie"
            />
            <SearchList
                title="Series found"
                data={series}
                count={seriesCount}
                sortBy={seriesSortBy!}
                ascOrDesc={seriesAscOrDesc!}
                page={Number(pageSeries)}
                pageCount={pageCountSeries}
                dataType="Series"
                cardType="serie"
            />
            <SearchList
                title="Actors found"
                data={actors}
                count={actorsCount}
                sortBy={actorsSortBy!}
                ascOrDesc={actorsAscOrDesc!}
                page={Number(pageActors)}
                pageCount={pageCountActors}
                dataType="Actors"
                cardType="actor"
                path="actors"
            />
            <SearchList
                title="Seasons found"
                data={seasons}
                count={seasonsCount}
                sortBy={seasonsSortBy!}
                ascOrDesc={seasonsAscOrDesc!}
                page={Number(pageSeasons)}
                pageCount={pageCountSeasons}
                dataType="Seasons"
                cardType="season"
                path="seasons"
            />
            <SearchList
                title="Episodes found"
                data={episodes}
                count={episodesCount}
                sortBy={episodesSortBy!}
                ascOrDesc={episodesAscOrDesc!}
                page={Number(pageEpisodes)}
                pageCount={pageCountEpisodes}
                dataType="Episodes"
                cardType="episode"
                path="episodes"
            />
        </Box>
    );
}
