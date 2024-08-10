"use client";

import { Typography, Box, useTheme, CssVarsTheme } from "@mui/material";

const HeaderDashboard = ({ title, subtitle }: any) => {
    const theme: CssVarsTheme = useTheme();

    return (
        <Box mb="30px" component={"nav"}>
            <Typography
                variant="h2"
                color={theme.vars.palette.greyAccent.main}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
            >
                {title}
            </Typography>
            <Typography variant="h5" color={theme.vars.palette.green.light}>
                {subtitle}
            </Typography>
        </Box>
    );
};

export default HeaderDashboard;
