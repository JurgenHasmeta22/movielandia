"use client";

import { Card, Typography, useTheme } from "@mui/material";
import { Genre } from "@prisma/client";
import { motion } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Link from "next/link";

interface IGenreItemProps {
	genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
	const theme = useTheme();

	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			transition={{ duration: 0.2, ease: "easeInOut" }}
		>
			<Link
				href={`/genres/${genre.id}/${genre.name}`}
				style={{ textDecoration: "none" }}
			>
				<Card
					key={genre.id}
					sx={{
						display: "grid",
						placeItems: "end start",
						minHeight: { xs: 120, sm: 148, md: 164 },
						width: "100%",
						p: { xs: 1.75, sm: 2.5, md: 3 },
						position: "relative",
						overflow: "hidden",
						cursor: "pointer",
						borderRadius: 2,
						backgroundColor: theme.vars.palette.background.paper,
						border: "1px solid",
						borderColor: theme.vars.palette.divider,
						boxShadow: "none",
						transition:
							"border-color 180ms ease, transform 180ms ease, background-color 180ms ease",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							width: 36,
							height: 3,
							backgroundColor: theme.vars.palette.green.main,
						},
						"&:hover": {
							borderColor: theme.vars.palette.green.main,
							transform: "translateY(-3px)",
							backgroundColor:
								theme.vars.palette.background.default,
						},
					}}
					elevation={0}
				>
					<Typography
						sx={{
							textDecoration: "none",
							color: theme.vars.palette.text.primary,
							fontSize: { xs: "1rem", sm: "1.25rem" },
							fontWeight: 600,
							letterSpacing: "-0.025em",
						}}
					>
						{genre.name}
					</Typography>
				</Card>
			</Link>
		</motion.div>
	);
}
