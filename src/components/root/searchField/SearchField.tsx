"use client";

import React, { useState } from "react";
import { TextField, InputAdornment, useTheme, IconButton } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import type {} from "@mui/material/themeCssVarsAugmentation";

const SearchField = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState(searchParams.get("term") || "");

    const theme = useTheme();

    const handleSearch = () => {
        if (inputValue) {
            router.push(`/search?term=${encodeURIComponent(inputValue)}`);
        } else {
            router.push("/search");
        }
    };

    const handleClear = () => {
        setInputValue("");
        router.push("/search");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
            <TextField
                placeholder="Search for anything..."
                size="small"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
                        endAdornment: (
                            <InputAdornment position="end">
                                <Clear sx={{ cursor: "pointer" }} onClick={handleClear} aria-label="clear search" />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </form>
    );
};

export default SearchField;
