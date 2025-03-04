"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, useTheme, IconButton, Box, ClickAwayListener } from "@mui/material";
import { Clear, Search, KeyboardReturn } from "@mui/icons-material";
import SearchAutocomplete from "./SearchAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { showToast } from "@/utils/helpers/toast";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { Movie, Serie, Actor, Crew, Season, Episode, User } from "@prisma/client";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

interface SearchFieldProps {
    onFocusChange?: (focused: boolean) => void;
    onClose?: () => void;
}

const SearchField = ({ onFocusChange, onClose }: SearchFieldProps) => {
    const router = useRouter();

    const [filtersSearch, setFiltersSearch] = useQueryState("filters", {
        defaultValue: "all",
        parse: (value) => value || "all",
        history: "push",
        shallow: false,
    });

    const getInitialFilters = () => {
        const urlFilters = filtersSearch?.split(",") || [];
        return urlFilters.length > 0 ? urlFilters : ["all"];
    };

    const [term, setTerm] = useQueryState("term", {
        defaultValue: "",
        parse: (value) => value || "",
        shallow: false,
    });

    const [inputValue, setInputValue] = useState(term);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(getInitialFilters());
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<SearchResults>(emptyResults);
    const [isFocused, setIsFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const theme = useTheme();

    const debouncedSearch = useDebounce(inputValue, 50);

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
        setShowResults(true);
        setSelectedFilters(["all"]);
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
                `/api/search/all?term=${encodeURIComponent(debouncedSearch.trim())}&filters=${selectedFilters.join(
                    ",",
                )}`,
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

    // Updated selected filters when URL params change
    useEffect(() => {
        const urlFilters = filtersSearch?.split(",") || [];

        if (urlFilters.length > 0) {
            setSelectedFilters(urlFilters);
        }
    }, [filtersSearch]);

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

    const handleFocusEnhanced = () => {
        setIsFocused(true);
        onFocusChange?.(true);
        handleFocus();
    };

    const handleBlurEnhanced = () => {
        // Small delay to allow click events to process
        setTimeout(() => {
            if (!showResults) {
                setIsFocused(false);
                onFocusChange?.(false);
                // Reset input if there's no search term
                if (!inputValue.trim()) {
                    setInputValue("");
                }
            }
        }, 100);
    };

    const handleFocus = () => {
        setShowResults(true);

        // Only fetching if there's a valid search term
        if (inputValue.trim()) {
            fetchResults();
        }
    };

    const handleClose = () => {
        setResults(emptyResults);
        setShowResults(false);
        setIsFocused(false);
        setIsExpanded(false);
        onFocusChange?.(false);
        onClose?.();

        if (!inputValue.trim()) {
            setInputValue("");
        }
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

    const handleClickAway = () => {
        handleClose();
    };

    const handleSearchIconClick = () => {
        setIsExpanded(true);
        setIsFocused(true);
        setShowResults(true); // Show autocomplete immediately
        onFocusChange?.(true);
    };

    return (
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
            <AnimatePresence>
                {!isExpanded ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <IconButton
                            onClick={handleSearchIconClick}
                            sx={{
                                color: "text.secondary",
                                p: 1, // Reduced padding
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1.25rem', // Matched to other header icons
                                },
                                "&:hover": { 
                                    color: "primary.main",
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            <Search />
                        </IconButton>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        style={{ width: "100%" }}
                    >
                        <Box sx={{ width: "100%" }}>
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <Box sx={{ position: "relative", width: "100%" }}>
                                    <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
                                        <TextField
                                            autoFocus // Added to focus input automatically
                                            size="small"
                                            placeholder="Search..."
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onFocus={handleFocusEnhanced}
                                            onKeyDown={handleKeyDown}
                                            sx={{
                                                width: "100%",
                                                "& .MuiInputBase-root": {
                                                    height: 38,
                                                    pr: 1,
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search sx={{ color: "text.secondary" }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {isFocused && (
                                                            <Box sx={{ display: "flex", gap: "4px" }}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => {
                                                                        handleClose();
                                                                        setInputValue("");
                                                                    }}
                                                                    sx={{ mr: 0.5 }}
                                                                    aria-label="collapse search"
                                                                >
                                                                    <KeyboardReturn fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={handleClear}
                                                                    sx={{ mr: 0.5 }}
                                                                    aria-label="clear search"
                                                                >
                                                                    <Clear fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        )}
                                                    </InputAdornment>
                                                ),
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
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default SearchField;
