"use client";

import { Box, Typography, useTheme } from "@mui/material";
import CardItem from "../cardItem/CardItem";
import { Movie, Serie } from "@prisma/client";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface ILatestListProps {
	data: Array<Movie | Serie> | null;
	type: string;
}

export function LatestList({ data, type }: ILatestListProps) {
	const theme = useTheme();

	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				maxWidth: "1320px",
				margin: "0 auto",
				width: "100%",
				px: { xs: 2, sm: 3, md: 4, xl: 0 },
				py: { xs: 4, md: 5 },
			}}
		>
			<Box
				sx={{
					mb: { xs: 1, md: 2 },
					display: "flex",
					justifyContent: "flex-start",
				}}
			>
				<Typography
					variant="h2"
					sx={{
						fontSize: { xs: 22, sm: 26, md: 30 },
						fontWeight: 700,
						color: theme.vars.palette.text.primary,
						letterSpacing: "-0.04em",
					}}
				>
					Latest {type}
				</Typography>
			</Box>

			<Box
				sx={{
					width: "100%",
					overflow: "visible",
					mt: { xs: 2.5, md: 3.5 },
				}}
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "repeat(2, minmax(0, 1fr))",
							sm: "repeat(3, minmax(0, 1fr))",
							md: "repeat(4, minmax(0, 1fr))",
							lg: "repeat(5, minmax(0, 1fr))",
							xl: "repeat(6, minmax(0, 1fr))",
						},
						gap: { xs: 1.5, sm: 2.5, md: 3 },
					}}
				>
					{data?.map((item) => (
						<CardItem
							key={item.id}
							data={item}
							type={
								type.toLowerCase() === "movies"
									? "movie"
									: "serie"
							}
							presentation="poster"
						/>
					))}
				</Box>
			</Box>
		</Box>
	);
}

export default LatestList;
