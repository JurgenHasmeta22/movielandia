"use client";

import { CloseOutlined } from "@mui/icons-material";
import { Box, SwipeableDrawer, IconButton, useMediaQuery, useTheme, Typography, Divider, Paper } from "@mui/material";
import { useStore } from "@/store/store";
import { useEffect } from "react";
import { Session } from "next-auth";
import AuthButtons from "../authButtons/AuthButtons";
import { HeaderLinks } from "../header/HeaderLinks";
import ThemeToggleButton from "../themeToggleButton/ThemeToggleButton";
import SearchField from "../searchField/SearchField";
import { Genre } from "@prisma/client";
import NotificationMenu from "../notificationMenu/NotificationMenu";
import MessageCounter from "../header/MessageCounter";
import { motion, AnimatePresence } from "framer-motion";

interface IHeaderMobileProps {
    genres: Genre[];
    anchorElProfile: null | HTMLElement;
    session: Session | null;
    userName: string;
    openMenuProfile: (event: any) => void;
    closeMenuProfile: () => void;
    handleSignOut: () => Promise<void>;
}

export default function HeaderMobile({
    genres,
    anchorElProfile,
    openMenuProfile,
    closeMenuProfile,
    handleSignOut,
    userName,
    session,
}: IHeaderMobileProps) {
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const theme = useTheme();
    const isFullScreen = useMediaQuery(theme.breakpoints.up("md"));

    useEffect(() => {
        if (isFullScreen && isDrawerOpen) {
            setIsDrawerOpen(false);
        }
    }, [isFullScreen, isDrawerOpen]);

    const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <AnimatePresence>
            <SwipeableDrawer
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                variant="temporary"
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onOpen={() => setIsDrawerOpen(true)}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: { xs: "85%", sm: 320 },
                        boxSizing: "border-box",
                        backgroundColor: theme.vars.palette.background.paper,
                        boxShadow: 1,
                    },
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: "100%" }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderBottom: 1,
                                borderColor: "divider",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                onClick={() => setIsDrawerOpen(false)}
                                sx={{
                                    color: theme.vars.palette.primary.main,
                                    "&:hover": { color: theme.vars.palette.green.main },
                                }}
                            >
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <Box sx={{ width: "100%" }}>
                                <HeaderLinks genres={genres} />
                            </Box>
                            {session?.user && (
                                <Box sx={{ mt: "auto", borderTop: 1, borderColor: "divider" }}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "transparent" }}>
                                        <SearchField
                                            onClose={() => setIsDrawerOpen(false)}
                                            isMobile={true}
                                            customStyles={{ width: "100%", mb: 2 }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mt: 1,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", gap: 1 }}>
                                                <MessageCounter session={session} />
                                                <NotificationMenu session={session} />
                                                <ThemeToggleButton />
                                            </Box>
                                            <AuthButtons
                                                session={session}
                                                userName={userName}
                                                anchorElProfile={anchorElProfile}
                                                closeMenuProfile={closeMenuProfile}
                                                openMenuProfile={openMenuProfile}
                                                handleSignOut={handleSignOut}
                                            />
                                        </Box>
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </motion.div>
            </SwipeableDrawer>
        </AnimatePresence>
    );
}
