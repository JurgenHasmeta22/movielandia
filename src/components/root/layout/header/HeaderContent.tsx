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
import { useEffect, useState } from "react";
import { Session } from "next-auth";

interface IHeaderContent {
    session: Session | null;
}

export function HeaderContent({ session }: IHeaderContent) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const { mobileOpen, setOpenDrawer } = useStore();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch("/api/genres");
                const genres: Genre[] = await response.json();
                setGenres(genres);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            }
        };

        fetchGenres();
    }, []);

    return (
        <>
            <AppBar position="fixed" component={"header"}>
                <Toolbar
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
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
                            <HeaderLinks genres={genres} />
                            <Box sx={{ display: "flex", placeItems: "center", columnGap: 1 }}>
                                <SearchField />
                                <ThemeToggleButton />
                                <AuthButtons session={session} />
                            </Box>
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
            {/* <HeaderMenu
                closeMenuGenres={closeMenuGenres}
                genres={genres}
                anchorElProfile={anchorElProfile}
                redirectToProfile={redirectToProfile}
                openMenuProfile={openMenuProfile}
                closeMenuProfile={closeMenuProfile}
                handleLogout={handleLogout}
            /> */}
        </>
    );
}
