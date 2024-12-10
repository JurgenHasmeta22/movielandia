// #region "Imports"
import { Box, Typography } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import { searchMoviesByTitle } from "@/actions/movie.actions";
import { searchSeriesByTitle } from "@/actions/serie.actions";
import { searchActorsByTitle } from "@/actions/actor.actions";
import { searchSeasonsByTitle } from "@/actions/season.actions";
import { searchEpisodesByTitle } from "@/actions/episode.actions";
import { searchUsersByUsername } from "@/actions/user.actions";
import SearchList from "./SearchList";
import { searchCrewMembersByTitle } from "@/actions/crew.actions";
import SearchTabs from "./SearchTabs";
// #endregion

// #region "Interfaces"
interface SearchPageContentProps {
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
        crewAscOrDesc?: string;
        pageCrews?: string;
        crewSortBy?: string;
        seasonsAscOrDesc?: string;
        pageSeasons?: string;
        seasonsSortBy?: string;
        episodesAscOrDesc?: string;
        pageEpisodes?: string;
        episodesSortBy?: string;
        usersAscOrDesc?: string;
        pageUsers?: string;
        usersSortBy?: string;
        term?: string;
        filters?: string;
    };
    session: any;
}

interface IQueryParams {
    page: number;
    ascOrDesc?: string;
    sortBy?: string;
}
// #endregion

