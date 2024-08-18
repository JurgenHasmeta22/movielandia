"use client";

import { Box, Container, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function VerifyRegisterPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    return (
        <Container
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {email && email.length > 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 4,
                        boxShadow: 6,
                        borderRadius: 4,
                        backgroundColor: "background.paper",
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Verify Your Email
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        We have sent a verification link to <strong>{email}</strong>.
                    </Typography>
                    <Typography variant="body2">
                        Please check your email and follow the instructions to verify your account.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 4,
                        boxShadow: 6,
                        borderRadius: 4,
                        backgroundColor: "background.paper",
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Email not provided
                    </Typography>
                </Box>
            )}
        </Container>
    );
}
