"use client";

import {
	Box,
	Container,
	Typography,
	Breadcrumbs,
	Link as MuiLink,
	Paper,
	Button,
	Alert,
} from "@mui/material";
import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForumPost } from "@prisma/client";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { updatePost } from "@/actions/forum/forumPost.actions";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { showToast } from "@/utils/helpers/toast";

interface IEditPostPageContentProps {
	post: ForumPost & {
		topic: {
			id: number;
			title: string;
			slug: string;
		};
	};
	session: any;
}

export default function EditPostPageContent({
	post,
	session,
}: IEditPostPageContentProps) {
	const router = useRouter();
	const [content, setContent] = useState(post.content);
	const [error, setError] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();
	const editorRef = useRef(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!content || content === "<p><br></p>") {
			setError("Please enter some content for your post.");
			return;
		}

		setError(null);

		startTransition(async () => {
			try {
				await updatePost(post.id, content, Number(session.user.id));
				showToast("success", "Post updated successfully!");
				router.push(
					`/forum/topics/${post.topic.id}/${post.topic.slug}`,
				);
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "An error occurred while updating your post.",
				);
				showToast("error", "Failed to update post.");
			}
		});
	};

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
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
					href={`/forum/topics/${post.topic.id}/${post.topic.slug}`}
					underline="hover"
					color="inherit"
				>
					{post.topic.title}
				</MuiLink>
				<Typography color="text.primary">Edit Post</Typography>
			</Breadcrumbs>

			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				fontWeight="bold"
			>
				Edit Post
			</Typography>

			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
				{error && (
					<Alert severity="error" sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						borderRadius: 2,
						backgroundColor: (theme) =>
							theme.vars.palette.secondary.light,
						border: (theme) =>
							`1px solid ${theme.vars.palette.primary.light}`,
					}}
				>
					<TextEditor
						value={content}
						onChange={setContent}
						ref={editorRef}
						isDisabled={isPending}
						type="post"
					/>
				</Paper>

				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						onClick={() => router.back()}
						disabled={isPending}
					>
						Cancel
					</Button>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isPending}
					>
						{isPending ? "Updating..." : "Update Post"}
					</Button>
				</Box>
			</Box>
		</Container>
	);
}
