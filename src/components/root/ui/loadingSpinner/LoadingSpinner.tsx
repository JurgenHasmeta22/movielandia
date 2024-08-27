"use client";

import React from "react";
import { CircularProgress, Box } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";

const LoadingSpinner: React.FC = () => {
    const theme = useTheme();

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
