"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, useTheme, IconButton, Box, ClickAwayListener } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMoviesByTitle } from "@/actions/movie.actions";
import { searchSeriesByTitle } from "@/actions/serie.actions";
import { searchActorsByTitle } from "@/actions/actor.actions";
import { searchCrewMembersByTitle } from "@/actions/crew.actions";
import { searchSeasonsByTitle } from "@/actions/season.actions";
import { searchEpisodesByTitle } from "@/actions/episode.actions";
import { searchUsersByUsername } from "@/actions/user.actions";
import SearchAutocomplete from "./SearchAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import type {} from "@mui/material/themeCssVarsAugmentation";

const SearchField = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [inputValue, setInputValue] = useState(searchParams.get("term") || "");
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
    const [results, setResults] = useState({
        movies: [],
        series: [],
        actors: [],
        crew: [],
        seasons: [],
        episodes: [],
        users: [],
    });

    const theme = useTheme();
    const debouncedSearch = useDebounce(inputValue, 300);

    const handleSearch = () => {
        if (inputValue) {
            router.push(`/search?term=${encodeURIComponent(inputValue)}&filters=${selectedFilters.join(",")}`);
        } else {
            router.push("/search");
        }

        setShowResults(false);
    };

    const handleClear = () => {
        setInputValue("");

        setResults({
            movies: [],
            series: [],
            actors: [],
            crew: [],
            seasons: [],
            episodes: [],
            users: [],
        });

        router.push("/search");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    const handleFilterChange = (filter: string) => {
        if (filter === "all") {
            setSelectedFilters(["all"]);
        } else {
            const newFilters = selectedFilters.filter((f) => f !== "all");

            if (selectedFilters.includes(filter)) {
                setSelectedFilters(newFilters.filter((f) => f !== filter));
            } else {
                setSelectedFilters([...newFilters, filter]);
            }
        }
    };

    const handleShowMore = () => {
        handleSearch();
    };

    const fetchResults = useCallback(async () => {
        if (!debouncedSearch) {
            setResults({
                movies: [],
                series: [],
                actors: [],
                crew: [],
                seasons: [],
                episodes: [],
                users: [],
            });

            return;
        }

        setLoading(true);

        try {
            const [moviesData, seriesData, actorsData, crewData, seasonsData, episodesData, usersData] =
                await Promise.all([
                    searchMoviesByTitle(debouncedSearch, { page: 1 }),
                    searchSeriesByTitle(debouncedSearch, { page: 1 }),
                    searchActorsByTitle(debouncedSearch, { page: 1 }),
                    searchCrewMembersByTitle(debouncedSearch, { page: 1 }),
                    searchSeasonsByTitle(debouncedSearch, { page: 1 }),
                    searchEpisodesByTitle(debouncedSearch, { page: 1 }),
                    searchUsersByUsername(debouncedSearch, { page: 1 }),
                ]);

            setResults({
                movies: moviesData?.movies || [],
                series: seriesData?.rows || [],
                actors: actorsData?.actors || [],
                crew: crewData?.crews || [],
                seasons: seasonsData?.seasons || [],
                episodes: episodesData?.episodes || [],
                users: usersData?.users || [],
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    return (
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
            <Box sx={{ position: "relative", width: "100%" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex" }}>
                    <TextField
                        placeholder="Search for anything..."
                        size="small"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowResults(true);
                        }}
                        onFocus={() => setShowResults(true)}
                        sx={{
                            width: "100%",
                            "& .MuiInputBase-root": {
                                minWidth: 300,
                                transition: "width 0.2s",
                                width: showResults ? "100%" : 300,
                            },
                        }}
                        slotProps={{
                            input: {
                                sx: { py: 0.5, color: theme.vars.palette.primary.main },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton type="submit" size="small" aria-label="search">
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                endAdornment: inputValue && (
                                    <InputAdornment position="end">
                                        <Clear
                                            sx={{ cursor: "pointer" }}
                                            onClick={handleClear}
                                            aria-label="clear search"
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </form>
                {showResults && debouncedSearch && (
                    <SearchAutocomplete
                        loading={loading}
                        results={results}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        searchTerm={inputValue}
                        onShowMore={handleShowMore}
                    />
                )}
            </Box>
        </ClickAwayListener>
    );
};

export default SearchField;
