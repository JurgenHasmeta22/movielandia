"use client";

import { IconButton } from "@mui/material";

interface SocialButtonProps {
	href: string;
	icon: React.ElementType;
	label: string;
}

export const SocialButton = ({
	href,
	icon: Icon,
	label,
}: SocialButtonProps) => {
	return (
		<IconButton
			href={href}
			target="_blank"
			rel="noopener"
			aria-label={label}
			sx={{
				color: "text.primary",
				padding: "10px",
				border: "1px solid",
				borderColor: "divider",
				"&:hover": {
					color: "accent.contrastText",
					backgroundColor: "accent.main",
					borderColor: "accent.main",
					transform: "translateY(-3px)",
				},
			}}
		>
			<Icon sx={{ fontSize: 20 }} />
		</IconButton>
	);
};
