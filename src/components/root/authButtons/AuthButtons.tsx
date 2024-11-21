"use client";

import React from "react";
import { Button, Typography, Menu, MenuItem, useTheme, Box } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Link from "next/link";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Session } from "next-auth";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useRouter } from "next/navigation";

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
                <>
                    <Button
                        component={MuiNextLink}
                        href="/login"
                        prefetch={false}
                        variant="text"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 1,
                            px: 2,
                            py: 1,
                            color: theme.vars.palette.primary.main,
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
                        <LockOpenIcon />
                        <Typography
                            sx={{
                                textTransform: "capitalize",
                            }}
                        >
                            Sign In
                        </Typography>
                    </Button>
                    <Button
                        component={MuiNextLink}
                        href="/register"
                        prefetch={false}
                        variant="text"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: 1,
                            px: 2,
                            py: 1,
                            color: theme.vars.palette.primary.main,
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
                        <AppRegistrationIcon />
                        <Typography
                            sx={{
                                textTransform: "capitalize",
                            }}
                        >
                            Sign Up
                        </Typography>
                    </Button>
                </>
            )}
        </>
    );
};

export default AuthButtons;
