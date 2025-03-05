"use client";

import React from "react";
import { Button, Typography, Menu, MenuItem, useTheme, Box } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Session } from "next-auth";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import { useRouter } from "next/navigation";
import type {} from "@mui/material/themeCssVarsAugmentation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

interface IAuthButtonsProps {
    session: Session | null;
    anchorElProfile: HTMLElement | null;
    userName: string;
    openMenuProfile: (event: any) => void;
    closeMenuProfile: () => void;
    handleSignOut: () => Promise<void>;
}

const AuthButtons = ({
    session,
    anchorElProfile,
    openMenuProfile,
    closeMenuProfile,
    handleSignOut,
    userName,
}: IAuthButtonsProps) => {
    const { isDrawerOpen, setIsDrawerOpen } = useStore();
    const theme = useTheme();
    const router = useRouter();

    const handleProfileClick = () => {
        closeMenuProfile();

        if (session?.user?.role === "Admin") {
            router.push("/admin");
        } else {
            router.push(`/users/${session?.user?.id}/${userName}`);
        }
    };

    return (
        <>
            {session && session.user ? (
                <>
                    <AccountCircleOutlinedIcon
                        onClick={openMenuProfile}
                        sx={{
                            color: theme.vars.palette.primary.main,
                            fontSize: 32,
                            cursor: "pointer",
                            "&:hover": {
                                color: theme.vars.palette.green.main,
                            },
                        }}
                    />
                    <Menu
                        anchorEl={anchorElProfile}
                        open={Boolean(anchorElProfile)}
                        onClose={closeMenuProfile}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    "& .MuiMenuItem-root": {
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "1.25rem",
                                            color: theme.vars.palette.primary.main,
                                        },
                                        "&:hover": {
                                            backgroundColor: theme.vars.palette.action.hover,
                                            "& .MuiSvgIcon-root": {
                                                color: theme.vars.palette.green.main,
                                            },
                                            "& .MuiTypography-root": {
                                                color: theme.vars.palette.green.main,
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleProfileClick}>
                            {session?.user?.role === "Admin" ? (
                                <>
                                    <DashboardIcon />
                                    <Typography variant="inherit" sx={{ fontSize: "0.95rem" }}>
                                        Go to Dashboard
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <PersonOutlinedIcon />
                                    <Typography variant="inherit" sx={{ fontSize: "0.95rem" }}>
                                        My Profile
                                    </Typography>
                                </>
                            )}
                        </MenuItem>
                        <MenuItem onClick={() => handleSignOut()}>
                            <LogoutIcon />
                            <Typography variant="inherit" sx={{ fontSize: "0.95rem" }}>
                                Sign Out
                            </Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, gap: 1 }}>
                    <Button
                        LinkComponent={MuiNextLink}
                        href="/login"
                        variant="text"
                        startIcon={<LoginIcon />}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 2,
                            color: theme.vars.palette.primary.main,
                            textTransform: "none",
                            flexShrink: 0,
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.25rem",
                            },
                            "&:hover": {
                                backgroundColor: theme.vars.palette.green.main,
                                color: theme.vars.palette.greyAccent.main,
                            },
                        }}
                        onClick={() => {
                            if (isDrawerOpen) {
                                setIsDrawerOpen(false);
                            }
                        }}
                    >
                        Sign In
                    </Button>
                    <Button
                        LinkComponent={MuiNextLink}
                        href="/register"
                        variant="text"
                        startIcon={<PersonAddIcon />}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 2,
                            color: theme.vars.palette.primary.main,
                            textTransform: "none",
                            flexShrink: 0,
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                            "& .MuiSvgIcon-root": {
                                fontSize: "1.25rem",
                            },
                            "&:hover": {
                                backgroundColor: theme.vars.palette.green.main,
                                color: theme.vars.palette.greyAccent.main,
                            },
                        }}
                        onClick={() => {
                            if (isDrawerOpen) {
                                setIsDrawerOpen(false);
                            }
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
            )}
        </>
    );
};

export default AuthButtons;
