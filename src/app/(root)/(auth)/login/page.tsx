import { Box, Paper } from "@mui/material";
import type { Metadata } from "next";
import LoginForm from "./_components/LoginForm";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Login - MovieLandia24 - Your Ultimate Destination for Movies",
	description: "Login to the page",
};

export default async function Login() {
	return (
		<Box
			sx={{
				position: "relative",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
				marginTop: "-50px",
				marginBottom: "-22px",
				px: 2,
				py: { xs: 6, md: 10 },
				isolation: "isolate",
			}}
			component="section"
		>
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: -1,
					overflow: "hidden",
				}}
			>
				<Image
					src="/images/backgrounds/netflix.png"
					alt="Background Image"
					fill
					priority={true}
					style={{
						objectFit: "cover",
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background:
							"linear-gradient(110deg, rgba(7, 11, 20, 0.82), rgba(7, 11, 20, 0.42))",
					}}
				/>
			</Box>
			<Paper
				sx={{
					width: "100%",
					maxWidth: 520,
					px: { xs: 2.5, sm: 5, md: 6 },
					py: { xs: 3, sm: 4.5 },
					borderRadius: { xs: 2, sm: 3 },
					position: "relative",
					zIndex: 1,
					border: "1px solid",
					borderColor: "divider",
					boxShadow: "0 30px 90px rgba(0, 0, 0, 0.3)",
				}}
			>
				<LoginForm />
			</Paper>
		</Box>
	);
}
