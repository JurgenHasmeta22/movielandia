"use client";

import React from "react";
import { Button, Typography, Menu, MenuItem, useTheme, Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Session } from "next-auth";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import { useRouter } from "next/navigation";
import type {} from "@mui/material/themeCssVarsAugmentation";

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
                            {userName}
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
                        <MenuItem onClick={handleProfileClick} sx={{ color: theme.vars.palette.primary.main }}>
                            <Typography variant="inherit">
                                {session?.user?.role === "Admin" ? "Go to Dashboard" : "My Profile"}
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => handleSignOut()} sx={{ color: theme.vars.palette.primary.main }}>
                            <Typography variant="inherit">Sign Out</Typography>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                        gap: 1,
                    }}
                >
                    <Button
                        LinkComponent={MuiNextLink}
                        href="/login"
                        variant="text"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 2,
                            color: theme.vars.palette.primary.main,
                            textTransform: "none",
                            flexShrink: 0,
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
                        <LockOpenIcon sx={{ fontSize: "1.2rem" }} />
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Sign In
                        </Typography>
                    </Button>
                    <Button
                        LinkComponent={MuiNextLink}
                        href="/register"
                        variant="text"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            px: 2,
                            color: theme.vars.palette.primary.main,
                            textTransform: "none",
                            flexShrink: 0,
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
                        <AppRegistrationIcon sx={{ fontSize: "1.2rem" }} />
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Sign Up
                        </Typography>
                    </Button>
                </Box>
            )}
        </>
    );
};

export default AuthButtons;
