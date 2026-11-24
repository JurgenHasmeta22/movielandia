import { Box, Typography, useTheme } from "@mui/material";
import { DashboardProgressCircle } from "./DashboardProgressCircle";
import type {} from "@mui/material/themeCssVarsAugmentation";
import React, { JSX } from "react";

interface IDashboardProgressCircleProps {
	title: string;
	subtitle: string;
	progress: number;
	increase: string;
	icon: JSX.Element;
}

export const DashboardStatBox = ({
	title,
	subtitle,
	icon,
	progress,
	increase,
}: IDashboardProgressCircleProps) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				position: "relative",
				zIndex: 1,
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<Box>
					<Box
						className="stat-icon"
						sx={{
							backgroundColor: theme.vars.palette.stats.iconBg,
							p: 1.25,
							borderRadius: "14px",
							display: "inline-flex",
							transition: "transform 0.3s ease-in-out",
						}}
					>
						{icon}
					</Box>
					<Typography
						variant="h3"
						sx={{
							color: theme.vars.palette.text.primary,
							mt: 2,
							mb: 1,
							fontSize: "2.6rem",
							fontWeight: 800,
							lineHeight: 1,
						}}
					>
						{title}
					</Typography>
				</Box>
				<Box>
					<DashboardProgressCircle progress={progress} />
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mt: 2,
					borderTop: `1px solid ${theme.vars.palette.stats.borderColor}`,
					pt: 2,
				}}
			>
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
						color: theme.vars.palette.accent.main,
						backgroundColor: theme.vars.palette.stats.iconBg,
						px: 2,
						py: 0.75,
						borderRadius: 999,
						fontWeight: 600,
						fontSize: "0.85rem",
					}}
				>
					{increase}
				</Typography>
			</Box>
		</Box>
	);
};
