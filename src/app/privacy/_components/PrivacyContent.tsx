"use client";

import React from "react";
import { Container, Typography, Box, Stack, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

const Section = ({ title, content, items }: { title: string; content: string; items?: string[] }) => {
    const theme = useTheme();

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ color: theme.vars.palette.primary.main, fontWeight: 600 }}>
                {title}
            </Typography>
            <Typography>{content}</Typography>
            {items && (
                <ul>
                    {items.map((item, index) => (
                        <Typography component="li" key={index}>
                            {item}
                        </Typography>
                    ))}
                </ul>
            )}
        </Box>
    );
};

const PrivacyContentPage = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography
                variant="h2"
                gutterBottom
                sx={{ color: theme.vars.palette.primary.main, fontWeight: 700, mb: 4 }}
            >
                Privacy Policy
            </Typography>

            <Stack spacing={4}>
                <Typography>Last Updated: January 1, 2024</Typography>

                <Section
                    title="Introduction"
                    content="Welcome to MovieLandia24's Privacy Policy. This document outlines how we collect, use, and protect your personal information when you use our service."
                />

                <Section
                    title="Information We Collect"
                    content="We collect various types of information to provide and improve our service:"
                    items={[
                        "Personal information (email, name) when you create an account",
                        "Usage data about how you interact with our platform",
                        "Device information including browser type and IP address",
                        "Cookies and similar tracking technologies",
                    ]}
                />

                <Section
                    title="How We Use Your Information"
                    content="Your information helps us to:"
                    items={[
                        "Provide and maintain our service",
                        "Notify you about changes to our service",
                        "Provide customer support",
                        "Monitor usage of our service",
                        "Detect, prevent, and address technical issues",
                    ]}
                />

                <Section
                    title="Data Protection"
                    content="We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure."
                />

                <Section
                    title="Your Rights"
                    content="You have the right to:"
                    items={[
                        "Access your personal data",
                        "Correct inaccurate data",
                        "Request deletion of your data",
                        "Object to our processing of your data",
                        "Receive a copy of your data",
                    ]}
                />

                <Section
                    title="Contact Us"
                    content="If you have any questions about this Privacy Policy, please contact us at:"
                    items={["Email: privacy@movielandia24.com", "Address: 123 Movie Street, Cinema City, CC 12345"]}
                />
            </Stack>
        </Container>
    );
};

export default PrivacyContentPage;
