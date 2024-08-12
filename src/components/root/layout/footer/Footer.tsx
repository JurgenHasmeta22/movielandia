"use client";

import React from "react";
import { Box, Typography, IconButton, Stack, TextField, Button, useTheme, CssVarsTheme } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MuiNextLink from "../../ui/muiNextLink/MuiNextLink";
import RecentActorsIcon from "@mui/icons-material/RecentActors";

const Footer = (): React.JSX.Element => {
    const theme: CssVarsTheme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: theme.vars.palette.primary.dark,
                color: theme.vars.palette.primary.main,
                justifyContent: "center",
                py: 4,
                gap: 2,
                pl: 2,
                pr: 2,
            }}
            component="footer"
        >
            <Stack direction="row" rowGap={8} columnGap={4} sx={{ flexWrap: "wrap", justifyContent: "center", mb: 1 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Explore
                    </Typography>
                    <Stack spacing={1} pt={1}>
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
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                    <Stack spacing={1} pt={1}>
                        <Button
                            component={MuiNextLink}
                            href="/login"
                            prefetch={false}
                            style={{
                                textDecoration: "none",
                                textTransform: "capitalize",
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                            <Stack direction="row" alignItems="center" spacing={1}>
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
                    <Stack direction="row" spacing={1} pt={1}>
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
                    <Stack direction="row" spacing={1} alignItems="center" pt={1}>
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
                    pt: 2,
                }}
            >
                <Typography variant="body2">Copyright © 2024 | MovieLandia24</Typography>
            </Box>
        </Box>
    );
};

export default Footer;
