"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

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
                <Typography variant="h1" gutterBottom>
                    Oops! Something went wrong.
                </Typography>
                <Typography variant="h2" gutterBottom>
                    Please try again or contact support if the problem persists..
                </Typography>
                <Button onClick={reset} className="text-accent-blue">
                    Try again
                </Button>
                <Link href={"/"}>Go back home</Link>
            </Box>
        </Container>
    );
}
