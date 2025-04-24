import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingSkeletonGenre() {
	return (
		<Box
			sx={{
				maxWidth: "1400px",
				margin: "0 auto",
				px: { xs: 2, sm: 3, md: 4 },
				py: { xs: 3, md: 4 },
			}}
		>
			{/* Header Section */}
			<Box
				sx={{
					textAlign: "center",
					mt: { xs: 4, md: 8 },
					mb: { xs: 4, md: 6 },
				}}
			>
				<Skeleton
					variant="text"
					sx={{
						width: "60%",
						height: { xs: 40, md: 48 },
						mx: "auto",
						mb: 2,
					}}
				/>
				<Skeleton
					variant="text"
					sx={{
						width: "80%",
						height: { xs: 24, md: 28 },
						mx: "auto",
					}}
				/>
			</Box>

			{/* GenreTabs Skeleton */}
			<Box
				sx={{ borderBottom: 1, borderColor: "divider", mb: 3, mt: 10 }}
			>
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 1,
						p: { xs: 1, sm: 1.5 },
						mx: -1,
						justifyContent: { xs: "center", sm: "flex-start" },
					}}
				>
					{Array.from(new Array(3)).map((_, index) => (
						<Skeleton
							key={index}
							variant="rectangular"
							sx={{ width: 100, height: 40, borderRadius: 1 }}
						/>
					))}
				</Box>
			</Box>

			{/* Movies Section Skeleton */}
			<Box sx={{ mb: 6 }}>
				<Box
					sx={{
						p: { xs: 2, sm: 3 },
						borderBottom: 1,
						borderColor: "divider",
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
					}}
				>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<Skeleton
							variant="text"
							sx={{ width: "200px", height: 32, mb: 1 }}
						/>
						<Skeleton
							variant="text"
							sx={{ width: "250px", height: 22 }}
						/>
					</Box>
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
				<Box sx={{ p: { xs: 2, sm: 3 } }}>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
						{Array.from(new Array(12)).map((_, index) => (
							<Skeleton
								key={index}
								variant="rectangular"
								sx={{
									flex: "1 1 calc(16.66% - 16px)",
									height: { xs: 210, sm: 240 },
								}}
							/>
						))}
					</Box>
					<Box
						sx={{
							mt: 4,
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Skeleton
							variant="rectangular"
							sx={{ width: 200, height: 40 }}
						/>
					</Box>
				</Box>
			</Box>

			{/* Series Section Skeleton */}
			<Box sx={{ mb: 6 }}>
				<Box
					sx={{
						p: { xs: 2, sm: 3 },
						borderBottom: 1,
						borderColor: "divider",
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
					}}
				>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<Skeleton
							variant="text"
							sx={{ width: "200px", height: 32, mb: 1 }}
						/>
						<Skeleton
							variant="text"
							sx={{ width: "250px", height: 22 }}
						/>
					</Box>
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
				<Box sx={{ p: { xs: 2, sm: 3 } }}>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
						{Array.from(new Array(12)).map((_, index) => (
							<Skeleton
								key={index}
								variant="rectangular"
								sx={{
									flex: "1 1 calc(16.66% - 16px)",
									height: { xs: 210, sm: 240 },
								}}
							/>
						))}
					</Box>
					<Box
						sx={{
							mt: 4,
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Skeleton
							variant="rectangular"
							sx={{ width: 200, height: 40 }}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
