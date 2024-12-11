"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const spinAnimation = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
        },
    },
};

const pulseAnimation = {
    animate: {
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const dotAnimation = {
    animate: {
        opacity: [0, 1, 0],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const LoadingSpinner = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                background: isDark
                    ? `linear-gradient(135deg, 
                        rgba(0,0,0,0.97), 
                        rgba(25,118,210,0.15))`
                    : `linear-gradient(135deg, 
                        rgba(255,255,255,0.97), 
                        rgba(25,118,210,0.08))`,
                gap: 5,
                position: "relative",
                isolation: "isolate",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    height: "100%",
                    background: `radial-gradient(circle at center, 
                        ${theme.palette.primary.main}15 0%, 
                        transparent 70%)`,
                    filter: "blur(40px)",
                }}
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        width: { xs: 280, sm: 400 },
                        height: 140,
                        filter: `drop-shadow(0 0 20px ${theme.palette.primary.main}30)`,
                        position: "relative",
                    }}
                >
                    <Image
                        src="/icons/movielandia24-logo.png"
                        alt="MovieLandia24 Loading"
                        width={400}
                        height={140}
                        priority
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </motion.div>
            <Box
                sx={{
                    position: "relative",
                    width: 70,
                    height: 70,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <motion.div
                    variants={spinAnimation}
                    animate="animate"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        border: `3px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                        borderTopColor: theme.palette.primary.main,
                        borderRadius: "50%",
                        boxShadow: `0 0 15px ${theme.palette.primary.main}40`,
                    }}
                />
                <motion.div
                    variants={pulseAnimation}
                    animate="animate"
                    style={{
                        position: "absolute",
                        width: "40%",
                        height: "40%",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, 
                            ${theme.palette.primary.main} 0%, 
                            ${theme.palette.primary.main}40 70%, 
                            transparent 100%)`,
                        filter: "blur(1px)",
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
                        fontWeight: 500,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        textShadow: `0 0 10px ${theme.palette.primary.main}40`,
                    }}
                >
                    Loading
                </Typography>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        variants={dotAnimation}
                        animate="animate"
                        style={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            backgroundColor: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
                            animationDelay: `${i * 0.3}s`,
                        }}
                        transition={{
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default LoadingSpinner;
