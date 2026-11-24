"use client";

import { Typography, Box } from "@mui/material";

interface IHeaderDashboard {
	title: string;
	subtitle: string;
}

const HeaderDashboard = ({ title, subtitle }: IHeaderDashboard) => {
	return (
		<Box
			component={"nav"}
			sx={{
				mb: 4,
			}}
		>
			<Typography variant="h2" sx={{ mb: 1 }}>
				{title}
			</Typography>
			<Typography variant="h5" sx={{ color: "text.secondary", fontWeight: 500 }}>
				{subtitle}
			</Typography>
		</Box>
	);
};

export default HeaderDashboard;
