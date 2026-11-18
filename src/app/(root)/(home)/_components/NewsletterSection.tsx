"use client";

import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
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
			<Container maxWidth="xl">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={containerVariants}
				>
					<Box
						sx={{
							textAlign: "left",
							position: "relative",
							zIndex: 1,
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								md: "minmax(0, 1fr) minmax(320px, 0.8fr)",
							},
							alignItems: "center",
							gap: { xs: 3, md: 6 },
							p: { xs: 3, sm: 4, md: 6 },
							border: "1px solid",
							borderColor: "divider",
							borderRadius: 2,
							backgroundColor:
								theme.vars.palette.background.paper,
						}}
					>
						<Box>
							<motion.div variants={itemVariants}>
								<Box
									sx={{
										display: "inline-flex",
										alignItems: "center",
										color: theme.vars.palette.green.light,
										mb: 1.5,
									}}
								>
									<MailOutlineOutlinedIcon
										sx={{ mr: 1, fontSize: 20 }}
									/>
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
										fontSize: { xs: 28, sm: 34, md: 40 },
										fontWeight: 700,
										letterSpacing: "-0.04em",
										mb: 1.5,
									}}
								>
									Subscribe to Our Newsletter
								</Typography>
							</motion.div>
							<motion.div variants={itemVariants}>
								<Typography
									variant="h3"
									sx={{
										fontSize: { xs: 15, sm: 16 },
										color: theme.vars.palette.text
											.secondary,
										mb: 0,
										maxWidth: "560px",
										lineHeight: 1.7,
									}}
								>
									Get notified about new releases, exclusive
									content, and special events. Join our
									community of movie enthusiasts!
								</Typography>
							</motion.div>
						</Box>
						<Box>
							<motion.div variants={itemVariants}>
								<Box
									component="form"
									sx={{
										display: "flex",
										flexDirection: {
											xs: "column",
											sm: "row",
										},
										gap: 1.5,
										width: "100%",
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
													height: 52,
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
												minWidth: {
													xs: "100%",
													sm: 180,
												},
												height: 52,
												textTransform: "none",
												fontSize: 16,
												fontWeight: 600,
												color: "#080b12",
												backgroundColor:
													theme.vars.palette.green
														.main,
												boxShadow: "none",
												transition:
													"background-color 180ms ease",
												"&:hover": {
													backgroundColor:
														theme.vars.palette.green
															.light,
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
										color: theme.vars.palette.text
											.secondary,
										lineHeight: 1.6,
									}}
								>
									By subscribing, you agree to our Privacy
									Policy and Terms of Service.
								</Typography>
							</motion.div>
						</Box>
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
};

export default NewsletterSection;
