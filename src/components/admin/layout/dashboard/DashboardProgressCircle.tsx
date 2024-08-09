import { Box, CssVarsTheme, useTheme } from "@mui/material";

export const DashboardProgressCircle = ({ progress = "0.75", size = "40" }: any) => {
    const theme: CssVarsTheme = useTheme();
    const angle = progress * 360;

    return (
        <Box
            sx={{
                background: `radial-gradient(${theme.vars.palette.primary.main} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${theme.vars.palette.primary.main} ${angle}deg 360deg),
            ${theme.vars.palette.primary.main}`,
                borderRadius: "50%",
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
};
