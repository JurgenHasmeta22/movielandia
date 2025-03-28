"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingSkeletonWithLatest() {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1200px",
                m: "0 auto",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    height: {
                        xs: "100vh",
                        sm: "90vh",
                        md: "80vh",
                    },
                    overflow: "hidden",
                    mt: 4,
                    mb: 2,
                    borderRadius: { xs: 0, sm: 2 },
                    boxShadow: { xs: "none", sm: "rgba(0, 0, 0, 0.1) 0px 8px 24px" },
                    backgroundColor: "rgba(20, 20, 20, 0.05)",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        justifyContent: { xs: "flex-start", md: "center" },
                        gap: { xs: 3, sm: 4, md: 6 },
                        pt: { xs: 4, sm: 0 },
                        p: { xs: 2, sm: 3, md: 4 },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            flexShrink: 0,
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: 280,
                                height: 400,
                                borderRadius: "16px",
                                boxShadow: "0 16px 32px rgba(20, 20, 20, 0.25)",
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: { xs: "relative", md: "static" },
                            zIndex: 2,
                            width: "100%",
                            maxWidth: { xs: "100%", md: "50%" },
                            px: { xs: 2, sm: 3, md: 0 },
                        }}
                    >
                        <Skeleton variant="text" sx={{ width: "80%", height: 60, mb: 2 }} />
                        <Skeleton variant="text" sx={{ width: "100%", height: 20, mb: 1 }} />
                        <Skeleton variant="text" sx={{ width: "100%", height: 20, mb: 1 }} />
                        <Skeleton variant="text" sx={{ width: "90%", height: 20, mb: 1 }} />
                        <Skeleton variant="text" sx={{ width: "95%", height: 20, mb: 3 }} />
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                width: 120,
                                height: 45,
                                borderRadius: "8px",
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: "24px", sm: "28px", md: "32px" },
                            left: 0,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            zIndex: 5,
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {[1, 2, 3].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant="circular"
                                    sx={{
                                        width: { xs: 10, sm: 12 },
                                        height: { xs: 10, sm: 12 },
                                        bgcolor: index === 0 ? "#4cceac" : "rgba(224, 224, 224, 0.5)",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>


            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Skeleton variant="text" sx={{ width: "25%", height: 48 }} />
                <Stack direction="row" spacing={2}>
                    <Skeleton variant="rectangular" sx={{ width: 150, height: 50 }} />
                    <Skeleton variant="rectangular" sx={{ width: 150, height: 50 }} />
                </Stack>
            </Box>


            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                {Array.from(new Array(12)).map((_, index) => (
                    <Box key={index} sx={{ flex: "1 1 calc(16.66% - 16px)" }}>
                        <Skeleton variant="rectangular" sx={{ width: "100%", height: { xs: 210, sm: 240 } }} />
                    </Box>
                ))}
            </Box>


            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
                <Skeleton variant="rectangular" sx={{ width: 200, height: 40 }} />
            </Stack>


            <Box>
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="text" sx={{ width: "20%", height: 32 }} />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {Array.from(new Array(12)).map((_, index) => (
                        <Box key={index} sx={{ flex: "1 1 calc(16.66% - 16px)" }}>
                            <Skeleton variant="rectangular" sx={{ width: "100%", height: { xs: 210, sm: 240 } }} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
