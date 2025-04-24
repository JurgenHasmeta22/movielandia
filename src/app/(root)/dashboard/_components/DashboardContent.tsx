"use client";

import {
	Box,
	Container,
	Typography,
	Paper,
	Grid,
	Button,
	Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import SharedListsSection from "@/components/root/sharedListsSection/SharedListsSection";

interface DashboardContentProps {
	userId: number;
	userName: string;
}

export default function DashboardContent({
	userId,
	userName,
}: DashboardContentProps) {
	const router = useRouter();

	const dashboardItems = [
		{
			title: "My Lists",
			description:
				"Create and manage your custom lists of movies, TV shows, and more.",
			icon: (
				<PlaylistAddIcon sx={{ fontSize: 40, color: "primary.main" }} />
			),
			action: () => router.push(`/users/${userId}/${userName}/lists`),
			buttonText: "View Lists",
		},
		{
			title: "My Reviews",
			description:
				"See all your reviews and ratings for movies and TV shows.",
			icon: (
				<RateReviewIcon sx={{ fontSize: 40, color: "primary.main" }} />
			),
			action: () =>
				router.push(
					`/users/${userId}/${userName}?maintab=reviews&subtab=movies`,
				),
			buttonText: "View Reviews",
		},
		{
			title: "My Bookmarks",
			description:
				"Access your bookmarked movies, TV shows, actors, and more.",
			icon: <BookmarkIcon sx={{ fontSize: 40, color: "primary.main" }} />,
			action: () =>
				router.push(
					`/users/${userId}/${userName}?maintab=bookmarks&subtab=movies`,
				),
			buttonText: "View Bookmarks",
		},
		{
			title: "My Profile",
			description:
				"Update your profile information and privacy settings.",
			icon: <PersonIcon sx={{ fontSize: 40, color: "primary.main" }} />,
			action: () => router.push(`/users/${userId}/${userName}`),
			buttonText: "View Profile",
		},
	];

	return (
		<Container maxWidth="lg" sx={{ py: 6, mt: 8 }}>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				sx={{ mb: 4, fontWeight: 600 }}
			>
				Your Dashboard
			</Typography>

			{/* Shared Lists Section */}
			<SharedListsSection userId={userId} userName={userName} />

			<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
				Quick Actions
			</Typography>

			<Grid container spacing={3}>
				{dashboardItems.map((item, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Paper
							elevation={2}
							sx={{
								p: 3,
								height: "100%",
								display: "flex",
								flexDirection: "column",
								transition: "transform 0.2s, box-shadow 0.2s",
								"&:hover": {
									transform: "translateY(-4px)",
									boxShadow: 4,
								},
							}}
						>
							<Box sx={{ mb: 2 }}>{item.icon}</Box>
							<Typography
								variant="h6"
								sx={{ mb: 1, fontWeight: 600 }}
							>
								{item.title}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ mb: 2, flexGrow: 1 }}
							>
								{item.description}
							</Typography>
							<Button
								variant="outlined"
								color="primary"
								onClick={item.action}
								sx={{
									alignSelf: "flex-start",
									textTransform: "none",
								}}
							>
								{item.buttonText}
							</Button>
						</Paper>
					</Grid>
				))}
			</Grid>

			<Box sx={{ mt: 6 }}>
				<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
					Create New Content
				</Typography>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
					<Button
						variant="contained"
						color="primary"
						startIcon={<PlaylistAddIcon />}
						onClick={() =>
							router.push(
								`/users/${userId}/${userName}/lists/create`,
							)
						}
						sx={{ textTransform: "none" }}
					>
						Create New List
					</Button>
					<Button
						variant="outlined"
						color="primary"
						startIcon={<RateReviewIcon />}
						onClick={() => router.push("/movies")}
						sx={{ textTransform: "none" }}
					>
						Write a Review
					</Button>
				</Stack>
			</Box>
		</Container>
	);
}
