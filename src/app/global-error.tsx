"use client";

import { Button, Typography } from "@mui/material";
import Box from "@mui/material-pigment-css/Box";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <Box>
            <Typography component="h3" variant="h3">
                Something went wrong!
            </Typography>
            <Box>{error.message}</Box>
            <Button onClick={() => reset()}>Try again</Button>
        </Box>
    );
}
