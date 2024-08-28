import Box from "@mui/material-pigment-css/Box";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useTheme } from "@mui/material-pigment-css";

export const DashboardProgressCircle = ({ progress = "0.75", size = "40" }: any) => {
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
