import { Typography } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { DashboardProgressCircle } from "./DashboardProgressCircle";
import { useTheme } from "@mui/material-pigment-css";
import Box from "@mui/material-pigment-css/Box";

export const DashboardStatBox = ({ title, subtitle, icon, progress, increase }: any) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: "100%",
                margin: "0 30px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    {icon}
                    <Typography variant="h4" fontWeight="bold" sx={{ color: theme.vars.palette.greyAccent.main }}>
                        {title}
                    </Typography>
                </Box>
                <Box>
                    <DashboardProgressCircle progress={progress} />
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                }}
            >
                <Typography variant="h5" sx={{ color: theme.vars.palette.green.light }}>
                    {subtitle}
                </Typography>
                <Typography variant="h5" fontStyle="italic" sx={{ color: theme.vars.palette.green.light }}>
                    {increase}
                </Typography>
            </Box>
        </Box>
    );
};
