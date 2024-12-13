"use client";

import { Box, Paper, Stack, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function PrivateProfileMessage() {
    return (
        <Paper
            elevation={3}
            sx={{
                width: "100%",
                p: 4,
                mt: 3,
                textAlign: "center",
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "background.paper" : "grey.50"),
            }}
        >
            <Stack spacing={3} alignItems="center">
                <LockIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                <Box>
                    <Typography variant="h6" gutterBottom>
                        This Profile is Private
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Follow this user and wait for them to accept your request to see their content.
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}
