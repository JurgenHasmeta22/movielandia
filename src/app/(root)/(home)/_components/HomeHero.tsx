"use client";

import {
	Typography,
	Button,
	Box,
	Container,
	Stack,
	useTheme,
} from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";

const HomeHeroSection = () => {
	const theme = useTheme();

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

	const buttonHoverVariants = {
		hover: {
			scale: 1.05,
			transition: { duration: 0.3, ease: "easeInOut" },
		},
	};

	return (
		<Box
			sx={{
				position: "relative",
				minHeight: { xs: "620px", sm: "min(76vh, 760px)" },
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: -1,
					"&::after": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background:
							"linear-gradient(90deg, rgba(4,5,9,0.94) 0%, rgba(8,11,18,0.82) 48%, rgba(8,11,18,0.28) 100%), linear-gradient(0deg, rgba(8,11,18,0.5), transparent 55%)",
					},
				}}
			>
				<Image
					src="/images/backgrounds/netflix.png"
					alt="Background Image"
					fill
					priority={true}
					style={{ objectFit: "cover", objectPosition: "center" }}
				/>
			</Box>

			<Container
				maxWidth="xl"
				sx={{
					position: "relative",
					zIndex: 2,
					py: { xs: 7, sm: 8, md: 10 },
				}}
			>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<Stack
						spacing={{ xs: 2, sm: 2.5, md: 3 }}
						sx={{
							maxWidth: { xs: "100%", md: "680px" },
							textAlign: "left",
							mx: 0,
							py: { xs: 4, md: 0 },
						}}
					>
						<motion.div variants={itemVariants}>
							<Typography
								component="h1"
								sx={{
									fontSize: {
										xs: "2.75rem",
										sm: "3.5rem",
										md: "4.5rem",
										lg: "5rem",
									},
									fontWeight: 700,
									letterSpacing: { xs: "-1.5px", md: "-3px" },
									lineHeight: 1.02,
									color: theme.vars.palette.common.white,
									textShadow: "0 3px 24px rgba(0,0,0,0.35)",
									mb: { xs: 0.5, md: 1 },
								}}
							>
								Dive into MovieLandia24
							</Typography>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Typography
								component="h2"
								sx={{
									fontSize: {
										xs: "1.125rem",
										sm: "1.25rem",
										md: "1.5rem",
									},
									fontWeight: 500,
									color: theme.vars.palette.green.light,
									lineHeight: 1.4,
									mb: { xs: 0.5, md: 1 },
								}}
							>
								Your Gateway to the World of Cinema!
							</Typography>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Typography
								sx={{
									fontSize: {
										xs: "0.95rem",
										sm: "1rem",
										md: "1.05rem",
									},
									fontWeight: 400,
									color: "rgba(255,255,255,0.8)",
									maxWidth: { xs: "100%", md: "90%" },
									lineHeight: 1.75,
									mb: { xs: 1, md: 2 },
								}}
							>
								Explore the latest blockbusters and timeless
								classics in our curated collection of movies and
								series. Discover, rate, and share your favorite
								cinematic experiences.
							</Typography>
						</motion.div>

						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={{ xs: 2, sm: 3 }}
							sx={{
								justifyContent: "flex-start",
								mt: { xs: 0.5, md: 1 },
							}}
						>
							<motion.div
								variants={itemVariants}
								whileHover="hover"
							>
								<Button
									component={Link}
									href="/movies"
									variant="contained"
									startIcon={<PlayArrowIcon />}
									sx={{
										px: { xs: 2.5, md: 3.5 },
										py: { xs: 1.25, md: 1.5 },
										fontSize: { xs: "0.9rem", md: "1rem" },
										fontWeight: 600,
										borderRadius: "8px",
										textTransform: "none",
										boxShadow: "none",
										backgroundColor:
											theme.vars.palette.green.main,
										color: "#080b12",
										transition:
											"background-color 180ms ease, transform 180ms ease",
										width: { xs: "100%", sm: "auto" },
										"&:hover": {
											transform: "translateY(-2px)",
											backgroundColor:
												theme.vars.palette.green.light,
											boxShadow: "none",
										},
									}}
								>
									Explore Movies
								</Button>
							</motion.div>

							<motion.div
								variants={itemVariants}
								whileHover="hover"
							>
								<Button
									component={Link}
									href="/series"
									variant="outlined"
									startIcon={<TvIcon />}
									sx={{
										px: { xs: 2.5, md: 3.5 },
										py: { xs: 1.25, md: 1.5 },
										fontSize: { xs: "0.9rem", md: "1rem" },
										fontWeight: 600,
										borderRadius: "8px",
										textTransform: "none",
										color: theme.vars.palette.common.white,
										borderColor: "rgba(255,255,255,0.7)",
										backgroundColor: "rgba(8,11,18,0.3)",
										transition:
											"background-color 180ms ease, border-color 180ms ease",
										width: { xs: "100%", sm: "auto" },
										"&:hover": {
											borderColor:
												theme.vars.palette.common.white,
											backgroundColor:
												"rgba(255,255,255,0.08)",
										},
									}}
								>
									Browse Series
								</Button>
							</motion.div>
						</Stack>

						<motion.div
							variants={itemVariants}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1.2, duration: 1 }}
						>
							<Box
								sx={{
									display: { xs: "none", sm: "flex" },
									alignItems: "center",
									gap: 1.5,
									mt: 2,
									pl: 1.5,
									borderLeft: "2px solid",
									borderColor: theme.vars.palette.green.main,
								}}
							>
								<Typography
									sx={{
										fontSize: "0.875rem",
										color: "rgba(255,255,255,0.75)",
									}}
								>
									Featuring thousands of titles across all
									genres
								</Typography>
							</Box>
						</motion.div>
					</Stack>
				</motion.div>
			</Container>
		</Box>
	);
};

export default HomeHeroSection;
