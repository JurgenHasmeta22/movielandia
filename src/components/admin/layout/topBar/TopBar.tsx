"use client";

import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { useStore } from "@/store/store";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const TopBar = () => {
    const { data: session } = useSession();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
    const router = useRouter();
    const open = Boolean(anchorEl);
    const theme: CssVarsTheme = useTheme();

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
                    backgroundColor: theme.vars.palette.secondary[700],
                }}
                component={"nav"}
            >
                <Box display={"flex"} justifyContent={"start"}>
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
                <Box display={"flex"} flexDirection={"row"}>
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
