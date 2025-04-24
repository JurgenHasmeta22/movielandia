"use client";

import { Box, Button, Paper } from "@mui/material";
import { useState, useRef, useTransition } from "react";
import { createPost } from "@/actions/forum/forumPost.actions";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { showToast } from "@/utils/helpers/toast";

interface CreatePostFormProps {
	topicId: number;
	userId: number;
}

export default function CreatePostForm({
	topicId,
	userId,
}: CreatePostFormProps) {
	const [content, setContent] = useState("");
	const [isPending, startTransition] = useTransition();
	const editorRef = useRef(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim()) {
			showToast("error", "Please enter some content for your post.");
			return;
		}

		startTransition(async () => {
			try {
				await createPost(content, topicId, userId);
				showToast(
					"success",
					"Your post has been created successfully!",
				);
				setContent("");
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to create your post.",
				);
				console.error("Error creating post:", error);
			}
		});
	};

	return (
		<Box component="form" onSubmit={handleSubmit} id="post-form">
			<Paper
				elevation={0}
				sx={{
					p: 0,
					mb: 2,
					borderRadius: 1,
				}}
			>
				<Box>
					<TextEditor
						value={content}
						onChange={setContent}
						ref={editorRef}
						isDisabled={isPending}
						type="post"
					/>
				</Box>
			</Paper>
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					size="large"
					type="submit"
					variant="contained"
					color="primary"
					disabled={isPending || !content.trim()}
					sx={{
						borderRadius: 1,
						textTransform: "none",
						fontWeight: 500,
						backgroundColor: (theme) =>
							theme.vars.palette.primary.main,
					}}
				>
					{isPending ? "Creating..." : "Create Post"}
				</Button>
			</Box>
		</Box>
	);
}
