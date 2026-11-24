"use client";

import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import ForumIcon from "@mui/icons-material/Forum";
import { ForumCategory } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";

interface ForumCategoryListProps {
	categories: {
		items: ForumCategory[];
		total: number;
	};
	currentPage: number;
}

export default function ForumCategoryList({
	categories,
	currentPage,
}: ForumCategoryListProps) {
	const theme = useTheme();
	const limit = 10;
	const totalPages = Math.ceil(categories.total / limit);

	if (categories.items.length === 0) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 4,
					textAlign: "center",
					borderRadius: 2,
					backgroundColor: theme.vars.palette.background.paper,
					border: `1px solid ${theme.vars.palette.divider}`,
				}}
			>
				<ForumIcon
					sx={{
						fontSize: 60,
						color: theme.vars.palette.accent.main,
						mb: 2,
						opacity: 0.7,
					}}
				/>
				<Typography variant="h6" gutterBottom>
					No categories found
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 3 }}
				>
					There are no forum categories available yet.
				</Typography>
			</Paper>
		);
	}

	return (
		<>
			<Stack spacing={2}>
				{categories.items.map((category) => (
					<Paper
						key={category.id}
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 2,
							backgroundColor:
								theme.vars.palette.background.paper,
							border: `1px solid ${theme.vars.palette.divider}`,
							transition:
								"border-color 180ms ease, transform 180ms ease",
							"&:hover": {
								borderColor: theme.vars.palette.accent.main,
								transform: "translateY(-2px)",
							},
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
								gap: 2,
								mb: 2,
								flexWrap: "wrap",
							}}
						>
							<Link
								href={`/forum/categories/${category.id}/${category.slug}`}
								style={{ textDecoration: "none" }}
							>
								<Typography
									variant="h6"
									color="text.primary"
									sx={{
										fontWeight: 650,
										letterSpacing: "-0.02em",
									}}
								>
									{category.name}
								</Typography>
							</Link>
							<Box>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{category.topicCount}{" "}
									{category.topicCount === 1
										? "topic"
										: "topics"}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{category.postCount}{" "}
									{category.postCount === 1
										? "post"
										: "posts"}
								</Typography>
							</Box>
						</Box>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mb: 2, maxWidth: "75ch", lineHeight: 1.65 }}
						>
							{category.description}
						</Typography>
						{category.lastPostAt && (
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									gap: 2,
									flexWrap: "wrap",
									mt: 2,
								}}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Last activity:{" "}
									{formatDistanceToNow(
										new Date(category.lastPostAt),
										{ addSuffix: true },
									)}
								</Typography>
								<Button
									variant="outlined"
									size="small"
									component={Link}
									href={`/forum/categories/${category.id}/${category.slug}`}
								>
									View Topics
								</Button>
							</Box>
						)}
					</Paper>
				))}
			</Stack>

			<Box sx={{ mt: 4 }}>
				<PaginationControl
					currentPage={currentPage}
					pageCount={totalPages}
					urlParamName="page"
				/>
			</Box>
		</>
	);
}
