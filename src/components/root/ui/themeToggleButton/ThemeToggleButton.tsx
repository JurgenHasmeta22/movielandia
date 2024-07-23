"use client";

import React from "react";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@/utils/theme/theme";

const ThemeToggleButton = () => {
    const { mode, toggleMode } = useTheme();
    return <IconButton onClick={toggleMode}>{mode === "dark" ? <Brightness7 /> : <Brightness4 />}</IconButton>;
};

export default ThemeToggleButton;
