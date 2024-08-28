"use client";

import { Link, Typography } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Container from "@mui/material-pigment-css/Container";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

export default function NotFoundGlobalPage() {
    const theme = useTheme();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 10,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    placeContent: "center",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "neutral.200",
                    backgroundColor: "background.paper",
                    padding: 6,
                    boxShadow: "3px",
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
                    <Box
                        sx={{
                            marginTop: 4,
                        }}
                    >
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
