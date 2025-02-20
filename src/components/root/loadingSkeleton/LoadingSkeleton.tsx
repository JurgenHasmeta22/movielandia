"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";

const LoadingSkeleton = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: { xs: 1, sm: 2, md: 3 },
                rowGap: { xs: 3, sm: 4, md: 5 },
                justifyContent: { xs: "center", md: "flex-start" },
                mx: { xs: 1, sm: 2 },
                mb: { xs: 3, md: 4 },
                pt: 2,
            }}
        >
            {Array.from({ length: 12 }).map((_, index) => (
                <Box key={index} sx={{ width: { xs: "140px", sm: "160px" } }}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        sx={{ height: { xs: 210, sm: 240 } }}
                        animation="wave"
                    />
                </Box>
            ))}
        </Box>
    );
};

export default LoadingSkeleton;
