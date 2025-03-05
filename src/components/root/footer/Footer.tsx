"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, TextField, Button, useTheme, Container, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { subscribeNewsletter } from "@/actions/auth.actions";
import { showToast } from "@/utils/helpers/toast";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Link from "next/link";
import { FooterLink } from "./FooterLink";
import { SocialButton } from "./SocialButton";

const Footer = (): React.JSX.Element => {
    const theme = useTheme();
    const [email, setEmail] = useState("");

    const handleSubscribe = async () => {
        try {
            const message = await subscribeNewsletter({ email });
            const messageType = message.includes("successful") ? "success" : "error";
            showToast(messageType, message);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            showToast("error", errorMessage);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.vars.palette.primary.dark,
                color: theme.vars.palette.primary.main,
                py: 6,
                borderTop: `1px solid ${theme.vars.palette.divider}`,
                "& a": {
                    textDecoration: "none !important",
                },
            }}
            component="footer"
        >
            <Container maxWidth="lg">
                <Stack spacing={6}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 4, md: 4 }}
                        sx={{
                            width: "100%",
                            alignItems: { xs: "stretch", md: "flex-start" },
                        }}
                    >
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 4, sm: 8 }}
                            sx={{
                                width: { xs: "100%", md: "auto" },
                                flexGrow: 0,
                            }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: "1.25rem", sm: "1.35rem" },
                                        fontWeight: 700,
                                        pl: "12px",
                                        color: theme.vars.palette.red.main,
                                    }}
                                >
                                    Movies & TV
                                </Typography>
                                <Stack spacing={1}>
                                    <FooterLink href="/movies" text="Movies" icon={<MovieIcon />} />
                                    <FooterLink href="/series" text="TV Series" icon={<TvIcon />} />
                                    <FooterLink href="/genres" text="Genres" icon={<CategoryIcon />} />
                                </Stack>
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: "1.25rem", sm: "1.35rem" },
                                        fontWeight: 700,
                                        pl: "12px",
                                        color: theme.vars.palette.red.main,
                                    }}
                                >
                                    Cast & Crew
                                </Typography>
                                <Stack spacing={1}>
                                    <FooterLink href="/actors" text="Actors" icon={<PersonIcon />} />
                                    <FooterLink href="/crew" text="Crew" icon={<GroupIcon />} />
                                </Stack>
                            </Box>
                            <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: "1.25rem", sm: "1.35rem" },
                                        fontWeight: 700,
                                        pl: "12px",
                                        color: theme.vars.palette.red.main,
                                    }}
                                >
                                    Other
                                </Typography>
                                <Stack spacing={1}>
                                    <FooterLink href="/about-us" text="About Us" icon={<InfoIcon />} />
                                    <FooterLink href="/contact-us" text="Contact Us" icon={<ContactMailIcon />} />
                                    <FooterLink href="/login" text="Sign In" icon={<LoginIcon />} />
                                    <FooterLink href="/register" text="Sign Up" icon={<PersonAddIcon />} />
                                </Stack>
                            </Box>
                        </Stack>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 4, sm: 8 }}
                            sx={{
                                width: { xs: "100%", md: "auto" },
                                flexGrow: 0,
                                ml: { md: "auto" },
                            }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: "1.25rem", sm: "1.35rem" },
                                        fontWeight: 700,
                                        pl: "12px",
                                        color: theme.vars.palette.red.main,
                                    }}
                                >
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
                            <Box sx={{ width: { xs: "100%", sm: 300 } }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mb: 2,
                                        fontSize: { xs: "1.25rem", sm: "1.35rem" },
                                        fontWeight: 700,
                                        color: theme.vars.palette.red.main,
                                    }}
                                >
                                    Newsletter
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: "primary.main",
                                                "& fieldset": {
                                                    borderColor: "rgba(255, 255, 255, 0.23)",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "primary.main",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "primary.main",
                                                },
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleSubscribe}
                                        sx={{
                                            bgcolor: "red.main",
                                            color: "white",
                                            "&:hover": {
                                                bgcolor: "red.dark",
                                            },
                                        }}
                                    >
                                        Subscribe
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
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
                            © 2025 MovieLandia24. All rights reserved.
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Link href="/privacy" style={{ textDecoration: "none" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.8,
                                        "&:hover": { color: theme.vars.palette.red.main },
                                    }}
                                >
                                    Privacy Policy
                                </Typography>
                            </Link>
                            <Link href="/terms" style={{ textDecoration: "none" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        opacity: 0.8,
                                        "&:hover": { color: theme.vars.palette.red.main },
                                    }}
                                >
                                    Terms of Service
                                </Typography>
                            </Link>
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
