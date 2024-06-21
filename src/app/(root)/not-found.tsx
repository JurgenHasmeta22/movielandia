"use client";

import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { tokens } from "@/utils/theme";

export default function Custom404() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                py: 4,
            }}
        >
            <Box>
                <Image
                    src="/404-image.svg"
                    alt="404 Error"
                    width={500}
                    height={300}
                    style={{ maxWidth: "100%", height: "auto" }}
                />
                <Typography variant="h2" component="h2" gutterBottom sx={{ color: colors.primary[100] }}>
                    Oops! Page not found.
                </Typography>
                <Typography variant="h4" component="p" sx={{ color: colors.primary[100] }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily
                    unavailable.
                </Typography>
                <Link href="/" passHref>
                    <Button
                        variant="contained"
                        sx={{ mt: 4, color: colors.primary[100], backgroundColor: colors.greenAccent[600] }}
                    >
                        Go to Homepage
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}
