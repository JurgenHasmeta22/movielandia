"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    Link as MuiLink,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";

const loginSchema = yup.object().shape({
    email: yup.string().required("Email is a required field").email("Invalid email format"),
    password: yup
        .string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const router = useRouter();

    async function handleSubmitLogin(
        values: { email: string; password: string },
        setSubmitting: (isSubmitting: boolean) => void,
    ) {
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

        setSubmitting(false);
    }

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmitLogin(values, setSubmitting);
            }}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
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
                        <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                            <Box display={"flex"} flexDirection="row" columnGap={1}>
                                <EmailIcon />
                                <FormLabel component={"label"}>Email</FormLabel>
                            </Box>
                            <TextField
                                type="text"
                                name="email"
                                aria-label="Email"
                                required
                                value={values.email}
                                onChange={handleChange}
                                autoComplete="username"
                                hiddenLabel={true}
                                aria-autocomplete="both"
                                onBlur={handleBlur}
                                size="small"
                                helperText={touched["email"] && errors["email"]}
                                error={touched["email"] && !!errors["email"]}
                            />
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                            <Box display={"flex"} flexDirection="row" columnGap={1}>
                                <PasswordIcon />
                                <FormLabel component={"label"}>Password</FormLabel>
                            </Box>
                            <FormControl variant="outlined" fullWidth size="small">
                                <Box sx={{ minHeight: "100px" }}>
                                    <TextField
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        aria-label="Current password"
                                        hiddenLabel={true}
                                        aria-autocomplete="both"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={touched.password && !!errors.password}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText
                                            error
                                            sx={{
                                                whiteSpace: "normal",
                                                overflowWrap: "break-word",
                                                wordWrap: "break-word",
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </Box>
                            </FormControl>
                        </Box>
                        <Button
                            type="submit"
                            variant="outlined"
                            sx={{ fontWeight: 600, py: 1 }}
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
                </Form>
            )}
        </Formik>
    );
}
