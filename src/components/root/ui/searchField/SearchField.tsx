"use client";

import React from "react";
import { TextField, InputAdornment, useTheme } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import type {} from "@mui/material/themeCssVarsAugmentation";

const SearchField = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = useTheme();

    const handleSearch = (value: string) => {
        if (value.length > 0) {
            router.push(`/search?term=${encodeURIComponent(value)}`);
        } else {
            router.push("/search");
        }
    };

    const handleClear = () => {
        router.push("/search");
    };

    return (
        <TextField
            placeholder="Search for movies, series, seasons, episodes, actors ..."
            size="small"
            value={searchParams.get("term") || ""}
            onChange={(e) => {
                const value = e.target.value;
                handleSearch(value);
            }}
            InputProps={{
                sx: { py: 0.5, color: theme.vars.palette.primary.main },
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <Clear sx={{ cursor: "pointer" }} onClick={handleClear} />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchField;
