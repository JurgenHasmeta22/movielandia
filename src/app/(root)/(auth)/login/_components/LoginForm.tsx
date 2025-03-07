"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Link as MuiLink,
    Divider,
} from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PasswordIcon from "@mui/icons-material/Password";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth.schema";
import Image from "next/image";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { emailOrUsername: "", password: "" },
        mode: "onChange",
    });

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    async function handleSubmitLogin(values: { emailOrUsername: string; password: string }) {
        const result = await signIn("credentials", {
            redirect: false,
            emailOrUsername: values.emailOrUsername,
            password: values.password,
            callbackUrl: "/",
        });

        if (result?.error) {
            showToast("error", result?.error);
        } else if (result?.url) {
            showToast("success", "Login successful! You will be redirected shortly.");
            router.push(result.url);
            router.refresh();
        }
    }

    return (
        <Box sx={{ width: "100%", maxWidth: "400px", margin: "0 auto", px: 2 }}>
            <form onSubmit={handleSubmit(handleSubmitLogin)}>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <Image
                            src="/icons/movielandia24-logo.png"
                            alt="MovieLandia24"
                            height={50}
                            width={160}
                            priority
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                        <FormControl>
                            <Controller
                                name="emailOrUsername"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Email or Username"
                                        autoComplete="username"
                                        size="small"
                                        fullWidth
                                        error={!!errors.emailOrUsername}
                                        helperText={errors.emailOrUsername?.message}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AlternateEmailIcon />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            minHeight: "50px",
                                            "& .MuiFormHelperText-root": {
                                                position: "absolute",
                                                bottom: "-15px",
                                                margin: 0,
                                                lineHeight: 1.2,
                                                whiteSpace: "normal",
                                                overflowWrap: "break-word",
                                                wordWrap: "break-word",
                                                maxWidth: "100%",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        size="small"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PasswordIcon />
                                                    </InputAdornment>
                                                ),
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
                                            },
                                        }}
                                        sx={{
                                            minHeight: "60px",
                                            "& .MuiFormHelperText-root": {
                                                position: "absolute",
                                                bottom: "-18px",
                                                margin: 0,
                                                lineHeight: 1.2,
                                                whiteSpace: "normal",
                                                overflowWrap: "break-word",
                                                wordWrap: "break-word",
                                                maxWidth: "100%",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 2,
                            flexDirection: "column",
                            rowGap: 1,
                        }}
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
                                sx={{ fontSize: 16, paddingLeft: 1, textTransform: "capitalize" }}
                            >
                                Sign In
                            </Typography>
                        </Button>
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 1 }}>
                            <Divider sx={{ flexGrow: 1 }} />
                            <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                    px: 2,
                                    color: "text.secondary",
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
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
                    <Box>
                        <MuiLink
                            component={Link}
                            href="/reset-password"
                            underline="none"
                            sx={{ textAlign: "right", mt: 1, fontSize: 12, pl: 4, textTransform: "capitalize" }}
                        >
                            Forgot Password?
                        </MuiLink>
                    </Box>
                    <Box>
                        <Typography component={"span"} sx={{ fontSize: 14, pl: 4, textTransform: "capitalize" }}>
                            Don&apos;t have an account?
                        </Typography>
                        <MuiLink
                            component={Link}
                            href="/register"
                            underline="none"
                            sx={{ textAlign: "right", mt: 1, fontSize: 14, pl: 4, textTransform: "capitalize" }}
                        >
                            Sign Up
                        </MuiLink>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}
