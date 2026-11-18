"use client";

import { Box, Container, Typography, Button, ButtonGroup } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ForumCategoryList from "./ForumCategoryList";
import ForumStats from "./ForumStats";
import SearchIcon from "@mui/icons-material/Search";

interface IForumPageContentProps {
	searchParams?: {
		page?: string;
	};
	session: any;
	categories: {
		items: any[];
		total: number;
	};
	stats: {
		categoriesCount: number;
		topicsCount: number;
		postsCount: number;
	};
	currentPage: number;
}

export default function ForumPageContent({
	session,
	categories,
	stats,
	currentPage,
}: IForumPageContentProps) {
	const router = useRouter();

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 }, mt: 2 }}>
			<Box sx={{ mb: { xs: 3, md: 4 } }}>
				<Typography
					variant="h2"
					component="h1"
					gutterBottom
					sx={{
						fontWeight: 700,
						fontSize: { xs: "2rem", sm: "2.75rem" },
						letterSpacing: "-0.05em",
					}}
				>
					Community Forum
				</Typography>
				<Typography variant="body1" color="text.secondary" gutterBottom>
					Join discussions about your favorite movies and series with
					other movie enthusiasts.
				</Typography>
			</Box>
			{stats && <ForumStats stats={stats} />}
			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 2,
					mb: 2,
					mt: { xs: 4, md: 5 },
				}}
			>
				<Typography
					variant="h5"
					component="h2"
					sx={{ fontWeight: 650, letterSpacing: "-0.025em" }}
				>
					Categories
				</Typography>
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 1,
					}}
				>
					<ButtonGroup variant="outlined" sx={{ mr: 1 }}>
						<Button
							color="secondary"
							startIcon={<SearchIcon />}
							href="/forum/search"
							component={Link}
						>
							Search Forum
						</Button>
					</ButtonGroup>
					{session?.user?.role === "Admin" && (
						<Button
							variant="contained"
							color="primary"
							onClick={() =>
								router.push("/forum/categories/create")
							}
						>
							Create Category
						</Button>
					)}
				</Box>
			</Box>
			<ForumCategoryList
				categories={categories}
				currentPage={currentPage}
			/>
		</Container>
	);
}
