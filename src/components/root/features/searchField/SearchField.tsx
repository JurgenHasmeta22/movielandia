"use client";

import React from "react";
import { TextField, InputAdornment, useTheme, CssVarsTheme } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";

import { useRouter, useSearchParams } from "next/navigation";

const SearchField = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const theme: CssVarsTheme = useTheme();

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
            placeholder="What are you going to watch today?"
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
