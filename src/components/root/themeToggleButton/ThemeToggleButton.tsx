"use client";

import React from "react";
import { IconButton, useColorScheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const SwitchThemeButton = () => {
    const { colorScheme, setColorScheme } = useColorScheme();

    function handleModeChange() {
        setColorScheme(colorScheme === "light" ? "dark" : "light");
    }

    return <IconButton onClick={handleModeChange}>{colorScheme === "dark" ? <LightMode /> : <DarkMode />}</IconButton>;
};

export default SwitchThemeButton;
