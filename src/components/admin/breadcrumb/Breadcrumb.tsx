"use client";

import { Box, Button, Breadcrumbs, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IBreadcrumbProps {
	breadcrumbs: JSX.Element[];
	navigateTo: string;
}

const Breadcrumb = ({ breadcrumbs, navigateTo }: IBreadcrumbProps) => {
	const router = useRouter();
	const theme = useTheme();

	return (
		<Box
			component={"nav"}
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: 2,
				mb: 4,
			}}
		>
			<Button
				variant="outlined"
				color="primary"
				aria-label="Go back"
				onClick={() => {
					router.push(navigateTo);
				}}
				sx={{ minWidth: 0, width: 40, height: 40, p: 0 }}
			>
				<ArrowBackIcon fontSize="small" />
			</Button>
			<Breadcrumbs
				separator={
					<NavigateNextIcon
						fontSize="small"
						sx={{ color: theme.vars.palette.text.secondary }}
					/>
				}
				aria-label="breadcrumb"
				sx={{
					"& .MuiBreadcrumbs-li a": {
						color: theme.vars.palette.text.secondary,
						transition: "all 0.2s ease-in-out",
						padding: "4px 10px",
						borderRadius: 999,
						fontWeight: 600,
						"&:hover": {
							color: theme.vars.palette.accent.main,
							backgroundColor: `rgba(${theme.vars.palette.accent.mainChannel} / 0.12)`,
							textDecoration: "none",
						},
					},
					"& .MuiBreadcrumbs-li:last-child a": {
						color: theme.vars.palette.text.primary,
						pointerEvents: "none",
						backgroundColor: "transparent",
					},
				}}
			>
				{breadcrumbs}
			</Breadcrumbs>
		</Box>
	);
};

export default Breadcrumb;
