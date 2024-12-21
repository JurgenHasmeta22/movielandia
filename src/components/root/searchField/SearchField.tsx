"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, useTheme, IconButton, Box, ClickAwayListener } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import SearchAutocomplete from "./SearchAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { showToast } from "@/utils/helpers/toast";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { Movie, Serie, Actor, Crew, Season, Episode, User } from "@prisma/client";

interface SearchResults {
    movies: { items: Movie[]; total: number };
    series: { items: Serie[]; total: number };
    actors: { items: Actor[]; total: number };
    crews: { items: Crew[]; total: number };
    seasons: { items: Season[]; total: number };
    episodes: { items: Episode[]; total: number };
    users: { items: User[]; total: number };
}

const emptyResults = {
    movies: { items: [], total: 0 },
    series: { items: [], total: 0 },
    actors: { items: [], total: 0 },
    crews: { items: [], total: 0 },
    seasons: { items: [], total: 0 },
    episodes: { items: [], total: 0 },
    users: { items: [], total: 0 },
};

const SearchField = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [inputValue, setInputValue] = useState(searchParams.get("term") || "");
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["all"]);
    const [results, setResults] = useState<SearchResults>(emptyResults);

    const debouncedSearch = useDebounce(inputValue, 300);
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
        setResults(emptyResults);
        setLoading(false);
        setShowResults(true); // Keeping showing the initial state
        handleSearch();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    const handleFilterChange = (filter: string) => {
        if (filter === "all") {
            setSelectedFilters(["all"]);
            return;
        }

        const newFilters = selectedFilters.filter((f) => f !== "all");

        if (selectedFilters.includes(filter)) {
            const updatedFilters = newFilters.filter((f) => f !== filter);
            // If no filters are selected, default to "all"
            setSelectedFilters(updatedFilters.length === 0 ? ["all"] : updatedFilters);
        } else {
            // Checking if adding this filter would make all filters selected
            const potentialFilters = [...newFilters, filter];
            const allFiltersExceptAll = filters.filter((f) => f.value !== "all").map((f) => f.value);

            if (potentialFilters.length === allFiltersExceptAll.length) {
                setSelectedFilters(["all"]);
            } else {
                setSelectedFilters(potentialFilters);
            }
        }
    };

    const handleShowMore = () => {
        handleSearch();
    };

    const fetchResults = useCallback(async () => {
        // No fetch if search term is empty or only whitespace
        if (!debouncedSearch?.trim()) {
            setResults(emptyResults);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `/api/search/all?term=${encodeURIComponent(debouncedSearch.trim())}&filters=${selectedFilters.join(",")}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                showToast("error", "Failed to fetch search results");
                return;
            }

            const data = await response.json();

            setResults({
                movies: data.movies || { items: [], total: 0 },
                series: data.series || { items: [], total: 0 },
                actors: data.actors || { items: [], total: 0 },
                crews: data.crews || { items: [], total: 0 },
                seasons: data.seasons || { items: [], total: 0 },
                episodes: data.episodes || { items: [], total: 0 },
                users: data.users || { items: [], total: 0 },
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
            showToast("error", "Failed to fetch search results. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, selectedFilters]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Showing results panel even if empty
        setShowResults(true);

        // Only setting loading if we have a non-empty, non-whitespace search term
        if (value.trim()) {
            setLoading(true);
        } else {
            setLoading(false);
            setResults(emptyResults);
        }
    };

    const handleFocus = () => {
        setShowResults(true);

        // Only fetching if there's a valid search term
        if (inputValue.trim()) {
            fetchResults();
        }
    };

    const handleClose = () => {
        setShowResults(false);
    };

    const handleReset = () => {
        setInputValue("");
        setResults(emptyResults);
        setShowResults(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
            handleClose();
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box sx={{ position: "relative", width: "100%" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex" }}>
                    <TextField
                        placeholder="Search for anything..."
                        size="small"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
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
                {showResults && (
                    <SearchAutocomplete
                        loading={loading}
                        results={results}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        searchTerm={inputValue}
                        onShowMore={handleShowMore}
                        onClose={handleClose}
                        onResultClick={handleReset}
                        showInitialState={!inputValue}
                    />
                )}
            </Box>
        </ClickAwayListener>
    );
};

export default SearchField;
