"use client";

import { Button, Typography } from "@mui/material";
import Container from "@mui/material-pigment-css/Container";
import Box from "@mui/material-pigment-css/Box";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 10,
                    marginBottom: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    border: 1,
                    borderColor: "neutral.200",
                    backgroundColor: "background.paper",
                    padding: 4,
                    boxShadow: "3px",
                    transition: "background-color 0.5s ease",
                }}
            >
                <Typography variant="h3" gutterBottom>
                    Something went wrong.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Please try again now or later
                </Typography>
                <Button onClick={reset} className="text-accent-blue">
                    Try again
                </Button>
            </Box>
        </Container>
    );
}
