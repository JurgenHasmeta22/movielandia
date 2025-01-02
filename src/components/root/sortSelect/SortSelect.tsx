"use client";

import React from "react";
import { Box, Select, MenuItem, SvgIcon, Typography, FormControl, InputLabel } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useSorting } from "@/hooks/useSorting";
import { getSortOptions } from "@/components/root/sortSelect/getSortingOptions";

interface ISortSelectProps {
    sortBy: string;
    ascOrDesc: string;
    type: string;
    dataType: string;
}

export default function SortSelect({ sortBy, ascOrDesc, type, dataType }: ISortSelectProps) {
    const handleChangeSorting = useSorting(dataType);
    const sortOptions = getSortOptions(type, dataType);

    const getDefaultSortByField = (typeEntity: string): string => {
        switch (typeEntity) {
            case "movies":
            case "episodes":
            case "seasons":
            case "series":
                return "title";
            case "actors":
            case "crew":
                return "fullname";
            case "users":
                return "userName";
            case "genres":
                return "name";
            case "details":
                return "createdAt";
            default:
                return "createdAt";
        }
    };

    const defaultValue = getDefaultSortByField(dataType);

    const handleSortTypeChange = (event: any) => {
        const newSortBy = event.target.value as string;
        handleChangeSorting({ sortBy: newSortBy, ascOrDesc: ascOrDesc || "asc" });
    };

    const handleOrderChange = (event: any) => {
        const newAscOrDesc = event.target.value as string;
        handleChangeSorting({ sortBy, ascOrDesc: newAscOrDesc });
    };

    return (
        <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
            <FormControl>
                <InputLabel
                    id="sort-by-label"
                    sx={{
                        fontSize: 20,
                    }}
                >
                    Sort By
                </InputLabel>
                <Select
                    labelId="sort-by-label"
                    value={sortBy || defaultValue}
                    sx={{
                        mt: 2,
                    }}
                    onChange={handleSortTypeChange}
                    displayEmpty
                    renderValue={(value) => (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <SvgIcon fontSize="small">
                                <SwapVertIcon />
                            </SvgIcon>
                            <Typography fontSize="15px">
                                {sortOptions.find((option) => option.value === value)?.label}
                            </Typography>
                        </Box>
                    )}
                >
                    {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel
                    id="ordering-label"
                    sx={{
                        fontSize: 20,
                    }}
                >
                    Ordering
                </InputLabel>
                <Select
                    labelId="ordering-label"
                    value={ascOrDesc || "asc"}
                    onChange={handleOrderChange}
                    sx={{
                        mt: 2,
                    }}
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