export default async function SearchPageContent({ searchParams, session }: SearchPageContentProps) {
    const term = searchParams?.term ?? "";
    const selectedFilters = searchParams?.filters?.split(",") || ["all"];
    const itemsPerPage = 12;

    // #region "Movies data"
    const pageMovies = Number(searchParams?.pageMovies) || 1;
    const moviesSortBy = searchParams?.moviesSortBy ?? "";
    const moviesAscOrDesc = searchParams?.moviesAscOrDesc ?? "";
    const queryParamsMovies: IQueryParams = { page: pageMovies };

    if (moviesSortBy) {
        queryParamsMovies.sortBy = moviesSortBy;
    }

    if (moviesAscOrDesc) {
        queryParamsMovies.ascOrDesc = moviesAscOrDesc;
    }

    const moviesData = await searchMoviesByTitle(term, queryParamsMovies, Number(session?.user?.id));
    const movies: Movie[] = moviesData.movies;
    const moviesCount: number = moviesData.count;
    const pageCountMovies = Math.ceil(moviesCount / itemsPerPage);
    // #endregion

    // #region "Series data"
    const pageSeries = Number(searchParams?.pageSeries) || 1;
    const seriesSortBy = searchParams?.seriesSortBy ?? "";
    const seriesAscOrDesc = searchParams?.seriesAscOrDesc ?? "";
    const queryParamsSeries: IQueryParams = { page: pageSeries };

    if (seriesSortBy) {
        queryParamsSeries.sortBy = seriesSortBy;
    }

    if (seriesAscOrDesc) {
        queryParamsSeries.ascOrDesc = seriesAscOrDesc;
    }

    const seriesData = await searchSeriesByTitle(term, queryParamsSeries, Number(session?.user?.id));
    const series: Serie[] = seriesData.rows;
    const seriesCount: number = seriesData.count;
    const pageCountSeries = Math.ceil(seriesCount / itemsPerPage);
    // #endregion

    // #region "Actors data"
    const pageActors = Number(searchParams?.pageActors) || 1;
    const actorsSortBy = searchParams?.actorsSortBy ?? "";
    const actorsAscOrDesc = searchParams?.actorsAscOrDesc ?? "";
    const queryParamsActors: IQueryParams = { page: pageActors };

    if (actorsSortBy) {
        queryParamsActors.sortBy = actorsSortBy;
    }

    if (actorsAscOrDesc) {
        queryParamsActors.ascOrDesc = actorsAscOrDesc;
    }

    const actorsData = await searchActorsByTitle(term, queryParamsActors, Number(session?.user?.id));
    const actors: Actor[] = actorsData.actors;
    const actorsCount: number = actorsData.count;
    const pageCountActors = Math.ceil(actorsCount / itemsPerPage);
    // #endregion

    // #region "Crews data"
    const pageCrews = Number(searchParams?.pageCrews) || 1;
    const crewsSortBy = searchParams?.crewSortBy ?? "";
    const crewsAscOrDesc = searchParams?.crewAscOrDesc ?? "";
    const queryParamsCrews: IQueryParams = { page: pageCrews };

    if (crewsSortBy) {
        queryParamsCrews.sortBy = crewsSortBy;
    }

    if (actorsAscOrDesc) {
        queryParamsActors.ascOrDesc = actorsAscOrDesc;
    }

    const crewsData = await searchCrewMembersByTitle(term, queryParamsCrews, Number(session?.user?.id));
    const crews: Crew[] = crewsData.crews;
    const crewsCount: number = crewsData.count;
    const pageCountCrews = Math.ceil(crewsCount / itemsPerPage);
    // #endregion

    // #region "Episodes data"
    const pageEpisodes = Number(searchParams?.pageEpisodes) || 1;
    const episodesSortBy = searchParams?.episodesSortBy ?? "";
    const episodesAscOrDesc = searchParams?.episodesAscOrDesc ?? "";
    const queryParamsEpisodes: IQueryParams = { page: pageEpisodes };

    if (episodesSortBy) {
        queryParamsEpisodes.sortBy = episodesSortBy;
    }

    if (episodesAscOrDesc) {
        queryParamsEpisodes.ascOrDesc = episodesAscOrDesc;
    }

    const episodesData = await searchEpisodesByTitle(term, queryParamsEpisodes, Number(session?.user?.id));
    const episodes: Episode[] = episodesData.episodes;
    const episodesCount: number = episodesData.count;
    const pageCountEpisodes = Math.ceil(episodesCount / itemsPerPage);
    // #endregion

    // #region "Seasons data"
    const pageSeasons = Number(searchParams?.pageSeasons) || 1;
    const seasonsSortBy = searchParams?.seasonsSortBy ?? "";
    const seasonsAscOrDesc = searchParams?.seasonsAscOrDesc ?? "";
    const queryParamsSeasons: IQueryParams = { page: pageSeasons };

    if (seasonsSortBy) {
        queryParamsSeasons.sortBy = seasonsSortBy;
    }

    if (seasonsAscOrDesc) {
        queryParamsSeasons.ascOrDesc = seasonsAscOrDesc;
    }

    const seasonsData = await searchSeasonsByTitle(term, queryParamsSeasons, Number(session?.user?.id));
    const seasons: Season[] = seasonsData.seasons;
    const seasonsCount: number = seasonsData.count;
    const pageCountSeasons = Math.ceil(seasonsCount / itemsPerPage);
    // #endregion

    // #region "Users data"
    const pageUsers = Number(searchParams?.pageUsers) || 1;
    const usersSortBy = searchParams?.usersSortBy ?? "";
    const usersAscOrDesc = searchParams?.usersAscOrDesc ?? "";
    const queryParamsUsers: IQueryParams = { page: pageUsers };

    if (usersSortBy) {
        queryParamsUsers.sortBy = usersSortBy;
    }

    if (usersAscOrDesc) {
        queryParamsUsers.ascOrDesc = usersAscOrDesc;
    }

    const usersData = await searchUsersByUsername(term, queryParamsUsers);
    const users: User[] = usersData.users;
    const usersCount: number = usersData.count;
    const pageCountUsers = Math.ceil(usersCount / itemsPerPage);
    // #endregion

    const shouldShowSection = (type: string) => {
        if (selectedFilters.includes("all")) return true;
        return selectedFilters.includes(type.toLowerCase());
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
                    {term ? `Search Results for "${term}"` : "Browse All"}
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
                    {term
                        ? `Found ${
                              moviesCount + seriesCount + actorsCount + seasonsCount + episodesCount + usersCount
                          } results across all categories`
                        : "Explore our vast collection of movies, series, actors and more"}
                </Typography>
            </Box>
            <SearchTabs />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 6, md: 8 },
                    mt: 4,
                }}
            >
                {shouldShowSection("movies") && (
                    <SearchList
                        title={term ? `Movies matching "${term}"` : "Movies"}
                        data={movies}
                        count={moviesCount}
                        sortBy={moviesSortBy}
                        ascOrDesc={moviesAscOrDesc}
                        page={Number(pageMovies)}
                        pageCount={pageCountMovies}
                        dataType="Movies"
                        cardType="movie"
                    />
                )}
                {shouldShowSection("series") && (!term || seriesCount > 0) && (
                    <SearchList
                        title={term ? `Series matching "${term}"` : "Series"}
                        data={series}
                        count={seriesCount}
                        sortBy={seriesSortBy}
                        ascOrDesc={seriesAscOrDesc}
                        page={Number(pageSeries)}
                        pageCount={pageCountSeries}
                        dataType="Series"
                        cardType="serie"
                    />
                )}
                {shouldShowSection("actors") && (!term || actorsCount > 0) && (
                    <SearchList
                        title={term ? `Actors matching "${term}"` : "Actors"}
                        data={actors}
                        count={actorsCount}
                        sortBy={actorsSortBy}
                        ascOrDesc={actorsAscOrDesc}
                        page={Number(pageActors)}
                        pageCount={pageCountActors}
                        dataType="Actors"
                        cardType="actor"
                        path="actors"
                    />
                )}
                {shouldShowSection("crew") && (!term || crewsCount > 0) && (
                    <SearchList
                        title={term ? `Crews matching "${term}"` : "Crews"}
                        data={crews}
                        count={crewsCount}
                        sortBy={crewsSortBy}
                        ascOrDesc={crewsAscOrDesc}
                        page={Number(pageCrews)}
                        pageCount={pageCountCrews}
                        dataType="Crew"
                        cardType="crew"
                        path="crew"
                    />
                )}
                {shouldShowSection("seasons") && (!term || seasonsCount > 0) && (
                    <SearchList
                        title={term ? `Seasons matching "${term}"` : "Seasons"}
                        data={seasons}
                        count={seasonsCount}
                        sortBy={seasonsSortBy}
                        ascOrDesc={seasonsAscOrDesc}
                        page={Number(pageSeasons)}
                        pageCount={pageCountSeasons}
                        dataType="Seasons"
                        cardType="season"
                    />
                )}
                {shouldShowSection("episodes") && (!term || episodesCount > 0) && (
                    <SearchList
                        title={term ? `Episodes matching "${term}"` : "Episodes"}
                        data={episodes}
                        count={episodesCount}
                        sortBy={episodesSortBy}
                        ascOrDesc={episodesAscOrDesc}
                        page={Number(pageEpisodes)}
                        pageCount={pageCountEpisodes}
                        dataType="Episodes"
                        cardType="episode"
                    />
                )}
                {shouldShowSection("users") && (!term || usersCount > 0) && (
                    <SearchList
                        title={term ? `Users matching "${term}"` : "Users"}
                        data={users}
                        count={usersCount}
                        sortBy={usersSortBy}
                        ascOrDesc={usersAscOrDesc}
                        page={Number(pageUsers)}
                        pageCount={pageCountUsers}
                        dataType="Users"
                        cardType="user"
                    />
                )}
            </Box>
        </Box>
    );
}
