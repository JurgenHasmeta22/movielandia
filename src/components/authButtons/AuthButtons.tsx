"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const AuthButtons = () => {
    return (
        <Box display={"flex"} flexDirection={"row"} columnGap={1}>
            <Button variant="text">
                <LockOpenIcon />
                Sign In
            </Button>
            <Button variant="text">
                <AppRegistrationIcon />
                Sign Up
            </Button>
        </Box>
    );
};

export default AuthButtons;
