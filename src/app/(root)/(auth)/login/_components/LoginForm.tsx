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

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

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
        <form onSubmit={handleSubmit(handleSubmitLogin)}>
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                <Box
                    display={"flex"}
                    flexDirection="row"
                    columnGap={1}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{ pb: 4 }}
                >
                    <LockOutlinedIcon fontSize="large" />
                    <Typography variant="h2" textAlign={"center"}>
                        Sign In
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
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
                                    type="email"
                                    autoComplete="username"
                                    size="small"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                        <Box display={"flex"} flexDirection="row" columnGap={1}>
                            <PasswordIcon />
                            <FormLabel component={"label"}>Password</FormLabel>
                        </Box>
                        <FormControl variant="outlined" fullWidth size="small">
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </FormControl>
                    </Box>
                </Box>
                <Button
                    type="submit"
                    variant="outlined"
                    sx={{ fontWeight: 600, py: 1, marginTop: 8 }}
                    disabled={isSubmitting}
                >
                    <LockOutlinedIcon />
                    <Typography component={"span"} sx={{ fontSize: 16, paddingLeft: 1 }}>
                        Sign In
                    </Typography>
                </Button>
                <Button
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    variant="outlined"
                    sx={{ fontWeight: 600, py: 1 }}
                >
                    <GoogleIcon />
                    <Typography component={"span"} sx={{ fontSize: 16, paddingLeft: 1 }}>
                        Continue with Google
                    </Typography>
                </Button>
                <Box>
                    <MuiLink
                        component={Link}
                        href="/reset-password"
                        underline="none"
                        sx={{ textAlign: "right", mt: 1, fontSize: 12, pl: 4 }}
                    >
                        Forgot Password?
                    </MuiLink>
                </Box>
                <Box>
                    <Typography component={"span"} sx={{ fontSize: 14, pl: 4 }}>
                        Don&apos;t have an account?
                    </Typography>
                    <MuiLink
                        component={Link}
                        href="/register"
                        underline="none"
                        sx={{ textAlign: "right", mt: 1, fontSize: 14, pl: 4 }}
                    >
                        Sign Up
                    </MuiLink>
                </Box>
            </Box>
        </form>
    );
}
