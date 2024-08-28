"use client";

import { useStore } from "@/store/store";
import { AppBar, IconButton, Toolbar } from "@mui/material";
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
import { showToast } from "@/utils/helpers/toast";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";
import Stack from "@mui/material-pigment-css/Stack";

interface IHeaderContent {
    session: Session | null;
    genres: Genre[];
    userName: string;
}

export function HeaderContent({ session, genres, userName }: IHeaderContent) {
    const [anchorElGenres, setAnchorElGenres] = useState<null | HTMLElement>(null);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const router = useRouter();

    const theme = useTheme();

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
                            md: "space-around",
                            lg: "space-around",
                        },
                        flexWrap: "wrap",
                        py: 1,
                        backgroundColor: theme.vars.palette.primary.dark,
                    }}
                    component={"nav"}
                >
                    {/* Mobile Header */}
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
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    {/* Dekstop Header */}
                    <Stack
                        sx={{
                            display: {
                                xs: "none",
                                sm: "none",
                                md: "flex",
                                lg: "flex",
                            },
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            columnGap: 2,
                            flexWrap: "wrap",
                        }}
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
                                userName={userName}
                                anchorElProfile={anchorElProfile}
                                closeMenuProfile={closeMenuProfile}
                                openMenuProfile={openMenuProfile}
                                handleSignOut={handleSignOut}
                            />
                        </Box>
                    </Stack>
                </Toolbar>
            </AppBar>
            {/* Mobile Header Menu */}
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
