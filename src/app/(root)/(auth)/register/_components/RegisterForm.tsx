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
    Divider,
    Checkbox,
    FormHelperText,
    Link,
} from "@mui/material";
import { useState } from "react";
import { showToast } from "@/utils/helpers/toast";
import { signUp } from "@/actions/auth.actions";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import PersonIcon from "@mui/icons-material/Person";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/schemas/auth.schema";
import Image from "next/image";

export default function RegisterForm() {
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
            acceptTerms: false,
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
        acceptTerms: boolean;
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
        <Box sx={{ width: "100%", maxWidth: "300px", margin: "0 auto", px: 1 }}>
            <form onSubmit={handleSubmit(handleSubmitRegister)}>
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                    <Box
                        display={"flex"}
                        flexDirection="row"
                        alignItems={"center"}
                        justifyContent={"center"}
                        sx={{ pb: 4 }}
                    >
                        <Image
                            src={"/icons/movielandia24-logo.png"}
                            alt="MovieLandia24"
                            height={70}
                            width={220}
                            priority={true}
                            style={{ pointerEvents: "none" }}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                        <FormControl variant="outlined" size="small">
                            <Controller
                                name="userName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Username"
                                        size="small"
                                        error={!!errors.userName}
                                        helperText={errors.userName?.message}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFormHelperText-root": {
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
                        <FormControl variant="outlined" size="small">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        placeholder="Email"
                                        size="small"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFormHelperText-root": {
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
                        <FormControl variant="outlined" size="small">
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        size="small"
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
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFormHelperText-root": {
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
                        <FormControl variant="outlined" size="small">
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type={showPasswordConfirm ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        size="small"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
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
                                                            onClick={handleClickShowPasswordConfirm}
                                                            onMouseDown={handleMouseDownPasswordConfirm}
                                                        >
                                                            {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                        sx={{
                                            "& .MuiFormHelperText-root": {
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
                        <FormControl variant="outlined" size="small">
                            <Controller
                                name="acceptTerms"
                                control={control}
                                render={({ field }) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Checkbox
                                            {...field}
                                            size="medium"
                                            checked={field.value}
                                            sx={{
                                                p: 0.5,
                                                mt: "-2px",
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                gap: 0.5,
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: "inherit",
                                                    lineHeight: 1.5,
                                                    fontWeight: 500,
                                                    color: "text.primary",
                                                }}
                                            >
                                                I agree to the
                                            </Typography>
                                            <Link
                                                href="/terms"
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                    color: "primary.main",
                                                    fontSize: "inherit",
                                                    lineHeight: 1.5,
                                                    "&:hover": {
                                                        textDecoration: "underline",
                                                    },
                                                }}
                                            >
                                                Terms of Service
                                            </Link>
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontSize: "inherit",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                and
                                            </Typography>
                                            <Link
                                                href="/privacy"
                                                target="_blank"
                                                sx={{
                                                    textDecoration: "none",
                                                    color: "primary.main",
                                                    fontSize: "inherit",
                                                    lineHeight: 1.5,
                                                    "&:hover": {
                                                        textDecoration: "underline",
                                                    },
                                                }}
                                            >
                                                Privacy Policy
                                            </Link>
                                        </Box>
                                    </Box>
                                )}
                            />
                            {errors.acceptTerms && (
                                <FormHelperText error sx={{ mt: 0.5, ml: "32px" }}>
                                    {errors.acceptTerms.message}
                                </FormHelperText>
                            )}
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
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                                fontWeight: 600,
                                py: 1,
                                px: 4,
                            }}
                        >
                            <LockOutlinedIcon />
                            <Typography
                                component={"span"}
                                sx={{
                                    fontSize: 16,
                                    paddingLeft: 1,
                                    textTransform: "capitalize",
                                }}
                            >
                                Sign Up
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
                                sx={{
                                    fontSize: 16,
                                    paddingLeft: 1,
                                    textTransform: "capitalize",
                                }}
                            >
                                Continue with Google
                            </Typography>
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                mt: 1,
                                fontSize: 14,
                            }}
                        >
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                sx={{
                                    textDecoration: "none",
                                    pl: 1,
                                    fontSize: 14,
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}
