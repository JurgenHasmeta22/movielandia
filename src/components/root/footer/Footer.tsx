"use client";

import React from "react";
import { Box, Typography, IconButton, Stack, TextField, Button, useTheme, Container, Divider } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import InfoIcon from "@mui/icons-material/Info";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { motion } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const FooterLink = ({ href, icon: Icon, text }: { href: string; icon: any; text: string }) => {
    const theme = useTheme();
    return (
        <Button
            component={MuiNextLink}
            href={href}
            prefetch={false}
            sx={{
                textDecoration: "none",
                textTransform: "capitalize",
                color: theme.vars.palette.primary.main,
                transition: "all 0.2s ease-in-out",
                minWidth: "160px",
                justifyContent: "flex-start",
                "&:hover": {
                    transform: "translateX(8px)",
                    color: theme.vars.palette.red.main,
                },
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: "100%" }}>
                <Icon sx={{ fontSize: 20, minWidth: "24px" }} />
                <Typography variant="body1">{text}</Typography>
            </Stack>
        </Button>
    );
};

const SocialButton = ({ href, icon: Icon }: { href: string; icon: any }) => {
    const theme = useTheme();
    return (
        <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            href={href}
            target="_blank"
            rel="noopener"
            sx={{
                color: theme.vars.palette.primary.main,
                transition: "all 0.2s ease-in-out",
                padding: "8px",
                "&:hover": {
                    color: theme.vars.palette.red.main,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
            }}
        >
            <Icon />
        </IconButton>
    );
};

const Footer = (): React.JSX.Element => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.vars.palette.primary.dark,
                color: theme.vars.palette.primary.main,
                py: 6,
                borderTop: `1px solid ${theme.vars.palette.divider}`,
            }}
            component="footer"
        >
            <Container maxWidth="lg">
                <Stack spacing={6}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 6, sm: 2, md: 8 }}
                        sx={{ justifyContent: "space-between" }}
                    >
                        <Box sx={{ minWidth: 160 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, pl: "12px" }}>
                                Explore
                            </Typography>
                            <Stack spacing={1}>
                                <FooterLink href="/movies" icon={MovieIcon} text="Movies" />
                                <FooterLink href="/series" icon={LocalMoviesIcon} text="Series" />
                                <FooterLink href="/genres" icon={SubtitlesIcon} text="Genres" />
                                <FooterLink href="/actors" icon={RecentActorsIcon} text="Actors" />
                                <FooterLink href="/about-us" icon={InfoIcon} text="About Us" />
                                <FooterLink href="/contact-us" icon={ContactSupportIcon} text="Contact Us" />
                            </Stack>
                        </Box>

                        <Box sx={{ minWidth: 160 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, pl: "12px" }}>
                                Account
                            </Typography>
                            <Stack spacing={1}>
                                <FooterLink href="/login" icon={LockOpenIcon} text="Sign In" />
                                <FooterLink href="/register" icon={AppRegistrationIcon} text="Sign Up" />
                            </Stack>
                        </Box>

                        <Box sx={{ minWidth: 160 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, pl: "12px" }}>
                                Follow Us
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    pl: "4px",
                                    "& .MuiIconButton-root": {
                                        ml: "4px",
                                    },
                                }}
                            >
                                <SocialButton href="https://facebook.com" icon={FacebookIcon} />
                                <SocialButton href="https://twitter.com" icon={TwitterIcon} />
                                <SocialButton href="https://instagram.com" icon={InstagramIcon} />
                            </Stack>
                        </Box>

                        <Box sx={{ maxWidth: 300 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Newsletter
                            </Typography>
                            <Stack spacing={2}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter your email"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: theme.vars.palette.red.main,
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: theme.vars.palette.red.main,
                                            },
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: theme.vars.palette.primary.main,
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        py: 1,
                                        color: theme.vars.palette.secondary.light,
                                        bgcolor: theme.vars.palette.red.main,
                                        "&:hover": {
                                            bgcolor: theme.vars.palette.red.dark,
                                        },
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>

                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            2024 MovieLandia24. All rights reserved.
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Typography
                                variant="body2"
                                component={MuiNextLink}
                                href="/privacy"
                                sx={{
                                    opacity: 0.8,
                                    textDecoration: "none",
                                    "&:hover": { color: theme.vars.palette.red.main },
                                }}
                            >
                                Privacy Policy
                            </Typography>
                            <Typography
                                variant="body2"
                                component={MuiNextLink}
                                href="/terms"
                                sx={{
                                    opacity: 0.8,
                                    textDecoration: "none",
                                    "&:hover": { color: theme.vars.palette.red.main },
                                }}
                            >
                                Terms of Service
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
