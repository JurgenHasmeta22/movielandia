"use client";

import { Box, InputAdornment, TextField, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProfileSearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search")?.toString() ?? "");
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);

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

    const createQueryString = useCallback(
        (newSearch: string) => {
            const params = new URLSearchParams(Array.from(searchParams.entries()));

            if (newSearch) {
                params.set("search", newSearch);
                params.set("page", "1");
            } else {
                params.delete("search");
                params.delete("page");
            }

            return params.toString();
        },
        [searchParams],
    );

    const updateSearch = useCallback(
        async (term: string) => {
            setIsSearching(true);
            const queryString = createQueryString(term);

            await router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
                scroll: false,
            });

            setIsSearching(false);
        },
        [pathname, router, createQueryString],
    );

    useEffect(() => {
        updateSearch(debouncedSearch);
    }, [debouncedSearch, updateSearch]);

    useEffect(() => {
        const currentSearchParam = searchParams.get("search")?.toString() ?? "";

        // Only update if there's a URL change that didn't come from the input
        if (currentSearchParam !== searchQuery && document.activeElement !== document.querySelector("input")) {
            setSearchQuery(currentSearchParam);
        }
    }, [searchParams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 2,
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder={getPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: isSearching ? (
                        <InputAdornment position="end">
                            <CircularProgress size={20} color="inherit" />
                        </InputAdornment>
                    ) : null,
                }}
                sx={{
                    maxWidth: "600px",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                    },
                }}
            />
        </Box>
    );
}
