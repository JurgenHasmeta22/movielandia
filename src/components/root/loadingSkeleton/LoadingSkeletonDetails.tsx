"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingSkeletonDetails() {
    return (
        <Box sx={{ width: "100%", maxWidth: "1200px", m: "0 auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
            {/* Movie header: Poster and details */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={4}>
                {/* Poster Skeleton */}
                <Skeleton
                    variant="rectangular"
                    sx={{ width: { xs: "100%", md: 214 }, height: { xs: 300, md: 317 }, borderRadius: 2 }}
                />

                {/* Details Skeleton */}
                <Stack spacing={2} flex={1}>
                    {/* Title Skeleton */}
                    <Skeleton variant="text" sx={{ width: "80%", height: 40 }} />
                    {/* Genre Chips Skeleton */}
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rectangular" sx={{ width: 80, height: 32, borderRadius: 1 }} />
                        <Skeleton variant="rectangular" sx={{ width: 80, height: 32, borderRadius: 1 }} />
                        <Skeleton variant="rectangular" sx={{ width: 80, height: 32, borderRadius: 1 }} />
                    </Stack>
                    {/* Rating and Date Skeleton */}
                    <Skeleton variant="text" sx={{ width: "50%", height: 30 }} />
                    {/* Description Skeleton */}
                    <Skeleton variant="rectangular" sx={{ width: "100%", height: 150, borderRadius: 2 }} />
                </Stack>
            </Stack>

            {/* Reviews Section Skeleton */}
            <Box mb={4}>
                <Skeleton variant="text" sx={{ width: "40%", height: 30 }} />
                <Stack spacing={2} mt={2}>
                    {Array.from(new Array(3)).map((_, index) => (
                        <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Skeleton variant="text" sx={{ width: "60%", height: 20 }} />
                            <Skeleton variant="rectangular" sx={{ width: "100%", height: 60, borderRadius: 1 }} />
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Section 3: Movie List (12 items in 2 rows of 6) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                {Array.from(new Array(12)).map((_, index) => (
                    <Box key={index} sx={{ flex: "1 1 calc(16.66% - 16px)" }}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: { xs: 210, sm: 240 } }} />
                    </Box>
                ))}
            </Box>

            {/* Section 4: Pagination */}
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <Skeleton variant="rectangular" sx={{ width: 200, height: 40 }} />
            </Stack>
        </Box>
    );
}
