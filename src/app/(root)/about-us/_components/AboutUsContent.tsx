"use client";

import React from "react";
import { Container, Typography, Box, Stack, useTheme, Paper } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { motion } from "framer-motion";
import MovieIcon from "@mui/icons-material/Movie";
import TheatersIcon from "@mui/icons-material/Theaters";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";

const AboutUsContent = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 6,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}22 0%, ${theme.vars.palette.primary.main}11 100%)`,
                    }}
                >
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            color: theme.vars.palette.primary.main,
                            fontWeight: 800,
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                        }}
                    >
                        About MovieLandia
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: theme.vars.palette.text.secondary,
                            maxWidth: "800px",
                            mx: "auto",
                            mb: 4,
                        }}
                    >
                        Your premier destination for movies and TV series
                    </Typography>
                </Paper>

                <Stack spacing={6}>
                    <Box>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={4}
                            alignItems="center"
                            component={motion.div}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <MovieIcon sx={{ fontSize: 80, color: theme.vars.palette.red.main }} />
                            <Box>
                                <Typography variant="h4" gutterBottom color="primary">
                                    Our Mission
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    At MovieLandia, we&apos;re passionate about bringing the magic of cinema and
                                    television television directly to you. Our platform is designed to be your ultimate
                                    companion discovering, tracking, and enjoying the best in entertainment.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={4}
                            alignItems="center"
                            component={motion.div}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <TheatersIcon sx={{ fontSize: 80, color: theme.vars.palette.red.main }} />
                            <Box>
                                <Typography variant="h4" gutterBottom color="primary">
                                    What We Offer
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Our comprehensive database includes the latest movies and TV series, complete with
                                    detailed information, ratings, and reviews. We provide a user-friendly interface
                                    that makes it easy to find exactly what you&apos;re looking for, whether it&apos;s a
                                    classic film or the newest release.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Box>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={4}
                            alignItems="center"
                            component={motion.div}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <LocalMoviesIcon sx={{ fontSize: 80, color: theme.vars.palette.red.main }} />
                            <Box>
                                <Typography variant="h4" gutterBottom color="primary">
                                    Join Our Community
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Become part of our growing community of movie and TV enthusiasts. Share your
                                    thoughts, rate your favorite content, and connect with others who share your passion
                                    for entertainment. MovieLandia is more than just a platform &ndash; it&apos;s a
                                    community.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </motion.div>
        </Container>
    );
};

export default AboutUsContent;
