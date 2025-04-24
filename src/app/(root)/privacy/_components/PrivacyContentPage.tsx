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

const PrivacyContentPage = () => {
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
					Privacy Policy
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
					At MovieLandia24, we value your privacy and are committed to
					protecting your personal information. This Privacy Policy
					explains how we collect, use, and safeguard your data.
				</Typography>
			</Paper>

			<Stack spacing={4}>
				<Section
					title="1. Information We Collect"
					content="We collect various types of information to provide and improve our services:"
					subsections={[
						{
							title: "1.1 Personal Information",
							content:
								"Information that you provide directly to us:",
							items: [
								"Name and email address",
								"Profile information and preferences",
								"Payment information (processed securely through our payment providers)",
								"Communication preferences",
							],
						},
						{
							title: "1.2 Automatically Collected Information",
							content:
								"Information collected automatically when you use our service:",
							items: [
								"Device information (type, operating system, browser)",
								"IP address and location data",
								"Usage patterns and preferences",
								"Cookies and similar tracking technologies",
							],
						},
					]}
				/>

				<Section
					title="2. How We Use Your Information"
					content="Your information helps us provide and improve our services:"
					subsections={[
						{
							title: "2.1 Service Provision",
							content: "We use your information to:",
							items: [
								"Create and manage your account",
								"Process your requests and transactions",
								"Provide customer support",
								"Personalize your experience",
							],
						},
						{
							title: "2.2 Service Improvement",
							content: "We analyze usage patterns to:",
							items: [
								"Improve our website functionality",
								"Develop new features",
								"Enhance user experience",
								"Fix bugs and issues",
							],
						},
					]}
				/>

				<Section
					title="3. Data Protection"
					content="We implement strong security measures to protect your information:"
					subsections={[
						{
							title: "3.1 Security Measures",
							content: "Our security practices include:",
							items: [
								"Encryption of sensitive data",
								"Regular security audits",
								"Secure data storage",
								"Access controls and monitoring",
							],
						},
						{
							title: "3.2 Data Retention",
							content:
								"We retain your information only as long as necessary to provide our services and comply with legal obligations.",
							items: [
								"Account information retained while account is active",
								"Backup retention for disaster recovery",
								"Legal compliance retention periods",
								"Option to request data deletion",
							],
						},
					]}
				/>

				<Section
					title="4. Information Sharing"
					content="We share your information only in specific circumstances:"
					subsections={[
						{
							title: "4.1 Third-Party Service Providers",
							content:
								"We may share data with trusted service providers who assist us in:",
							items: [
								"Payment processing",
								"Analytics and performance monitoring",
								"Email and communication services",
								"Customer support",
							],
						},
						{
							title: "4.2 Legal Requirements",
							content:
								"We may disclose information when required by law:",
							items: [
								"Court orders and legal processes",
								"Government requests",
								"Protection of rights and safety",
								"Prevention of fraud or abuse",
							],
						},
					]}
				/>

				<Section
					title="5. Your Rights"
					content="You have several rights regarding your personal information:"
					subsections={[
						{
							title: "5.1 Access and Control",
							content: "You can request to:",
							items: [
								"Access your personal data",
								"Correct inaccurate information",
								"Delete your data",
								"Export your data",
							],
						},
						{
							title: "5.2 Preferences",
							content: "You can manage your preferences for:",
							items: [
								"Marketing communications",
								"Notification settings",
								"Privacy settings",
								"Cookie preferences",
							],
						},
					]}
				/>

				<Section
					title="6. Cookies and Tracking"
					content="We use cookies and similar technologies to enhance your experience:"
					subsections={[
						{
							title: "6.1 Types of Cookies",
							content: "We use different types of cookies:",
							items: [
								"Essential cookies for basic functionality",
								"Performance cookies for analytics",
								"Functionality cookies for preferences",
								"Targeting cookies for personalized content",
							],
						},
						{
							title: "6.2 Cookie Management",
							content: "You have control over cookies:",
							items: [
								"Browser settings to manage cookies",
								"Option to reject non-essential cookies",
								"Cookie preference center",
								"Third-party cookie controls",
							],
						},
					]}
				/>

				<Section
					title="7. Children's Privacy"
					content="We take special precautions to protect children's privacy:"
					subsections={[
						{
							title: "7.1 Age Restrictions",
							content:
								"Our service is not intended for children under 13. We do not knowingly collect information from children under 13.",
						},
						{
							title: "7.2 Parental Controls",
							content: "Parents or guardians can request to:",
							items: [
								"Review their child's information",
								"Request deletion of data",
								"Control privacy settings",
								"Manage account access",
							],
						},
					]}
				/>

				<Section
					title="8. International Data Transfers"
					content="We may transfer your data internationally:"
					subsections={[
						{
							title: "8.1 Data Transfer Safeguards",
							content:
								"We ensure appropriate safeguards for international data transfers:",
							items: [
								"Standard contractual clauses",
								"Data protection agreements",
								"Compliance with local laws",
								"Security measures during transfer",
							],
						},
					]}
				/>

				<Section
					title="9. Contact Information"
					content="For privacy-related inquiries or concerns, please contact us:"
					items={[
						"Email: privacy@movielandia24.com",
						"Address: 123 Movie Street, Cinema City, CC 12345",
						"Phone: +1 (555) 123-4567",
						"Data Protection Officer: dpo@movielandia24.com",
					]}
				/>
			</Stack>
		</Container>
	);
};

export default PrivacyContentPage;
