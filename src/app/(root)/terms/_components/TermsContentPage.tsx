"use client";

import React from "react";
import {
	Container,
	Typography,
	Box,
	Stack,
	useTheme,
	Paper,
	Divider,
} from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";

const Section = ({
	title,
	content,
	items,
	subsections,
}: {
	title: string;
	content: string;
	items?: string[];
	subsections?: Array<{ title: string; content: string; items?: string[] }>;
}) => {
	const theme = useTheme();

	return (
		<Paper
			elevation={0}
			sx={{
				p: 4,
				borderRadius: 2,
				backgroundColor: "rgba(255, 255, 255, 0.05)",
				transition:
					"transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
				},
			}}
		>
			<Typography
				variant="h4"
				gutterBottom
				sx={{
					color: theme.vars.palette.primary.main,
					fontWeight: 700,
					mb: 3,
					borderBottom: `2px solid ${theme.vars.palette.primary.main}`,
					pb: 1,
				}}
			>
				{title}
			</Typography>

			<Typography
				sx={{
					mb: 2,
					color: theme.vars.palette.text.primary,
					lineHeight: 1.7,
				}}
			>
				{content}
			</Typography>

			{items && (
				<Box component="ul" sx={{ pl: 3, mb: 3 }}>
					{items.map((item, index) => (
						<Typography
							component="li"
							key={index}
							sx={{
								mb: 1,
								color: theme.vars.palette.text.secondary,
								"&::marker": {
									color: theme.vars.palette.primary.main,
								},
							}}
						>
							{item}
						</Typography>
					))}
				</Box>
			)}

			{subsections && (
				<Stack spacing={3} sx={{ mt: 3 }}>
					{subsections.map((subsection, index) => (
						<Box key={index}>
							<Typography
								variant="h6"
								sx={{
									color: theme.vars.palette.primary.main,
									fontWeight: 600,
									mb: 2,
								}}
							>
								{subsection.title}
							</Typography>
							<Typography
								sx={{
									mb: 2,
									color: theme.vars.palette.text.secondary,
								}}
							>
								{subsection.content}
							</Typography>
							{subsection.items && (
								<Box component="ul" sx={{ pl: 3 }}>
									{subsection.items.map((item, itemIndex) => (
										<Typography
											component="li"
											key={itemIndex}
											sx={{
												mb: 1,
												color: theme.vars.palette.text
													.secondary,
												"&::marker": {
													color: theme.vars.palette
														.primary.main,
												},
											}}
										>
											{item}
										</Typography>
									))}
								</Box>
							)}
						</Box>
					))}
				</Stack>
			)}
		</Paper>
	);
};

