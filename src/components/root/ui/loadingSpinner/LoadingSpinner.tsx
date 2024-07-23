"use client";

import React from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";
import { tokens } from "@/utils/theme/theme";

const LoadingSpinner: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

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
                    color: colors.primary[100],
                }}
            />
        </Box>
    );
};

export default LoadingSpinner;
