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
        <Box width="100%" height="100%">
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    {icon}
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            color: theme.vars.palette.text.primary,
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Box>
                    <DashboardProgressCircle progress={progress} />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography
                    variant="h6"
                    sx={{
                        color: theme.vars.palette.text.secondary,
                        fontWeight: 500,
                    }}
                >
                    {subtitle}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.vars.palette.primary.main,
                        backgroundColor:
                            theme.vars.palette.mode === "dark"
                                ? "rgba(144, 202, 249, 0.08)"
                                : "rgba(33, 150, 243, 0.08)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 500,
                    }}
                >
                    {increase}
                </Typography>
            </Box>
        </Box>
    );
};
