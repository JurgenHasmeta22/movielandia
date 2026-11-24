"use client";

import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion, type Variants } from "framer-motion";
import ExploreIcon from "@mui/icons-material/Explore";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShareIcon from "@mui/icons-material/Share";
import SectionHeading from "@/components/root/sectionHeading/SectionHeading";

const steps = [
	{
		icon: <ExploreIcon sx={{ fontSize: 26 }} />,
		title: "Discover",
		description:
			"Browse our extensive collection of movies, TV series, actors, and crew members. Use filters to find exactly what you're looking for.",
	},
	{
		icon: <BookmarkAddIcon sx={{ fontSize: 26 }} />,
		title: "Save",
		description:
			"Create watchlists, bookmark your favorites, and keep track of what you want to watch next. Never lose track of a great recommendation.",
	},
	{
		icon: <RateReviewIcon sx={{ fontSize: 26 }} />,
		title: "Review",
		description:
			"Share your thoughts by rating and reviewing content. Help others discover great movies and shows through your insights.",
	},
	{
		icon: <ShareIcon sx={{ fontSize: 26 }} />,
		title: "Connect",
		description:
			"Join discussions, follow other users with similar tastes, and become part of our vibrant community of film enthusiasts.",
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.12, ease: "easeOut" },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const HowItWorksSection = () => {
	return (
		<Box
			component="section"
			sx={{
				py: { xs: 8, md: 12 },
				backgroundColor: "background.paper",
				borderBlock: "1px solid",
				borderColor: "divider",
				position: "relative",
				width: "100%",
				overflow: "hidden",
			}}
		>
			<Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<motion.div variants={itemVariants}>
						<SectionHeading
							eyebrow="Getting Started"
							title="How MovieLandia24 Works"
							description="Get started with MovieLandia24 in just a few simple steps and unlock the full potential of your cinematic journey."
						/>
					</motion.div>

					<Box
						component="ol"
						sx={{
							listStyle: "none",
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(4, 1fr)",
							},
							gap: { xs: 2, md: 3 },
						}}
					>
						{steps.map((step, index) => (
							<motion.li
								key={step.title}
								variants={itemVariants}
								style={{ height: "100%" }}
							>
								<Box
									sx={{
										position: "relative",
										height: "100%",
										p: 3,
										pt: 4,
										overflow: "hidden",
										borderRadius: "20px",
										border: "1px solid",
										borderColor: "divider",
										backgroundColor: "background.default",
										transition: "border-color 240ms ease",
										"&:hover": { borderColor: "accent.main" },
									}}
								>
									<Typography
										aria-hidden
										sx={{
											position: "absolute",
											top: -18,
											right: 12,
											fontFamily: "var(--font-display)",
											fontSize: "8rem",
											fontWeight: 800,
											lineHeight: 1,
											color: "transparent",
											WebkitTextStroke:
												"1.5px rgba(255, 178, 36, 0.35)",
											userSelect: "none",
										}}
									>
										{index + 1}
									</Typography>
									<Box
										sx={{
											position: "relative",
											display: "grid",
											placeItems: "center",
											width: 48,
											height: 48,
											mb: 3,
											borderRadius: "50%",
											color: "accent.contrastText",
											backgroundColor: "accent.main",
										}}
									>
										{step.icon}
									</Box>
									<Typography
										variant="h4"
										component="h3"
										sx={{ position: "relative", mb: 1.25 }}
									>
										{step.title}
									</Typography>
									<Typography
										sx={{
											position: "relative",
											color: "text.secondary",
											fontSize: "0.95rem",
											lineHeight: 1.7,
										}}
									>
										{step.description}
									</Typography>
								</Box>
							</motion.li>
						))}
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default HowItWorksSection;
