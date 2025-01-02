"use client";

import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";

const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                bgcolor: "background.default",
                gap: 5,
            }}
        >
            <Box
                sx={{
                    width: { xs: 240, sm: 320 },
                    height: 120,
                    position: "relative",
                }}
            >
                <Image
                    src="/icons/movielandia24-logo.png"
                    alt="MovieLandia24 Loading"
                    width={320}
                    height={120}
                    priority
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner;
