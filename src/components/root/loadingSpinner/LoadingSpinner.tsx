"use client";

import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				width: "100%",
				bgcolor: "background.default",
			}}
		>
			<CircularProgress />
		</Box>
	);
};

export default LoadingSpinner;
