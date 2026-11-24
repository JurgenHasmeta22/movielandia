"use client";

import { Typography, Box, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IHeaderDashboard {
	title: string;
	subtitle: string;
}

const HeaderDashboard = ({ title, subtitle }: IHeaderDashboard) => {
	const theme = useTheme();

	return (
		<Box
			component={"nav"}
			sx={{
				mb: "30px",
			}}
		>
			<Typography
				variant="h2"
				color={theme.vars.palette.greyAccent.main}
				sx={{ m: "0 0 5px 0", fontWeight: "bold" }}
			>
				{title}
			</Typography>
			<Typography variant="h5" color={theme.vars.palette.accent.main}>
				{subtitle}
			</Typography>
		</Box>
	);
};

export default HeaderDashboard;
