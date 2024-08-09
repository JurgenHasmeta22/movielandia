"use client";

import React from "react";
import { Button, Typography, Menu, MenuItem, useTheme, Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Link from "next/link";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Session } from "next-auth";
import { useStore } from "@/store/store";

interface IAuthButtons {
    session: Session | null;
    anchorElProfile: HTMLElement | null;
    openMenuProfile: (event: any) => void;
    closeMenuProfile: () => void;
    handleSignOut: () => Promise<void>;
}

const AuthButtons = ({ session, anchorElProfile, openMenuProfile, closeMenuProfile, handleSignOut }: IAuthButtons) => {
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const theme: CssVarsTheme = useTheme();

    return (
        <>
            {session && session.user ? (
                <>
                    <Box display={"flex"} flexDirection={"row"} onClick={openMenuProfile}>
                        <PersonOutlinedIcon color="action" fontSize="medium" />
                        <Typography
                            variant="body1"
                            sx={{
                                cursor: "pointer",
                                paddingLeft: 1,
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            {session.user.userName}
                        </Typography>
                    </Box>
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
                    >
                        <MenuItem onClick={() => closeMenuProfile()} sx={{ color: theme.vars.palette.primary.main }}>
                            <Link
                                href={`/users/${session?.user?.id}/${session?.user?.userName}`}
                                style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                            >
                                <Typography variant="inherit">My Profile</Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => handleSignOut()} sx={{ color: theme.vars.palette.primary.main }}>
                            <Typography variant="inherit">Sign Out</Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <>
                    <Link
                        href={"/login"}
                        style={{
                            textDecoration: "none",
                        }}
                        onClick={() => {
                            if (isDrawerOpen) {
                                setIsDrawerOpen(false);
                            }
                        }}
                    >
                        <Button
                            variant="text"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 1,
                                px: 2,
                                py: 1,
                                color: theme.vars.palette.primary.main,
                                "&:hover": {
                                    backgroundColor: theme.vars.palette.secondary["100"],
                                    color: theme.vars.palette.secondary["400"],
                                },
                            }}
                        >
                            <LockOpenIcon />
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Sign In
                            </Typography>
                        </Button>
                    </Link>
                    <Link
                        href={"/register"}
                        style={{
                            textDecoration: "none",
                        }}
                        onClick={() => {
                            if (isDrawerOpen) {
                                setIsDrawerOpen(false);
                            }
                        }}
                    >
                        <Button
                            variant="text"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 1,
                                px: 2,
                                py: 1,
                                color: theme.vars.palette.primary.main,
                                "&:hover": {
                                    backgroundColor: theme.vars.palette.secondary["100"],
                                    color: theme.vars.palette.secondary["400"],
                                },
                            }}
                        >
                            <AppRegistrationIcon />
                            <Typography
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Sign Up
                            </Typography>
                        </Button>
                    </Link>
                </>
            )}
        </>
    );
};

export default AuthButtons;
