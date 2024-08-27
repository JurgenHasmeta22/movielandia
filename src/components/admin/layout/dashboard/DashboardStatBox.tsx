import { Box, Typography } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { DashboardProgressCircle } from "./DashboardProgressCircle";
import { useTheme } from "@mui/material-pigment-css";

export const DashboardStatBox = ({ title, subtitle, icon, progress, increase }: any) => {
    const theme = useTheme();

    return (
        <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
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
                display="flex"
                justifyContent="space-between"
                sx={{
                    mt: 2,
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
