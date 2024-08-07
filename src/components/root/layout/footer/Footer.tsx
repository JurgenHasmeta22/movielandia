"use client";

import React from "react";
import { Box, Typography, IconButton, Stack, TextField, Button, useTheme } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Link from "next/link";
import { tokens } from "@/utils/theme/theme";

const Footer = (): React.JSX.Element => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: colors.primary[900],
                color: colors.primary[100],
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
                        <Link href="/movies" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <MovieIcon />
                                <Typography>Movies</Typography>
                            </Stack>
                        </Link>
                        <Link href="/series" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LocalMoviesIcon />
                                <Typography>Series</Typography>
                            </Stack>
                        </Link>
                        <Link href="/genres" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <SubtitlesIcon />
                                <Typography>Genres</Typography>
                            </Stack>
                        </Link>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Account
                    </Typography>
                    <Stack spacing={1} mt={1}>
                        <Link href="/login" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <LockOpenIcon />
                                <Typography>Sign In</Typography>
                            </Stack>
                        </Link>
                        <Link href="/register" style={{ textDecoration: "none", color: colors.primary[100] }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <AppRegistrationIcon />
                                <Typography>Sign Up</Typography>
                            </Stack>
                        </Link>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Follow Us
                    </Typography>
                    <Stack direction="row" spacing={2} mt={1}>
                        <IconButton href="https://facebook.com" target="_blank" rel="noopener">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton href="https://twitter.com" target="_blank" rel="noopener">
                            <TwitterIcon />
                        </IconButton>
                        <IconButton href="https://instagram.com" target="_blank" rel="noopener">
                            <InstagramIcon />
                        </IconButton>
                        <IconButton href="https://youtube.com" target="_blank" rel="noopener">
                            <YouTubeIcon />
                        </IconButton>
                    </Stack>
                </Box>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Newsletter
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                        <TextField variant="outlined" size="small" placeholder="Email" />
                        <Button
                            variant="contained"
                            sx={{
                                py: 1.2,
                                px: 3,
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
