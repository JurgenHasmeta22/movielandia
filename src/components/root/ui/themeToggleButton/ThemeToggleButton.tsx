"use client";

import React from "react";
import { IconButton, useColorScheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const SwitchThemeButton = () => {
    const { mode, setMode } = useColorScheme();
    const alternativeScheme = mode === "light" ? "dark" : "light";

    return (
        <IconButton onClick={() => setMode(alternativeScheme)}>
            {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
    );
};

export default SwitchThemeButton;
