"use client";

import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { subscribeNewsletter } from "../../../../actions/auth.actions";
import { showToast } from "@/utils/helpers/toast";
import SectionHeading from "@/components/root/sectionHeading/SectionHeading";

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.15, ease: "easeOut" },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 36 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const NewsletterSection = () => {
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

	return (
		<Box
			component="section"
			sx={{
				py: { xs: 6, md: 10 },
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
					<Box
						sx={{
							position: "relative",
							overflow: "hidden",
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr",
								md: "minmax(0, 1fr) minmax(320px, 0.8fr)",
							},
							alignItems: "center",
							gap: { xs: 3, md: 8 },
							p: { xs: 3.5, sm: 5, md: 8 },
							border: "1px solid",
							borderColor: "divider",
							borderRadius: "32px",
							backgroundColor: "background.paper",
							backgroundImage:
								"radial-gradient(600px 300px at 100% 0%, rgba(255, 178, 36, 0.16), transparent 70%)",
						}}
					>
						<motion.div variants={itemVariants}>
							<Box sx={{ "& > div": { mb: 0 } }}>
								<SectionHeading
									eyebrow="Stay Updated"
									title="Subscribe to Our Newsletter"
									description="Get notified about new releases, exclusive content, and special events. Join our community of movie enthusiasts!"
								/>
							</Box>
						</motion.div>
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
									<TextField
										fullWidth
										placeholder="Enter your email"
										variant="outlined"
										onChange={(e) =>
											setEmail(e.target.value)
										}
										type="email"
										slotProps={{
											htmlInput: {
												"aria-label": "Email address",
											},
										}}
										sx={{
											"& .MuiOutlinedInput-root": {
												height: 56,
												borderRadius: 999,
												px: 1,
											},
										}}
									/>
									<Button
										variant="contained"
										size="large"
										onClick={handleSubscribe}
										sx={{
											minWidth: {
												xs: "100%",
												sm: 180,
											},
											height: 56,
										}}
									>
										Subscribe
									</Button>
								</Box>
							</motion.div>
							<motion.div variants={itemVariants}>
								<Typography
									variant="caption"
									sx={{
										display: "block",
										mt: 2,
										px: 1,
										color: "text.secondary",
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
