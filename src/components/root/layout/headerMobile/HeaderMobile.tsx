"use client";

import { CloseOutlined } from "@mui/icons-material";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import { useStore } from "@/store/store";
import { useEffect, useState } from "react";
import { Genre } from "@prisma/client";
import { Session } from "next-auth";
import SearchField from "../../features/searchField/SearchField";
import AuthButtons from "../../ui/authButtons/AuthButtons";
import { HeaderLinks } from "../header/HeaderLinks";
import ThemeToggleButton from "../../ui/themeToggleButton/ThemeToggleButton";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

interface IHeaderMenu {
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
}: IHeaderMenu) {
    const [anchorElGenresMobile, setAnchorElGenresMobile] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const theme = useTheme();

    const openMenuGenresMobile = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorElGenresMobile(event.currentTarget);
    };

    const closeMenuGenresMobile = () => {
        setAnchorElGenresMobile(null);
    };

    const handleDrawerToggle = () => {
        setIsDrawerOpen(false);
    };

    const isFullScreen = useMediaQuery(theme.breakpoints.up("md"));

    useEffect(() => {
        if (isFullScreen && isDrawerOpen) {
            setIsDrawerOpen(false);
        }
    }, [isFullScreen, isDrawerOpen, setIsDrawerOpen]);

    return (
        <Drawer variant="persistent" open={isDrawerOpen} onClose={handleDrawerToggle} component={"aside"}>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        placeContent: "end",
                        marginRight: 2,
                        marginTop: 1,
                    }}
                >
                    <IconButton
                        onClick={() => {
                            setIsDrawerOpen(false);
                        }}
                    >
                        <CloseOutlined />
                    </IconButton>
                </Box>
                <HeaderLinks
                    genres={genres}
                    anchorElGenres={anchorElGenresMobile}
                    closeMenuGenres={closeMenuGenresMobile}
                    openMenuGenres={openMenuGenresMobile}
                />
                <Box
                    sx={{
                        marginTop: 2,
                        marginLeft: 2,
                        marginRight: 2,
                    }}
                >
                    <SearchField />
                </Box>
                <Box
                    sx={{
                        marginTop: 2,
                        marginLeft: 2,
                        marginRight: 2,
                    }}
                >
                    <ThemeToggleButton />
                </Box>
                <Box
                    sx={{
                        marginTop: 3,
                        display: "flex",
                        flexDirection: "row",
                        columnGap: 3,
                        marginLeft: 2,
                        marginRight: 2,
                    }}
                >
                    <AuthButtons
                        session={session}
                        anchorElProfile={anchorElProfile}
                        closeMenuProfile={closeMenuProfile}
                        handleSignOut={handleSignOut}
                        openMenuProfile={openMenuProfile}
                        userName={userName}
                    />
                </Box>
            </Box>
        </Drawer>
    );
}
