import { Box, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IDashboardProgressCircleProps {
    progress: number;
    size?: string;
}

export const DashboardProgressCircle = ({ progress = 0.75, size = "40" }: IDashboardProgressCircleProps) => {
    const theme = useTheme();

    const angle = progress * 360;

    return (
        <Box
            sx={{
                background: `radial-gradient(${theme.vars.palette.background.default} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${theme.vars.palette.blue.main} ${angle}deg 360deg),
            ${theme.vars.palette.green.light}`,
                borderRadius: "50%",
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
};
