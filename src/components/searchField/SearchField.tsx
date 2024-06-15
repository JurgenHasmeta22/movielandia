"use client";

import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Clear, Search } from "@mui/icons-material";

const SearchField = () => {
    return (
        <TextField
            placeholder="What are you going to watch today?"
            size="small"
            InputProps={{
                color: "secondary",
                sx: { py: 0.5 },
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
