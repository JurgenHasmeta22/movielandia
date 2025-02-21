"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingSkeleton() {
    return (
        <Box sx={{ width: "100%", maxWidth: "1200px", m: "0 auto", p: 2 }}>
            {/* Section 1: Carousel with overlay text, extra top margin */}
            <Box sx={{ position: "relative", mt: 8, mb: 4 }}>
                <Skeleton variant="rectangular" sx={{ width: "100%", height: { xs: "40vh", md: "60vh" } }} />
                <Box sx={{ position: "absolute", bottom: 16, left: 16 }}>
                    <Skeleton variant="text" sx={{ width: "30%", height: 32 }} />
                </Box>
            </Box>

            {/* Section 2: Movies Header with SortSelect on the right */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Skeleton variant="text" sx={{ width: "25%", height: 48 }} />
                <Stack direction="row" spacing={2}>
                    <Skeleton variant="rectangular" sx={{ width: 150, height: 40 }} />
                    <Skeleton variant="rectangular" sx={{ width: 150, height: 40 }} />
                </Stack>
            </Box>

            {/* Section 3: Movie List Section (12 movies => 2 rows of 6) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                {Array.from(new Array(12)).map((_, index) => (
                    <Box key={index} sx={{ flex: "1 1 calc(16.66% - 16px)" }}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: 150 }} />
                        <Skeleton variant="text" sx={{ width: "80%", height: 24, mt: 1 }} />
                        <Skeleton variant="text" sx={{ width: "60%", height: 24 }} />
                    </Box>
                ))}
            </Box>

            {/* Section 4: Pagination Skeleton */}
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <Skeleton variant="rectangular" sx={{ width: 200, height: 40 }} />
            </Stack>

            {/* Section 5: Latest List Section */}
            <Box>
                {/* Latest List Header with narrower width */}
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="text" sx={{ width: "20%", height: 32 }} />
                </Box>
                {/* Latest List Grid (12 movies => 2 rows of 6) */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {Array.from(new Array(12)).map((_, index) => (
                        <Box key={index} sx={{ flex: "1 1 calc(16.66% - 16px)" }}>
                            <Skeleton variant="rectangular" sx={{ width: "100%", height: 150 }} />
                            <Skeleton variant="text" sx={{ width: "80%", height: 24, mt: 1 }} />
                            <Skeleton variant="text" sx={{ width: "60%", height: 24 }} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
