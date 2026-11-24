"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Button, Container } from "@mui/material";
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
import Link from "next/link";
import { FooterLink } from "./FooterLink";
import { SocialButton } from "./SocialButton";

const columnTitleSx = {
	mb: { xs: 1.5, md: 2.5 },
	fontSize: { xs: "1rem", md: "1.1rem" },
	color: "text.primary",
};

const legalLinkSx = {
	color: "text.secondary",
	transition: "color 0.2s ease",
	"&:hover": { color: "accent.main" },
};

const Footer = (): React.JSX.Element => {
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
			component="footer"
			sx={{
				position: "relative",
				pt: { xs: 7, md: 9 },
				pb: { xs: 4, md: 5 },
				backgroundColor: "background.paper",
				borderTop: "1px solid",
				borderColor: "divider",
				"& a": { textDecoration: "none !important" },
				"&::before": {
					content: '""',
					position: "absolute",
					top: -1,
					left: "50%",
					width: "min(720px, 80%)",
					height: 2,
					transform: "translateX(-50%)",
					background:
						"linear-gradient(90deg, transparent, #FFB224, transparent)",
				},
			}}
		>
			<Container maxWidth="xl" sx={{ px: { xs: 2.5, sm: 4, md: 6 } }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						gap: { xs: 5, md: 8 },
						mb: 6,
					}}
				>
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
									component="h2"
									sx={columnTitleSx}
								>
									Movies & TV
								</Typography>
								<Stack spacing={0.5}>
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
									component="h2"
									sx={columnTitleSx}
								>
									Cast & Crew
								</Typography>
								<Stack spacing={0.5}>
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
									component="h2"
									sx={columnTitleSx}
								>
									Other
								</Typography>
								<Stack spacing={0.5}>
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

					<Box sx={{ flex: "1 1 auto", maxWidth: { md: "42%" } }}>
						<Box
							sx={{
								p: { xs: 3, md: 4 },
								borderRadius: "24px",
								border: "1px solid",
								borderColor: "divider",
								backgroundColor: "background.default",
								backgroundImage:
									"radial-gradient(420px 220px at 100% 0%, rgba(255, 178, 36, 0.13), transparent 70%)",
							}}
						>
							<Typography
								variant="h5"
								component="h2"
								sx={{ mb: 1.5 }}
							>
								Stay Connected
							</Typography>

							<Typography
								variant="body2"
								sx={{ mb: 2.5, color: "text.secondary" }}
							>
								Subscribe to our newsletter for updates on new
								releases, features, and promotions.
							</Typography>
							<Stack direction="row" spacing={1}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										flex: 1,
										px: 2,
										borderRadius: 999,
										border: "1px solid",
										borderColor: "divider",
										backgroundColor: "background.paper",
										transition:
											"border-color 0.2s ease, box-shadow 0.2s ease",
										"&:hover": {
											borderColor: "text.secondary",
										},
										"&:focus-within": {
											borderColor: "accent.main",
											boxShadow:
												"0 0 0 4px rgba(255, 178, 36, 0.16)",
										},
									}}
								>
									<EmailIcon
										sx={{
											color: "text.secondary",
											mr: 1.25,
											fontSize: 20,
											flexShrink: 0,
										}}
									/>
									<Box
										component="input"
										type="email"
										aria-label="Email address"
										placeholder="Enter your email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										sx={{
											background: "transparent",
											border: "none",
											outline: "none !important",
											color: "text.primary",
											width: "100%",
											py: 1.5,
											fontSize: "0.9rem",
											fontFamily: "inherit",
											"&::placeholder": {
												color: "text.secondary",
											},
										}}
									/>
								</Box>
								<Button
									variant="contained"
									onClick={handleSubscribe}
									sx={{ minWidth: "120px" }}
								>
									Subscribe
								</Button>
							</Stack>

							<Typography
								variant="subtitle2"
								sx={{ mt: 4, mb: 1.5 }}
							>
								Follow us on social media
							</Typography>
							<Stack direction="row" spacing={1}>
								<SocialButton
									href="https://facebook.com"
									icon={FacebookIcon}
									label="Facebook"
								/>
								<SocialButton
									href="https://twitter.com"
									icon={TwitterIcon}
									label="Twitter"
								/>
								<SocialButton
									href="https://instagram.com"
									icon={InstagramIcon}
									label="Instagram"
								/>
								<SocialButton
									href="https://youtube.com"
									icon={YouTubeIcon}
									label="YouTube"
								/>
							</Stack>
						</Box>
					</Box>
				</Box>

				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						alignItems: "center",
						justifyContent: "space-between",
						gap: 2,
						pt: 3,
						borderTop: "1px solid",
						borderColor: "divider",
					}}
				>
					<Typography
						variant="body2"
						sx={{
							color: "text.secondary",
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
							<Typography variant="body2" sx={legalLinkSx}>
								Privacy Policy
							</Typography>
						</Link>
						<Link href="/terms">
							<Typography variant="body2" sx={legalLinkSx}>
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
