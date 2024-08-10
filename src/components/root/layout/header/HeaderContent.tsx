"use client";

import { useStore } from "@/store/store";
import { AppBar, Box, CssVarsTheme, IconButton, Stack, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import SearchField from "../../features/searchField/SearchField";
import AuthButtons from "../../ui/authButtons/AuthButtons";
import ThemeToggleButton from "../../ui/themeToggleButton/ThemeToggleButton";
import MenuIcon from "@mui/icons-material/Menu";
import { HeaderLinks } from "./HeaderLinks";
import { Genre } from "@prisma/client";
import { Session } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import HeaderMobile from "../headerMobile/HeaderMobile";

interface IHeaderContent {
    session: Session | null;
    genres: Genre[];
}

export function HeaderContent({ session, genres }: IHeaderContent) {
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const router = useRouter();

    const theme: CssVarsTheme = useTheme();
    const isMobile = useMediaQuery("(max-width:768px)");

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

        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }

        // this does a full server component rerender too not only client so is very useful here
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            <AppBar position="fixed" component={"header"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: `${isMobile ? "start" : "space-around"}`,
                        flexWrap: "wrap",
                        py: 2,
                        backgroundColor: theme.vars.palette.primary.dark,
                    }}
                    component={"nav"}
                >
                    {isMobile ? (
                        <Box>
                            <IconButton
                                aria-label="open drawer"
                                edge="start"
                                onClick={() => {
                                    setIsDrawerOpen(true);
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
            <HeaderMobile
                genres={genres}
                anchorElProfile={anchorElProfile}
                openMenuProfile={openMenuProfile}
                closeMenuProfile={closeMenuProfile}
                handleSignOut={handleSignOut}
                session={session}
            />
        </>
    );
}
