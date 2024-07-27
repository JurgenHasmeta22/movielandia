"use client";

import { Box, Button, Typography } from "@mui/material";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    console.log("Global Error", error);

    return (
        <Box>
            <Typography component="h2" variant="h2">
                Something went wrong!
            </Typography>
            <Box>{error.message}</Box>
            <Button onClick={() => reset()}>Try again</Button>
        </Box>
    );
}
