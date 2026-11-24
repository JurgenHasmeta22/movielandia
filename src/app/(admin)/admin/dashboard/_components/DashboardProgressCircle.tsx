import { Box, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IDashboardProgressCircleProps {
	progress: number;
	size?: string;
}

export const DashboardProgressCircle = ({
	progress = 0.75,
	size = "44",
}: IDashboardProgressCircleProps) => {
	const theme = useTheme();

	const angle = progress * 360;

	return (
		<Box
			sx={{
				background: `radial-gradient(${theme.vars.palette.background.paper} 58%, transparent 59%),
            conic-gradient(${theme.vars.palette.accent.main} 0deg ${angle}deg, ${theme.vars.palette.stats.borderColor} ${angle}deg 360deg)`,
				borderRadius: "50%",
				width: `${size}px`,
				height: `${size}px`,
			}}
		/>
	);
};
