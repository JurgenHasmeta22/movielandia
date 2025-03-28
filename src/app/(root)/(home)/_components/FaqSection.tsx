"use client";

import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { motion } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const faqs = [
    {
        question: "What is MovieLandia24?",
        answer: "MovieLandia24 is a comprehensive cinema platform where you can discover, explore, and engage with movies, TV series, actors, and crew. Create an account to write reviews, rate content, build custom lists, and connect with other film enthusiasts."
    },
    {
        question: "Is MovieLandia24 free to use?",
        answer: "Yes, MovieLandia24 is completely free to use. Create an account to access all features including personalized recommendations, watchlists, and community interactions."
    },
    {
        question: "How do I create a watchlist?",
        answer: "After signing in, you can add any movie or TV show to your watchlist by clicking the bookmark icon on the content card. Access your watchlist anytime from your profile page."
    },
    {
        question: "Can I write reviews for movies and TV shows?",
        answer: "Absolutely! Once you're signed in, navigate to any movie or TV show page and scroll down to the reviews section. Click on 'Write a Review' to share your thoughts and rating."
    },
    {
        question: "How are movie and TV show ratings calculated?",
        answer: "Ratings are calculated based on the average of all user ratings. Each user can rate content on a scale of 1 to 10, and these ratings are aggregated to provide an overall score."
    }
];

const FaqSection = () => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
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
                backgroundColor: theme.palette.mode === "dark" 
                    ? "rgba(0, 0, 0, 0.2)" 
                    : "rgba(245, 245, 245, 0.8)",
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
                                <QuestionAnswerIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: 14 }}>
                                    Frequently Asked Questions
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
                                Got Questions? We've Got Answers
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
                                Find answers to the most common questions about MovieLandia24 and how to make the most of your experience.
                            </Typography>
                        </motion.div>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                custom={index}
                            >
                                <Accordion
                                    expanded={expanded === `panel${index}`}
                                    onChange={handleChange(`panel${index}`)}
                                    sx={{
                                        mb: 2,
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                        border: "1px solid",
                                        borderColor: "divider",
                                        "&:before": {
                                            display: "none",
                                        },
                                        backgroundColor: theme.palette.background.paper,
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                                        sx={{
                                            px: 3,
                                            py: 1.5,
                                            "&:hover": {
                                                backgroundColor: theme.palette.mode === "dark" 
                                                    ? "rgba(255, 255, 255, 0.05)" 
                                                    : "rgba(0, 0, 0, 0.02)",
                                            },
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.95rem", sm: "1.05rem" } }}>
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.01)" }}>
                                        <Typography sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </motion.div>
                        ))}
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default FaqSection;
