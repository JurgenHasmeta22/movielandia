"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, FormLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import PasswordIcon from "@mui/icons-material/Password";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IChangePassword {
    email: string;
}

const registerSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            })
            .min(1, { message: "New password is required" }),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords must match",
            });
        }
    });

export default function ChangePasswordForm({ email }: IChangePassword) {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const router = useRouter();

    async function handleSubmitChangePassword(values: { newPassword: string; confirmPassword: string }) {
        try {
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword: values.newPassword, email }),
            });

            if (response.ok) {
                showToast("success", "Your password has been changed successfully.");
                router.push("/login");
            } else {
                const data = await response.json();
                showToast("error", data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            showToast("error", "An error occurred. Please try again later.");
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    return (
        <form onSubmit={handleSubmit(handleSubmitChangePassword)}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 6,
                    height: "100vh",
                }}
            >
                <Box display={"flex"} flexDirection="row" columnGap={1} sx={{ pb: 4 }}>
                    <LockOutlinedIcon fontSize="large" />
                    <Typography variant="h2" textAlign={"center"}>
                        Change Password
                    </Typography>
                </Box>
                <Box display={"flex"} flexDirection={"row"} columnGap={3}>
                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                        <Box display={"flex"} flexDirection="row" columnGap={1}>
                            <PasswordIcon />
                            <FormLabel component={"label"}>New Password</FormLabel>
                        </Box>
                        <FormControl variant="outlined" fullWidth size="small">
                            <Box sx={{ minHeight: "100px" }}>
                                <Controller
                                    name="newPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showNewPassword ? "text" : "password"}
                                            size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleClickShowNewPassword}>
                                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.newPassword}
                                            helperText={errors.newPassword?.message}
                                        />
                                    )}
                                />
                            </Box>
                        </FormControl>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                        <Box display={"flex"} flexDirection="row" columnGap={1}>
                            <PasswordIcon />
                            <FormLabel component={"label"}>Confirm New Password</FormLabel>
                        </Box>
                        <FormControl variant="outlined" fullWidth size="small">
                            <Box sx={{ minHeight: "100px" }}>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showConfirmPassword ? "text" : "password"}
                                            size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleClickShowConfirmPassword}>
                                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
                                        />
                                    )}
                                />
                            </Box>
                        </FormControl>
                    </Box>
                </Box>
                <Button type="submit" variant="outlined" sx={{ fontWeight: 600, py: 1 }} disabled={isSubmitting}>
                    <LockOutlinedIcon />
                    <Typography component={"span"} sx={{ fontSize: 16, paddingLeft: 1, textTransform: "capitalize" }}>
                        Change Password
                    </Typography>
                </Button>
            </Box>
        </form>
    );
}
