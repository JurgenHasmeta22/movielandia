"use client";

import React, { useState } from "react";
import {
	Box,
	Typography,
	Stack,
	Button,
	useTheme,
	Container,
	Paper,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import ForumIcon from "@mui/icons-material/Forum";
import { subscribeNewsletter } from "@/actions/auth.actions";
import { showToast } from "@/utils/helpers/toast";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Link from "next/link";
import { FooterLink } from "./FooterLink";
import { SocialButton } from "./SocialButton";

const Footer = (): React.JSX.Element => {
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

	return (
		<Box
			sx={{
				backgroundColor: theme.vars.palette.primary.dark,
				color: theme.vars.palette.primary.main,
				pt: { xs: 6, md: 8 },
				pb: { xs: 4, md: 6 },
				borderTop: `1px solid ${theme.vars.palette.divider}`,
				"& a": {
					textDecoration: "none !important",
				},
				position: "relative",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage:
						"radial-gradient(circle at 20% 150%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
					zIndex: 0,
				},
			}}
			component="footer"
		>
			<Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: { xs: 4, md: 6 },
						mb: 6,
					}}
				>
					{/* Left column - Navigation links */}
					<Box sx={{ flex: "1 1 auto", maxWidth: { md: "58%" } }}>
						<Box
							sx={{
								display: "flex",
								flexDirection: { xs: "column", sm: "row" },
								gap: 4,
							}}
						>
							<Box sx={{ flex: "1 1 0" }}>
								<Typography
									variant="h6"
									sx={{
										mb: { xs: 1.5, md: 2.5 },
										fontSize: { xs: "1rem", md: "1.1rem" },
										fontWeight: 700,
										color: "#f44336",
										position: "relative",
										display: "inline-block",
									}}
								>
									Movies & TV
								</Typography>
								<Stack spacing={1}>
									<FooterLink
										href="/movies"
										text="Movies"
										icon={<MovieIcon />}
									/>
									<FooterLink
										href="/series"
										text="TV Series"
										icon={<TvIcon />}
									/>
									<FooterLink
										href="/genres"
										text="Genres"
										icon={<CategoryIcon />}
									/>
									<FooterLink
										href="/forum"
										text="Forum"
										icon={<ForumIcon />}
									/>
								</Stack>
							</Box>
							<Box sx={{ flex: "1 1 0" }}>
								<Typography
									variant="h6"
									sx={{
										mb: { xs: 1.5, md: 2.5 },
										fontSize: { xs: "1rem", md: "1.1rem" },
										fontWeight: 700,
										color: "#f44336",
										position: "relative",
										display: "inline-block",
									}}
								>
									Cast & Crew
								</Typography>
								<Stack spacing={1}>
									<FooterLink
										href="/actors"
										text="Actors"
										icon={<PersonIcon />}
									/>
									<FooterLink
										href="/crew"
										text="Crew"
										icon={<GroupIcon />}
									/>
								</Stack>
							</Box>
							<Box sx={{ flex: "1 1 0" }}>
								<Typography
									variant="h6"
									sx={{
										mb: { xs: 1.5, md: 2.5 },
										fontSize: { xs: "1rem", md: "1.1rem" },
										fontWeight: 700,
										color: "#f44336",
										position: "relative",
										display: "inline-block",
									}}
								>
									Other
								</Typography>
								<Stack spacing={1}>
									<FooterLink
										href="/about-us"
										text="About Us"
										icon={<InfoIcon />}
									/>
									<FooterLink
										href="/contact-us"
										text="Contact Us"
										icon={<ContactMailIcon />}
									/>
									<FooterLink
										href="/login"
										text="Sign In"
										icon={<LoginIcon />}
									/>
									<FooterLink
										href="/register"
										text="Sign Up"
										icon={<PersonAddIcon />}
									/>
								</Stack>
							</Box>
						</Box>
					</Box>

					{/* Right column - Social and Newsletter */}
					<Box sx={{ flex: "1 1 auto", maxWidth: { md: "42%" } }}>
						<Paper
							elevation={0}
							sx={{
								p: { xs: 3, md: 4 },
								backgroundColor: "rgba(255, 255, 255, 0.03)",
								borderRadius: 2,
								border: "1px solid rgba(255, 255, 255, 0.05)",
							}}
						>
							<Typography
								variant="h6"
								sx={{
									mb: 3,
									fontSize: { xs: "1.1rem", md: "1.2rem" },
									fontWeight: 700,
									color: "#f44336",
								}}
							>
								Stay Connected
							</Typography>

							<Box sx={{ mb: 3 }}>
								<Typography
									variant="body2"
									sx={{ mb: 2, opacity: 0.9 }}
								>
									Subscribe to our newsletter for updates on
									new releases, features, and promotions.
								</Typography>
								<Stack direction="row" spacing={1}>
									<Box
										component="div"
										sx={{
											display: "flex",
											alignItems: "center",
											backgroundColor:
												"rgba(0, 0, 0, 0.2)",
											borderRadius: 1,
											border: "1px solid rgba(255, 255, 255, 0.1)",
											px: 1.5,
											"&:hover": {
												borderColor: "primary.main",
											},
											flex: 1,
										}}
									>
										<EmailIcon
											sx={{
												color: "rgba(255, 255, 255, 0.5)",
												mr: 1.5,
												flexShrink: 0,
											}}
										/>
										<Box
											component="input"
											type="email"
											placeholder="Enter your email"
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											sx={{
												background: "transparent",
												border: "none",
												outline: "none",
												color: "white",
												width: "100%",
												py: 1.25,
												fontSize: "0.875rem",
												fontFamily: "inherit",
											}}
										/>
									</Box>
									<Button
										variant="contained"
										onClick={handleSubscribe}
										sx={{
											bgcolor: "#f44336",
											color: "white",
											minWidth: "120px",
											"&:hover": {
												bgcolor: "#d32f2f",
											},
										}}
									>
										Subscribe
									</Button>
								</Stack>
							</Box>

							<Box
								sx={{
									width: "100%",
									height: "1px",
									backgroundColor:
										"rgba(255, 255, 255, 0.05)",
									my: 3,
								}}
							/>

							<Typography
								variant="subtitle2"
								sx={{
									mb: 2,
									fontWeight: 600,
									color: theme.vars.palette.primary.main,
								}}
							>
								Follow us on social media
							</Typography>
							<Stack
								direction="row"
								spacing={1}
								sx={{
									"& .MuiIconButton-root": {
										backgroundColor:
											"rgba(255, 255, 255, 0.03)",
									},
								}}
							>
								<SocialButton
									href="https://facebook.com"
									icon={FacebookIcon}
								/>
								<SocialButton
									href="https://twitter.com"
									icon={TwitterIcon}
								/>
								<SocialButton
									href="https://instagram.com"
									icon={InstagramIcon}
								/>
								<SocialButton
									href="https://youtube.com"
									icon={YouTubeIcon}
								/>
							</Stack>
						</Paper>
					</Box>
				</Box>

				<Box
					sx={{
						width: "100%",
						height: "1px",
						backgroundColor: "rgba(255, 255, 255, 0.05)",
						my: 3,
					}}
				/>

				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
					}}
				>
					<Typography
						variant="body2"
						sx={{
							opacity: 0.7,
							textAlign: { xs: "center", sm: "left" },
						}}
					>
						© 2026 MovieLandia24. All rights reserved.
					</Typography>
					<Stack
						direction="row"
						spacing={3}
						sx={{
							justifyContent: { xs: "center", sm: "flex-end" },
						}}
					>
						<Link href="/privacy">
							<Typography
								variant="body2"
								sx={{
									opacity: 0.7,
									transition: "color 0.2s ease",
									"&:hover": {
										color: "#f44336",
										opacity: 1,
									},
								}}
							>
								Privacy Policy
							</Typography>
						</Link>
						<Link href="/terms">
							<Typography
								variant="body2"
								sx={{
									opacity: 0.7,
									transition: "color 0.2s ease",
									"&:hover": {
										color: "#f44336",
										opacity: 1,
									},
								}}
							>
								Terms of Service
							</Typography>
						</Link>
					</Stack>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
