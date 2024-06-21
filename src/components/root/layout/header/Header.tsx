/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { AppBar, Box, List, ListItem, Stack, Toolbar, useTheme } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import Link from "next/link";
import { tokens } from "@/utils/theme";
import SearchField from "../../features/searchField/SearchField";
import AuthButtons from "../../ui/authButtons/AuthButtons";
import ThemeToggleButton from "../../ui/themeToggleButton/ThemeToggleButton";
import HeaderMenu from "../headerMenu/HeaderMenu";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import LoadingSpinner from "../../ui/loadingSpinner/LoadingSpinner";

const Header = () => {
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const [options, setOptions] = useState<any>([]);
    const router = useRouter();

    const [genres, setGenres] = useState<Genre[]>([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // useEffect(() => {
    //     const fetchGenres = async () => {
    //         try {
    //             const response = await fetch("/api/genres");
    //             const data = await response.json();
    //             setGenres(data.rows);
    //         } catch (error) {
    //             console.error("Failed to fetch genres:", error);
    //         }
    //     };

    //     fetchGenres();
    // }, []);

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

    async function handleLogout(): Promise<void> {
        closeMenuProfile();
        await signOut({ redirect: false });
        router.push("/login");
    }

    function redirectToProfile(): void {
        router.push("/profile");
    }

    // useEffect(() => {
    //     for (const genre of genres) {
    //         const option = {
    //             value: genre.name,
    //             label: genre.name,
    //         };

    //         setOptions([...options, option]);
    //     }
    // }, [genres, options]);

    // if (genres) {
    //     return <LoadingSpinner />;
    // }

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
                    <Stack
                        flexDirection={"row"}
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        columnGap={3}
                        flexWrap={"wrap"}
                    >
                        <Box>
                            <Link
                                href={"/"}
                                style={{
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    fontSize: 20,
                                    color: colors.primary[100],
                                }}
                            >
                                MovieLandia24
                            </Link>
                        </Box>
                        <Box>
                            <List sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}>
                                <ListItem>
                                    <Link
                                        href="/movies"
                                        style={{
                                            fontSize: "16px",
                                            textDecoration: "none",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            color: colors.primary[100],
                                        }}
                                    >
                                        <MovieIcon fontSize={"large"} />
                                        Movies
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href="/genres"
                                        style={{
                                            fontSize: "16px",
                                            textDecoration: "none",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            color: colors.primary[100],
                                        }}
                                    >
                                        <SubtitlesIcon fontSize={"large"} />
                                        Genres
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href="/series"
                                        style={{
                                            fontSize: "16px",
                                            textDecoration: "none",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            color: colors.primary[100],
                                        }}
                                    >
                                        <LocalMoviesIcon fontSize={"large"} />
                                        Series
                                    </Link>
                                </ListItem>
                            </List>
                        </Box>
                        <Box sx={{ display: "flex", placeItems: "center", columnGap: 1 }}>
                            <SearchField />
                            <ThemeToggleButton />
                            <AuthButtons />
                        </Box>
                    </Stack>
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
};

export default Header;
