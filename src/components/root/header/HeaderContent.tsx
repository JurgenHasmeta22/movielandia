"use client";

import { useStore } from "@/store/store";
import { AppBar, Box, Button, IconButton, Toolbar, useTheme } from "@mui/material";
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
import MuiNextLink from "../muiNextLink/MuiNextLink";
import EmailIcon from "@mui/icons-material/Email";

interface IHeaderContentProps {
    session: Session | null;
    genres: Genre[];
    userName: string;
}

export function HeaderContent({ session, genres, userName }: IHeaderContentProps) {
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const router = useRouter();
    const theme = useTheme();

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

    return (
        <>
            <AppBar position="fixed" component={"header"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: {
                            xs: "flex-start",
                            sm: "flex-start",
                            md: "space-between",
                            lg: "space-between",
                        },
                        flexWrap: "nowrap",
                        py: 1.5,
                        backgroundColor: theme.vars.palette.primary.dark,
                        minHeight: 72,
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
                            onClick={() => {
                                setIsDrawerOpen(true);
                            }}
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
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            px: 2,
                        }}
                    >
                        <HeaderLinks genres={genres} />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                ml: "auto",
                                height: "100%",
                                flexShrink: 0,
                            }}
                        >
                            <SearchField />
                            {session?.user && (
                                <Box>
                                    <Button
                                        LinkComponent={MuiNextLink}
                                        href="/messages"
                                        variant="text"
                                        sx={{
                                            color: theme.vars.palette.primary.main,
                                        }}
                                    >
                                        <EmailIcon />
                                    </Button>
                                </Box>
                            )}
                            {session?.user && <NotificationMenu session={session} />}
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
                </Toolbar>
            </AppBar>
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
        </>
    );
}
