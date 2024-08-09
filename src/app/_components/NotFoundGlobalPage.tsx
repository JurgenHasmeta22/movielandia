"use client";

import { Box, CssVarsTheme, Link, Typography, useTheme } from "@mui/material";

export default function NotFoundGlobalPage() {
    const theme: CssVarsTheme = useTheme();

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
                <Typography variant="h1" component="h1" gutterBottom sx={{ color: theme.vars.palette.primary.main }}>
                    404
                </Typography>
                <Typography variant="h2" component="h2" gutterBottom sx={{ color: theme.vars.palette.primary.main }}>
                    Ooops, page not found.
                </Typography>
                <Typography variant="h4" component="p" sx={{ color: theme.vars.palette.primary.main }}>
                    The page you are looking for might have been removed, or is temporarily unavailable.
                </Typography>
                <Link href={"/"} style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}>
                    Go back home
                </Link>
            </Box>
        </Box>
    );
}
