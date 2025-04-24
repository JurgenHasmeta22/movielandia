"use client";

import { Box, Button, Breadcrumbs, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter } from "next/navigation";
import { JSX } from "react";

interface IBreadcrumbProps {
	breadcrumbs: JSX.Element[];
	navigateTo: string;
}

const Breadcrumb = ({ breadcrumbs, navigateTo }: IBreadcrumbProps) => {
	const router = useRouter();
	const theme = useTheme();

	return (
		<Box
			display={"flex"}
			component={"nav"}
			flexDirection={"row"}
			alignItems={"center"}
			gap={"20px"}
			sx={{
				mb: "30px",
			}}
		>
			<Button
				variant="outlined"
				onClick={() => {
					router.push(navigateTo);
				}}
				sx={{
					backgroundColor: theme.vars.palette.background.default,
					borderColor: theme.vars.palette.primary.main,
					color: theme.vars.palette.primary.main,
					"&:hover": {
						backgroundColor: theme.vars.palette.primary.main,
						color: theme.vars.palette.background.default,
						borderColor: theme.vars.palette.primary.main,
					},
				}}
			>
				<ArrowBackIcon />
			</Button>
			<Breadcrumbs
				separator={
					<NavigateNextIcon
						fontSize="small"
						sx={{ color: theme.vars.palette.primary.main }}
					/>
				}
				aria-label="breadcrumb"
				sx={{
					"& .MuiBreadcrumbs-li a": {
						color: theme.vars.palette.primary.main,
						transition: "all 0.2s ease-in-out",
						padding: "4px 8px",
						borderRadius: "4px",
						"&:hover": {
							color: theme.vars.palette.background.default,
							backgroundColor: theme.vars.palette.primary.main,
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
