"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, FormLabel, IconButton, InputAdornment, TextField, Typography, Divider } from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { showToast } from "@/utils/helpers/toast";
import { signUp } from "@/actions/auth.actions";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

const registerSchema = z
    .object({
        userName: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username can't be longer than 20 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
            .min(1, "Username is a required field"),
        email: z.string().email("Invalid email format").min(1, "Email is a required field"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must be at least 8 characters, contain at least one uppercase letter, one lowercase, one number, and one special character",
            )
            .min(1, "Password is a required field"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "Passwords must match",
            });
        }
    });

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
    const handleMouseDownPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);

    async function handleSubmitRegister(values: {
        userName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) {
        const userData = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        };

        try {
            await signUp(userData);
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while registering the user.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitRegister)}>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                <Box
                    display={"flex"}
                    flexDirection="row"
                    columnGap={1}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{ pb: 1 }}
                >
                    <LockOutlinedIcon fontSize="large" />
                    <Typography variant="h2" sx={{ textTransform: "capitalize" }}>
                        Sign Up
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ rowGap: 1 }}>
                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                            <PersonIcon />
                            <FormLabel>Username</FormLabel>
                        </Box>
                        <Controller
                            name="userName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    error={!!errors.userName}
                                    helperText={errors.userName?.message}
                                    sx={{
                                        "& .MuiFormHelperText-root": {
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            maxWidth: "200px",
                                        },
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ rowGap: 1 }}>
                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                            <EmailIcon />
                            <FormLabel>Email</FormLabel>
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
                                    sx={{
                                        "& .MuiFormHelperText-root": {
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            maxWidth: "200px",
                                        },
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ rowGap: 1 }}>
                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                            <PasswordIcon />
                            <FormLabel>Password</FormLabel>
                        </Box>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    sx={{
                                        "& .MuiFormHelperText-root": {
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            maxWidth: "200px",
                                        },
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" size="small" sx={{ rowGap: 1 }}>
                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                            <PasswordIcon />
                            <FormLabel>Confirm Password</FormLabel>
                        </Box>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type={showPasswordConfirm ? "text" : "password"}
                                    size="small"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPasswordConfirm}
                                                        onMouseDown={handleMouseDownPasswordConfirm}
                                                    >
                                                        {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                    sx={{
                                        "& .MuiFormHelperText-root": {
                                            whiteSpace: "normal",
                                            overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            maxWidth: "200px",
                                        },
                                    }}
                                />
                            )}
                        />
                    </FormControl>
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "center", marginTop: 2, flexDirection: "column", rowGap: 1 }}
                >
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{ fontWeight: 600, py: 1, px: 4 }}
                        disabled={isSubmitting}
                    >
                        <LockOutlinedIcon />
                        <Typography
                            component={"span"}
                            sx={{ paddingLeft: 1, fontSize: 16, textTransform: "capitalize" }}
                        >
                            Sign Up
                        </Typography>
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 1 }}>
                        <Divider sx={{ flexGrow: 1 }} />
                        <Typography 
                            variant="body2" 
                            component="span" 
                            sx={{ 
                                px: 2, 
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: '0.875rem'
                            }}
                        >
                            OR
                        </Typography>
                        <Divider sx={{ flexGrow: 1 }} />
                    </Box>
                    <Button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        variant="outlined"
                        sx={{ fontWeight: 600, py: 1 }}
                    >
                        <GoogleIcon />
                        <Typography
                            component={"span"}
                            sx={{ fontSize: 16, paddingLeft: 1, textTransform: "capitalize" }}
                        >
                            Continue with Google
                        </Typography>
                    </Button>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                    <Typography component={"span"} sx={{ textTransform: "capitalize", fontSize: 12 }}>
                        Already have an account?
                    </Typography>
                    <Link href="/login" style={{ textDecoration: "none", paddingLeft: 4, textTransform: "capitalize" }}>
                        Sign In
                    </Link>
                </Box>
            </Box>
        </form>
    );
}
