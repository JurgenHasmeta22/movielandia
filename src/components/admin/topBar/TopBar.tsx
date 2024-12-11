"use client";

import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useStore } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type {} from "@mui/material/themeCssVarsAugmentation";
import SwitchThemeButton from "@/components/root/themeToggleButton/ThemeToggleButton";
import Image from "next/image";
import MuiNextLink from "@/components/root/muiNextLink/MuiNextLink";

const TopBar = () => {
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
    const router = useRouter();
    const theme = useTheme();
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut();
        handleClose();
        router.push("/login");
    };

    const handleRedirectToProfile = () => {
        if (session?.user?.role === "Admin") {
            router.push("/admin");
        } else {
            router.push("/users/1/admin");
        }

        handleClose();
    };

    const handleGoToHome = () => {
        router.push("/");
        handleClose();
    };

    return (
        <AppBar position="static" component={"header"}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: theme.vars.palette.primary.dark,
                }}
                component={"nav"}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    {!isOpenSidebarAdmin && (
                        <IconButton
                            onClick={() => {
                                setIsOpenSidebarAdmin(true);
                            }}
                        >
                            <MenuIcon fontSize="medium" />
                        </IconButton>
                    )}
                    <Box
                        sx={{
                            paddingLeft: 3,
                        }}
                    >
                        <IconButton
                            LinkComponent={MuiNextLink}
                            href={"/admin"}
                            sx={{
                                p: 0,
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <Image
                                src="/icons/movielandia24-logo.png"
                                alt="MovieLandia24 Admin"
                                height={80}
                                width={200}
                                priority
                                style={{
                                    objectFit: "contain",
                                }}
                            />
                        </IconButton>
                    </Box>
                </Box>
                <Box display={"flex"} flexDirection={"row"}>
                    <SwitchThemeButton />
                    <IconButton
                        id="buttonProfile"
                        aria-controls={open ? "menuProfile" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
                    >
                        <PersonOutlinedIcon color="action" fontSize="medium" />
                        <Typography
                            component={"span"}
                            style={{
                                fontSize: 16,
                            }}
                        >
                            {session?.user?.userName}
                        </Typography>
                    </IconButton>
                    <Menu
                        id="menuProfile"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "buttonProfile",
                        }}
                    >
                        <MenuItem onClick={handleRedirectToProfile} style={{ color: theme.vars.palette.primary.main }}>
                            {session?.user?.role === "Admin" ? "Go to Dashboard" : "My Profile"}
                        </MenuItem>
                        {session?.user?.role === "Admin" && (
                            <MenuItem onClick={handleGoToHome} sx={{ color: theme.vars.palette.primary.main }}>
                                <Typography variant="inherit">Go To Home</Typography>
                            </MenuItem>
                        )}
                        <MenuItem onClick={handleLogout} style={{ color: theme.vars.palette.primary.main }}>
                            Log out
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
