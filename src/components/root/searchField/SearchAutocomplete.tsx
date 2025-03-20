"use client";

import { Box, CircularProgress, Typography, useTheme, Button, Divider } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import { Chip, Stack } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import SearchResultCard from "./SearchResultCard";

interface SearchResults {
    movies: { items: Movie[]; total: number };
    series: { items: Serie[]; total: number };
    actors: { items: Actor[]; total: number };
    crews: { items: Crew[]; total: number };
    seasons: { items: Season[]; total: number };
    episodes: { items: Episode[]; total: number };
    users: { items: User[]; total: number };
}

interface SearchAutocompleteProps {
    loading: boolean;
    results: SearchResults;
    selectedFilters: string[];
    searchTerm: string;
    showInitialState: boolean;
    isMobile?: boolean;
    onFilterChange: (filter: string) => void;
    onShowMore: () => void;
    onClose: () => void;
    onResultClick: () => void;
}

const SearchAutocomplete = ({
    loading,
    results,
    selectedFilters,
    onFilterChange,
    searchTerm,
    onShowMore,
    onClose,
    onResultClick,
    showInitialState,
    isMobile,
}: SearchAutocompleteProps) => {
    const theme = useTheme();

    const handleItemClick = () => {
        onResultClick();

        if (!isMobile) {
            onClose();
        }
    };

    const handleShowMoreClick = () => {
        onShowMore();

        if (!isMobile) {
            onClose();
        }
    };

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

    const SectionTitle = ({
        title,
        shownCount,
        totalCount,
    }: {
        title: string;
        shownCount: number;
        totalCount: number;
    }) => (
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
            {title}{" "}
            {totalCount > 0 && (
                <Box
                    component="span"
                    sx={{
                        fontSize: "0.85em",
                        color: theme.vars.palette.text.secondary,
                        ml: 1,
                    }}
                >
                    ({shownCount} of {totalCount})
                </Box>
            )}
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

    const InitialState = () => (
        <Box sx={{ py: 4, textAlign: "center", color: theme.vars.palette.text.secondary }}>
            <Typography variant="body1">Select a category and start typing to search</Typography>
            <Typography variant="caption">You can search across movies, series, actors, and more</Typography>
        </Box>
    );

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
            return `View all ${totalCount} ${counts[0].label.toLowerCase()} results`;
        }

        const categoriesText = counts
            .map((item, index) => {
                if (index === counts.length - 1) {
                    return `and all ${item.count} ${item.label.toLowerCase()}`;
                }

                return `${item.count} ${item.label.toLowerCase()}`;
            })
            .join(counts.length > 2 ? ", " : " ");

        return `View all ${categoriesText} results`;
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <Box
            sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                borderRadius: { xs: 0, sm: 1 },
                boxShadow: theme.shadows[3],
                p: { xs: 1, sm: 2 },
                zIndex: 1000,
                maxHeight: { xs: "calc(100vh - 200px)", sm: "70vh" },
                overflowY: "auto",
                mt: { xs: 0.5, sm: 1 },
                ...(isMobile && {
                    width: "90%",
                    maxWidth: "90%",
                }),
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    background: theme.vars.palette.background.default,
                },
                "&::-webkit-scrollbar-thumb": {
                    background: theme.vars.palette.primary.main,
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: theme.vars.palette.primary.dark,
                },
            }}
        >
            <Stack
                sx={{
                    mb: 2,
                    px: { xs: 0.5, sm: 1 },
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
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
                            borderRadius: 2,
                            width: "100%",
                            py: 0.25,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            "&:hover": {
                                bgcolor: selectedFilters.includes(filter.value)
                                    ? theme.vars.palette.primary.main
                                    : theme.vars.palette.action.hover,
                                transform: "scale(1.05)",
                                transition: "transform 0.2s",
                            },
                        }}
                    />
                ))}
            </Stack>

            {showInitialState ? (
                <InitialState />
            ) : !hasAnyResults ? (
                <NoResultsMessage />
            ) : (
                <Stack spacing={3} sx={{ width: "100%" }}>
                    {shouldShowSection("movies") && (
                        <Box>
                            <SectionTitle
                                title="Movies"
                                shownCount={results.movies.items.length}
                                totalCount={results.movies.total}
                            />
                            <Box sx={{ mt: 1 }}>
                                {results.movies.items.length > 0 ? (
                                    <Stack spacing={1}>
                                        {results.movies.items.map((movie) => (
                                            <SearchResultCard
                                                key={movie.id}
                                                data={movie}
                                                type="movie"
                                                onResultClick={handleItemClick}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoSectionResults section="Movies" />
                                )}
                            </Box>
                        </Box>
                    )}
                    {shouldShowSection("movies") && shouldShowSection("series") && (
                        <Divider sx={{ my: 1, width: "100%" }} />
                    )}
                    {shouldShowSection("series") && (
                        <Box>
                            <SectionTitle
                                title="Series"
                                shownCount={results.series.items.length}
                                totalCount={results.series.total}
                            />
                            {results.series.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.series.items.map((serie) => (
                                        <SearchResultCard
                                            key={serie.id}
                                            data={serie}
                                            type="serie"
                                            onResultClick={handleItemClick}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Series" />
                            )}
                        </Box>
                    )}
                    {shouldShowSection("series") && shouldShowSection("actors") && (
                        <Divider sx={{ my: 1, width: "100%" }} />
                    )}
                    {shouldShowSection("actors") && (
                        <Box>
                            <SectionTitle
                                title="Actors"
                                shownCount={results.actors.items.length}
                                totalCount={results.actors.total}
                            />
                            <Box sx={{ mt: 1 }}>
                                {results.actors.items.length > 0 ? (
                                    <Stack spacing={1}>
                                        {results.actors.items.map((actor) => (
                                            <SearchResultCard
                                                key={actor.id}
                                                data={actor}
                                                type="actor"
                                                path="actors"
                                                onResultClick={handleItemClick}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoSectionResults section="Actors" />
                                )}
                            </Box>
                        </Box>
                    )}
                    {shouldShowSection("actors") && shouldShowSection("crew") && (
                        <Divider sx={{ my: 1, width: "100%" }} />
                    )}
                    {shouldShowSection("crew") && (
                        <Box>
                            <SectionTitle
                                title="Crew"
                                shownCount={results.crews.items.length}
                                totalCount={results.crews.total}
                            />
                            <Box sx={{ mt: 1 }}>
                                {results.crews.items.length > 0 ? (
                                    <Stack spacing={1}>
                                        {results.crews.items.map((crewMember) => (
                                            <SearchResultCard
                                                key={crewMember.id}
                                                data={crewMember}
                                                type="crew"
                                                path="crew"
                                                onResultClick={handleItemClick}
                                            />
                                        ))}
                                    </Stack>
                                ) : (
                                    <NoSectionResults section="Crew" />
                                )}
                            </Box>
                        </Box>
                    )}
                    {shouldShowSection("crew") && shouldShowSection("seasons") && (
                        <Divider sx={{ my: 1, width: "100%" }} />
                    )}
                    {shouldShowSection("seasons") && (
                        <Box>
                            <SectionTitle
                                title="Seasons"
                                shownCount={results.seasons.items.length}
                                totalCount={results.seasons.total}
                            />
                            {results.seasons.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.seasons.items.map((season) => (
                                        <SearchResultCard
                                            key={season.id}
                                            data={season}
                                            type="season"
                                            onResultClick={handleItemClick}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Seasons" />
                            )}
                        </Box>
                    )}
                    {shouldShowSection("seasons") && shouldShowSection("episodes") && (
                        <Divider sx={{ my: 1, width: "100%" }} />
                    )}
                    {shouldShowSection("episodes") && (
                        <Box>
                            <SectionTitle
                                title="Episodes"
                                shownCount={results.episodes.items.length}
                                totalCount={results.episodes.total}
                            />
                            {results.episodes.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.episodes.items.map((episode) => (
                                        <SearchResultCard
                                            key={episode.id}
                                            data={episode}
                                            type="episode"
                                            onResultClick={handleItemClick}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <NoSectionResults section="Episodes" />
                            )}
                        </Box>
                    )}
                    {shouldShowSection("episodes") && shouldShowSection("users") && (
                        <Divider sx={{ my: 1, width: "100%" }} />
                    )}
                    {shouldShowSection("users") && (
                        <Box>
                            <SectionTitle
                                title="Users"
                                shownCount={results.users.items.length}
                                totalCount={results.users.total}
                            />
                            {results.users.items.length > 0 ? (
                                <Stack spacing={1}>
                                    {results.users.items.map((user) => (
                                        <SearchResultCard
                                            key={user.id}
                                            data={user}
                                            type="user"
                                            onResultClick={handleItemClick}
                                        />
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
                                onClick={handleShowMoreClick}
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
