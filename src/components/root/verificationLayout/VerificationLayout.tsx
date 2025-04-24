"use client";

import { Box, Container, Paper, Typography, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { motion } from "framer-motion";

interface VerificationLayoutProps {
	title: string;
	children: React.ReactNode;
}

export default function VerificationLayout({
	title,
	children,
}: VerificationLayoutProps) {
	const theme = useTheme();

	return (
		<Container
			maxWidth="sm"
			sx={{
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				style={{ width: "100%" }}
			>
				<Paper
					elevation={3}
					sx={{
						p: { xs: 3, sm: 6 },
						borderRadius: 2,
						backgroundColor: theme.vars.palette.background.paper,
						boxShadow: theme.shadows[8],
					}}
				>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						textAlign="center"
						sx={{
							mb: 4,
							color: theme.vars.palette.primary.main,
							fontWeight: 700,
						}}
					>
						{title}
					</Typography>
					{children}
				</Paper>
			</motion.div>
		</Container>
	);
}
