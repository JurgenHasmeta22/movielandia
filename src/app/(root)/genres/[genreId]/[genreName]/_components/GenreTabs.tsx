"use client";

import { ButtonBase, Box } from "@mui/material";
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
			role="group"
			aria-label="Filter by type"
			sx={{
				display: "inline-flex",
				gap: 0.5,
				p: 0.5,
				mb: { xs: 4, md: 5 },
				borderRadius: 999,
				border: "1px solid",
				borderColor: "divider",
				backgroundColor: "background.paper",
			}}
		>
			{tabOptions.map((tab) => {
				const isSelected = selectedFilters.includes(tab.value);

				return (
					<ButtonBase
						key={tab.value}
						onClick={() => handleTabClick(tab.value)}
						aria-pressed={isSelected}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 0.75,
							px: { xs: 1.75, sm: 2.25 },
							py: { xs: 0.9, sm: 1 },
							borderRadius: 999,
							fontFamily: "inherit",
							fontWeight: 600,
							fontSize: { xs: "0.85rem", sm: "0.9rem" },
							lineHeight: 1,
							transition: "all 0.2s ease",
							bgcolor: isSelected ? "#FFB224" : "transparent",
							color: isSelected ? "#1A1100" : "text.primary",
							"&:hover": {
								bgcolor: isSelected
									? "#FFCB6B"
									: "rgba(255, 178, 36, 0.12)",
							},
							"& .MuiSvgIcon-root": {
								fontSize: { xs: "1.1rem", sm: "1.2rem" },
							},
						}}
					>
						{tab.icon}
						{tab.label}
					</ButtonBase>
				);
			})}
		</Box>
	);
};

export default GenreTabs;
