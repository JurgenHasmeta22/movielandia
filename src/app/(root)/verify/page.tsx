"use client";

import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyToken = async () => {
            if (!email || !token) {
                setMessage("Invalid verification link.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `/api/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
                );

                if (res.ok) {
                    setMessage("Your email has been successfully verified. Redirecting to login...");
                    router.push("/login");
                    router.refresh();
                } else {
                    const data = await res.json();
                    setMessage(data.message || "Verification failed.");
                }
            } catch (error) {
                setMessage("An error occurred while verifying your email.");
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [email, token]);

    return (
        <Container
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
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
                {loading ? (
                    <>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="h5" component="p">
                            Verifying your email...
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Verification Result
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {message}
                        </Typography>
                    </>
                )}
            </Box>
        </Container>
    );
}
