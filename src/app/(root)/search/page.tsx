import CardItem from "@/components/root/ui/cardItem/CardItem";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { searchMoviesByTitle } from "@/actions/movie.actions";
import { searchSeriesByTitle } from "@/actions/serie.actions";
import { Box, Stack, Typography } from "@mui/material";
import { Actor, Episode, Movie, Season, Serie } from "@prisma/client";
import type { Metadata } from "next";
import { searchActorsByTitle } from "@/actions/actor.actions";
import { searchSeasonsByTitle } from "@/actions/season.actions";
import { searchEpisodesByTitle } from "@/actions/episode.actions";

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

    if (actorsSortBy) {
        queryParamsEpisodes.sortBy = actorsSortBy;
    }

    if (actorsAscOrDesc) {
        queryParamsEpisodes.ascOrDesc = actorsAscOrDesc;
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
            {movies.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography fontSize={22} variant="h2">
                                Movies found
                            </Typography>
                            <Typography variant="h5">
                                (showing {movies.length} of {moviesCount})
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
            )}
            {series.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography fontSize={22} variant="h2">
                                Series found
                            </Typography>
                            <Typography variant="h5">
                                (showing {series.length} of {seriesCount})
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
            {actors.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography fontSize={22} variant="h2">
                                Actors found
                            </Typography>
                            <Typography variant="h5">
                                (showing {actors.length} of {actorsCount})
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
                                sortBy={actorsSortBy!}
                                ascOrDesc={actorsAscOrDesc!}
                                type="list"
                                dataType="actors"
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
                            {actors.map((actor: Actor) => (
                                <CardItem data={actor} type="actor" key={actor.id} path={"actors"} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageActors)!}
                            pageCount={pageCountActors}
                            dataType="Actors"
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
                            No search result, no actor found with that criteria.
                        </Typography>
                    </Box>
                </>
            )}
            {seasons.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography fontSize={22} variant="h2">
                                Seasons found
                            </Typography>
                            <Typography variant="h5">
                                (showing {seasons.length} of {seasonsCount})
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
                                sortBy={seasonsSortBy!}
                                ascOrDesc={seasonsAscOrDesc!}
                                type="list"
                                dataType="seasons"
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
                            {seasons.map((season: Season) => (
                                <CardItem data={season} type="season" key={season.id} path={"seasons"} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageSeasons)!}
                            pageCount={pageCountSeasons}
                            dataType="Seasons"
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
                    <Typography component={"h1"} fontSize={24} textAlign={"center"}>
                        No search result, no season found with that criteria.
                    </Typography>
                </Box>
            )}
            {episodes.length !== 0 ? (
                <Box display={"flex"} flexDirection={"column"} rowGap={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} ml={3} mr={3}>
                        <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                            <Typography fontSize={22} variant="h2">
                                Episodes found
                            </Typography>
                            <Typography variant="h5">
                                (showing {episodes.length} of {episodesCount})
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
                                sortBy={episodesSortBy!}
                                ascOrDesc={episodesAscOrDesc!}
                                type="list"
                                dataType="episodes"
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
                            {episodes.map((episode: Episode) => (
                                <CardItem data={episode} type="episode" key={episode.id} path={"episodes"} />
                            ))}
                        </Stack>
                        <PaginationControl
                            currentPage={Number(pageEpisodes)!}
                            pageCount={pageCountEpisodes}
                            dataType="Episodes"
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
                    <Typography component={"h1"} fontSize={24} textAlign={"center"}>
                        No search result, no episode found with that criteria.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
