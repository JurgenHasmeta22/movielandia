"use client";

import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Zoom, useScrollTrigger } from "@mui/material";
import { useCallback } from "react";

function ScrollToTop() {
    const trigger = useScrollTrigger({
        threshold: 150,
    });

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                <Fab onClick={scrollToTop} size="large" aria-label="Scroll back to top">
                    <KeyboardArrowUp fontSize="large" />
                </Fab>
            </Box>
        </Zoom>
    );
}

export default ScrollToTop;
