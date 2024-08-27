"use client";

import { Box, Button, Typography } from "@mui/material";
import Container from "@mui/material-pigment-css/Container";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
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
