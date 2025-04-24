"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

export default function LoadingSkeletonWithLatest() {
	return (
		<Box
			component="section"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: { xs: 3, sm: 4, md: 5 },
			}}
		>
			<Box component="section">
				<Box
					sx={{
						position: "relative",
						height: {
							xs: "100vh",
							sm: "90vh",
							md: "80vh",
						},
						overflow: "hidden",
						mt: 4,
						mb: 2,
						borderRadius: { xs: 0, sm: 2 },
						boxShadow: {
							xs: "none",
							sm: "rgba(0, 0, 0, 0.1) 0px 8px 24px",
						},
						backgroundColor: "rgba(20, 20, 20, 0.05)",
					}}
				>
					<Box
						sx={{
							position: "relative",
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							alignItems: "center",
							justifyContent: { xs: "flex-start", md: "center" },
							gap: { xs: 3, sm: 4, md: 6 },
							pt: { xs: 4, sm: 0 },
							p: { xs: 2, sm: 3, md: 4 },
						}}
					>
						<Box
							sx={{
								position: "relative",
								zIndex: 2,
								flexShrink: 0,
							}}
						>
							<Skeleton
								variant="rectangular"
								sx={{
									width: 280,
									height: 400,
									borderRadius: "16px",
									boxShadow:
										"0 16px 32px rgba(20, 20, 20, 0.25)",
								}}
							/>
						</Box>

						<Box
							sx={{
								position: { xs: "relative", md: "static" },
								zIndex: 2,
								width: "100%",
								maxWidth: { xs: "100%", md: "50%" },
								px: { xs: 2, sm: 3, md: 0 },
							}}
						>
							<Skeleton
								variant="text"
								sx={{ width: "80%", height: 60, mb: 2 }}
							/>
							<Skeleton
								variant="text"
								sx={{ width: "100%", height: 20, mb: 1 }}
							/>
							<Skeleton
								variant="text"
								sx={{ width: "100%", height: 20, mb: 1 }}
							/>
							<Skeleton
								variant="text"
								sx={{ width: "90%", height: 20, mb: 1 }}
							/>
							<Skeleton
								variant="text"
								sx={{ width: "95%", height: 20, mb: 3 }}
							/>
							<Skeleton
								variant="rectangular"
								sx={{
									width: 120,
									height: 45,
									borderRadius: "8px",
								}}
							/>
						</Box>

						<Box
							sx={{
								position: "absolute",
								bottom: { xs: "24px", sm: "28px", md: "32px" },
								left: 0,
								width: "100%",
								display: "flex",
								justifyContent: "center",
								zIndex: 5,
							}}
						>
							<Box sx={{ display: "flex", gap: 1 }}>
								{[1, 2, 3].map((_, index) => (
									<Skeleton
										key={index}
										variant="circular"
										sx={{
											width: { xs: 10, sm: 12 },
											height: { xs: 10, sm: 12 },
											bgcolor:
												index === 0
													? "#4cceac"
													: "rgba(224, 224, 224, 0.5)",
										}}
									/>
								))}
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>

			<Box
				component="section"
				sx={{
					maxWidth: "1200px",
					margin: "0 auto",
					width: "100%",
					px: { xs: 2, sm: 3, md: 4 },
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						flexDirection: { xs: "column", sm: "row" },
						gap: { xs: 2, sm: 3 },
						mb: { xs: 3, md: 4 },
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", sm: "row" },
							alignItems: { xs: "flex-start", sm: "baseline" },
							gap: { xs: 1, sm: 2 },
						}}
					>
						<Skeleton
							variant="text"
							sx={{
								width: 120,
								height: 40,
								position: "relative",
								display: "inline-block",
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: -8,
									left: 0,
									width: "100%",
									height: 3,
									bgcolor: "rgba(0, 0, 0, 0.12)",
									borderRadius: 1,
								},
							}}
						/>
						<Skeleton
							variant="text"
							sx={{
								width: 120,
								height: 24,
								mt: { xs: 2, sm: 0 },
								ml: { sm: 1 },
							}}
						/>
					</Box>
					<Box>
						<Skeleton
							variant="rectangular"
							sx={{ width: 150, height: 40, borderRadius: 1 }}
						/>
					</Box>
				</Box>

				<Box
					sx={{
						width: "100%",
						overflow: "hidden",
						mt: { xs: 4, md: 5 },
					}}
				>
					<Stack
						direction="row"
						flexWrap="wrap"
						sx={{
							columnGap: { xs: 1, sm: 2, md: 3 },
							rowGap: { xs: 3, sm: 4, md: 5 },
							justifyContent: {
								xs: "center",
								md: "flex-start",
							},
							mx: { xs: 1, sm: 2 },
							mb: { xs: 3, md: 4 },
						}}
					>
						{Array.from(new Array(12)).map((_, index) => (
							<Box key={index}>
								<Skeleton
									variant="rectangular"
									sx={{
										width: { xs: 140, sm: 160 },
										height: { xs: 210, sm: 240 },
										borderRadius: 2,
										boxShadow:
											"0 2px 8px rgba(0, 0, 0, 0.1)",
									}}
								/>
							</Box>
						))}
					</Stack>

					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							mb: 4,
						}}
					>
						<Skeleton
							variant="rectangular"
							sx={{ width: 300, height: 40, borderRadius: 1 }}
						/>
					</Box>
				</Box>
			</Box>

			<Box component="section">
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						maxWidth: "1200px",
						margin: "0 auto",
						width: "100%",
						px: { xs: 2, sm: 3, md: 4 },
						py: { xs: 3, md: 4 },
					}}
				>
					<Box
						sx={{
							mb: { xs: 1, md: 2 },
							display: "flex",
							justifyContent: { xs: "center", md: "flex-start" },
						}}
					>
						<Skeleton
							variant="text"
							sx={{
								width: 200,
								height: 48,
								position: "relative",
								display: "inline-block",
								"&::after": {
									content: '""',
									position: "absolute",
									bottom: -8,
									left: 0,
									width: "100%",
									height: 3,
									bgcolor: "rgba(0, 0, 0, 0.12)",
									borderRadius: 1,
								},
							}}
						/>
					</Box>

					<Box
						sx={{
							width: "100%",
							overflow: "hidden",
							mt: { xs: 4, md: 5 },
						}}
					>
						<Stack
							direction="row"
							flexWrap="wrap"
							sx={{
								columnGap: { xs: 1, sm: 2, md: 3 },
								rowGap: { xs: 3, sm: 4, md: 5 },
								justifyContent: {
									xs: "center",
									md: "flex-start",
								},
								mx: { xs: 1, sm: 2 },
							}}
						>
							{Array.from(new Array(12)).map((_, index) => (
								<Box key={index}>
									<Skeleton
										variant="rectangular"
										sx={{
											width: { xs: 140, sm: 160 },
											height: { xs: 210, sm: 240 },
											borderRadius: 2,
											boxShadow:
												"0 2px 8px rgba(0, 0, 0, 0.1)",
										}}
									/>
								</Box>
							))}
						</Stack>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
