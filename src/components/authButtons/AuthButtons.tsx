"use client";

import React, { useState } from "react";
import { Button, CircularProgress, Typography, Menu, MenuItem, useTheme } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tokens } from "@/utils/theme";

const AuthButtons = () => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        handleMenuClose();
        await signOut({ redirect: false });
        router.push("/login");
    };

    if (loading) {
        return <CircularProgress size={20} thickness={4} color="error" />;
    }

    return (
        <>
            {session && session.user ? (
                <>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "white",
                            cursor: "pointer",
                        }}
                        onClick={handleMenuOpen}
                    >
                        {/* @ts-expect-error session*/}
                        Welcome, {session.user.userName}
                    </Typography>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        <MenuItem onClick={() => handleMenuClose()} sx={{ color: colors.primary[100] }}>
                            <Link href="/profile" passHref>
                                <Typography variant="inherit" color="primary">
                                    My Profile
                                </Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => handleSignOut()} sx={{ color: colors.primary[100] }}>
                            <Typography variant="inherit" color="primary">
                                Sign Out
                            </Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <>
                    <Link href="/login" style={{ textDecoration: "none" }}>
                        <Button
                            variant="text"
                            onClick={function () {
                                window.scrollTo(0, 0);
                            }}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 1,
                                px: 2,
                                py: 1,
                                color: colors.primary[100],
                                "&:hover": {
                                    backgroundColor: colors.greenAccent[700],
                                    color: colors.grey[100],
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
                    <Link href="/register" style={{ textDecoration: "none" }}>
                        <Button
                            variant="text"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 1,
                                px: 2,
                                py: 1,
                                color: colors.primary[100],
                                "&:hover": {
                                    backgroundColor: colors.greenAccent[700],
                                    color: colors.grey[100],
                                },
                            }}
                            onClick={function () {
                                window.scrollTo(0, 0);
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
