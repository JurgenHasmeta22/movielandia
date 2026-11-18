"use client";

import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import CardItem from "@/components/root/cardItem/CardItem";
import { Box, Typography, useTheme } from "@mui/material";
import { Movie, Serie } from "@prisma/client";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { motion } from "framer-motion";

interface GenreListProps {
	title: string;
	data: (Movie | Serie)[];
	count: number;
	sortBy: string;
	ascOrDesc: string;
	page: number;
	pageCount: number;
	dataType: "Movies" | "Series";
	cardType: "movie" | "serie";
}

const GenreList = ({
	title,
	data,
	count,
	sortBy,
	ascOrDesc,
	page,
	pageCount,
	dataType,
	cardType,
}: GenreListProps) => {
	const theme = useTheme();

	const itemsPerPage = 12;
	const startIndex = (page - 1) * itemsPerPage + 1;
	const endIndex = Math.min(startIndex + itemsPerPage - 1, count);

	if (data.length === 0) return null;

	return (
		<Box
			component={motion.section}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			sx={{
				width: "100%",
				bgcolor: "background.paper",
				borderRadius: 2,
				boxShadow: "none",
				overflow: "hidden",
				border: "1px solid",
				borderColor: "divider",
			}}
		>
			<Box
				sx={{
					p: { xs: 2, sm: 3 },
					borderBottom: `1px solid ${theme.vars.palette.divider}`,
					bgcolor: "transparent",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
						gap: 2,
					}}
				>
					<Box>
						<Typography
							variant="h2"
							sx={{
								fontSize: { xs: 19, sm: 22 },
								fontWeight: 700,
								color: "text.primary",
								mb: 0.5,
								letterSpacing: "-0.03em",
							}}
						>
							{title}
						</Typography>
						<Typography
							variant="body2"
							sx={{
								color: "text.secondary",
							}}
						>
							{startIndex} – {endIndex} of {count}{" "}
							{dataType.toLowerCase()}
						</Typography>
					</Box>
					<Box sx={{ minWidth: { xs: "100%", sm: 200 } }}>
						<SortSelect
							sortBy={sortBy}
							ascOrDesc={ascOrDesc}
							type="list"
							dataType={dataType.toLowerCase()}
						/>
					</Box>
				</Box>
			</Box>
			<Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "transparent" }}>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "repeat(2, minmax(0, 1fr))",
							sm: "repeat(3, minmax(0, 1fr))",
							md: "repeat(4, minmax(0, 1fr))",
							lg: "repeat(5, minmax(0, 1fr))",
						},
						gap: { xs: 1.5, sm: 2.5, md: 3 },
					}}
				>
					{data.map((item) => (
						<CardItem
							key={item.id}
							data={item}
							type={cardType}
							presentation="poster"
						/>
					))}
				</Box>
				<Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
					<PaginationControl
						currentPage={Number(page)}
						pageCount={pageCount}
						urlParamName={
							dataType === "Movies" ? "pageMovies" : "pageSeries"
						}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default GenreList;
