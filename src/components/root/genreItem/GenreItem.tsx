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
						display: "flex",
						placeItems: "center",
						placeContent: "center",
						cursor: "pointer",
						height: "240px",
						width: "160px",
						backgroundColor: `colors.secondary`,
					}}
					elevation={4}
				>
					<Typography
						sx={{
							textDecoration: "none",
							color: theme.vars.palette.primary.main,
						}}
					>
						{genre.name}
					</Typography>
				</Card>
			</Link>
		</motion.div>
	);
}
