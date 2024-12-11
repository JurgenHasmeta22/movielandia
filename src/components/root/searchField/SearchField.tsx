"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TextField, InputAdornment, useTheme, IconButton, Box, ClickAwayListener } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import SearchAutocomplete from "./SearchAutocomplete";
import { useDebounce } from "@/hooks/useDebounce";
import { showToast } from "@/utils/helpers/toast";
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
            const response = await fetch(`/api/search/all?term=${encodeURIComponent(debouncedSearch)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                showToast("error", "Failed to fetch search results");
            }

            const data = await response.json();

            setResults({
                movies: data.movies || [],
                series: data.series || [],
                actors: data.actors || [],
                crew: data.crews || [],
                seasons: data.seasons || [],
                episodes: data.episodes || [],
                users: data.users || [],
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
            showToast("error", "Failed to fetch search results. Please try again later.");
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
