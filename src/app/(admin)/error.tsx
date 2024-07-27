"use client";

import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const ErrorPage: React.FC = () => {
    const router = useRouter();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    my: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    border: 1,
                    borderColor: "neutral.200",
                    bgcolor: "background.paper",
                    p: 4,
                    boxShadow: 3,
                    transition: "background-color 0.5s ease",
                }}
            >
                <Typography variant="body1" gutterBottom>
                    There was an issue with our page. This could be a temporary issue.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        router.push("/");
                    }}
                    sx={{
                        mt: 2,
                        borderRadius: "9999px",
                        py: 1,
                        px: 4,
                        textTransform: "none",
                        "&:hover": {
                            opacity: 0.9,
                        },
                    }}
                >
                    Go To Home
                </Button>
            </Box>
        </Container>
    );
};

export default ErrorPage;
