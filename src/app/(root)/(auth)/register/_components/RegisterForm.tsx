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
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import Link from "next/link";
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

        try {
            await signUp(userData);
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while registering the user.");
            }
        } finally {
            setSubmitting(false);
        }
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
                                sx={{ pb: 1 }}
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
                            <Box sx={{ display: "flex", flexDirection: "column", rowGap: 4 }}>
                                <Box display={"flex"} flexDirection={"row"} columnGap={4}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            display: "flex",
                                            rowGap: 1,
                                        }}
                                    >
                                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
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
                                            InputProps={{
                                                sx: { flexGrow: 1 },
                                            }}
                                            error={touched.userName && !!errors.userName}
                                            helperText={touched.userName && errors.userName}
                                        />
                                    </FormControl>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            display: "flex",
                                            rowGap: 1,
                                        }}
                                    >
                                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                                            <EmailIcon />
                                            <FormLabel component={"label"}>Email</FormLabel>
                                        </Box>
                                        <TextField
                                            type="text"
                                            name="email"
                                            required
                                            value={values.email}
                                            autoComplete="email"
                                            aria-label="Email"
                                            hiddenLabel={true}
                                            aria-autocomplete="both"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="small"
                                            InputProps={{
                                                sx: { flexGrow: 1 },
                                            }}
                                            error={touched.email && !!errors.email}
                                            helperText={touched.email && errors.email}
                                        />
                                    </FormControl>
                                </Box>
                                <Box display={"flex"} flexDirection={"row"} columnGap={4}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            display: "flex",
                                            rowGap: 1,
                                        }}
                                    >
                                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                                            <PasswordIcon />
                                            <FormLabel component={"label"}>Password</FormLabel>
                                        </Box>
                                        <Box sx={{ minHeight: "100px" }}>
                                            <TextField
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                value={values.password}
                                                autoComplete="current-password"
                                                aria-label="Password"
                                                hiddenLabel={true}
                                                aria-autocomplete="both"
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
                                                    sx: { flexGrow: 1 },
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
                                                        maxWidth: "220px",
                                                    }}
                                                >
                                                    {errors.password}
                                                </FormHelperText>
                                            )}
                                        </Box>
                                    </FormControl>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            display: "flex",
                                            rowGap: 1,
                                        }}
                                    >
                                        <Box display={"flex"} flexDirection="row" alignItems="center" columnGap={1}>
                                            <PasswordIcon />
                                            <FormLabel component={"label"}>Confirm Password</FormLabel>
                                        </Box>
                                        <TextField
                                            type={showPasswordConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            value={values.confirmPassword}
                                            autoComplete="current-password"
                                            aria-label="Confirm password"
                                            hiddenLabel={true}
                                            aria-autocomplete="both"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPasswordConfirm}
                                                            onMouseDown={handleMouseDownPasswordConfirm}
                                                            edge="end"
                                                        >
                                                            {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                sx: { flexGrow: 1 },
                                            }}
                                            error={touched.confirmPassword && !!errors.confirmPassword}
                                        />
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <FormHelperText
                                                error
                                                sx={{
                                                    whiteSpace: "normal",
                                                    overflowWrap: "break-word",
                                                    wordWrap: "break-word",
                                                    maxWidth: "100%",
                                                }}
                                            >
                                                {errors.confirmPassword}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 600,
                                        py: 1,
                                        px: 4,
                                        textTransform: "capitalize",
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <LockOutlinedIcon />
                                    <Typography
                                        component={"span"}
                                        sx={{
                                            paddingLeft: 1,
                                            fontSize: 16,
                                        }}
                                    >
                                        Sign Up
                                    </Typography>
                                </Button>
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    component={"span"}
                                    sx={{
                                        textTransform: "capitalize",
                                        fontSize: 12,
                                    }}
                                >
                                    Already have an account?
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