const TermsContentPage = () => {
	const theme = useTheme();

	return (
		<Container maxWidth="lg" sx={{ py: 8 }}>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					mb: 6,
					borderRadius: 2,
					background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}22 0%, ${theme.vars.palette.primary.main}11 100%)`,
				}}
			>
				<Typography
					variant="h2"
					gutterBottom
					sx={{
						color: theme.vars.palette.primary.main,
						fontWeight: 800,
						textAlign: "center",
						textTransform: "uppercase",
						letterSpacing: "0.1em",
					}}
				>
					Terms of Service
				</Typography>
				<Typography
					sx={{
						textAlign: "center",
						color: theme.vars.palette.text.secondary,
						mb: 2,
					}}
				>
					Last updated: {new Date().toLocaleDateString()}
				</Typography>
				<Divider sx={{ my: 3 }} />
				<Typography
					sx={{
						textAlign: "center",
						color: theme.vars.palette.text.secondary,
						maxWidth: "800px",
						mx: "auto",
					}}
				>
					Please read these terms of service carefully before using
					MovieLandia24. By accessing or using our service, you agree
					to be bound by these terms.
				</Typography>
			</Paper>

			<Stack spacing={4}>
				<Section
					title="1. Acceptance of Terms"
					content="By accessing and using MovieLandia24, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy."
					subsections={[
						{
							title: "1.1 Eligibility",
							content:
								"You must be at least 13 years old to use our service. If you are under 18, you must have parental consent.",
						},
						{
							title: "1.2 Changes to Terms",
							content:
								"We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform.",
						},
					]}
				/>

				<Section
					title="2. User Accounts"
					content="Your account security is important to us. When creating and maintaining your account:"
					items={[
						"You must provide accurate and complete information",
						"You are responsible for maintaining the security of your account credentials",
						"You must notify us immediately of any unauthorized access",
						"You are responsible for all activities under your account",
					]}
					subsections={[
						{
							title: "2.1 Account Termination",
							content:
								"We reserve the right to suspend or terminate accounts that violate our terms or for any other reason at our discretion.",
							items: [
								"Violation of these Terms of Service",
								"Extended periods of inactivity",
								"Fraudulent or illegal activities",
								"Harassment of other users",
							],
						},
						{
							title: "2.2 Account Recovery",
							content:
								"We provide account recovery options through email verification. Multiple failed recovery attempts may result in temporary account lockout.",
						},
					]}
				/>

				<Section
					title="3. Content Guidelines"
					content="Users must adhere to our content guidelines when interacting with our platform:"
					items={[
						"No illegal or unauthorized content",
						"No harassment or hate speech",
						"No spam or misleading information",
						"No copyright infringement",
						"No impersonation of others",
					]}
					subsections={[
						{
							title: "3.1 User-Generated Content",
							content:
								"By posting content on our platform, you grant us a non-exclusive, worldwide license to use, display, and distribute your content.",
						},
						{
							title: "3.2 Content Moderation",
							content:
								"We reserve the right to remove or modify any content that violates our guidelines or terms of service.",
							items: [
								"Content is reviewed by our moderation team",
								"Automated systems may flag potentially inappropriate content",
								"Users can report violations",
								"Appeals process available for content removal",
							],
						},
					]}
				/>

				<Section
					title="4. Privacy and Data Protection"
					content="We take your privacy seriously and handle your data in accordance with our Privacy Policy."
					subsections={[
						{
							title: "4.1 Data Collection",
							content:
								"We collect and process personal data as described in our Privacy Policy.",
							items: [
								"Account information",
								"Usage data",
								"Device information",
								"Communication preferences",
							],
						},
						{
							title: "4.2 Data Security",
							content:
								"We implement industry-standard security measures to protect your data.",
							items: [
								"Encryption of sensitive data",
								"Regular security audits",
								"Access controls and monitoring",
								"Incident response procedures",
							],
						},
					]}
				/>

				<Section
					title="5. Intellectual Property"
					content="All content and materials available on MovieLandia24 are protected by intellectual property rights."
					subsections={[
						{
							title: "5.1 Ownership",
							content:
								"MovieLandia24 owns or licenses all content on our platform, including but not limited to text, graphics, logos, and software.",
						},
						{
							title: "5.2 Limited License",
							content:
								"We grant you a limited, non-exclusive license to access and use our service for personal, non-commercial purposes.",
							items: [
								"No redistribution of content",
								"No unauthorized copying or scraping",
								"No reverse engineering",
								"No commercial use without permission",
							],
						},
					]}
				/>

				<Section
					title="6. Limitation of Liability"
					content="To the maximum extent permitted by law, MovieLandia24 shall not be liable for any indirect, incidental, special, consequential, or punitive damages."
					subsections={[
						{
							title: "6.1 Warranty Disclaimer",
							content:
								"Our service is provided 'as is' without any warranties of any kind, either express or implied.",
						},
						{
							title: "6.2 Force Majeure",
							content:
								"We are not liable for any failure or delay in performance due to circumstances beyond our reasonable control.",
						},
					]}
				/>

				<Section
					title="7. Dispute Resolution"
					content="Any disputes arising from these terms or our service shall be resolved through:"
					items={[
						"Initial informal negotiations",
						"Mediation if informal negotiations fail",
						"Binding arbitration as a last resort",
						"Class action waiver",
					]}
					subsections={[
						{
							title: "7.1 Governing Law",
							content:
								"These terms are governed by and construed in accordance with the laws of the jurisdiction where MovieLandia24 is registered.",
						},
						{
							title: "7.2 Legal Compliance",
							content:
								"Users must comply with all applicable laws and regulations when using our service.",
						},
					]}
				/>

				<Section
					title="8. Contact Information"
					content="For any questions or concerns about these Terms of Service, please contact us:"
					items={[
						"Email: legal@movielandia24.com",
						"Address: 123 Movie Street, Cinema City, CC 12345",
						"Phone: +1 (555) 123-4567",
						"Support Hours: Monday to Friday, 9 AM - 6 PM EST",
					]}
				/>
			</Stack>
		</Container>
	);
};

export default TermsContentPage;
