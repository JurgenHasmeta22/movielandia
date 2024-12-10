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

    const hasAnyResults = Object.values(results).some((array) => array.length > 0);

    const NoResultsMessage = () => (
        <Box
            sx={{
                py: 4,
                textAlign: "center",
                color: theme.vars.palette.text.secondary,
            }}
        >
            <Typography variant="body1">No results found for &quot;{searchTerm}&quot;</Typography>
            <Typography variant="caption">
                Try adjusting your search or filters to find what you&apos;re looking for
            </Typography>
        </Box>
    );

    const NoSectionResults = ({ section }: { section: string }) => (
        <Typography
            variant="body2"
            sx={{
                py: 1,
                px: 2,
                color: theme.vars.palette.text.secondary,
                fontStyle: "italic",
            }}
        >
            No {section.toLowerCase()} found
        </Typography>
    );

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

            {!hasAnyResults ? (
                <NoResultsMessage />
            ) : (
                <Stack spacing={3}>
                    {shouldShowSection("movies") && (
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
                            {results.movies.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.movies.map((movie) => (
                                        <SearchResultCard key={movie.id} data={movie} type="movie" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Movies" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("series") && (
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
                            {results.series.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.series.map((serie) => (
                                        <SearchResultCard key={serie.id} data={serie} type="serie" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Series" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("actors") && (
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
                            {results.actors.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.actors.map((actor) => (
                                        <SearchResultCard key={actor.id} data={actor} type="actor" path="actors" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Actors" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("crew") && (
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
                            {results.crew.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.crew.map((crewMember) => (
                                        <SearchResultCard
                                            key={crewMember.id}
                                            data={crewMember}
                                            type="crew"
                                            path="crew"
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Crew" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("seasons") && (
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
                            {results.seasons.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.seasons.map((season) => (
                                        <SearchResultCard key={season.id} data={season} type="season" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Seasons" />
                            )}
                        </Box>
                    )}
                    {shouldShowSection("episodes") && (
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
                            {results.episodes.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.episodes.map((episode) => (
                                        <SearchResultCard key={episode.id} data={episode} type="episode" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Episodes" />
                            )}
                        </Box>
                    )}
                    {shouldShowSection("users") && (
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
                            {results.users.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.users.map((user) => (
                                        <SearchResultCard key={user.id} data={user} type="user" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Users" />
                            )}
                        </Box>
                    )}
                    {hasAnyResults && (
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
            )}
        </Box>
    );
};

export default SearchAutocomplete;
