"use client";

import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useStore } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

const TopBar = () => {
    const { data: session } = useSession();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();

    const router = useRouter();
    const open = Boolean(anchorEl);

    const theme = useTheme();

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
        router.push("/profile");
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
                        justifyContent: "start",
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
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <IconButton>
                        {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                    </IconButton>
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
                            My profile
                        </MenuItem>
                        {/* <MenuItem>
                            <Link
                                to="/changePassword"
                                style={{ color: theme.vars.palette.primary.main, textDecoration: "none" }}
                            >
                                Change password
                            </Link>
                        </MenuItem> */}
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
