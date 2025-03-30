"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Avatar, Rating, useTheme, Paper } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type {} from "@mui/material/themeCssVarsAugmentation";

const testimonials = [
    {
        name: "Sarah Johnson",
        avatar: "/images/avatars/avatar1.jpg",
        role: "Film Enthusiast",
        rating: 5,
        text: "MovieLandia24 has completely transformed how I discover new films. The recommendations are spot-on, and I love being able to create custom watchlists for different moods and occasions.",
    },
    {
        name: "Michael Chen",
        avatar: "/images/avatars/avatar2.jpg",
        role: "TV Series Buff",
        rating: 4.5,
        text: "As someone who watches a lot of TV series, I appreciate how well-organized everything is on MovieLandia24. The episode tracking feature is particularly useful, and the community discussions add so much value.",
    },
    {
        name: "Emma Rodriguez",
        avatar: "/images/avatars/avatar3.jpg",
        role: "Aspiring Filmmaker",
        rating: 5,
        text: "The depth of information about directors, cinematographers, and other crew members is impressive. MovieLandia24 has become an invaluable resource for my film studies and creative projects.",
    },
    {
        name: "David Wilson",
        avatar: "/images/avatars/avatar4.jpg",
        role: "Movie Collector",
        rating: 4.5,
        text: "I've been using MovieLandia24 to catalog my personal collection, and it's been a game-changer. The interface is intuitive, and the database is incredibly comprehensive.",
    },
    {
        name: "Olivia Thompson",
        avatar: "/images/avatars/avatar5.jpg",
        role: "Cinema Critic",
        rating: 5,
        text: "The review system on MovieLandia24 is exceptional. I can express my thoughts in detail, and the community engagement with reviews creates meaningful conversations about cinema.",
    },
];

const TestimonialsSection = () => {
    const theme = useTheme();
    const [slidesToShow, setSlidesToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 600) setSlidesToShow(1);
            else if (width < 960) setSlidesToShow(2);
            else setSlidesToShow(3);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: true,
        adaptiveHeight: false,
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, ease: "easeOut" },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                backgroundColor: theme.vars.palette.background.default,
                position: "relative",
                width: "100%",
                overflow: "hidden",
            }}
        >
            <Container maxWidth="xl">
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
                                    backgroundColor: `${theme.vars.palette.primary.main}15`,
                                    color: theme.vars.palette.primary.main,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            >
                                <PeopleAltIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 14 }}>
                                    User Testimonials
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
                                What Our Community Says
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: theme.vars.palette.text.secondary,
                                    maxWidth: "800px",
                                    mx: "auto",
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                }}
                            >
                                Join thousands of satisfied users who have discovered their next favorite movies and
                                shows through MovieLandia24.
                            </Typography>
                        </motion.div>
                    </Box>

                    <Box sx={{ mt: 4, px: { xs: 1, md: 2 } }}>
                        <Slider {...settings}>
                            {testimonials.map((testimonial, index) => (
                                <Box key={index} sx={{ px: 2, height: "100%" }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: "100%",
                                            borderRadius: 3,
                                            display: "flex",
                                            flexDirection: "column",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            backgroundColor: theme.vars.palette.background.paper,
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                            },
                                        }}
                                    >
                                        <Box sx={{ mb: 2 }}>
                                            <FormatQuoteIcon
                                                sx={{
                                                    fontSize: 40,
                                                    color: theme.vars.palette.primary.main,
                                                    opacity: 0.3,
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            sx={{
                                                fontSize: "0.95rem",
                                                fontStyle: "italic",
                                                color: theme.vars.palette.text.secondary,
                                                lineHeight: 1.6,
                                                mb: 3,
                                                flexGrow: 1,
                                                minHeight: { xs: "auto", sm: "120px", md: "150px" },
                                            }}
                                        >
                                            &quot;{testimonial.text}&quot;
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                                            <Avatar
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                sx={{ width: 50, height: 50, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                                                    {testimonial.name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: theme.vars.palette.text.secondary,
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    {testimonial.role}
                                                </Typography>
                                                <Rating
                                                    value={testimonial.rating}
                                                    precision={0.5}
                                                    readOnly
                                                    size="small"
                                                    sx={{ mt: 0.5 }}
                                                />
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default TestimonialsSection;
