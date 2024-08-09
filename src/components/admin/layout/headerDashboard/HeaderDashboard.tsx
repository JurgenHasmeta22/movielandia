"use client";

import { Typography, Box, useTheme } from "@mui/material";

const HeaderDashboard = ({ title, subtitle }: any) => {
    const theme: CssVarsTheme = useTheme();

    return (
        <Box mb="30px" component={"nav"}>
            <Typography
                variant="h2"
                color={theme.vars.palette.secondary[400]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
            >
                {title}
            </Typography>
            <Typography variant="h5" color={theme.vars.palette.secondary[900]}>
                {subtitle}
            </Typography>
        </Box>
    );
};

export default HeaderDashboard;
