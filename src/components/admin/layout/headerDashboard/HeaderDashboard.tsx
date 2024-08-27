"use client";

import { Typography, Box } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";

const HeaderDashboard = ({ title, subtitle }: any) => {
    const theme = useTheme();

    return (
        <Box
            component={"nav"}
            sx={{
                mb: "30px",
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
