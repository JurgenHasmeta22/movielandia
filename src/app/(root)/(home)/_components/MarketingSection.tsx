"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import UpdateIcon from "@mui/icons-material/Update";
import CollectionsIcon from "@mui/icons-material/Collections";
import DevicesIcon from "@mui/icons-material/Devices";
import { motion } from "framer-motion";

const features = [
    {
        icon: <CollectionsIcon sx={{ fontSize: 40 }} />,
        title: "Extensive Library",
        description: "Access thousands of movies and TV shows, from latest releases to timeless classics.",
    },
    {
        icon: <LocalMoviesIcon sx={{ fontSize: 40 }} />,
        title: "Curated Collections",
        description: "Discover handpicked selections organized by genre, mood, and themes.",
    },
    {
        icon: <UpdateIcon sx={{ fontSize: 40 }} />,
        title: "Regular Updates",
        description: "New content added weekly to keep you entertained with fresh releases.",
    },
    {
        icon: <DevicesIcon sx={{ fontSize: 40 }} />,
        title: "Cross-Platform Support",
        description: "Watch seamlessly across all your devices, anytime and anywhere.",
    },
];

const cardVariants = {
    hover: {
        scale: 1.05,
        boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3, ease: "easeInOut" },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, ease: "easeOut" },
    },
};

const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const MarketingSection = () => {
    const theme = useTheme();

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 4, md: 5 },
                backgroundColor: theme.palette.background.default,
                position: "relative",
                width: "100%",
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.div variants={textVariants}>
                        <Box
                            sx={{
                                textAlign: "center",
                                mb: { xs: 5, md: 8 },
                                maxWidth: "800px",
                                mx: "auto",
                            }}
                        >
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: { xs: 28, sm: 32, md: 40 },
                                    fontWeight: 800,
                                    mb: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    color: "transparent",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Welcome to MovieLandia24
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: { xs: 16, sm: 18, md: 20 },
                                    color: "text.secondary",
                                    lineHeight: 1.6,
                                }}
                            >
                                Your premier destination for cinematic entertainment. We bring you a vast collection of
                                movies and series, carefully curated to provide the best streaming experience.
                            </Typography>
                        </Box>
                    </motion.div>

                    <Box
                        sx={{
                            maxWidth: "1200px",
                            mx: "auto",
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 4,
                        }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover="hover"
                                style={{ height: "100%" }}
                            >
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        p: 3,
                                        borderRadius: 4,
                                        backgroundColor: theme.palette.background.paper,
                                        height: "100%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: theme.palette.primary.main,
                                            mb: 2,
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1,
                                            fontSize: { xs: 18, md: 20 },
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "text.secondary",
                                            fontSize: { xs: 14, md: 16 },
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {feature.description}
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default MarketingSection;
