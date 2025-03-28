"use client";

import React from "react";
import { Box, Container, Typography, useTheme, Paper } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShareIcon from "@mui/icons-material/Share";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { motion } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const steps = [
    {
        icon: <ExploreIcon sx={{ fontSize: 40 }} />,
        title: "Discover",
        description: "Browse our extensive collection of movies, TV series, actors, and crew members. Use filters to find exactly what you're looking for."
    },
    {
        icon: <BookmarkAddIcon sx={{ fontSize: 40 }} />,
        title: "Save",
        description: "Create watchlists, bookmark your favorites, and keep track of what you want to watch next. Never lose track of a great recommendation."
    },
    {
        icon: <RateReviewIcon sx={{ fontSize: 40 }} />,
        title: "Review",
        description: "Share your thoughts by rating and reviewing content. Help others discover great movies and shows through your insights."
    },
    {
        icon: <ShareIcon sx={{ fontSize: 40 }} />,
        title: "Connect",
        description: "Join discussions, follow other users with similar tastes, and become part of our vibrant community of film enthusiasts."
    }
];

const HowItWorksSection = () => {
    const theme = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, ease: "easeOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                backgroundColor: theme.palette.mode === "dark"
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(255, 255, 255, 0.9)",
                position: "relative",
                width: "100%",
                overflow: "hidden",
            }}
        >
            <Container maxWidth="lg">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <Box sx={{ textAlign: "center", mb: 5 }}>
                        <motion.div variants={itemVariants}>
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    backgroundColor: `${theme.palette.primary.main}15`,
                                    color: theme.palette.primary.main,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            >
                                <HelpOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 14 }}>
                                    Getting Started
                                </Typography>
                            </Box>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                                }}
                            >
                                How MovieLandia24 Works
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: "text.secondary",
                                    maxWidth: "800px",
                                    mx: "auto",
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                }}
                            >
                                Get started with MovieLandia24 in just a few simple steps and unlock the full potential of your cinematic journey.
                            </Typography>
                        </motion.div>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 3,
                            mt: 2,
                        }}
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                custom={index}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                style={{ height: "100%" }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: "100%",
                                        borderRadius: 3,
                                        textAlign: "center",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        backgroundColor: theme.palette.background.paper,
                                        position: "relative",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "4px",
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 70,
                                            height: 70,
                                            borderRadius: "50%",
                                            backgroundColor: `${theme.palette.primary.main}15`,
                                            color: theme.palette.primary.main,
                                            mx: "auto",
                                            mb: 2,
                                        }}
                                    >
                                        {step.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1.5,
                                            fontSize: { xs: "1.1rem", sm: "1.25rem" },
                                        }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.secondary",
                                            lineHeight: 1.6,
                                            fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                            flexGrow: 1,
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 15,
                                            right: 15,
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            backgroundColor: theme.palette.primary.main,
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.8rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default HowItWorksSection;
