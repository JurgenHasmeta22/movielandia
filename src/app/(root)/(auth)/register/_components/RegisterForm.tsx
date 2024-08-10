"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import { signUp } from "@/actions/auth.actions";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import PersonIcon from "@mui/icons-material/Person";

const registerSchema = yup.object().shape({
    userName: yup
        .string()
        .required("Username is a required field")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username can't be longer than 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: yup.string().required("Email is a required field").email("Invalid email format"),
    password: yup
        .string()
        .required("Password is a required field")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const router = useRouter();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);
    const handleMouseDownPasswordConfirm = () => setShowPasswordConfirm(!showPasswordConfirm);

    async function handleSubmitRegister(
        values: {
            userName: string;
            email: string;
            password: string;
            confirmPassword: string;
        },
        setSubmitting: (isSubmitting: boolean) => void,
    ) {
        const userData = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        };

        const result = await signUp(userData);

        if (!result) {
            showToast("error", "User already exists or something is wrong with the data you provided!");
        } else {
            router.push("/login");
        }

        setSubmitting(false);
    }

    return (
        <Formik
            initialValues={{
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
            }}
            validationSchema={registerSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmitRegister(values, setSubmitting);
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting }) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                            }}
                        >
                            <Box
                                display={"flex"}
                                flexDirection="row"
                                columnGap={1}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <LockOutlinedIcon fontSize="large" />
                                <Typography
                                    variant="h2"
                                    sx={{
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Sign Up
                                </Typography>
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <Box display={"flex"} flexDirection="row" columnGap={1}>
                                    <PersonIcon />
                                    <FormLabel component={"label"}>Username</FormLabel>
                                </Box>
                                <TextField
                                    type="text"
                                    name="userName"
                                    required
                                    value={values.userName}
                                    autoComplete="username"
                                    aria-label="Username"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    size="small"
                                    helperText={touched["userName"] && errors["userName"]}
                                    error={touched["userName"] && !!errors["userName"]}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <Box display={"flex"} flexDirection="row" columnGap={1}>
                                    <EmailIcon />
                                    <FormLabel component={"label"}>Email</FormLabel>
                                </Box>
                                <TextField
                                    type="text"
                                    name="email"
                                    required
                                    value={values.email}
                                    autoComplete="username"
                                    aria-label="Email"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    onChange={handleChange}
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                    helperText={touched["password"] && errors["password"]}
                                    error={touched["password"] && !!errors["password"]}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <Box display={"flex"} flexDirection="row" columnGap={1}>
                                    <PasswordIcon />
                                    <FormLabel component={"label"}>Confirm password</FormLabel>
                                </Box>
                                <TextField
                                    type={showPasswordConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    autoComplete="current-password"
                                    aria-label="Confirm password"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPasswordConfirm}
                                                    onMouseDown={handleMouseDownPasswordConfirm}
                                                >
                                                    {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                    helperText={touched["confirmPassword"] && errors["confirmPassword"]}
                                    error={touched["confirmPassword"] && !!errors["confirmPassword"]}
                                />
                            </Box>
                            <Button
                                type="submit"
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    py: 1,
                                }}
                                disabled={isSubmitting}
                            >
                                <LockOutlinedIcon />
                                <Typography
                                    component={"span"}
                                    style={{
                                        paddingLeft: 1,
                                        textTransform: "capitalize",
                                        fontSize: 16,
                                    }}
                                >
                                    Sign Up
                                </Typography>
                            </Button>
                            <Box>
                                <Typography
                                    component={"span"}
                                    style={{
                                        textTransform: "capitalize",
                                        fontSize: 12,
                                    }}
                                >
                                    Already have an account ?
                                </Typography>
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                    href={"/login"}
                                >
                                    Sign In
                                </Link>
                            </Box>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
}
