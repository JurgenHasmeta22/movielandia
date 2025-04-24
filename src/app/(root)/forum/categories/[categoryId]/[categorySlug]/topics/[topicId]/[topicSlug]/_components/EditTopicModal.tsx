"use client";

import { useState, useRef, useTransition } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton,
	Box,
	Typography,
	Alert,
	TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { updateTopic } from "@/actions/forum/forumTopic.actions";
import { showToast } from "@/utils/helpers/toast";
import TagSelector from "@/app/(root)/forum/_components/TagSelector";

interface EditTopicModalProps {
	open: boolean;
	onClose: () => void;
	topic: {
		id: number;
		title: string;
		content: string;
		tags?: { id: number }[];
	};
	userId: number;
	categoryId: number;
}

export default function EditTopicModal({
	open,
	onClose,
	topic,
	userId,
}: EditTopicModalProps) {
	const [title, setTitle] = useState(topic.title);
	const [content, setContent] = useState(topic.content);
	const [selectedTags, setSelectedTags] = useState<number[]>(
		topic.tags?.map((tag) => tag.id) || [],
	);
	const [error, setError] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();
	const editorRef = useRef(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) {
			setError("Please enter a title for your topic.");
			return;
		}

		if (!content || content === "<p><br></p>") {
			setError("Please enter some content for your topic.");
			return;
		}

		setError(null);

		startTransition(async () => {
			try {
				await updateTopic(
					topic.id,
					title,
					content,
					userId,
					selectedTags.length > 0 ? selectedTags : undefined,
				);
				showToast("success", "Topic updated successfully!");
				onClose();
			} catch (error) {
				setError(
					error instanceof Error
						? error.message
						: "An error occurred while updating your topic.",
				);
				showToast("error", "Failed to update topic.");
			}
		});
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullWidth
			maxWidth="md"
			PaperProps={{
				sx: {
					borderRadius: 1,
					bgcolor: "#1e2330",
					boxShadow: 3,
					overflow: "hidden",
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: "1.1rem",
					fontWeight: 500,
					bgcolor: "#2c3347",
					color: "#fff",
					py: 2,
					px: 3,
					borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Typography variant="h6" component="div">
					Edit Topic
				</Typography>
				<IconButton
					edge="end"
					color="inherit"
					onClick={onClose}
					aria-label="close"
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: 3 }}>
				<Box component="form" onSubmit={handleSubmit}>
					{error && (
						<Alert severity="error" sx={{ mb: 3 }}>
							{error}
						</Alert>
					)}
					<TextField
						label="Topic Title"
						variant="outlined"
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						sx={{ mb: 3, mt: 2 }}
						disabled={isPending}
					/>
					<Typography variant="subtitle1" gutterBottom>
						Content
					</Typography>
					<Box sx={{ mb: 3 }}>
						<TextEditor
							value={content}
							onChange={setContent}
							ref={editorRef}
							isDisabled={isPending}
							type="topic"
						/>
					</Box>
					<TagSelector
						selectedTags={selectedTags}
						onChange={setSelectedTags}
						label="Topic Tags"
						placeholder="Select tags for your topic"
						disabled={isPending}
					/>
				</Box>
			</DialogContent>
			<DialogActions
				sx={{
					px: 3,
					py: 2,
					borderTop: "1px solid rgba(255, 255, 255, 0.1)",
				}}
			>
				<Button
					onClick={onClose}
					variant="outlined"
					disabled={isPending}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					color="primary"
					disabled={isPending || !title.trim() || !content.trim()}
				>
					{isPending ? "Updating..." : "Update Topic"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
