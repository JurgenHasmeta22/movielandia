"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Link as MuiLink,
    useTheme,
    useMediaQuery,
} from "@mui/material";
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
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
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

const ErrorMessage = ({ message }: { message: string }) => (
    <Box
        sx={{
            position: "absolute",
            color: "error.main",
            fontSize: "0.75rem",
            mt: 0.5,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
            minHeight: "1.5em",
        }}
    >
        {message}
    </Box>
);

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        <Box
            sx={{
                width: "100%",
                maxWidth: { xs: "90%", sm: "400px" },
                margin: "0 auto",
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: { xs: 0, sm: 1 },
            }}
        >
            <form onSubmit={handleSubmit(handleSubmitRegister)}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={1}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mb: 4 }}
                    >
                        <LockOutlinedIcon fontSize="large" color="primary" />
                        <Typography variant={isMobile ? "h5" : "h4"} textAlign="center" color="primary">
                            Sign Up
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <Box sx={{ position: "relative", pb: errors.userName ? 3 : 0 }}>
                            <Box display="flex" flexDirection="row" gap={1} mb={1}>
                                <PersonIcon color="action" />
                                <FormLabel sx={{ color: "text.primary" }}>Username</FormLabel>
                            </Box>
                            <FormControl error={!!errors.userName} fullWidth>
                                <Controller
                                    name="userName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            fullWidth
                                            error={!!errors.userName}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "background.paper",
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {errors.userName && <ErrorMessage message={errors.userName.message as string} />}
                            </FormControl>
                        </Box>

                        <Box sx={{ position: "relative", pb: errors.email ? 3 : 0 }}>
                            <Box display="flex" flexDirection="row" gap={1} mb={1}>
                                <EmailIcon color="action" />
                                <FormLabel sx={{ color: "text.primary" }}>Email</FormLabel>
                            </Box>
                            <FormControl error={!!errors.email} fullWidth>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="email"
                                            size="small"
                                            fullWidth
                                            error={!!errors.email}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "background.paper",
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {errors.email && <ErrorMessage message={errors.email.message as string} />}
                            </FormControl>
                        </Box>

                        <Box sx={{ position: "relative", pb: errors.password ? 3 : 0 }}>
                            <Box display="flex" flexDirection="row" gap={1} mb={1}>
                                <PasswordIcon color="action" />
                                <FormLabel sx={{ color: "text.primary" }}>Password</FormLabel>
                            </Box>
                            <FormControl error={!!errors.password} fullWidth>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            size="small"
                                            fullWidth
                                            error={!!errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "background.paper",
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {errors.password && <ErrorMessage message={errors.password.message as string} />}
                            </FormControl>
                        </Box>

                        <Box sx={{ position: "relative", pb: errors.confirmPassword ? 3 : 0 }}>
                            <Box display="flex" flexDirection="row" gap={1} mb={1}>
                                <PasswordIcon color="action" />
                                <FormLabel sx={{ color: "text.primary" }}>Confirm Password</FormLabel>
                            </Box>
                            <FormControl error={!!errors.confirmPassword} fullWidth>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type={showPasswordConfirm ? "text" : "password"}
                                            size="small"
                                            fullWidth
                                            error={!!errors.confirmPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={handleClickShowPasswordConfirm}
                                                            onMouseDown={handleMouseDownPasswordConfirm}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "background.paper",
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <ErrorMessage message={errors.confirmPassword.message as string} />
                                )}
                            </FormControl>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            <LockOutlinedIcon sx={{ mr: 1 }} />
                            Sign Up
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                            mt: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?
                        </Typography>
                        <MuiLink
                            component={Link}
                            href="/login"
                            underline="hover"
                            sx={{
                                fontSize: "0.875rem",
                                color: "primary.main",
                                fontWeight: 500,
                            }}
                        >
                            Sign In
                        </MuiLink>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}
