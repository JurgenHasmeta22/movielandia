"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";

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
    const router = useRouter();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={async (values, { setSubmitting }) => {
                const result = await signIn("credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                    callbackUrl: "/",
                });

                if (result?.error) {
                    showToast("error", "Your credentials are wrong!");
                } else if (result?.url) {
                    router.push(result.url);
                }

                setSubmitting(false);
            }}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
                        <Typography variant="h2">Sign In</Typography>
                        <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                            <FormLabel component={"label"}>Email</FormLabel>
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
                                InputProps={{ color: "secondary" }}
                                InputLabelProps={{ color: "secondary" }}
                                helperText={touched["email"] && errors["email"]}
                                error={touched["email"] && !!errors["email"]}
                            />
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                            <FormLabel component={"label"}>Password</FormLabel>
                            <TextField
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                autoComplete="current-password"
                                aria-label="Current password"
                                aria-autocomplete="both"
                                hiddenLabel={true}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                InputProps={{
                                    color: "secondary",
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? (
                                                    <Visibility color="secondary" />
                                                ) : (
                                                    <VisibilityOff color="secondary" />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                                InputLabelProps={{ color: "secondary" }}
                                helperText={touched["password"] && errors["password"]}
                                error={touched["password"] && !!errors["password"]}
                            />
                        </Box>
                        <Button
                            type="submit"
                            color="secondary"
                            variant="outlined"
                            sx={{ fontWeight: 600, py: 1 }}
                            disabled={isSubmitting}
                        >
                            <LockOutlinedIcon />
                            <Typography
                                component={"span"}
                                sx={{ fontSize: 14, paddingLeft: 4, textTransform: "capitalize" }}
                            >
                                Sign In
                            </Typography>
                        </Button>
                        <Box>
                            <Typography
                                component={"span"}
                                sx={{ fontSize: 12, paddingLeft: 4, textTransform: "capitalize" }}
                            >
                                Don&apos;t have an account ?
                            </Typography>
                            <Link
                                style={{ textDecoration: "none", paddingLeft: 4, textTransform: "capitalize" }}
                                href={"/register"}
                            >
                                Sign Up
                            </Link>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
