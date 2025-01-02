// #region "Imports"
import { Box, Typography } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import { searchMoviesByTitle } from "@/actions/movie.actions";
import { searchSeriesByTitle } from "@/actions/serie.actions";
import { searchActorsByTitle } from "@/actions/actor.actions";
import { searchSeasonsByTitle } from "@/actions/season.actions";
import { searchEpisodesByTitle } from "@/actions/episode.actions";
import { searchUsersByUsername } from "@/actions/user/user.actions";
import SearchList from "./SearchList";
import { searchCrewMembersByFullname } from "@/actions/crew.actions";
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

    let movies: Movie[] = [],
        moviesCount = 0,
        pageCountMovies = 0;
    let series: Serie[] = [],
        seriesCount = 0,
        pageCountSeries = 0;
    let actors: Actor[] = [],
        actorsCount = 0,
        pageCountActors = 0;
    let crews: Crew[] = [],
        crewsCount = 0,
        pageCountCrews = 0;
    let episodes: Episode[] = [],
        episodesCount = 0,
        pageCountEpisodes = 0;
    let seasons: Season[] = [],
        seasonsCount = 0,
        pageCountSeasons = 0;
    let users: User[] = [],
        usersCount = 0,
        pageCountUsers = 0;

    const shouldFetchData = (type: string) => selectedFilters.includes("all") || selectedFilters.includes(type);

    if (shouldFetchData("movies")) {
        const pageMovies = Number(searchParams?.pageMovies) || 1;
        const queryParamsMovies: IQueryParams = {
            page: pageMovies,
            sortBy: searchParams?.moviesSortBy ?? "",
            ascOrDesc: searchParams?.moviesAscOrDesc ?? "",
        };

        const moviesData = await searchMoviesByTitle(term, queryParamsMovies, Number(session?.user?.id));
        movies = moviesData.movies;
        moviesCount = moviesData.count;
        pageCountMovies = Math.ceil(moviesCount / itemsPerPage);
    }

    if (shouldFetchData("series")) {
        const pageSeries = Number(searchParams?.pageSeries) || 1;
        const queryParamsSeries: IQueryParams = {
            page: pageSeries,
            sortBy: searchParams?.seriesSortBy ?? "",
            ascOrDesc: searchParams?.seriesAscOrDesc ?? "",
        };

        const seriesData = await searchSeriesByTitle(term, queryParamsSeries, Number(session?.user?.id));
        series = seriesData.rows;
        seriesCount = seriesData.count;
        pageCountSeries = Math.ceil(seriesCount / itemsPerPage);
    }

    if (shouldFetchData("actors")) {
        const pageActors = Number(searchParams?.pageActors) || 1;
        const queryParamsActors: IQueryParams = {
            page: pageActors,
            sortBy: searchParams?.actorsSortBy ?? "",
            ascOrDesc: searchParams?.actorsAscOrDesc ?? "",
        };

        const actorsData = await searchActorsByTitle(term, queryParamsActors, Number(session?.user?.id));
        actors = actorsData.actors;
        actorsCount = actorsData.count;
        pageCountActors = Math.ceil(actorsCount / itemsPerPage);
    }

    if (shouldFetchData("crew")) {
        const pageCrews = Number(searchParams?.pageCrews) || 1;
        const queryParamsCrews: IQueryParams = {
            page: pageCrews,
            sortBy: searchParams?.crewSortBy ?? "",
            ascOrDesc: searchParams?.crewAscOrDesc ?? "",
        };

        const crewsData = await searchCrewMembersByFullname(term, queryParamsCrews, Number(session?.user?.id));
        crews = crewsData.crews;
        crewsCount = crewsData.count;
        pageCountCrews = Math.ceil(crewsCount / itemsPerPage);
    }

    if (shouldFetchData("episodes")) {
        const pageEpisodes = Number(searchParams?.pageEpisodes) || 1;
        const queryParamsEpisodes: IQueryParams = {
            page: pageEpisodes,
            sortBy: searchParams?.episodesSortBy ?? "",
            ascOrDesc: searchParams?.episodesAscOrDesc ?? "",
        };

        const episodesData = await searchEpisodesByTitle(term, queryParamsEpisodes, Number(session?.user?.id));
        episodes = episodesData.episodes;
        episodesCount = episodesData.count;
        pageCountEpisodes = Math.ceil(episodesCount / itemsPerPage);
    }

    if (shouldFetchData("seasons")) {
        const pageSeasons = Number(searchParams?.pageSeasons) || 1;
        const queryParamsSeasons: IQueryParams = {
            page: pageSeasons,
            sortBy: searchParams?.seasonsSortBy ?? "",
            ascOrDesc: searchParams?.seasonsAscOrDesc ?? "",
        };

        const seasonsData = await searchSeasonsByTitle(term, queryParamsSeasons, Number(session?.user?.id));
        seasons = seasonsData.seasons;
        seasonsCount = seasonsData.count;
        pageCountSeasons = Math.ceil(seasonsCount / itemsPerPage);
    }

    if (shouldFetchData("users")) {
        const pageUsers = Number(searchParams?.pageUsers) || 1;
        const queryParamsUsers: IQueryParams = {
            page: pageUsers,
            sortBy: searchParams?.usersSortBy ?? "",
            ascOrDesc: searchParams?.usersAscOrDesc ?? "",
        };

        const usersData = await searchUsersByUsername(term, queryParamsUsers);
        users = usersData.users;
        usersCount = usersData.count;
        pageCountUsers = Math.ceil(usersCount / itemsPerPage);
    }

    const totalResults =
        moviesCount + seriesCount + actorsCount + seasonsCount + episodesCount + usersCount + crewsCount;

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
                        mt: 8,
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
                        ? `Found ${totalResults} results across all categories`
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
                        sortBy={searchParams?.moviesSortBy ?? ""}
                        ascOrDesc={searchParams?.moviesAscOrDesc ?? ""}
                        page={Number(searchParams?.pageMovies) || 1}
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
                        sortBy={searchParams?.seriesSortBy ?? ""}
                        ascOrDesc={searchParams?.seriesAscOrDesc ?? ""}
                        page={Number(searchParams?.pageSeries) || 1}
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
                        sortBy={searchParams?.actorsSortBy ?? ""}
                        ascOrDesc={searchParams?.actorsAscOrDesc ?? ""}
                        page={Number(searchParams?.pageActors) || 1}
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
                        sortBy={searchParams?.crewSortBy ?? ""}
                        ascOrDesc={searchParams?.crewAscOrDesc ?? ""}
                        page={Number(searchParams?.pageCrews) || 1}
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
                        sortBy={searchParams?.seasonsSortBy ?? ""}
                        ascOrDesc={searchParams?.seasonsAscOrDesc ?? ""}
                        page={Number(searchParams?.pageSeasons) || 1}
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
                        sortBy={searchParams?.episodesSortBy ?? ""}
                        ascOrDesc={searchParams?.episodesAscOrDesc ?? ""}
                        page={Number(searchParams?.pageEpisodes) || 1}
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
                        sortBy={searchParams?.usersSortBy ?? ""}
                        ascOrDesc={searchParams?.usersAscOrDesc ?? ""}
                        page={Number(searchParams?.pageUsers) || 1}
                        pageCount={pageCountUsers}
                        dataType="Users"
                        cardType="user"
                    />
                )}
            </Box>
        </Box>
    );
}
