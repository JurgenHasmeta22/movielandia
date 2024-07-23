"use client";

import React from "react";
import { TextField, InputAdornment, useTheme } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import { tokens } from "@/utils/theme/theme";

const SearchField = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <TextField
            placeholder="What are you going to watch today?"
            size="small"
            InputProps={{
                sx: { py: 0.5, color: colors.primary[100] },
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <Clear sx={{ cursor: "pointer" }} />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchField;
