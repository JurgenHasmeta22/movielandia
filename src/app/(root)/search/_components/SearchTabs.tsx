"use client";

import { Box, Typography } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { useRouter, useSearchParams } from "next/navigation";
import { JSX } from "react";

interface TabOption {
    label: string;
    icon: JSX.Element;
    value: string;
}

const tabOptions: TabOption[] = [
    { label: "All", icon: <AllInclusiveIcon />, value: "all" },
    { label: "Movies", icon: <LocalMoviesIcon />, value: "movies" },
    { label: "Series", icon: <LiveTvIcon />, value: "series" },
    { label: "Seasons", icon: <PlaylistPlayIcon />, value: "seasons" },
    { label: "Episodes", icon: <PlayCircleOutlineIcon />, value: "episodes" },
    { label: "Actors", icon: <PersonIcon />, value: "actors" },
    { label: "Crew", icon: <GroupWorkIcon />, value: "crew" },
    { label: "Users", icon: <PersonOutlineIcon />, value: "users" },
];

export default function SearchTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedFilters = searchParams.get("filters")?.split(",") || ["all"];

    const handleTabClick = (value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        let newFilters: string[];

        if (value === "all") {
            newFilters = ["all"];
        } else {
            if (selectedFilters.includes("all")) {
                // If "all" was selected, replace it with the clicked filter
                newFilters = [value];
            } else {
                if (selectedFilters.includes(value)) {
                    // Remove the value if it was already selected
                    newFilters = selectedFilters.filter((f) => f !== value);
                    // If no filters left, default to "all"
                    if (newFilters.length === 0) newFilters = ["all"];
                } else {
                    // Add the new value to existing filters
                    newFilters = [...selectedFilters, value];
                }
            }
        }

        current.set("filters", newFilters.join(","));
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${window.location.pathname}${query}`, { scroll: false });
    };

    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    p: 1,
                    flexWrap: "nowrap",
                }}
            >
                {tabOptions.map((tab) => (
                    <Box
                        key={tab.value}
                        onClick={() => handleTabClick(tab.value)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: { xs: 1.5, sm: 2 },
                            py: 1,
                            borderRadius: 1,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s",
                            bgcolor: selectedFilters.includes(tab.value) ? "primary.main" : "transparent",
                            color: selectedFilters.includes(tab.value) ? "primary.contrastText" : "text.primary",
                            "&:hover": {
                                bgcolor: selectedFilters.includes(tab.value) ? "primary.light" : "action.hover",
                            },
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.25rem",
                            },
                        }}
                    >
                        {tab.icon}
                        <Typography
                            sx={{
                                fontSize: { xs: "0.875rem", sm: "0.875rem" },
                                fontWeight: selectedFilters.includes(tab.value) ? 600 : 400,
                            }}
                        >
                            {tab.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
