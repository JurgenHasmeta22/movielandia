"use client";

import { Box, Button, Container, TextField, Typography, useTheme } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const NewsletterSection = () => {
    const theme = useTheme();

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 6, md: 8 },
                backgroundColor:
                    theme.palette.mode === "dark" ? "rgba(25, 118, 210, 0.05)" : "rgba(25, 118, 210, 0.02)",
                position: "relative",
                width: "100%",
                overflow: "hidden",
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.03,
                    backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                }}
            />

            <Container maxWidth="md">
                <Box
                    sx={{
                        textAlign: "center",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            backgroundColor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            mb: 3,
                        }}
                    >
                        <MailOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                fontSize: 14,
                            }}
                        >
                            Stay Updated
                        </Typography>
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: 28, sm: 32, md: 40 },
                            fontWeight: 800,
                            mb: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Subscribe to Our Newsletter
                    </Typography>

                    <Typography
                        variant="h3"
                        sx={{
                            fontSize: { xs: 16, sm: 18 },
                            color: "text.secondary",
                            mb: 4,
                            maxWidth: "600px",
                            mx: "auto",
                        }}
                    >
                        Get notified about new releases, exclusive content, and special events. Join our community of
                        movie enthusiasts!
                    </Typography>

                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            maxWidth: "500px",
                            mx: "auto",
                        }}
                        noValidate
                    >
                        <TextField
                            fullWidth
                            placeholder="Enter your email"
                            variant="outlined"
                            type="email"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: theme.palette.background.paper,
                                    height: 56,
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                minWidth: { xs: "100%", sm: 180 },
                                height: 56,
                                textTransform: "none",
                                fontSize: 16,
                                fontWeight: 600,
                                color: theme.palette.background.default,
                                background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.15)",
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                },
                                "&:active": {
                                    transform: "translateY(0)",
                                },
                            }}
                        >
                            Subscribe
                        </Button>
                    </Box>

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 2,
                            color: "text.secondary",
                        }}
                    >
                        By subscribing, you agree to our Privacy Policy and Terms of Service.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default NewsletterSection;
