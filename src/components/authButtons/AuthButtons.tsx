"use client";

import React, { useState } from "react";
import { Button, CircularProgress, Typography, Menu, MenuItem } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthButtons = () => {
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();

    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
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
                        <MenuItem onClick={() => handleMenuClose()}>
                            <Link href="/profile" passHref>
                                <Typography variant="inherit" color="primary">
                                    My Profile
                                </Typography>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => handleSignOut()}>
                            <Typography variant="inherit" color="primary">
                                Sign Out
                            </Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <>
                    <Link href="/login">
                        <Button variant="text">
                            <LockOpenIcon />
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="text">
                            <AppRegistrationIcon />
                            Sign Up
                        </Button>
                    </Link>
                </>
            )}
        </>
    );
};

export default AuthButtons;
