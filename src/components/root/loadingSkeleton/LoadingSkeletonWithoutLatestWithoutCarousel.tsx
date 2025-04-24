"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingSkeletonWithoutLatestWithoutCarousel() {
	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: "1200px",
				m: "0 auto",
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 3, md: 4 },
			}}
		>
			{/* Section 1: Movies Header with SortSelect */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					mb: 3,
					mt: 6,
				}}
			>
				<Skeleton variant="text" sx={{ width: "25%", height: 48 }} />
				<Stack direction="row" spacing={2}>
					<Skeleton
						variant="rectangular"
						sx={{ width: 150, height: 50 }}
					/>
					<Skeleton
						variant="rectangular"
						sx={{ width: 150, height: 50 }}
					/>
				</Stack>
			</Box>

			{/* Section 2: Movie List (12 items in 2 rows of 6) */}
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
				{Array.from(new Array(12)).map((_, index) => (
					<Box key={index} sx={{ flex: "1 1 calc(16.66% - 16px)" }}>
						<Skeleton
							variant="rectangular"
							sx={{ width: "100%", height: { xs: 210, sm: 240 } }}
						/>
					</Box>
				))}
			</Box>

			{/* Section 3: Pagination */}
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="center"
				sx={{ mb: 4 }}
			>
				<Skeleton
					variant="rectangular"
					sx={{ width: 200, height: 40 }}
				/>
			</Stack>
		</Box>
	);
}
