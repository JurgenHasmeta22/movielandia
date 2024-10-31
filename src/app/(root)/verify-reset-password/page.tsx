import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";

export default async function VerifyResetPasswordPage(props: {
    searchParams: Promise<{ token: string; email: string }>;
}) {
    const searchParams = await props.searchParams;
    const { token, email } = searchParams;

    let message = "";
    let isError = false;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_PROJECT_URL}/api/verifyResetPassword?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
        );

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Verification failed.");
        }

        message = "Your email has been successfully verified. Now you can change the passowrd.";
    } catch (error: any) {
        isError = true;
        message = error.message || "Verification failed. Go back and check the email";
    }

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
                    p: 8,
                    boxShadow: 6,
                    borderRadius: 4,
                    backgroundColor: "background.paper",
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    {isError ? "Verification Failed" : "Verification Successful"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    {message}
                </Typography>
                {isError ? (
                    <Box>
                        <Link
                            href={"/register"}
                            prefetch={false}
                            style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                textTransform: "capitalize",
                                textDecoration: "none",
                            }}
                        >
                            Sign Up
                        </Link>
                    </Box>
                ) : (
                    <Box>
                        <Link
                            href={`/change-password?email=${encodeURIComponent(email)}`}
                            prefetch={false}
                            style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                textTransform: "capitalize",
                                textDecoration: "none",
                            }}
                        >
                            Change Password
                        </Link>
                    </Box>
                )}
            </Box>
        </Container>
    );
}
