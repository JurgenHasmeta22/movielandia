"use client";

import { Typography } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

const HeaderDashboard = ({ title, subtitle }: any) => {
    const theme = useTheme();

    return (
        <Box
            component={"nav"}
            sx={{
                marginBottom: "30px",
            }}
        >
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
