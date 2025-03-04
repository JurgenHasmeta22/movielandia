"use client";

import { CloseOutlined } from "@mui/icons-material";
import { Box, SwipeableDrawer, IconButton, useMediaQuery, useTheme, Button, Divider } from "@mui/material";
import { useStore } from "@/store/store";
import { useEffect } from "react";
import { Session } from "next-auth";
import AuthButtons from "../authButtons/AuthButtons";
import { HeaderLinks } from "../header/HeaderLinks";
import ThemeToggleButton from "../themeToggleButton/ThemeToggleButton";
import SearchField from "../searchField/SearchField";
import { Genre } from "@prisma/client";
import EmailIcon from "@mui/icons-material/Email";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import NotificationMenu from "../notificationMenu/NotificationMenu";
import Image from "next/image";

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
    }, [isFullScreen, isDrawerOpen, setIsDrawerOpen]);

    const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
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
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <MuiNextLink href="/" onClick={() => setIsDrawerOpen(false)}>
                        <Image
                            src="/icons/movielandia24-logo.png"
                            alt="MovieLandia24"
                            width={120}
                            height={40}
                            style={{ display: "block" }}
                            priority
                        />
                    </MuiNextLink>
                    <IconButton
                        onClick={() => setIsDrawerOpen(false)}
                        sx={{
                            color: theme.vars.palette.primary.main,
                            "&:hover": {
                                color: theme.vars.palette.green.main,
                            },
                        }}
                    >
                        <CloseOutlined />
                    </IconButton>
                </Box>

                {/* Search */}
                <Box sx={{ p: 2 }}>
                    <SearchField />
                </Box>

                {/* Navigation */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        px: 2,
                        py: 1,
                    }}
                >
                    <HeaderLinks genres={genres} />
                </Box>

                <Divider />

                {/* User Actions */}
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    {session?.user && (
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                LinkComponent={MuiNextLink}
                                href="/messages"
                                variant="outlined"
                                size="small"
                                startIcon={<EmailIcon />}
                                onClick={() => setIsDrawerOpen(false)}
                                sx={{
                                    color: theme.vars.palette.primary.main,
                                    borderColor: theme.vars.palette.primary.main,
                                    "&:hover": {
                                        borderColor: theme.vars.palette.green.main,
                                        color: theme.vars.palette.green.main,
                                    },
                                }}
                            >
                                Messages
                            </Button>
                            <NotificationMenu session={session} />
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <ThemeToggleButton />
                        <AuthButtons
                            session={session}
                            userName={userName}
                            anchorElProfile={anchorElProfile}
                            closeMenuProfile={closeMenuProfile}
                            openMenuProfile={openMenuProfile}
                            handleSignOut={handleSignOut}
                        />
                    </Box>
                </Box>
            </Box>
        </SwipeableDrawer>
    );
}
