"use client";

import { Box, InputAdornment, TextField, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProfileSearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [isSearching, setIsSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300); // Reduced to 300ms for better responsiveness

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(Array.from(searchParams.entries()));
            if (value) {
                params.set(name, value);
                params.set("page", "1"); // Reset to first page on new search
            } else {
                params.delete(name);
                params.set("page", "1"); // Also reset page when clearing search
            }
            return params.toString();
        },
        [searchParams],
    );

    useEffect(() => {
        const updateSearch = async () => {
            setIsSearching(true);
            const query = createQueryString("search", debouncedSearch);
            const path = `${window.location.pathname}${query ? `?${query}` : ""}`;
            await router.push(path, { scroll: false });
            setIsSearching(false);
        };

        updateSearch();
    }, [debouncedSearch, createQueryString, router]);

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
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
