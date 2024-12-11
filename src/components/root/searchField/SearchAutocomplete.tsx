"use client";

import { Box, CircularProgress, Typography, useTheme, Button, Divider } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import { Chip, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import SearchResultCard from "./SearchResultCard";

interface SearchAutocompleteProps {
    loading: boolean;
    results: {
        movies: { items: Movie[]; total: number };
        series: { items: Serie[]; total: number };
        actors: { items: Actor[]; total: number };
        crews: { items: Crew[]; total: number };
        seasons: { items: Season[]; total: number };
        episodes: { items: Episode[]; total: number };
        users: { items: User[]; total: number };
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

    const hasAnyResults = Object.values(results).some((category) => category.items.length > 0);

    const NoResultsMessage = () =>
        searchTerm ? (
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
        ) : null;

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

    const SectionTitle = ({ title }: { title: string }) => (
        <Typography
            variant="subtitle1"
            sx={{
                textAlign: "center",
                fontWeight: 600,
                color: theme.vars.palette.text.primary,
                mb: 1.5,
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 40,
                    height: 2,
                    bgcolor: theme.vars.palette.primary.main,
                    borderRadius: 1,
                },
            }}
        >
            {title}
        </Typography>
    );

    const LoadingState = () => (
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
                alignItems: "center",
                minHeight: 100,
            }}
        >
            <CircularProgress size={24} />
        </Box>
    );

    if (loading) {
        return <LoadingState />;
    }

    const getTotalResults = () => {
        return Object.values(results).reduce((sum, category) => {
            return sum + (category?.total || 0);
        }, 0);
    };

    const getFilterSpecificResults = () => {
        const selectedCategories = selectedFilters.includes("all")
            ? filters.filter((f) => f.value !== "all")
            : filters.filter((f) => selectedFilters.includes(f.value));

        const counts = selectedCategories
            .map((filter) => {
                const key = filter.value === "crew" ? "crews" : `${filter.value}`;
                const category = results[key.toLowerCase() as keyof typeof results];

                if (!category) return null;

                return {
                    label: filter.label,
                    count: category.total || 0,
                };
            })
            .filter((item): item is { label: string; count: number } => item !== null && item.count > 0);

        if (counts.length === 0) return "";

        if (selectedFilters.includes("all")) {
            return `View all ${getTotalResults()} results`;
        }

        const totalCount = counts.reduce((sum, item) => sum + item.count, 0);

        if (counts.length === 1) {
            return `View ${totalCount} ${counts[0].label.toLowerCase()} results`;
        }

        const categoriesText = counts
            .map((item, index) => {
                if (index === counts.length - 1) {
                    return `and ${item.count} ${item.label.toLowerCase()}`;
                }

                return `${item.count} ${item.label.toLowerCase()}`;
            })
            .join(counts.length > 2 ? ", " : " ");

        return `View ${categoriesText} results`;
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
                    mb: 2,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "center",
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
                            minWidth: filter.value === "all" ? 80 : "auto",
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
                            <SectionTitle title="Movies" />
                            <Box sx={{ mt: 1 }}>
                                {results.movies.items.length > 0 ? (
                                    <Stack spacing={1}>
                                        {results.movies.items.map((movie) => (
                                            <SearchResultCard key={movie.id} data={movie} type="movie" />
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoSectionResults section="Movies" />
                                )}
                            </Box>
                        </Box>
                    )}

                    {shouldShowSection("movies") && shouldShowSection("series") && <Divider sx={{ my: 1 }} />}

                    {shouldShowSection("series") && (
                        <Box>
                            <SectionTitle title="Series" />
                            {results.series.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.series.items.map((serie) => (
                                        <SearchResultCard key={serie.id} data={serie} type="serie" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Series" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("series") && shouldShowSection("actors") && <Divider sx={{ my: 1 }} />}

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
                            {results.actors.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.actors.items.map((actor) => (
                                        <SearchResultCard key={actor.id} data={actor} type="actor" path="actors" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Actors" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("series") && shouldShowSection("crew") && <Divider sx={{ my: 1 }} />}

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
                            {results.crews.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.crews.items.map((crewMember) => (
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

                    {shouldShowSection("series") && shouldShowSection("seasons") && <Divider sx={{ my: 1 }} />}

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
                            {results.seasons.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.seasons.items.map((season) => (
                                        <SearchResultCard key={season.id} data={season} type="season" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Seasons" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("series") && shouldShowSection("episodes") && <Divider sx={{ my: 1 }} />}

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
                            {results.episodes.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.episodes.items.map((episode) => (
                                        <SearchResultCard key={episode.id} data={episode} type="episode" />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Episodes" />
                            )}
                        </Box>
                    )}

                    {shouldShowSection("series") && shouldShowSection("users") && <Divider sx={{ my: 1 }} />}

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
                            {results.users.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.users.items.map((user) => (
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
                                {`${getFilterSpecificResults()} for "${searchTerm}"`}
                            </Button>
                        </Box>
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default SearchAutocomplete;
