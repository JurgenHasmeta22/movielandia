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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email format").min(1, "Email is a required field"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        )
        .min(1, "Password is a required field"),
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

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onChange",
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    async function handleSubmitLogin(values: { email: string; password: string }) {
        const result = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: "/",
        });

        if (result?.error) {
            showToast("error", result?.error);
        } else if (result?.url) {
            router.push(result.url);
            router.refresh();
            showToast("success", "You are successfully logged in!");
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
            <form onSubmit={handleSubmit(handleSubmitLogin)}>
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
                            Sign In
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                                            autoComplete="username"
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
                                            autoComplete="current-password"
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
                            Sign In
                        </Button>

                        <Button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            variant="outlined"
                            sx={{
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            <GoogleIcon sx={{ mr: 1 }} />
                            Continue with Google
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", sm: "center" },
                            gap: 1,
                            mt: 2,
                        }}
                    >
                        <MuiLink
                            component={Link}
                            href="/reset-password"
                            underline="hover"
                            sx={{
                                fontSize: "0.875rem",
                                color: "primary.main",
                            }}
                        >
                            Forgot Password?
                        </MuiLink>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Don&apos;t have an account?
                            </Typography>
                            <MuiLink
                                component={Link}
                                href="/register"
                                underline="hover"
                                sx={{
                                    fontSize: "0.875rem",
                                    color: "primary.main",
                                    fontWeight: 500,
                                }}
                            >
                                Sign Up
                            </MuiLink>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}
