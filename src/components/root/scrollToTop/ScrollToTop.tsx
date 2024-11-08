"use client";

import { IS_BROWSER } from "@/utils/helpers/utils";
import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Zoom, useScrollTrigger, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

function ScrollToTop() {
    const theme = useTheme();

    const trigger = useScrollTrigger({
        threshold: 150,
        disableHysteresis: true,
    });

    const scrollToTop = () => {
        if (IS_BROWSER) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

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
                        color: theme.vars.palette.green.main,
                        backgroundColor: theme.vars.palette.primary.main,
                    }}
                >
                    <KeyboardArrowUp fontSize="large" />
                </Fab>
            </Box>
        </Zoom>
    );
}

export default ScrollToTop;
