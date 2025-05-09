"use client";

import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useState } from "react";
import { motion } from "framer-motion";
import { subscribeNewsletter } from "../../../../actions/auth.actions";
import { showToast } from "@/utils/helpers/toast";

const NewsletterSection = () => {
	const theme = useTheme();
	const [email, setEmail] = useState("");

	const handleSubscribe = async () => {
		try {
			const message = await subscribeNewsletter({ email });
			const messageType = message.includes("successful")
				? "success"
				: "error";
			showToast(messageType, message);
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An unexpected error occurred.";
			showToast("error", errorMessage);
		}
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.2, ease: "easeOut" },
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.7, ease: "easeOut" },
		},
	};

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 6, md: 8 },
				backgroundColor: theme.vars.palette.background.default,
				position: "relative",
				width: "100%",
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03,
					backgroundImage:
						"radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
					backgroundSize: "40px 40px",
				}}
			/>
			<Container maxWidth="md">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<Box
						sx={{
							textAlign: "center",
							position: "relative",
							zIndex: 1,
						}}
					>
						<motion.div variants={itemVariants}>
							<Box
								sx={{
									display: "inline-flex",
									alignItems: "center",
									backgroundColor: `${theme.vars.palette.primary.main}15`,
									color: theme.vars.palette.primary.main,
									px: 2,
									py: 1,
									borderRadius: 2,
									mb: 3,
								}}
							>
								<MailOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
								<Typography
									variant="subtitle2"
									sx={{ fontWeight: 600, fontSize: 14 }}
								>
									Stay Updated
								</Typography>
							</Box>
						</motion.div>
						<motion.div variants={itemVariants}>
							<Typography
								variant="h2"
								sx={{
									fontSize: { xs: 28, sm: 32, md: 40 },
									fontWeight: 800,
									mb: 2,
									background: `linear-gradient(45deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.secondary.main})`,
									backgroundClip: "text",
									WebkitBackgroundClip: "text",
									color: "transparent",
									WebkitTextFillColor: "transparent",
								}}
							>
								Subscribe to Our Newsletter
							</Typography>
						</motion.div>
						<motion.div variants={itemVariants}>
							<Typography
								variant="h3"
								sx={{
									fontSize: { xs: 16, sm: 18 },
									color: theme.vars.palette.text.secondary,
									mb: 4,
									maxWidth: "600px",
									mx: "auto",
								}}
							>
								Get notified about new releases, exclusive
								content, and special events. Join our community
								of movie enthusiasts!
							</Typography>
						</motion.div>
						<motion.div variants={itemVariants}>
							<Box
								component="form"
								sx={{
									display: "flex",
									flexDirection: { xs: "column", sm: "row" },
									gap: 2,
									maxWidth: "500px",
									mx: "auto",
								}}
								noValidate
							>
								<motion.div
									variants={itemVariants}
									style={{ width: "100%" }}
								>
									<TextField
										fullWidth
										placeholder="Enter your email"
										variant="outlined"
										onChange={(e) =>
											setEmail(e.target.value)
										}
										type="email"
										sx={{
											"& .MuiOutlinedInput-root": {
												backgroundColor:
													theme.vars.palette
														.background.paper,
												height: 56,
											},
										}}
									/>
								</motion.div>
								<motion.div variants={itemVariants}>
									<Button
										variant="contained"
										size="large"
										onClick={handleSubscribe}
										sx={{
											minWidth: { xs: "100%", sm: 180 },
											height: 56,
											textTransform: "none",
											fontSize: 16,
											fontWeight: 600,
											color: theme.vars.palette.background
												.default,
											background: `linear-gradient(45deg, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.primary.main})`,
											boxShadow:
												"0 8px 16px rgba(0, 0, 0, 0.1)",
											transition: "all 0.2s ease-in-out",
											"&:hover": {
												transform: "translateY(-2px)",
												boxShadow:
													"0 12px 20px rgba(0, 0, 0, 0.15)",
												background: `linear-gradient(45deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.secondary.main})`,
											},
											"&:active": {
												transform: "translateY(0)",
											},
										}}
									>
										Subscribe
									</Button>
								</motion.div>
							</Box>
						</motion.div>
						<motion.div variants={itemVariants}>
							<Typography
								variant="caption"
								sx={{
									display: "block",
									mt: 2,
									color: theme.vars.palette.text.secondary,
								}}
							>
								By subscribing, you agree to our Privacy Policy
								and Terms of Service.
							</Typography>
						</motion.div>
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default NewsletterSection;
