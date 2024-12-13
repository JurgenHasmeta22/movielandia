"use client";

import { Box, useTheme } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const spinAnimation = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
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
                bgcolor: "background.default",
                gap: 5,
            }}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Box
                    sx={{
                        width: { xs: 240, sm: 320 },
                        height: 120,
                        position: "relative",
                    }}
                >
                    <Image
                        src="/icons/movielandia24-logo.png"
                        alt="MovieLandia24 Loading"
                        width={320}
                        height={120}
                        priority
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </motion.div>
            <motion.div
                variants={spinAnimation}
                animate="animate"
                style={{
                    width: 48,
                    height: 48,
                    border: `3px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    borderTopColor: theme.palette.primary.main,
                    borderRadius: "50%",
                }}
            />
        </Box>
    );
};

export default LoadingSpinner;
