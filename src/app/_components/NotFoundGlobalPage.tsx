"use client";

import { Box, Container, CssVarsTheme, Link, Typography, useTheme } from "@mui/material";

export default function NotFoundGlobalPage() {
    const theme: CssVarsTheme = useTheme();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    my: 20,
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    placeContent: "center",
                    borderRadius: 2,
                    border: 1,
                    borderColor: "neutral.200",
                    bgcolor: "background.paper",
                    p: 6,
                    boxShadow: 3,
                    transition: "background-color 0.5s ease",
                }}
            >
                <Box>
                    <Typography
                        component="h1"
                        fontSize={60}
                        sx={{ color: theme.vars.palette.primary.main }}
                        textAlign={"center"}
                    >
                        404
                    </Typography>
                    <Typography
                        variant="h2"
                        component="h2"
                        gutterBottom
                        sx={{ color: theme.vars.palette.primary.main }}
                    >
                        Page not found.
                    </Typography>
                    <Typography variant="h5" component="p" sx={{ color: theme.vars.palette.primary.main }}>
                        The page you are looking for might have been removed, or is temporarily unavailable.
                    </Typography>
                    <Box mt={4}>
                        <Link
                            href={"/"}
                            style={{
                                textDecoration: "none",
                                color: theme.vars.palette.primary.main,
                                padding: 12,
                                borderRadius: 20,
                                border: "1px solid",
                            }}
                        >
                            Go back home
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
