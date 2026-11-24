"use client";

import { Typography, Button, Box, Container, Stack } from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import MarqueeBulbs from "@/components/root/marqueeBulbs/MarqueeBulbs";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.14, delayChildren: 0.15 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 36 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
	},
};

const ghostButtonSx = {
	color: "#F3EEE6",
	borderColor: "rgba(243, 238, 230, 0.35)",
	backgroundColor: "rgba(13, 10, 18, 0.35)",
	backdropFilter: "blur(10px)",
	"&:hover": {
		color: "#F3EEE6",
		borderColor: "rgba(243, 238, 230, 0.8)",
		backgroundColor: "rgba(243, 238, 230, 0.1)",
	},
};

const HomeHeroSection = () => {
	return (
		<Box
			component="section"
			className="film-grain"
			sx={{
				position: "relative",
				isolation: "isolate",
				overflow: "hidden",
				mt: { xs: -8, sm: -9 },
				minHeight: { xs: "680px", md: "min(92vh, 860px)" },
				display: "flex",
				alignItems: "center",
				backgroundColor: "#0D0A12",
			}}
		>
			<Box
				aria-hidden
				sx={{
					position: "absolute",
					inset: 0,
					zIndex: -3,
					animation: "poster-wall-drift 48s ease-in-out infinite alternate",
					transformOrigin: "70% 40%",
					filter: "saturate(0.9) contrast(1.05)",
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

			<Box
				aria-hidden
				sx={{
					position: "absolute",
					inset: 0,
					zIndex: -2,
					background:
						"linear-gradient(95deg, rgba(13,10,18,0.97) 0%, rgba(13,10,18,0.86) 38%, rgba(13,10,18,0.35) 72%, rgba(13,10,18,0.6) 100%), linear-gradient(0deg, #0D0A12 0%, rgba(13,10,18,0) 38%), linear-gradient(180deg, rgba(13,10,18,0.85) 0%, rgba(13,10,18,0) 24%)",
				}}
			/>

			<Box
				aria-hidden
				sx={{
					position: "absolute",
					top: "-8%",
					right: "-6%",
					width: { xs: "120%", md: "62%" },
					height: "128%",
					zIndex: -1,
					pointerEvents: "none",
					background:
						"linear-gradient(200deg, rgba(255,203,107,0.42) 0%, rgba(255,178,36,0.14) 38%, rgba(255,178,36,0) 78%)",
					clipPath: "polygon(78% 0, 100% 0, 100% 100%, 0 100%)",
					mixBlendMode: "screen",
					filter: "blur(28px)",
					opacity: 0.85,
					transformOrigin: "100% 0",
					animation: "projector-flicker 7s ease-in-out infinite",
				}}
			/>

			<Container
				maxWidth="xl"
				sx={{
					position: "relative",
					py: { xs: 14, md: 16 },
					px: { xs: 2.5, sm: 4, md: 6 },
				}}
			>
				<motion.div
					initial="hidden"
					animate="visible"
					variants={containerVariants}
				>
					<Stack
						spacing={{ xs: 2.5, md: 3 }}
						sx={{ maxWidth: { xs: "100%", md: "760px" } }}
					>
						<motion.div variants={itemVariants}>
							<Typography
								component="h1"
								sx={{
									fontFamily: "var(--font-display)",
									fontSize: {
										xs: "3.1rem",
										sm: "4.6rem",
										md: "6.4rem",
										lg: "7.4rem",
									},
									fontWeight: 800,
									letterSpacing: { xs: "-0.04em", md: "-0.055em" },
									lineHeight: 0.94,
									color: "#F3EEE6",
									textWrap: "balance",
									textShadow: "0 6px 40px rgba(0,0,0,0.5)",
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
										xs: "1.2rem",
										sm: "1.4rem",
										md: "1.65rem",
									},
									fontWeight: 600,
									color: "#FFCB6B",
									lineHeight: 1.3,
								}}
							>
								Your Gateway to the World of Cinema!
							</Typography>
						</motion.div>

						<motion.div variants={itemVariants}>
							<Typography
								sx={{
									fontSize: { xs: "1rem", md: "1.1rem" },
									color: "rgba(243, 238, 230, 0.78)",
									maxWidth: "56ch",
									lineHeight: 1.7,
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
							spacing={{ xs: 1.5, sm: 2 }}
							sx={{ pt: 1 }}
						>
							<motion.div variants={itemVariants}>
								<Button
									component={Link}
									href="/movies"
									variant="contained"
									size="large"
									startIcon={<PlayArrowIcon />}
									sx={{ width: { xs: "100%", sm: "auto" } }}
								>
									Explore Movies
								</Button>
							</motion.div>

							<motion.div variants={itemVariants}>
								<Button
									component={Link}
									href="/series"
									variant="outlined"
									size="large"
									startIcon={<TvIcon />}
									sx={{
										...ghostButtonSx,
										width: { xs: "100%", sm: "auto" },
									}}
								>
									Browse Series
								</Button>
							</motion.div>
						</Stack>

						<motion.div variants={itemVariants}>
							<Box
								sx={{
									display: { xs: "none", sm: "inline-flex" },
									alignItems: "center",
									mt: 2,
									px: 2.5,
									py: 1,
									position: "relative",
									border: "1px dashed rgba(243, 238, 230, 0.4)",
									borderRadius: "10px",
									backgroundColor: "rgba(13, 10, 18, 0.45)",
									backdropFilter: "blur(8px)",
									"&::before, &::after": {
										content: '""',
										position: "absolute",
										top: "50%",
										width: 12,
										height: 12,
										borderRadius: "50%",
										backgroundColor: "#0D0A12",
										border: "1px dashed rgba(243, 238, 230, 0.4)",
										transform: "translateY(-50%)",
									},
									"&::before": { left: -7 },
									"&::after": { right: -7 },
								}}
							>
								<Typography
									sx={{
										fontSize: "0.9rem",
										color: "rgba(243, 238, 230, 0.85)",
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

			<MarqueeBulbs />
		</Box>
	);
};

export default HomeHeroSection;
