import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface ISectionHeadingProps {
	title: ReactNode;
	description?: ReactNode;
	eyebrow?: string;
	maxWidth?: string;
}

const SectionHeading = ({
	title,
	description,
	eyebrow,
	maxWidth = "62ch",
}: ISectionHeadingProps) => (
	<Box sx={{ mb: { xs: 4, md: 6 }, maxWidth }}>
		{eyebrow && (
			<Box
				sx={{
					display: "inline-flex",
					alignItems: "center",
					gap: 1,
					mb: 2,
					px: 1.5,
					py: 0.5,
					borderRadius: 999,
					border: "1px solid",
					borderColor: "divider",
					backgroundColor: "rgba(255, 178, 36, 0.08)",
				}}
			>
				<Box
					aria-hidden
					sx={{
						width: 8,
						height: 8,
						borderRadius: "50%",
						backgroundColor: "accent.main",
						boxShadow: "0 0 10px 2px rgba(255, 178, 36, 0.6)",
					}}
				/>
				<Typography
					component="span"
					sx={{
						fontSize: "0.85rem",
						fontWeight: 600,
						color: "text.primary",
					}}
				>
					{eyebrow}
				</Typography>
			</Box>
		)}
		<Typography
			variant="h2"
			component="h2"
			sx={{ textWrap: "balance", mb: description ? 2 : 0 }}
		>
			{title}
		</Typography>
		{description && (
			<Typography
				sx={{
					color: "text.secondary",
					fontSize: { xs: "1rem", md: "1.075rem" },
					lineHeight: 1.7,
				}}
			>
				{description}
			</Typography>
		)}
	</Box>
);

export default SectionHeading;
