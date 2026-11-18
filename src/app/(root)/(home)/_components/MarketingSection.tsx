"use client";

import { Box, Container, Typography, useTheme } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import UpdateIcon from "@mui/icons-material/Update";
import CollectionsIcon from "@mui/icons-material/Collections";
import DevicesIcon from "@mui/icons-material/Devices";
import { motion, type Variants } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const features = [
	{
		icon: <CollectionsIcon sx={{ fontSize: 40 }} />,
		title: "Extensive Library",
		description:
			"Access thousands of movies and TV shows, from latest releases to timeless classics.",
	},
	{
		icon: <LocalMoviesIcon sx={{ fontSize: 40 }} />,
		title: "Curated Collections",
		description:
			"Discover handpicked selections organized by genre, mood, and themes.",
	},
	{
		icon: <UpdateIcon sx={{ fontSize: 40 }} />,
		title: "Regular Updates",
		description:
			"New content added weekly to keep you entertained with fresh releases.",
	},
	{
		icon: <DevicesIcon sx={{ fontSize: 40 }} />,
		title: "Cross-Platform Support",
		description:
			"Watch seamlessly across all your devices, anytime and anywhere.",
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.2, ease: "easeOut" },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: "easeOut" },
	},
};

const MarketingSection = () => {
	const theme = useTheme();

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 7, md: 10 },
				backgroundColor: theme.vars.palette.background.default,
				position: "relative",
				width: "100%",
			}}
		>
			<Container
				maxWidth="lg"
				sx={{
					px: { xs: 2, sm: 3 },
				}}
			>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<motion.div variants={itemVariants}>
						<Box
							sx={{
								textAlign: "left",
								mb: { xs: 4, md: 6 },
								maxWidth: "760px",
							}}
						>
							<Typography
								variant="h2"
								sx={{
									fontSize: { xs: 28, sm: 34, md: 40 },
									fontWeight: 700,
									letterSpacing: "-0.04em",
									mb: 1.5,
								}}
							>
								Welcome to MovieLandia24
							</Typography>
							<Typography
								variant="h3"
								sx={{
									fontSize: { xs: 15, sm: 16, md: 17 },
									color: "text.secondary",
									lineHeight: 1.75,
								}}
							>
								Your premier destination for cinematic
								entertainment. We bring you a vast collection of
								movies and series, carefully curated to provide
								the best streaming experience.
							</Typography>
						</Box>
					</motion.div>

					<Box
						sx={{
							maxWidth: "1200px",
							mx: 0,
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								md: "repeat(4, 1fr)",
							},
							columnGap: { xs: 3, md: 4 },
							rowGap: { xs: 3, md: 4 },
						}}
					>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
								style={{ height: "100%" }}
							>
								<Box
									sx={{
										textAlign: "left",
										pt: 2.5,
										borderTop: "1px solid",
										borderColor: theme.vars.palette.divider,
										height: "100%",
									}}
								>
									<Box
										sx={{
											color: theme.vars.palette.green
												.main,
											mb: 1.5,
											display: "flex",
											justifyContent: "flex-start",
										}}
									>
										{feature.icon}
									</Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											mb: 0.75,
											fontSize: { xs: 17, md: 18 },
										}}
									>
										{feature.title}
									</Typography>
									<Typography
										variant="body1"
										sx={{
											color: "text.secondary",
											fontSize: { xs: 14, md: 16 },
											lineHeight: 1.6,
										}}
									>
										{feature.description}
									</Typography>
								</Box>
							</motion.div>
						))}
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default MarketingSection;
