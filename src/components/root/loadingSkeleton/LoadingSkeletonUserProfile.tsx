"use client";

import React from "react";
import { Box, Skeleton, Stack, Paper, Divider } from "@mui/material";

export default function LoadingSkeletonUserProfile() {
	return (
		<Stack spacing={6} alignItems="center" sx={{ mt: 6, py: 6 }}>
			{/* Updated Profile Header mimicking actual layout: Avatar & ProfileInfo in center, Stats bottom right */}
			<Paper
				elevation={3}
				sx={{
					width: "100%",
					maxWidth: 800,
					p: { xs: 6, sm: 8 },
					position: "relative",
				}}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* Avatar Skeleton set to same dimensions as ProfileHeader */}
					<Skeleton
						variant="circular"
						sx={{
							width: { xs: 120, sm: 150 },
							height: { xs: 120, sm: 150 },
						}}
					/>
					{/* Profile info Skeleton with fixed width to match ProfileHeader */}
					<Box
						sx={{
							mt: 4,
							textAlign: "center",
							width: { xs: 120, sm: 150 },
						}}
					>
						<Skeleton
							variant="text"
							sx={{ width: "100%", height: 36 }}
						/>
						<Skeleton
							variant="text"
							sx={{ width: "100%", height: 28, mt: 1 }}
						/>
					</Box>
				</Box>
				{/* Stats Skeleton positioned at bottom right with increased padding-top */}
				<Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
					<Stack spacing={2} alignItems="flex-end">
						<Skeleton
							variant="text"
							sx={{ width: 100, height: 30 }}
						/>
						<Skeleton
							variant="text"
							sx={{ width: 100, height: 30 }}
						/>
					</Stack>
				</Box>
			</Paper>

			{/* Tabs Header with Title, Description & Divider */}
			<Box
				sx={{
					width: "100%",
					maxWidth: 800,
					textAlign: "center",
					mb: 4,
				}}
			>
				<Skeleton
					variant="text"
					sx={{ width: "60%", height: 32, mb: 1 }}
				/>
				<Skeleton
					variant="text"
					sx={{ width: "80%", height: 24, mb: 2 }}
				/>
				<Divider />
			</Box>

			{/* Tabs: Main & Subtabs Skeleton */}
			<Box sx={{ width: "100%", maxWidth: 800, mb: 4 }}>
				{/* Main Tabs */}
				<Stack direction="row" spacing={0} justifyContent="center">
					{Array.from(new Array(6)).map((_, index) => (
						<Skeleton
							key={index}
							variant="rectangular"
							sx={{ width: 100, height: 40 }}
						/>
					))}
				</Stack>
				{/* Sub Tabs */}
				<Stack
					direction="row"
					spacing={0}
					justifyContent="center"
					sx={{ mt: 1 }}
				>
					{Array.from(new Array(6)).map((_, index) => (
						<Skeleton
							key={index}
							variant="rectangular"
							sx={{ width: 100, height: 40 }}
						/>
					))}
				</Stack>
			</Box>

			{/* Tab Content Section Skeleton */}
			<Box sx={{ width: "100%", maxWidth: 1200, px: { xs: 1, sm: 2 } }}>
				{/* Adjusted Search Bar Skeleton */}
				<Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
					<Skeleton
						variant="rectangular"
						sx={{ width: "40%", height: 48, borderRadius: 1 }}
					/>
				</Box>
				{/* Grid of Content Cards Skeleton */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "repeat(auto-fill, minmax(125px, 1fr))",
							sm: "repeat(6, 125px)",
						},
						gap: 2,
						justifyContent: "center",
						mb: 4,
					}}
				>
					{Array.from(new Array(6)).map((_, index) => (
						<Skeleton
							key={index}
							variant="rectangular"
							sx={{ width: 125, height: 170 }}
						/>
					))}
				</Box>
				{/* Pagination Skeleton */}
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<Skeleton
						variant="rectangular"
						sx={{ width: 200, height: 40 }}
					/>
				</Box>
			</Box>
		</Stack>
	);
}
