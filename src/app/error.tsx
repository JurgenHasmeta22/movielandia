"use client";

import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";

interface ErrorProps {
    reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ reset }) => {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    my: 4,
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
                <Typography variant="h5" component="h2" gutterBottom>
                    Oh no!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    There was an issue with our storefront. This could be a temporary issue, please try your action
                    again.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={reset}
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
                    Try Again
                </Button>
            </Box>
        </Container>
    );
};

export default Error;
