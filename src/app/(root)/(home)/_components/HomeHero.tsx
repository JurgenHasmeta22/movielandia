"use client";

import { Typography, Button, Box } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import MovieIcon from "@mui/icons-material/Movie";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const HomeHeroSection = () => {
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                position: "relative",
                textAlign: "center",
                overflow: "hidden",
                padding: "3rem 0",
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
                        background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)",
                    },
                }}
            >
                <Image
                    src="/images/backgrounds/netflix.png"
                    alt="Background Image"
                    fill
                    priority
                    style={{ objectFit: "cover", objectPosition: "center" }}
                />
            </Box>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{
                    maxWidth: "75%",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    zIndex: 1,
                }}
            >
                <motion.div variants={itemVariants}>
                    <Typography
                        variant="h1"
                        fontSize={{ xs: 36, sm: 48, md: 64, lg: 72 }}
                        fontWeight={900}
                        letterSpacing={{ xs: 1, md: 2 }}
                        sx={{ color: "#fff", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                    >
                        Dive into MovieLandia24
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Typography
                        variant="h2"
                        fontSize={{ xs: 22, sm: 28, md: 36, lg: 42 }}
                        fontWeight={700}
                        sx={{ color: "#fff", textShadow: "1px 1px 3px rgba(0,0,0,0.4)", opacity: 0.95 }}
                    >
                        Your Gateway to the World of Cinema!
                    </Typography>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Typography
                        variant="body1"
                        fontSize={{ xs: 16, sm: 18, md: 20 }}
                        fontWeight={500}
                        sx={{
                            color: "grey.100",
                            maxWidth: { xs: "100%", md: "80%" },
                            mx: "auto",
                            opacity: 0.9,
                        }}
                    >
                        Explore the latest blockbusters and timeless classics in our curated collection of movies and
                        series.
                    </Typography>
                </motion.div>
                <Box
                    sx={{
                        display: "flex",
                        gap: "1.5rem",
                        justifyContent: "center",
                        marginTop: "1rem",
                        flexWrap: "wrap",
                    }}
                >
                    <motion.div variants={itemVariants}>
                        <Button
                            component={Link}
                            href="/movies"
                            variant="outlined"
                            size="large"
                            startIcon={<LocalMoviesIcon />}
                            sx={{
                                px: { xs: 3, md: 4 },
                                py: { xs: 1.5, md: 2 },
                                fontSize: { xs: 16, md: 18 },
                                fontWeight: 700,
                                borderRadius: 2,
                                textTransform: "none",
                                borderWidth: 2,
                                color: "common.white",
                                borderColor: "common.white",
                                backdropFilter: "blur(4px)",
                                backgroundColor: "rgba(255,255,255,0.05)",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                            }}
                        >
                            Explore Movies
                        </Button>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Button
                            component={Link}
                            href="/series"
                            variant="outlined"
                            size="large"
                            startIcon={<MovieIcon />}
                            sx={{
                                px: { xs: 3, md: 4 },
                                py: { xs: 1.5, md: 2 },
                                fontSize: { xs: 16, md: 18 },
                                fontWeight: 700,
                                borderRadius: 2,
                                textTransform: "none",
                                borderWidth: 2,
                                color: "common.white",
                                borderColor: "common.white",
                                backdropFilter: "blur(4px)",
                                backgroundColor: "rgba(255,255,255,0.05)",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                            }}
                        >
                            Browse Series
                        </Button>
                    </motion.div>
                </Box>
            </motion.div>
        </Box>
    );
};

export default HomeHeroSection;
