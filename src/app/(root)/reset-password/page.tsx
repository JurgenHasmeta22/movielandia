"use client";

import { Box, Button, FormLabel, TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { showToast } from "@/utils/helpers/toast";
import { resetPassword } from "@/actions/auth.actions";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import VerificationLayout from "@/components/root/verificationLayout/VerificationLayout";

export default function ResetPasswordPage() {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: "" },
    });

    async function handleSubmitResetPassword(values: { email: string }) {
        try {
            await resetPassword({ email: values.email });
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while resetting the password.");
            }
        }
    }

    return (
        <VerificationLayout title="Reset Password">
            <form onSubmit={handleSubmit(handleSubmitResetPassword)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon color="primary" />
                        <FormLabel>Email</FormLabel>
                    </Box>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                placeholder="Enter your email address"
                                autoComplete="email"
                                type="email"
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{
                            py: 1.5,
                            fontSize: "1.1rem",
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                </Box>
            </form>
        </VerificationLayout>
    );
}
