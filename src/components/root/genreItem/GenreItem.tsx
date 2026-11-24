"use client";

import { Box, Card, Typography } from "@mui/material";
import { Genre } from "@prisma/client";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Link from "next/link";
import { getGenreGradient } from "./genreGradient";

interface IGenreItemProps {
	genre: Genre;
}

export default function GenreItem({ genre }: IGenreItemProps) {
	const { from, background } = getGenreGradient(genre.id);

	return (
		<Link
			href={`/genres/${genre.id}/${genre.name}`}
			style={{ textDecoration: "none", display: "block" }}
		>
			<Card
				sx={{
					position: "relative",
					display: "flex",
					alignItems: "flex-end",
					minHeight: { xs: 120, sm: 150, md: 170 },
					p: { xs: 2, sm: 2.5 },
					overflow: "hidden",
					cursor: "pointer",
					borderRadius: "22px",
					border: "1px solid rgba(243, 238, 230, 0.12)",
					background,
					boxShadow: "0 10px 24px rgba(5, 2, 12, 0.3)",
					transition:
						"transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease",
					"&::before": {
						content: '""',
						position: "absolute",
						inset: 0,
						background:
							"radial-gradient(circle at 85% 0%, rgba(255,255,255,0.22), transparent 55%)",
						pointerEvents: "none",
					},
					"&:hover": {
						transform: "translateY(-6px)",
						boxShadow: `0 24px 44px ${from}66`,
					},
					"&:hover .genreArrow": {
						opacity: 1,
						transform: "translate(0, 0)",
					},
					"&:hover .genreInitial": {
						transform: "translate(-6px, -6px) scale(1.06)",
					},
				}}
				elevation={0}
			>
				<Typography
					aria-hidden
					className="genreInitial"
					sx={{
						position: "absolute",
						right: 14,
						bottom: -26,
						fontFamily: "var(--font-display)",
						fontSize: { xs: "7rem", sm: "8.5rem" },
						fontWeight: 800,
						lineHeight: 1,
						color: "rgba(255, 255, 255, 0.14)",
						userSelect: "none",
						transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
					}}
				>
					{genre.name.charAt(0).toUpperCase()}
				</Typography>
				<Box
					className="genreArrow"
					sx={{
						position: "absolute",
						top: 14,
						right: 14,
						display: "grid",
						placeItems: "center",
						width: 34,
						height: 34,
						borderRadius: "50%",
						color: "#1A1100",
						backgroundColor: "#FFB224",
						opacity: 0,
						transform: "translate(-6px, 6px)",
						transition: "opacity 220ms ease, transform 220ms ease",
					}}
				>
					<ArrowOutwardIcon sx={{ fontSize: 20 }} />
				</Box>
				<Typography
					sx={{
						position: "relative",
						fontFamily: "var(--font-display)",
						fontSize: { xs: "1.25rem", sm: "1.55rem" },
						fontWeight: 700,
						letterSpacing: "-0.03em",
						lineHeight: 1.1,
						color: "#FFFFFF",
						textShadow: "0 2px 12px rgba(0,0,0,0.35)",
					}}
				>
					{genre.name}
				</Typography>
			</Card>
		</Link>
	);
}
