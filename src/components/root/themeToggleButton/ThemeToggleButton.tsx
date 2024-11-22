"use client";

import React, { useEffect, useState } from "react";
import { IconButton, useColorScheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const SwitchThemeButton = () => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleModeChange() {
        setColorScheme(colorScheme === "light" ? "dark" : "light");
    }

    if (!mounted) {
        return (
            <IconButton sx={{ visibility: "hidden" }}>
                <DarkMode />
            </IconButton>
        );
    }

    return (
        <IconButton
            onClick={handleModeChange}
            sx={{
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "rotate(180deg)",
                },
            }}
        >
            {colorScheme === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
    );
};

export default SwitchThemeButton;
