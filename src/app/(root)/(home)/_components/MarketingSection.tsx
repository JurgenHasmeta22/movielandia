"use client";

import { Box, Container, Typography } from "@mui/material";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import UpdateIcon from "@mui/icons-material/Update";
import CollectionsIcon from "@mui/icons-material/Collections";
import DevicesIcon from "@mui/icons-material/Devices";
import { motion, type Variants } from "framer-motion";
import SectionHeading from "@/components/root/sectionHeading/SectionHeading";

const features = [
	{
		icon: <CollectionsIcon sx={{ fontSize: 28 }} />,
		title: "Extensive Library",
		description:
			"Access thousands of movies and TV shows, from latest releases to timeless classics.",
	},
	{
		icon: <LocalMoviesIcon sx={{ fontSize: 28 }} />,
		title: "Curated Collections",
		description:
			"Discover handpicked selections organized by genre, mood, and themes.",
	},
	{
		icon: <UpdateIcon sx={{ fontSize: 28 }} />,
		title: "Regular Updates",
		description:
			"New content added weekly to keep you entertained with fresh releases.",
	},
	{
		icon: <DevicesIcon sx={{ fontSize: 28 }} />,
		title: "Cross-Platform Support",
		description:
			"Watch seamlessly across all your devices, anytime and anywhere.",
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
	hidden: { opacity: 0, y: 32 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const MarketingSection = () => {
	return (
		<Box
			component="section"
			sx={{
				py: { xs: 8, md: 12 },
				position: "relative",
				width: "100%",
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
							title="Welcome to MovieLandia24"
							description="Your premier destination for cinematic entertainment. We bring you a vast collection of movies and series, carefully curated to provide the best streaming experience."
							maxWidth="760px"
						/>
					</motion.div>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(4, 1fr)",
							},
							gap: { xs: 2, md: 3 },
						}}
					>
						{features.map((feature) => (
							<motion.div
								key={feature.title}
								variants={itemVariants}
								style={{ height: "100%" }}
							>
								<Box
									sx={{
										height: "100%",
										p: 3,
										borderRadius: "20px",
										border: "1px solid",
										borderColor: "divider",
										backgroundColor: "background.paper",
										transition:
											"border-color 240ms ease, transform 240ms ease",
										"&:hover": {
											borderColor: "accent.main",
											transform: "translateY(-4px)",
										},
									}}
								>
									<Box
										sx={{
											display: "grid",
											placeItems: "center",
											width: 52,
											height: 52,
											mb: 2.5,
											borderRadius: "14px",
											color: "accent.main",
											backgroundColor:
												"rgba(255, 178, 36, 0.12)",
										}}
									>
										{feature.icon}
									</Box>
									<Typography
										variant="h5"
										component="h3"
										sx={{ mb: 1 }}
									>
										{feature.title}
									</Typography>
									<Typography
										sx={{
											color: "text.secondary",
											fontSize: "0.95rem",
											lineHeight: 1.65,
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
