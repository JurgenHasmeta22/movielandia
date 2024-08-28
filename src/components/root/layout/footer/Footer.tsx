"use client";

import React from "react";
import { Typography, IconButton, TextField, Button } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import MuiNextLink from "../../ui/muiNextLink/MuiNextLink";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

const Footer = (): React.JSX.Element => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: theme.vars.palette.primary.dark,
                color: theme.vars.palette.primary.main,
                justifyContent: "center",
                paddingTop: 2,
                paddingBottom: 2,
                gap: 2,
                paddingLeft: 2,
                paddingRight: 2,
            }}
            component="footer"
        >
            <Stack
                sx={{
                    display: "flex",
                    rowGap: 8,
                    columnGap: 4,
                    flexDirection: "row",
                    lexWrap: "wrap",
                    justifyContent: "center",
                    marginBottom: 1,
                }}
            >
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Explore
                    </Typography>
                    <Stack spacing={1} sx={{ paddingTop: 1 }}>
                        <Button
                            component={MuiNextLink}
                            href="/movies"
                            prefetch={false}
                            style={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <MovieIcon />
                                <Typography>Movies</Typography>
                            </Stack>
                        </Button>
                        <Button
                            component={MuiNextLink}
                            href="/series"
                            prefetch={false}
                            style={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <LocalMoviesIcon />
                                <Typography>Series</Typography>
                            </Stack>
                        </Button>
                        <Button
                            component={MuiNextLink}
                            href="/genres"
                            prefetch={false}
                            style={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <SubtitlesIcon />
                                <Typography>Genres</Typography>
                            </Stack>
                        </Button>
                        <Button
                            component={MuiNextLink}
                            href="/actors"
                            prefetch={false}
                            style={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <RecentActorsIcon />
                                <Typography>Actors</Typography>
                            </Stack>
                        </Button>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Account
                    </Typography>
                    <Stack spacing={1} sx={{ paddingTop: 1 }}>
                        <Button
                            component={MuiNextLink}
                            href="/login"
                            prefetch={false}
                            sx={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <LockOpenIcon />
                                <Typography>Sign In</Typography>
                            </Stack>
                        </Button>
                        <Button
                            component={MuiNextLink}
                            href="/register"
                            prefetch={false}
                            style={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <AppRegistrationIcon />
                                <Typography>Sign Up</Typography>
                            </Stack>
                        </Button>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Follow Us
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ paddingTop: 1 }}>
                        <IconButton href="https://facebook.com" target="_blank" rel="noopener">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton href="https://twitter.com" target="_blank" rel="noopener">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton href="https://instagram.com" target="_blank" rel="noopener">
                            <InstagramIcon />
                        </IconButton>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Newsletter
                    </Typography>
                    <Stack
                        spacing={1}
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: 1 }}
                    >
                        <TextField variant="outlined" size="small" placeholder="Email" />
                        <Button
                            variant="contained"
                            sx={{
                                py: 1.2,
                                px: 3,
                                color: theme.vars.palette.secondary.light,
                                bgcolor: theme.vars.palette.red.main,
                                "&:hover": {
                                    color: theme.vars.palette.blue.main,
                                    bgcolor: theme.vars.palette.primary.light,
                                },
                            }}
                        >
                            Subscribe
                        </Button>
                    </Stack>
                </Box>
            </Stack>
            <Box
                sx={{
                    paddingTop: 2,
                }}
            >
                <Typography variant="body2">Copyright © 2024 | MovieLandia24</Typography>
            </Box>
        </Box>
    );
};

export default Footer;
