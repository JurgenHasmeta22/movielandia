"use client";

import React from "react";
import { Container, Typography, Box, Stack, useTheme, Paper, TextField, Button } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "@/utils/helpers/toast";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactUsContent = () => {
    const theme = useTheme();
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            // Here you would typically send the data to your backend
            console.log("Form data:", data);
            showToast("success", "Message sent successfully! We&apos;ll get back to you soon.");
            reset();
        } catch (error) {
            showToast("error", "Failed to send message. Please try again later.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 6,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}22 0%, ${theme.vars.palette.primary.main}11 100%)`,
                    }}
                >
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            color: theme.vars.palette.primary.main,
                            fontWeight: 800,
                            textAlign: "center",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: theme.vars.palette.text.secondary,
                            maxWidth: "800px",
                            mx: "auto",
                            mb: 4,
                        }}
                    >
                        We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                    </Typography>
                </Paper>

                <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                    <Box flex={1}>
                        <Stack spacing={4}>
                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <EmailIcon sx={{ color: theme.vars.palette.red.main, fontSize: 30 }} />
                                    <Box>
                                        <Typography variant="h6" color="primary">
                                            Email
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            info@movielandia.com
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <PhoneIcon sx={{ color: theme.vars.palette.red.main, fontSize: 30 }} />
                                    <Box>
                                        <Typography variant="h6" color="primary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            +1 (555) 123-4567
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box
                                component={motion.div}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <LocationOnIcon sx={{ color: theme.vars.palette.red.main, fontSize: 30 }} />
                                    <Box>
                                        <Typography variant="h6" color="primary">
                                            Address
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            123 Movie Street
                                            <br />
                                            Hollywood, CA 90028
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    <Box
                        flex={2}
                        component={motion.div}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}11 0%, ${theme.vars.palette.primary.main}22 100%)`,
                            }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Name"
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                fullWidth
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                fullWidth
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="subject"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Subject"
                                                error={!!errors.subject}
                                                helperText={errors.subject?.message}
                                                fullWidth
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="message"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Message"
                                                multiline
                                                rows={4}
                                                error={!!errors.message}
                                                helperText={errors.message?.message}
                                                fullWidth
                                            />
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            py: 1.5,
                                            color: theme.vars.palette.secondary.light,
                                            bgcolor: theme.vars.palette.red.main,
                                            "&:hover": {
                                                bgcolor: theme.vars.palette.red.dark,
                                            },
                                        }}
                                    >
                                        Send Message
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Box>
                </Stack>
            </motion.div>
        </Container>
    );
};

export default ContactUsContent;
