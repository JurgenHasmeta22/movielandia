"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
    const theme = useTheme();

    const bufferingCircle = {
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
            },
        },
    };

    const pulseAnimation = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%",
                background:
                    theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(25,118,210,0.1))"
                        : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(25,118,210,0.05))",
                gap: 6,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                component={motion.div}
                sx={{
                    position: "absolute",
                    width: "200%",
                    height: "200%",
                    background:
                        "radial-gradient(circle, transparent 20%, rgba(25,118,210,0.03) 20.5%, transparent 21%)",
                    backgroundSize: "40px 40px",
                    top: "-50%",
                    left: "-50%",
                    zIndex: 0,
                }}
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "400px",
                        height: "140px",
                        filter: "drop-shadow(0 0 12px rgba(25,118,210,0.2))",
                    }}
                >
                    <Image
                        src="/icons/movielandia24-logo.png"
                        alt="MovieLandia24 Loading"
                        width={400}
                        height={140}
                        priority
                        style={{
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <motion.div
                    variants={bufferingCircle}
                    animate="animate"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        border: `3px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        borderTop: `3px solid ${theme.palette.primary.main}`,
                        borderRadius: "50%",
                    }}
                />
                <motion.div
                    variants={pulseAnimation}
                    animate="animate"
                    style={{
                        position: "absolute",
                        width: "50%",
                        height: "50%",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main}40 70%, transparent 100%)`,
                    }}
                />
            </Box>
            <Typography
                variant="body1"
                sx={{
                    color: theme.palette.mode === "dark" ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.875rem",
                    position: "relative",
                    zIndex: 1,
                    textShadow:
                        theme.palette.mode === "dark" ? "0 0 10px rgba(255,255,255,0.2)" : "0 0 10px rgba(0,0,0,0.1)",
                    marginTop: -1,
                }}
            >
                Loading
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;
