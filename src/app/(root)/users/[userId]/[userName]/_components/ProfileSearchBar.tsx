"use client";

import { Box, InputAdornment, TextField, CircularProgress, IconButton, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Options, useQueryState } from "nuqs";

interface IProfileSearchBar {
    search: string;
    page: number;
    mainTab: string;
    setPage: (value: string | ((old: string) => string | null) | null, options?: Options) => Promise<URLSearchParams>;
    setSearch: (value: string | ((old: string) => string | null) | null, options?: Options) => Promise<URLSearchParams>;
}

export default function ProfileSearchBar({ search, page, mainTab, setPage, setSearch }: IProfileSearchBar) {
    const [subTab, setSubTab] = useQueryState("subtab", {
        defaultValue: "movies",
        parse: (value) => value || "movies",
        history: "push",
        shallow: false,
    });

    const [inputValue, setInputValue] = useState(search);
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(inputValue, 50);

    const getPlaceholder = useMemo(() => {
        const contentType = subTab.toLowerCase();

        switch (mainTab) {
            case "reviews":
                return `Search ${contentType} reviews...`;
            case "upvotes":
                return `Search upvoted ${contentType} reviews...`;
            case "downvotes":
                return `Search downvoted ${contentType} reviews...`;
            default:
                return `Search ${contentType} bookmarks...`;
        }
    }, [mainTab, subTab]);

    const updateSearchParams = useCallback(() => {
        setIsSearching(true);

        if (debouncedSearch.trim()) {
            setSearch(debouncedSearch.trim());
            setPage("1");
        } else {
            setSearch(null);
            setPage("1");
        }

        setIsSearching(false);
    }, [debouncedSearch]);

    useEffect(() => {
        if (debouncedSearch !== search) {
            updateSearchParams();
        }
    }, [debouncedSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleClear = () => {
        setInputValue("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearchParams();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            updateSearchParams();
        }
    };

    return (
        <ClickAwayListener onClickAway={() => {}}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}>
                <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "600px" }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={getPlaceholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton type="submit" size="small" aria-label="search">
                                            <SearchIcon color="action" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {isSearching ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : inputValue ? (
                                            <IconButton
                                                onClick={handleClear}
                                                size="small"
                                                aria-label="clear search"
                                                edge="end"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        ) : null}
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                </form>
            </Box>
        </ClickAwayListener>
    );
}
