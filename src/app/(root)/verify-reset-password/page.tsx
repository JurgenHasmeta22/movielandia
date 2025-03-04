import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import VerificationLayout from "@/components/root/verificationLayout/VerificationLayout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default async function VerifyResetPasswordPage(props: {
    searchParams: Promise<{ token: string; email: string }>;
}) {
    const searchParams = await props.searchParams;
    const { token, email } = searchParams;

    let message = "";
    let isError = false;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_PROJECT_URL}/api/verifyResetPassword?token=${encodeURIComponent(
                token,
            )}&email=${encodeURIComponent(email)}`,
        );

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Verification failed.");
        }

        message = "Your email has been successfully verified. Now you can change the password.";
    } catch (error: any) {
        isError = true;
        message = error.message || "Verification failed. Go back and check the email";
    }

    return (
        <VerificationLayout title={isError ? "Verification Failed" : "Verification Successful"}>
            <Box sx={{ textAlign: "center" }}>
                {isError ? (
                    <ErrorIcon sx={{ fontSize: 60, color: "error.main", mb: 3 }} />
                ) : (
                    <CheckCircleIcon sx={{ fontSize: 60, color: "success.main", mb: 3 }} />
                )}
                <Typography variant="body1" sx={{ mb: 4 }}>
                    {message}
                </Typography>
                <Button
                    component={Link}
                    href={isError ? "/register" : `/change-password?email=${encodeURIComponent(email)}`}
                    variant="contained"
                    fullWidth
                    sx={{
                        py: 1.5,
                        fontSize: "1.1rem",
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    {isError ? "Sign Up" : "Change Password"}
                </Button>
            </Box>
        </VerificationLayout>
    );
}
