"use client";

import { Tab, Tabs, Paper } from "@mui/material";
import { Options, useQueryState } from "nuqs";
import { JSX } from "react";

interface ProfileTabsProps {
    mainTabs: any[];
    subTabs: Record<string, string[]>;
    currentMainTab: number;
    currentSubTab: number;
    getSubTabIcon: (label: string) => JSX.Element;
    setMainTab: (
        value: string | ((old: string) => string | null) | null,
        options?: Options,
    ) => Promise<URLSearchParams>;
    setSubTab: (value: string | ((old: string) => string | null) | null, options?: Options) => Promise<URLSearchParams>;
}

export default function ProfileTabs({
    mainTabs,
    subTabs,
    getSubTabIcon,
    currentMainTab,
    currentSubTab,
    setMainTab,
    setSubTab,
}: ProfileTabsProps) {
    const [search, setSearch] = useQueryState("search", {
        defaultValue: "",
        parse: (value) => value || "",
        history: "push",
        shallow: false,
    });

    const [page, setPage] = useQueryState("page", {
        defaultValue: "1",
        parse: (value) => Number(value) || "1",
        history: "push",
        shallow: false,
    });

    const updateURL = (mainTabValue: string, subTabValue: string) => {
        const cleanSubTabValue = subTabValue.toLowerCase().replace(/\s+/g, "");
        setPage(null);
        setSearch(null);
        setMainTab(mainTabValue);
        setSubTab(cleanSubTabValue);
    };

    const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
        const mainTabParam = mainTabs[newValue].param;
        const firstSubTab = subTabs[mainTabParam as keyof typeof subTabs][0];
        updateURL(mainTabParam, firstSubTab);
    };

    const handleSubTabChange = (_: React.SyntheticEvent, newValue: number) => {
        const mainTabParam = mainTabs[currentMainTab].param;
        const selectedSubTab = subTabs[mainTabParam as keyof typeof subTabs][newValue];
        updateURL(mainTabParam, selectedSubTab);
    };

    return (
        <Paper
            elevation={1}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: (theme) => theme.shadows[3],
                },
            }}
        >
            <Tabs
                value={currentMainTab}
                onChange={handleMainTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    borderBottom: 2,
                    borderColor: "divider",
                    "& .MuiTabs-flexContainer": {
                        display: "flex",
                        "& > button": {
                            flex: 1,
                            maxWidth: "none",
                        },
                    },
                    "& .MuiTab-root": {
                        minHeight: 48,
                        textTransform: "none",
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        transition: "all 0.2s",
                        borderRight: "1px solid",
                        borderColor: "divider",
                        px: { xs: 1, sm: 2 },
                        py: 1,
                        margin: 0,
                        minWidth: 0,
                        "&:hover": {
                            bgcolor: "action.hover",
                            color: "primary.main",
                        },
                        "&:last-child": {
                            borderRight: "none",
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: "1.25rem",
                        },
                    },
                    "& .Mui-selected": {
                        fontWeight: 600,
                        bgcolor: "action.selected",
                        "&:hover": {
                            bgcolor: "action.selected",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        height: 2,
                    },
                }}
            >
                {mainTabs.map((tab) => (
                    <Tab key={tab.label} icon={tab.icon} label={tab.label} iconPosition="start" sx={{ gap: 0.5 }} />
                ))}
            </Tabs>
            <Tabs
                value={currentSubTab}
                onChange={handleSubTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    minHeight: 48,
                    borderBottom: 1,
                    borderColor: "divider",
                    "& .MuiTabs-flexContainer": {
                        display: "flex",
                        "& > button": {
                            flex: 1,
                            maxWidth: "none",
                        },
                    },
                    "& .MuiTab-root": {
                        minHeight: 48,
                        textTransform: "none",
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        px: { xs: 1, sm: 2 },
                        py: 1,
                        margin: 0,
                        minWidth: 0,
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: "action.hover",
                            color: "primary.main",
                        },
                    },
                    "& .Mui-selected": {
                        fontWeight: 500,
                        bgcolor: "action.selected",
                        "&:hover": {
                            bgcolor: "action.selected",
                        },
                    },
                    "& .MuiTabs-indicator": {
                        height: 2,
                    },
                }}
            >
                {subTabs[mainTabs[currentMainTab].param as keyof typeof subTabs].map((label) => (
                    <Tab key={label} label={label} icon={getSubTabIcon(label)} iconPosition="start" sx={{ gap: 0.5 }} />
                ))}
            </Tabs>
        </Paper>
    );
}
