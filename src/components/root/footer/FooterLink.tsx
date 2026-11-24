"use client";

import { Button, Icon, Stack, Typography } from "@mui/material";

interface FooterLinkProps {
	href: string;
	text: string;
	icon?: React.ReactElement;
}

export const FooterLink = ({ href, text, icon }: FooterLinkProps) => {
	return (
		<Button
			href={href}
			sx={{
				textDecoration: "none",
				color: "text.secondary",
				minWidth: "auto",
				padding: "6px 10px",
				borderRadius: "10px",
				justifyContent: "flex-start",
				"&:hover": {
					backgroundColor: "rgba(255, 178, 36, 0.1)",
					transform: "translateX(4px)",
					color: "accent.main",
				},
			}}
		>
			<Stack
				direction="row"
				spacing={1.5}
				sx={{ alignItems: "center", width: "100%" }}
			>
				{icon && (
					<Icon
						component={() => icon}
						sx={{
							fontSize: 18,
							minWidth: "20px",
							color: "inherit",
						}}
					/>
				)}
				<Typography
					variant="body2"
					sx={{
						fontWeight: 500,
						fontSize: { xs: "0.875rem", md: "0.9rem" },
					}}
				>
					{text}
				</Typography>
			</Stack>
		</Button>
	);
};
