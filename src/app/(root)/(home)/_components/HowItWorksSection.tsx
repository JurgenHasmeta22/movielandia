"use client";

import React from "react";
import { Box, Container, Typography, useTheme, Paper } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShareIcon from "@mui/icons-material/Share";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { motion, type Variants } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const steps = [
	{
		icon: <ExploreIcon sx={{ fontSize: 40 }} />,
		title: "Discover",
		description:
			"Browse our extensive collection of movies, TV series, actors, and crew members. Use filters to find exactly what you're looking for.",
	},
	{
		icon: <BookmarkAddIcon sx={{ fontSize: 40 }} />,
		title: "Save",
		description:
			"Create watchlists, bookmark your favorites, and keep track of what you want to watch next. Never lose track of a great recommendation.",
	},
	{
		icon: <RateReviewIcon sx={{ fontSize: 40 }} />,
		title: "Review",
		description:
			"Share your thoughts by rating and reviewing content. Help others discover great movies and shows through your insights.",
	},
	{
		icon: <ShareIcon sx={{ fontSize: 40 }} />,
		title: "Connect",
		description:
			"Join discussions, follow other users with similar tastes, and become part of our vibrant community of film enthusiasts.",
	},
];

const HowItWorksSection = () => {
	const theme = useTheme();

	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.2, ease: "easeOut" },
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 7, md: 10 },
				backgroundColor: theme.vars.palette.background.paper,
				position: "relative",
				width: "100%",
				overflow: "hidden",
			}}
		>
			<Container maxWidth="xl">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<Box sx={{ textAlign: "left", mb: { xs: 4, md: 6 } }}>
						<motion.div variants={itemVariants}>
							<Box
								sx={{
									display: "inline-flex",
									alignItems: "center",
									color: theme.vars.palette.green.light,
									mb: 1.5,
								}}
							>
								<HelpOutlineOutlinedIcon
									sx={{ mr: 1, fontSize: 20 }}
								/>
								<Typography
									variant="subtitle2"
									sx={{ fontWeight: 600, fontSize: 14 }}
								>
									Getting Started
								</Typography>
							</Box>
						</motion.div>
						<motion.div variants={itemVariants}>
							<Typography
								variant="h3"
								sx={{
									fontWeight: 700,
									mb: 1.5,
									letterSpacing: "-0.04em",
									fontSize: {
										xs: "1.8rem",
										sm: "2.2rem",
										md: "2.6rem",
									},
								}}
							>
								How MovieLandia24 Works
							</Typography>
						</motion.div>
						<motion.div variants={itemVariants}>
							<Typography
								variant="body1"
								sx={{
									color: theme.vars.palette.text.secondary,
									maxWidth: "680px",
									fontSize: { xs: "0.9rem", sm: "1rem" },
									lineHeight: 1.7,
								}}
							>
								Get started with MovieLandia24 in just a few
								simple steps and unlock the full potential of
								your cinematic journey.
							</Typography>
						</motion.div>
					</Box>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								md: "repeat(4, 1fr)",
							},
							gap: { xs: 2, md: 3 },
							mt: 3,
						}}
					>
						{steps.map((step, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								custom={index}
								whileHover={{
									y: -10,
									transition: { duration: 0.3 },
								}}
								style={{ height: "100%" }}
							>
								<Paper
									elevation={0}
									sx={{
										px: { xs: 0, sm: 2 },
										py: { xs: 2.5, md: 3 },
										height: "100%",
										borderRadius: 0,
										textAlign: "left",
										border: 0,
										borderTop: "1px solid",
										borderColor: "divider",
										backgroundColor: "transparent",
										position: "relative",
										overflow: "hidden",
										display: "flex",
										flexDirection: "column",
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "flex-start",
											width: 44,
											height: 44,
											color: theme.vars.palette.green
												.main,
											mb: 1.5,
										}}
									>
										{step.icon}
									</Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											mb: 1.5,
											letterSpacing: "-0.02em",
											fontSize: {
												xs: "1.1rem",
												sm: "1.25rem",
											},
										}}
									>
										{step.title}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: theme.vars.palette.text
												.secondary,
											fontSize: {
												xs: "0.85rem",
												sm: "0.9rem",
											},
											lineHeight: 1.7,
											flexGrow: 1,
										}}
									>
										{step.description}
									</Typography>
									<Box
										sx={{
											position: "static",
											order: -1,
											width: "auto",
											height: "auto",
											borderRadius: 0,
											backgroundColor: "transparent",
											color: theme.vars.palette.green
												.main,
											display: "block",
											fontSize: "0.75rem",
											fontWeight: 700,
											mb: 1,
										}}
									>
										{index + 1}
									</Box>
								</Paper>
							</motion.div>
						))}
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default HowItWorksSection;
