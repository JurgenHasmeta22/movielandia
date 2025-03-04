"use client";

import { useStore } from "@/store/store";
import { AppBar, Box, IconButton, Toolbar, useTheme } from "@mui/material";
import AuthButtons from "../authButtons/AuthButtons";
import ThemeToggleButton from "../themeToggleButton/ThemeToggleButton";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderLinks } from "./HeaderLinks";
import { Genre } from "@prisma/client";
import { Session } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import HeaderMobile from "../headerMobile/HeaderMobile";
import { showToast } from "@/utils/helpers/toast";
import SearchField from "../searchField/SearchField";
import type {} from "@mui/material/themeCssVarsAugmentation";
import NotificationMenu from "../notificationMenu/NotificationMenu";
import MessageCounter from "./MessageCounter";

interface IHeaderContentProps {
    session: Session | null;
    genres: Genre[];
    userName: string;
}

export function HeaderContent({ session, genres, userName }: IHeaderContentProps) {
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();
    const theme = useTheme();

    const router = useRouter();

    const openMenuProfile = (event: any) => {
        setAnchorElProfile(event.currentTarget);
    };

    const closeMenuProfile = () => {
        setAnchorElProfile(null);
    };

    const handleSignOut = async () => {
        closeMenuProfile();
        await signOut({ redirect: false });

        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }

        router.push("/login");
        router.refresh();
        showToast("success", "You are succesfully logged out!");
    };

    const handleSearchFocusChange = (focused: boolean) => {
        setIsSearchFocused(focused);
    };

    return (
        <>
            <AppBar position="fixed" component={"header"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "nowrap",
                        py: 1.5,
                        backgroundColor: theme.vars.palette.primary.dark,
                        minHeight: 72,
                        px: 2, // Slightly reduced horizontal padding
                    }}
                    component={"nav"}
                >
                    {/* Hamburger Button */}
                    <Box
                        sx={{
                            display: {
                                xs: "block",
                                sm: "block",
                                md: "none",
                                lg: "none",
                            },
                        }}
                    >
                        <IconButton
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setIsDrawerOpen(true)}
                            sx={{
                                color: theme.vars.palette.primary.main,
                                "&:hover": {
                                    color: theme.vars.palette.green.main,
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "none",
                                md: "flex",
                                lg: "flex",
                            },
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flex: "0 0 auto",
                            }}
                        >
                            <HeaderLinks genres={genres} />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                ml: "auto",
                                flex: "0 0 auto",
                            }}
                        >
                            {session?.user && <MessageCounter session={session} />}
                            {session?.user && <NotificationMenu session={session} />}
                            <SearchField
                                onFocusChange={handleSearchFocusChange}
                                onClose={() => setIsSearchFocused(false)}
                            />
                            {!isSearchFocused && (
                                <>
                                    <ThemeToggleButton />
                                    <AuthButtons
                                        session={session}
                                        userName={userName}
                                        anchorElProfile={anchorElProfile}
                                        closeMenuProfile={closeMenuProfile}
                                        openMenuProfile={openMenuProfile}
                                        handleSignOut={handleSignOut}
                                    />
                                </>
                            )}
                        </Box>
                    </Box>

                    {/* Hamburger Button */}
                    <Box
                        sx={{
                            display: {
                                xs: "block",
                                sm: "block",
                                md: "none",
                                lg: "none",
                            },
                        }}
                    >
                        <IconButton
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setIsDrawerOpen(true)}
                            sx={{
                                color: theme.vars.palette.primary.main,
                                "&:hover": {
                                    color: theme.vars.palette.green.main,
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>

                    {/* Mobile Header Toggled sidebar */}
                    <HeaderMobile
                        genres={genres}
                        anchorElProfile={anchorElProfile}
                        openMenuProfile={openMenuProfile}
                        closeMenuProfile={closeMenuProfile}
                        handleSignOut={handleSignOut}
                        session={session}
                        userName={userName}
                    />
                </Toolbar>
            </AppBar>
        </>
    );
}
