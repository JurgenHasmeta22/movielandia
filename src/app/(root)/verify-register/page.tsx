import { Typography } from "@mui/material";
import Link from "next/link";
import Container from "@mui/material-pigment-css/Container";
import Box from "@mui/material-pigment-css/Box";

export default async function VerifyRegisterPage({ searchParams }: { searchParams: { token: string; email: string } }) {
    const { token, email } = searchParams;

    let message = "";
    let isError = false;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_PROJECT_URL}/api/verifyRegister?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
        );

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Verification failed.");
        }

        message = "Your email has been successfully verified. Now you can freely login.";
    } catch (error: any) {
        isError = true;
        message = error.message || "Verification failed. Go back and try registering again";
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
                    padding: 8,
                    boxShadow: "6px",
                    borderRadius: 4,
                    backgroundColor: "background.paper",
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    {isError ? "Verification Failed" : "Verification Successful"}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
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
                            href={"/login"}
                            prefetch={false}
                            style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                textTransform: "capitalize",
                                textDecoration: "none",
                            }}
                        >
                            Sign In
                        </Link>
                    </Box>
                )}
            </Box>
        </Container>
    );
}
