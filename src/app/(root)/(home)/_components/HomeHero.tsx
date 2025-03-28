"use client";

import { Typography, Button, Box, Container, Stack, useTheme } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import TvIcon from "@mui/icons-material/Tv";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const HomeHeroSection = () => {
    const theme = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, ease: "easeOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    const buttonHoverVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.3, ease: "easeInOut" }
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: { xs: "85vh", sm: "90vh", md: "95vh" },
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 100%)",
                    },
                }}
            >
                <Image
                    src="/images/backgrounds/netflix.png"
                    alt="Background Image"
                    fill
                    priority={true}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                />
            </Box>

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, py: { xs: 4, sm: 5 } }}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <Stack
                        spacing={{ xs: 2, sm: 2.5, md: 3 }}
                        sx={{
                            maxWidth: { xs: "100%", md: "65%", lg: "55%" },
                            textAlign: { xs: "center", md: "left" },
                            mx: { xs: "auto", md: 0 },
                            py: { xs: 4, md: 0 }
                        }}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem", lg: "4rem" },
                                    fontWeight: 900,
                                    letterSpacing: { xs: "-0.5px", md: "-1px" },
                                    lineHeight: 1.1,
                                    color: theme.vars.palette.common.white,
                                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                    mb: { xs: 1, md: 1.5 }
                                }}
                            >
                                Dive into MovieLandia24
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                component="h2"
                                sx={{
                                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.9)",
                                    textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                    mb: { xs: 1, md: 2 }
                                }}
                            >
                                Your Gateway to the World of Cinema!
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                sx={{
                                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" },
                                    fontWeight: 400,
                                    color: "rgba(255,255,255,0.8)",
                                    maxWidth: { xs: "100%", md: "85%" },
                                    lineHeight: 1.6,
                                    mb: { xs: 2, md: 3 }
                                }}
                            >
                                Explore the latest blockbusters and timeless classics in our curated collection of movies and
                                series. Discover, rate, and share your favorite cinematic experiences.
                            </Typography>
                        </motion.div>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 2, sm: 3 }}
                            sx={{
                                justifyContent: { xs: "center", md: "flex-start" },
                                mt: { xs: 0.5, md: 1.5 }
                            }}
                        >
                            <motion.div
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <Button
                                    component={Link}
                                    href="/movies"
                                    variant="contained"
                                    startIcon={<PlayArrowIcon />}
                                    sx={{
                                        px: { xs: 2.5, md: 3.5 },
                                        py: { xs: 1.25, md: 1.5 },
                                        fontSize: { xs: "0.9rem", md: "1rem" },
                                        fontWeight: 600,
                                        borderRadius: "12px",
                                        textTransform: "none",
                                        boxShadow: "0 8px 20px rgba(255, 87, 34, 0.3)",
                                        background: "linear-gradient(135deg, #ff8a65 0%, #ff5722 100%)",
                                        color: theme.vars.palette.common.white,
                                        transition: "all 0.3s ease",
                                        width: { xs: "100%", sm: "auto" },
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 10px 25px rgba(255, 87, 34, 0.4)"
                                        }
                                    }}
                                >
                                    Explore Movies
                                </Button>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                whileHover="hover"
                            >
                                <Button
                                    component={Link}
                                    href="/series"
                                    variant="outlined"
                                    startIcon={<TvIcon />}
                                    sx={{
                                        px: { xs: 2.5, md: 3.5 },
                                        py: { xs: 1.25, md: 1.5 },
                                        fontSize: { xs: "0.9rem", md: "1rem" },
                                        fontWeight: 600,
                                        borderRadius: "12px",
                                        textTransform: "none",
                                        borderWidth: 2,
                                        color: theme.vars.palette.common.white,
                                        borderColor: "rgba(255,255,255,0.7)",
                                        backdropFilter: "blur(8px)",
                                        backgroundColor: "rgba(255,255,255,0.05)",
                                        transition: "all 0.3s ease",
                                        width: { xs: "100%", sm: "auto" },
                                        "&:hover": {
                                            borderColor: theme.vars.palette.common.white,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                >
                                    Browse Series
                                </Button>
                            </motion.div>
                        </Stack>

                        <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                        >
                            <Box
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    alignItems: "center",
                                    gap: 2,
                                    mt: 4,
                                    opacity: 0.8
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "0.875rem",
                                        color: "rgba(255,255,255,0.7)"
                                    }}
                                >
                                    Featuring thousands of titles across all genres
                                </Typography>
                            </Box>
                        </motion.div>
                    </Stack>
                </motion.div>
            </Container>
        </Box>
    );
};

export default HomeHeroSection;
