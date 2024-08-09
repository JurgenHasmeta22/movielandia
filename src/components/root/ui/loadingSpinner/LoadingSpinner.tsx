"use client";

import React from "react";
import { CircularProgress, Box, useTheme, CssVarsTheme } from "@mui/material";

const LoadingSpinner: React.FC = () => {
    const theme: CssVarsTheme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                    color: theme.vars.palette.primary.main,
                }}
            />
        </Box>
    );
};

export default LoadingSpinner;
