"use client";

import { Box, Button, FormLabel, TextField, Typography, useTheme } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { showToast } from "@/utils/helpers/toast";
import { resetPassword } from "@/actions/auth.actions";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const resetPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }).min(1, { message: "Email is a required field" }),
});

export default function ResetPasswordPage() {
    const theme = useTheme();

    async function handleSubmitResetPassword(values: { email: string }) {
        const userData = {
            email: values.email,
        };

        try {
            await resetPassword(userData);
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while resetting the password.");
            }
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                rowGap: 4,
            }}
        >
            <Box
                sx={{
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: theme.vars.palette.primary.dark,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        pb: 2,
                    }}
                >
                    <Typography variant="h2" textAlign={"center"}>
                        Reset Password
                    </Typography>
                </Box>
                <form onSubmit={handleSubmit(handleSubmitResetPassword)}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 2,
                            width: 300,
                            maxWidth: "100%",
                        }}
                    >
                        <Box display={"flex"} flexDirection="row" columnGap={1}>
                            <EmailIcon />
                            <FormLabel component={"label"}>Email</FormLabel>
                        </Box>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    type="text"
                                />
                            )}
                        />
                        <Button
                            type="submit"
                            variant="text"
                            sx={{ fontWeight: 700, py: 1, fontSize: 18, textTransform: "capitalize" }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
