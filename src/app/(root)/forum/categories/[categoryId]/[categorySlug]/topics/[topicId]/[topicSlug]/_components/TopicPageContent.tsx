"use client";

import {
	Box,
	Container,
	Typography,
	Breadcrumbs,
	Link as MuiLink,
	Chip,
	Avatar,
	Paper,
	Button,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForumCategory, ForumTopic, ForumTag } from "@prisma/client";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PushPinIcon from "@mui/icons-material/PushPin";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow, format } from "date-fns";
import TagDisplay from "@/app/(root)/forum/_components/TagDisplay";
import RichTextDisplay from "@/components/root/richTextDisplay/RichTextDisplay";
import { useState } from "react";
import EditTopicModal from "./EditTopicModal";
import { useModal } from "@/providers/ModalProvider";
import { deleteTopic } from "@/actions/forum/forumTopic.actions";
import { showToast } from "@/utils/helpers/toast";
import * as CONSTANTS from "@/constants/Constants";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";

interface ITopicPageContentProps {
	topic: ForumTopic & {
		user: {
			id: number;
			userName: string;
			avatar?: { photoSrc: string } | null;
		};
		tags: ForumTag[];
	};
	category: ForumCategory;
	searchParams?: {
		page?: string;
	};
	session: any;
	posts: {
		items: any[];
		total: number;
	};
	currentPage: number;
}

export default function TopicPageContent({
	topic,
	category,
	session,
	posts,
	currentPage,
}: ITopicPageContentProps) {
	const router = useRouter();
	const { openModal } = useModal();

	const [editingTopic, setEditingTopic] = useState(false);
	const limit = 10;

	function handleDeleteTopic() {
		if (!session?.user) return;

		openModal({
			title: "Delete Topic",
			subTitle:
				"Are you sure you want to delete this topic? This will also delete all replies. This action cannot be undone.",
			actions: [
				{
					label: CONSTANTS.MODAL__DELETE__NO,
					onClick: () => {},
					color: "secondary",
					variant: "contained",
					sx: {
						bgcolor: "#ff5252",
					},
					icon: <WarningOutlined />,
				},
				{
					label: CONSTANTS.MODAL__DELETE__YES,
					onClick: async () => {
						try {
							await deleteTopic(
								topic.id,
								Number(session.user.id),
							);
							showToast("success", "Topic deleted successfully!");
							router.push(
								`/forum/categories/${category.id}/${category.slug}`,
							);
						} catch (error) {
							showToast(
								"error",
								error instanceof Error
									? error.message
									: "Failed to delete topic",
							);
						}
					},
					type: "submit",
					color: "secondary",
					variant: "contained",
					sx: {
						bgcolor: "#30969f",
					},
					icon: <CheckOutlined />,
				},
			],
		});
	}

	return (
		<Container maxWidth="xl" sx={{ py: 4, mt: 4 }}>
			<Breadcrumbs
				separator={<NavigateNextIcon fontSize="small" />}
				aria-label="breadcrumb"
				sx={{ mb: 3 }}
			>
				<MuiLink
					component={Link}
					href="/forum"
					underline="hover"
					color="inherit"
				>
					Forum
				</MuiLink>
				<MuiLink
					component={Link}
					href={"/forum/categories"}
					underline="hover"
					color="inherit"
				>
					Categories
				</MuiLink>
				<MuiLink
					component={Link}
					href={`/forum/categories/${category.id}/${category.slug}`}
					underline="hover"
					color="inherit"
				>
					{category.name}
				</MuiLink>
				<Typography color="text.primary">{topic.title}</Typography>
			</Breadcrumbs>
			<Paper
				elevation={0}
				sx={{
					p: 3,
					mb: 4,
					borderRadius: 2,
					backgroundColor: (theme) =>
						theme.vars.palette.secondary.light,
					border: (theme) =>
						`1px solid ${theme.vars.palette.primary.light}`,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						mb: 2,
						justifyContent: "space-between",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						{topic.isPinned && (
							<PushPinIcon fontSize="small" color="primary" />
						)}
						{topic.isLocked && (
							<LockIcon fontSize="small" color="error" />
						)}
						<Typography
							variant="h4"
							component="h1"
							fontWeight="bold"
						>
							{topic.title}
						</Typography>
					</Box>
					{session?.user &&
						Number(session.user.id) === topic.userId && (
							<Box sx={{ display: "flex", gap: 1 }}>
								<Button
									variant="outlined"
									size="medium"
									startIcon={<EditIcon />}
									onClick={() => setEditingTopic(true)}
								>
									Edit
								</Button>
								<Button
									variant="outlined"
									size="medium"
									color="error"
									startIcon={<DeleteIcon />}
									onClick={handleDeleteTopic}
								>
									Delete
								</Button>
							</Box>
						)}
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						mb: 3,
					}}
				>
					<Avatar
						src={topic.user.avatar?.photoSrc || ""}
						alt={topic.user.userName}
						sx={{ width: 32, height: 32 }}
					/>
					<Typography variant="body2" color="text.secondary">
						Started by{" "}
						<Link
							href={`/users/${topic.user.id}/${topic.user.userName}`}
							style={{ textDecoration: "none" }}
						>
							{topic.user.userName}
						</Link>{" "}
						{format(new Date(topic.createdAt), "PPP")}
					</Typography>
					{topic.status !== "Open" && (
						<Chip
							label={topic.status}
							size="small"
							color={
								topic.status === "Closed" ? "error" : "warning"
							}
							sx={{ ml: 2 }}
						/>
					)}
				</Box>
				<Box sx={{ mb: 3 }}>
					<RichTextDisplay content={topic.content} type="topic" />
				</Box>
				{topic.tags && topic.tags.length > 0 && (
					<TagDisplay tags={topic.tags} label="Tags" size="medium" />
				)}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="body2" color="text.secondary">
						Last updated:{" "}
						{formatDistanceToNow(new Date(topic.updatedAt), {
							addSuffix: true,
						})}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Views: {topic.viewCount}
					</Typography>
				</Box>
			</Paper>
			<Typography
				variant="h5"
				component="h2"
				fontWeight="bold"
				sx={{ mb: 3 }}
			>
				Posts
			</Typography>
			<PostList
				posts={posts}
				currentPage={currentPage}
				totalPages={Math.ceil(posts.total / limit)}
				userLoggedIn={session?.user}
				topicLocked={topic.isLocked}
			/>
			{session?.user && !topic.isLocked && (
				<Box sx={{ mt: 4 }}>
					<Typography
						variant="h6"
						component="h3"
						fontWeight="bold"
						sx={{ mb: 2 }}
					>
						Create a Post
					</Typography>
					<CreatePostForm
						topicId={topic.id}
						userId={Number(session.user.id)}
					/>
				</Box>
			)}
			{editingTopic && session?.user && (
				<EditTopicModal
					open={editingTopic}
					onClose={() => setEditingTopic(false)}
					topic={topic}
					userId={Number(session.user.id)}
					categoryId={category.id}
				/>
			)}
		</Container>
	);
}
