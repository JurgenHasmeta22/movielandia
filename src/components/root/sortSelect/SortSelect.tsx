"use client";

import React from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useSorting } from "@/hooks/useSorting";
import { getSortOptions } from "@/components/root/sortSelect/getSortingOptions";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";

interface ISortSelectProps {
	sortBy: string;
	ascOrDesc: string;
	type: string;
	dataType: string;
}

export default function SortSelect({
	sortBy,
	ascOrDesc,
	type,
	dataType,
}: ISortSelectProps) {
	const { handleChangeSorting, isPending } = useSorting(dataType);
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
		handleChangeSorting({
			sortBy: newSortBy,
			ascOrDesc: ascOrDesc || "asc",
		});
	};

	const handleOrderChange = (event: any) => {
		const newAscOrDesc = event.target.value as string;
		handleChangeSorting({ sortBy, ascOrDesc: newAscOrDesc });
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 2,
				position: "relative",
				opacity: isPending ? 0.6 : 1,
				pointerEvents: isPending ? "none" : "auto",
			}}
		>
			<FormControl size="small" sx={{ minWidth: 150 }}>
				<InputLabel id="sort-by-label">Sort By</InputLabel>
				<Select
					labelId="sort-by-label"
					value={sortBy || defaultValue}
					label="Sort By"
					onChange={handleSortTypeChange}
					displayEmpty
					startAdornment={
						<SwapVertIcon fontSize="small" sx={{ mr: 1 }} />
					}
					MenuProps={{
						disableScrollLock: true,
					}}
				>
					{sortOptions.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl size="small" sx={{ minWidth: 150 }}>
				<InputLabel id="ordering-label">Order</InputLabel>
				<Select
					labelId="ordering-label"
					value={ascOrDesc || "asc"}
					label="Order"
					onChange={handleOrderChange}
					startAdornment={
						<SortByAlphaIcon fontSize="small" sx={{ mr: 1 }} />
					}
					MenuProps={{
						disableScrollLock: true,
					}}
				>
					<MenuItem value="asc">Ascending</MenuItem>
					<MenuItem value="desc">Descending</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
}
