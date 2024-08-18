"use client";

import { Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import EmailIcon from "@mui/icons-material/Email";
import { useState } from "react";
import { showToast } from "@/utils/helpers/toast";

const resetPasswordSchema = yup.object().shape({
    email: yup.string().required("Email is a required field").email("Invalid email format"),
});

export default function ResetPasswordPage() {
    const [isSubmitting, setSubmitting] = useState(false);

    async function handleSubmitResetPassword(
        values: { email: string },
        setSubmitting: (isSubmitting: boolean) => void,
    ) {
        setSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        showToast("success", "If an account exists for this email, you will receive a password reset link.");
        setSubmitting(false);
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                rowGap: 4,
            }}
        >
            <Box display={"flex"} flexDirection="row" alignItems={"center"} justifyContent={"center"} sx={{ pb: 2 }}>
                <Typography variant="h2" textAlign={"center"}>
                    Reset Password
                </Typography>
            </Box>
            <Formik
                initialValues={{ email: "" }}
                validationSchema={resetPasswordSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleSubmitResetPassword(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                                width: 300,
                                maxWidth: "100%",
                            }}
                        >
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
                                onBlur={handleBlur}
                                autoComplete="email"
                                hiddenLabel={true}
                                aria-autocomplete="both"
                                size="small"
                                placeholder="Enter your email address"
                                helperText={touched["email"] && errors["email"]}
                                error={touched["email"] && !!errors["email"]}
                            />
                            <Button
                                type="submit"
                                variant="text"
                                sx={{ fontWeight: 700, py: 1, fontSize: 18, textTransform: "capitalize" }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}
