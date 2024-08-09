import { Box, Typography, useTheme } from "@mui/material";

import { DashboardProgressCircle } from "./DashboardProgressCircle";

export const DashboardStatBox = ({ title, subtitle, icon, progress, increase }: any) => {
    const theme: CssVarsTheme = useTheme();

    return (
        <Box width="100%" m="0 30px">
            <Box display="flex" justifyContent="space-between">
                <Box>
                    {icon}
                    <Typography variant="h4" fontWeight="bold" sx={{ color: theme.vars.palette.secondary[400] }}>
                        {title}
                    </Typography>
                </Box>
                <Box>
                    <DashboardProgressCircle progress={progress} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
                <Typography variant="h5" sx={{ color: theme.vars.palette.secondary[900] }}>
                    {subtitle}
                </Typography>
                <Typography variant="h5" fontStyle="italic" sx={{ color: theme.vars.palette.secondary[900] }}>
                    {increase}
                </Typography>
            </Box>
        </Box>
    );
};
