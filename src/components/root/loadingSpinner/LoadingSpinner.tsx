"use client";

import React from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LoadingSpinner: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%",
                background: "rgba(0, 0, 0, 0.02)",
            }}
        >
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                        opacity: { duration: 0.4 },
                        scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "300px",
                        height: "105px",
                        filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))",
                    }}
                >
                    <Image
                        src="/icons/movielandia24-logo.png"
                        alt="MovieLandia24 Loading"
                        width={300}
                        height={105}
                        priority
                        style={{
                            objectFit: "contain",
                            willChange: "transform",
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </Box>
    );
};

export default LoadingSpinner;
