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
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import PasswordIcon from "@mui/icons-material/Password";

const changePasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

export default function ChangePasswordForm() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const router = useRouter();

    async function handleSubmitChangePassword(
        values: { newPassword: string; confirmPassword: string },
        setSubmitting: (isSubmitting: boolean) => void,
    ) {
        try {
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword: values.newPassword }),
            });

            if (response.ok) {
                showToast("success", "Your password has been changed successfully.");
                router.push("/");
            } else {
                const data = await response.json();
                showToast("error", data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            showToast("error", "An error occurred. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={changePasswordSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmitChangePassword(values, setSubmitting);
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
                                Change Password
                            </Typography>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                            <Box display={"flex"} flexDirection="row" columnGap={1}>
                                <PasswordIcon />
                                <FormLabel component={"label"}>New Password</FormLabel>
                            </Box>
                            <FormControl variant="outlined" fullWidth size="small">
                                <Box sx={{ minHeight: "100px" }}>
                                    <TextField
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        required
                                        autoComplete="new-password"
                                        aria-label="New password"
                                        hiddenLabel={true}
                                        aria-autocomplete="both"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle new password visibility"
                                                        onClick={handleClickShowNewPassword}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={touched.newPassword && !!errors.newPassword}
                                    />
                                    {touched.newPassword && errors.newPassword && (
                                        <FormHelperText
                                            error
                                            sx={{
                                                whiteSpace: "normal",
                                                overflowWrap: "break-word",
                                                wordWrap: "break-word",
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {errors.newPassword}
                                        </FormHelperText>
                                    )}
                                </Box>
                            </FormControl>
                        </Box>
                        <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                            <Box display={"flex"} flexDirection="row" columnGap={1}>
                                <PasswordIcon />
                                <FormLabel component={"label"}>Confirm New Password</FormLabel>
                            </Box>
                            <FormControl variant="outlined" fullWidth size="small">
                                <Box sx={{ minHeight: "100px" }}>
                                    <TextField
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        autoComplete="new-password"
                                        aria-label="Confirm new password"
                                        hiddenLabel={true}
                                        aria-autocomplete="both"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
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
                                                maxWidth: "200px",
                                            }}
                                        >
                                            {errors.confirmPassword}
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
                                Change Password
                            </Typography>
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
}
