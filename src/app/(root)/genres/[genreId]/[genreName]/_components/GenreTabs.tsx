"use client";

import { Box, Typography } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { JSX } from "react";
import { useQueryState } from "nuqs";

interface TabOption {
	label: string;
	icon: JSX.Element;
	value: string;
}

const tabOptions: TabOption[] = [
	{ label: "All", icon: <AllInclusiveIcon />, value: "all" },
	{ label: "Movies", icon: <LocalMoviesIcon />, value: "movies" },
	{ label: "Series", icon: <LiveTvIcon />, value: "series" },
];

const GenreTabs = () => {
	const [filters, setFilters] = useQueryState("filters", {
		defaultValue: "all",
		parse: (value) => value || "all",
		history: "push",
		shallow: false,
	});

	const selectedFilters = filters?.split(",") || ["all"];

	const handleTabClick = (value: string) => {
		let newFilters: string[];

		if (value === "all") {
			newFilters = ["all"];
		} else {
			if (selectedFilters.includes("all")) {
				newFilters = [value];
			} else {
				if (selectedFilters.includes(value)) {
					newFilters = selectedFilters.filter((f) => f !== value);
					if (newFilters.length === 0) newFilters = ["all"];
				} else {
					newFilters = [...selectedFilters, value];
				}
			}

			// If both Movies and Series are selected, set to "all"
			const nonAll = newFilters.filter((f) => f !== "all");

			if (
				nonAll.length === 2 &&
				nonAll.includes("movies") &&
				nonAll.includes("series")
			) {
				newFilters = ["all"];
			}
		}

		setFilters(newFilters.join(","));
	};

	return (
		<Box
			sx={{
				width: "100%",
				borderBottom: 1,
				borderColor: "divider",
				position: "relative",
				mb: 4,
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					gap: 1,
					p: { xs: 1, sm: 1.5 },
					pb: { xs: 2, sm: 2.5 },
					mx: -1,
					justifyContent: { xs: "center", sm: "flex-start" },
				}}
			>
				{tabOptions.map((tab) => (
					<Box
						key={tab.value}
						onClick={() => handleTabClick(tab.value)}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.75,
							px: { xs: 1.25, sm: 1.5 },
							py: { xs: 0.75, sm: 1 },
							borderRadius: 1,
							cursor: "pointer",
							transition: "all 0.2s",
							bgcolor: selectedFilters.includes(tab.value)
								? "primary.main"
								: "transparent",
							color: selectedFilters.includes(tab.value)
								? "primary.contrastText"
								: "text.primary",
							"&:hover": {
								bgcolor: selectedFilters.includes(tab.value)
									? "primary.light"
									: "action.hover",
							},
							"& .MuiSvgIcon-root": {
								fontSize: { xs: "1.1rem", sm: "1.25rem" },
							},
							boxShadow: selectedFilters.includes(tab.value)
								? 1
								: "none",
							transform: selectedFilters.includes(tab.value)
								? "scale(1.02)"
								: "scale(1)",
							"&:active": {
								transform: "scale(0.98)",
							},
						}}
					>
						{tab.icon}
						<Typography
							sx={{
								fontSize: { xs: "0.8125rem", sm: "0.875rem" },
								fontWeight: selectedFilters.includes(tab.value)
									? 600
									: 400,
								lineHeight: 1,
							}}
						>
							{tab.label}
						</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default GenreTabs;
