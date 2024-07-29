"use client";

import { useStore } from "@/store/store";
import { AppBar, Box, IconButton, Stack, Toolbar, useTheme } from "@mui/material";
import SearchField from "../../features/searchField/SearchField";
import AuthButtons from "../../ui/authButtons/AuthButtons";
import ThemeToggleButton from "../../ui/themeToggleButton/ThemeToggleButton";
import { tokens } from "@/utils/theme/theme";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderLinks } from "./HeaderLinks";
import { Genre } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import HeaderMenu from "../headerMenu/HeaderMenu";
import { useResizeWindow } from "@/hooks/useResizeWindow";

interface IHeaderContent {
    session: Session | null;
    genres: Genre[];
}

export function HeaderContent({ session, genres }: IHeaderContent) {
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const { mobileOpen, setOpenDrawer, setMobileOpen } = useStore();

    const router = useRouter();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isPageShrunk = useResizeWindow();

    const openMenuGenres = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorElGenres(event.currentTarget);
    };

    const closeMenuGenres = () => {
        setAnchorElGenres(null);
    };

    const openMenuProfile = (event: any) => {
        setAnchorElProfile(event.currentTarget);
    };

    const closeMenuProfile = () => {
        setAnchorElProfile(null);
    };

    const handleSignOut = async () => {
        closeMenuProfile();
        await signOut({ redirect: false });
        router.push("/login");
        router.refresh();
    };

    useEffect(() => {
        if (isPageShrunk) {
            setMobileOpen(true);
        } else {
            setMobileOpen(false);
            setOpenDrawer(false);
        }
    }, [isPageShrunk]);

    return (
        <>
            <AppBar position="fixed" component={"header"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: `${mobileOpen ? "start" : "space-around"}`,
                        flexWrap: "wrap",
                        py: 2,
                        backgroundColor: colors.primary[900],
                    }}
                    component={"nav"}
                >
                    {mobileOpen ? (
                        <Box>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={() => {
                                    setOpenDrawer(true);
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Stack
                            flexDirection={"row"}
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            columnGap={3}
                            flexWrap={"wrap"}
                        >
                            <HeaderLinks
                                genres={genres}
                                openMenuGenres={openMenuGenres}
                                closeMenuGenres={closeMenuGenres}
                                anchorElGenres={anchorElGenres}
                            />
                            <Box sx={{ display: "flex", placeItems: "center", columnGap: 1 }}>
                                <SearchField />
                                <ThemeToggleButton />
                                <AuthButtons
                                    session={session}
                                    anchorElProfile={anchorElProfile}
                                    closeMenuProfile={closeMenuProfile}
                                    openMenuProfile={openMenuProfile}
                                    handleSignOut={handleSignOut}
                                />
                            </Box>
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
            <HeaderMenu
                closeMenuGenres={closeMenuGenres}
                genres={genres}
                anchorElProfile={anchorElProfile}
                openMenuProfile={openMenuProfile}
                closeMenuProfile={closeMenuProfile}
                handleLogout={handleSignOut}
                session={session}
            />
        </>
    );
}
