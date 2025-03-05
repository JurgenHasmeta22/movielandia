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
import NotificationMenu from "../notificationMenu/NotificationMenu";
import Image from "next/image";
import Link from "next/link";

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
                    <Link href="/" onClick={() => setIsDrawerOpen(false)} style={{ display: "block" }}>
                        <Image
                            src="/icons/movielandia24-logo.png"
                            alt="MovieLandia24"
                            width={120}
                            height={40}
                            style={{ display: "block" }}
                            priority
                        />
                    </Link>
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

                <Box
                    sx={{
                        p: 2,
                        width: "100%",
                    }}
                >
                    <SearchField
                        onClose={() => setIsDrawerOpen(false)}
                        isMobile={true}
                        customStyles={{
                            width: "100%",
                        }}
                    />
                </Box>

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
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Link
                                    href="/messages"
                                    onClick={() => setIsDrawerOpen(false)}
                                    style={{ textDecoration: "none" }}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            color: theme.vars.palette.primary.main,
                                            "&:hover": {
                                                color: theme.vars.palette.green.main,
                                            },
                                        }}
                                    >
                                        <EmailIcon />
                                    </IconButton>
                                </Link>
                                <NotificationMenu session={session} />
                            </Box>
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
