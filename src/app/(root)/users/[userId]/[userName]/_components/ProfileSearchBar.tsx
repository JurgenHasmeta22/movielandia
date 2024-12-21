"use client";

import { Box, InputAdornment, TextField, CircularProgress, IconButton, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProfileSearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [inputValue, setInputValue] = useState(searchParams.get("search")?.toString() ?? "");
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(inputValue, 300);

    const mainTab = searchParams.get("maintab") || "bookmarks";
    const subTab = searchParams.get("subtab") || "movies";

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

        const params = new URLSearchParams(searchParams.toString());

        if (debouncedSearch.trim()) {
            params.set("search", debouncedSearch.trim());

            // Only reset page if the search term actually changed
            if (params.get("search") !== searchParams.get("search")) {
                params.set("page", "1");
            }
        } else {
            params.delete("search");

            // Only reset page if we're clearing a previous search
            if (searchParams.has("search")) {
                params.set("page", "1");
            }
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        setIsSearching(false);
    }, [debouncedSearch, pathname, router, searchParams]);

    useEffect(() => {
        if (debouncedSearch !== searchParams.get("search")?.toString()) {
            updateSearchParams();
        }
    }, [debouncedSearch, searchParams, updateSearchParams]);

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
