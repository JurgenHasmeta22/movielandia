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
            <Typography paragraph>{content}</Typography>
            {items && (
                <ul>
                    {items.map((item, index) => (
                        <Typography component="li" key={index} paragraph>
                            {item}
                        </Typography>
                    ))}
                </ul>
            )}
        </Box>
    );
};

const TermsContentPage = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography
                variant="h2"
                gutterBottom
                sx={{ color: theme.vars.palette.primary.main, fontWeight: 700, mb: 4 }}
            >
                Terms of Service
            </Typography>

            <Stack spacing={4}>
                <Typography paragraph>Last Updated: January 1, 2024</Typography>

                <Section
                    title="Acceptance of Terms"
                    content="By accessing and using MovieLandia24, you agree to be bound by these Terms of Service and all applicable laws and regulations."
                />

                <Section
                    title="User Accounts"
                    content="When creating an account on MovieLandia24:"
                    items={[
                        "You must provide accurate and complete information",
                        "You are responsible for maintaining the security of your account",
                        "You must notify us immediately of any unauthorized access",
                        "We reserve the right to terminate accounts at our discretion",
                    ]}
                />

                <Section
                    title="Content Guidelines"
                    content="Users must follow these guidelines when interacting with our platform:"
                    items={[
                        "No harmful or malicious content",
                        "No copyright infringement",
                        "No hate speech or harassment",
                        "No impersonation of others",
                        "No spam or unauthorized advertising",
                    ]}
                />

                <Section
                    title="Intellectual Property"
                    content="MovieLandia24's content, features, and functionality are owned by us and protected by international copyright, trademark, and other intellectual property laws."
                />

                <Section
                    title="Service Modifications"
                    content="We reserve the right to:"
                    items={[
                        "Modify or discontinue any part of our service",
                        "Change our terms at any time",
                        "Limit access to certain features",
                        "Remove any content for any reason",
                    ]}
                />

                <Section
                    title="Limitation of Liability"
                    content="MovieLandia24 is provided 'as is' without any warranties. We are not liable for any damages arising from your use of our service."
                />

                <Section
                    title="Contact Information"
                    content="For any questions about these Terms of Service, please contact us at:"
                    items={["Email: terms@movielandia24.com", "Address: 123 Movie Street, Cinema City, CC 12345"]}
                />
            </Stack>
        </Container>
    );
};

export default TermsContentPage;
