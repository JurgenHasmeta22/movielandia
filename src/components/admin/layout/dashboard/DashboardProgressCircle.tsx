import { Box, useTheme } from "@mui/material";


export const DashboardProgressCircle = ({ progress = "0.75", size = "40" }: any) => {
    
    const angle = progress * 360;

    return (
        <Box
            sx={{
                background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
                borderRadius: "50%",
                width: `${size}px`,
                height: `${size}px`,
            }}
        />
    );
};
