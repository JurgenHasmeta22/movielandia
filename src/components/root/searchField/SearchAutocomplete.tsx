"use client";

import { Box, CircularProgress, Typography, useTheme, Button } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import { Chip, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import SearchResultCard from "./SearchResultCard";

interface SearchAutocompleteProps {
    loading: boolean;
    results: {
        movies: Movie[];
        series: Serie[];
        actors: Actor[];
        crew: Crew[];
        seasons: Season[];
        episodes: Episode[];
        users: User[];
    };
    selectedFilters: string[];
    searchTerm: string;
    onFilterChange: (filter: string) => void;
    onShowMore: () => void;
}

const SearchAutocomplete = ({
    loading,
    results,
    selectedFilters,
    onFilterChange,
    searchTerm,
    onShowMore,
}: SearchAutocompleteProps) => {
    const theme = useTheme();

    const filters = [
        { label: "All", value: "all" },
        { label: "Movies", value: "movies" },
        { label: "Series", value: "series" },
        { label: "Actors", value: "actors" },
        { label: "Crew", value: "crew" },
        { label: "Seasons", value: "seasons" },
        { label: "Episodes", value: "episodes" },
        { label: "Users", value: "users" },
    ];

    const shouldShowSection = (type: string) => {
        if (selectedFilters.includes("all")) return true;
        return selectedFilters.includes(type.toLowerCase());
    };

    if (loading) {
        return (
            <Box
                sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: theme.shadows[3],
                    p: 2,
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <CircularProgress size={24} />
            </Box>
        );
    }

    const hasResults =
        results.movies.length ||
        results.series.length ||
        results.actors.length ||
        results.crew.length ||
        results.seasons.length ||
        results.episodes.length ||
        results.users.length;

    if (!hasResults) return null;

    const getTotalResults = () => {
        return (
            results.movies.length +
            results.series.length +
            results.actors.length +
            results.crew.length +
            results.seasons.length +
            results.episodes.length +
            results.users.length
        );
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: theme.shadows[3],
                p: 2,
                zIndex: 1000,
                maxHeight: "80vh",
                overflowY: "auto",
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: 2.5,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                {filters.map((filter) => (
                    <Chip
                        key={filter.value}
                        label={filter.label}
                        onClick={() => onFilterChange(filter.value)}
                        color={selectedFilters.includes(filter.value) ? "primary" : "default"}
                        variant={selectedFilters.includes(filter.value) ? "filled" : "outlined"}
                        sx={{
                            borderRadius: 1,
                            "&:hover": {
                                bgcolor: selectedFilters.includes(filter.value)
                                    ? theme.vars.palette.primary.main
                                    : theme.vars.palette.action.hover,
                            },
                        }}
                    />
                ))}
            </Stack>

            <Stack spacing={3}>
                {shouldShowSection("movies") && results.movies.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Movies
                        </Typography>
                        <Stack spacing={1}>
                            {results.movies.map((movie) => (
                                <SearchResultCard key={movie.id} data={movie} type="movie" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {shouldShowSection("series") && results.series.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Series
                        </Typography>
                        <Stack spacing={1}>
                            {results.series.map((serie) => (
                                <SearchResultCard key={serie.id} data={serie} type="serie" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {shouldShowSection("actors") && results.actors.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Actors
                        </Typography>
                        <Stack spacing={1}>
                            {results.actors.map((actor) => (
                                <SearchResultCard key={actor.id} data={actor} type="actor" path="actors" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {shouldShowSection("crew") && results.crew.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Crew
                        </Typography>
                        <Stack spacing={1}>
                            {results.crew.map((crewMember) => (
                                <SearchResultCard key={crewMember.id} data={crewMember} type="crew" path="crew" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {shouldShowSection("seasons") && results.seasons.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Seasons
                        </Typography>
                        <Stack spacing={1}>
                            {results.seasons.map((season) => (
                                <SearchResultCard key={season.id} data={season} type="season" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {shouldShowSection("episodes") && results.episodes.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Episodes
                        </Typography>
                        <Stack spacing={1}>
                            {results.episodes.map((episode) => (
                                <SearchResultCard key={episode.id} data={episode} type="episode" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {shouldShowSection("users") && results.users.length > 0 && (
                    <Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary,
                            }}
                        >
                            Users
                        </Typography>
                        <Stack spacing={1}>
                            {results.users.map((user) => (
                                <SearchResultCard key={user.id} data={user} type="user" />
                            ))}
                        </Stack>
                    </Box>
                )}

                {hasResults && (
                    <Box
                        sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: 1,
                            borderColor: "divider",
                            textAlign: "center",
                        }}
                    >
                        <Button
                            onClick={onShowMore}
                            variant="text"
                            endIcon={<ArrowForward />}
                            sx={{
                                textTransform: "none",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            View all {getTotalResults()} results for &quot;{searchTerm}&quot;
                        </Button>
                    </Box>
                )}
            </Stack>
        </Box>
    );
};

export default SearchAutocomplete;
