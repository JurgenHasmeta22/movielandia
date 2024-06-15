"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
// import * as CONSTANTS from "@/constants/Constants";
// import { toast } from "react-toastify";
import Link from "next/link";

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

    // async function onSubmitLogin(values: any) {
    //     const response = await onLogin(values.email, values.password);

    //     if (response && !response.error) {
    //         toast.success(CONSTANTS.LOGIN__SUCCESS);
    //     } else {
    //         toast.error(CONSTANTS.LOGIN__FAILURE);
    //     }
    // }

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values: any) => {
                // onSubmitLogin(values);
                console.log(values);
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                            }}
                        >
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
                                    // @ts-expect-error helper
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
                                    // @ts-expect-error helper
                                    helperText={touched["password"] && errors["password"]}
                                    error={touched["password"] && !!errors["password"]}
                                />
                            </Box>
                            <Button
                                type="submit"
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    py: 1,
                                }}
                            >
                                <LockOutlinedIcon />
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: 14,
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Sign In
                                </Typography>
                            </Button>
                            <Box>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: 12,
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Don&apos;t have an account ?
                                </Typography>
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                    href={"/register"}
                                >
                                    Sign Up
                                </Link>
                            </Box>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
}
