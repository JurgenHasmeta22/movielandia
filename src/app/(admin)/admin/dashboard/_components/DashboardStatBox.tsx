import { Box, Typography, useTheme } from "@mui/material";
import { DashboardProgressCircle } from "./DashboardProgressCircle";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IDashboardProgressCircleProps {
    title: string;
    subtitle: string;
    progress: number;
    increase: string;
    icon: JSX.Element;
}

export const DashboardStatBox = ({ title, subtitle, icon, progress, increase }: IDashboardProgressCircleProps) => {
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
