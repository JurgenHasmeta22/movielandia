"use client";

import { Box, Button, Typography } from "@mui/material";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<Box>
			<Typography component="h3" variant="h3">
				Something went wrong!
			</Typography>
			<Box>{error.message}</Box>
			<Button onClick={() => reset()}>Try again</Button>
		</Box>
	);
}
