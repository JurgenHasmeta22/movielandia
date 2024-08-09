"use client";

import React from "react";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useStore } from "@/store/store";
import { localStorageSet } from "@/utils/helpers/localStorage";

const ThemeToggleButton = () => {
    const { isDarkMode, setIsDarkMode } = useStore();

    return (
        <IconButton
            onClick={() => {
                setIsDarkMode(!isDarkMode);
                localStorageSet("darkMode", !isDarkMode);
            }}
        >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
};

export default ThemeToggleButton;
