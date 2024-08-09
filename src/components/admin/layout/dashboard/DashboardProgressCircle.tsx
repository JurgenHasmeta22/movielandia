import { Box, useTheme } from "@mui/material";

export const DashboardProgressCircle = ({ progress = "0.75", size = "40" }: any) => {
    const theme: CssVarsTheme = useTheme();

    const angle = progress * 360;

    return (
        <Box
            sx={{
                background: `radial-gradient(${theme.vars.palette.background} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${theme.vars.palette.secondary["200"]} ${angle}deg 360deg),
            ${theme.vars.palette.secondary["900"]}`,
                borderRadius: "50%",
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
};
