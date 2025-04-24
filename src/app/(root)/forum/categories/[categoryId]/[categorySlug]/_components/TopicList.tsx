"use client";

import {
	Box,
	Paper,
	Typography,
	Stack,
	Chip,
	Avatar,
	Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import TopicIcon from "@mui/icons-material/Topic";
import PushPinIcon from "@mui/icons-material/PushPin";
import LockIcon from "@mui/icons-material/Lock";
import TagDisplay from "@/app/(root)/forum/_components/TagDisplay";
import { formatDistanceToNow } from "date-fns";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface TopicListProps {
	topics: {
		items: any[];
		total: number;
	};
	userLoggedIn: any;
}

export default function TopicList({ topics, userLoggedIn }: TopicListProps) {
	const theme = useTheme();

	if (topics.items.length === 0) {
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
				<TopicIcon
					sx={{
						fontSize: 60,
						color: theme.vars.palette.primary.main,
						mb: 2,
						opacity: 0.7,
					}}
				/>
				<Typography variant="h6" gutterBottom>
					No topics found
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 3 }}
				>
					There are no topics in this category yet. Be the first to
					start a discussion!
				</Typography>
				{userLoggedIn && (
					<Button
						variant="contained"
						color="primary"
						component={Link}
						href={`/forum/topics/create?categoryId=${topics.items[0]?.categoryId || ""}`}
					>
						Create Topic
					</Button>
				)}
			</Paper>
		);
	}

	return (
		<>
			<Stack spacing={2}>
				{topics.items.map((topic) => (
					<Paper
						key={topic.id}
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 2,
							backgroundColor:
								theme.vars.palette.background.paper,
							border: `1px solid ${theme.vars.palette.divider}`,
							transition: "all 0.2s ease-in-out",
							"&:hover": {
								borderColor: theme.vars.palette.primary.main,
								transform: "translateY(-2px)",
								boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
							},
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								mb: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								{topic.isPinned && (
									<PushPinIcon
										fontSize="small"
										color="primary"
									/>
								)}
								{topic.isLocked && (
									<LockIcon fontSize="small" color="error" />
								)}
								<Link
									href={`/forum/categories/${topic.categoryId}/${topic.category?.slug || "category"}/topics/${topic.id}/${topic.slug}`}
									style={{ textDecoration: "none" }}
								>
									<Typography
										variant="h6"
										color="primary"
										fontWeight="bold"
									>
										{topic.title}
									</Typography>
								</Link>
							</Box>
							<Box>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{topic._count.posts}{" "}
									{topic._count.posts === 1
										? "post"
										: "posts"}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{topic.viewCount}{" "}
									{topic.viewCount === 1 ? "view" : "views"}
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								mb: 2,
							}}
						>
							<Avatar
								src={topic.user.avatar?.photoSrc || ""}
								alt={topic.user.userName}
								sx={{ width: 24, height: 24 }}
							/>
							<Typography variant="body2" color="text.secondary">
								Started by{" "}
								<Link
									href={`/users/${topic.user.id}/${topic.user.userName}`}
									style={{
										textDecoration: "none",
										color: theme.vars.palette.primary.main,
									}}
								>
									{topic.user.userName}
								</Link>{" "}
								{formatDistanceToNow(
									new Date(topic.createdAt),
									{ addSuffix: true },
								)}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mt: 2,
							}}
						>
							<Box>
								{topic.status !== "Open" && (
									<Chip
										label={topic.status}
										size="small"
										color={
											topic.status === "Closed"
												? "error"
												: "warning"
										}
										sx={{ mr: 1 }}
									/>
								)}
								{topic.tags && topic.tags.length > 0 && (
									<TagDisplay
										tags={topic.tags}
										size="small"
										wrap={false}
									/>
								)}
							</Box>
							<Typography variant="body2" color="text.secondary">
								Last activity:{" "}
								{formatDistanceToNow(
									new Date(topic.lastPostAt),
									{ addSuffix: true },
								)}
							</Typography>
						</Box>
					</Paper>
				))}
			</Stack>
		</>
	);
}
