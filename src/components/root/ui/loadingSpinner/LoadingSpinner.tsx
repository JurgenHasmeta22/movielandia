"use client";

import React from "react";
import { CircularProgress, Box, useTheme } from "@mui/material";
import { tokens } from "@/utils/theme";

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
                color: colors.primary[100],
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner;
