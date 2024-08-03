"use client";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Zoom, useScrollTrigger, useTheme } from "@mui/material";
import { useCallback } from "react";
import { tokens } from "@/utils/theme/theme";

function ScrollToTop() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const trigger = useScrollTrigger({
        threshold: 150,
        disableHysteresis: true,
    });

    const scrollToTop = useCallback(() => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    return (
        <Zoom in={trigger}>
            <Box
                role="presentation"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1,
                }}
            >
                <Fab
                    onClick={scrollToTop}
                    size="large"
                    aria-label="Scroll back to top"
                    sx={{
                        color: colors.primary[900],
                        backgroundColor: colors.primary[100],
                    }}
                >
                    <KeyboardArrowUp fontSize="large" />
                </Fab>
            </Box>
        </Zoom>
    );
}

export default ScrollToTop;
