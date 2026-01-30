"use client";

// #region "Imports"
import { Box, Button, Paper, Typography } from "@mui/material";
import { useState, useRef, useTransition, useEffect } from "react";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { createReply } from "@/actions/forum/forumReply.actions";
import { showToast } from "@/utils/helpers/toast";
import ReplyIcon from "@mui/icons-material/Reply";
import CancelIcon from "@mui/icons-material/Cancel";
import { useModal } from "@/providers/ModalProvider";
import * as CONSTANTS from "@/constants/Constants";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
// #endregion

// #region "Interfaces"
interface ReplyFormProps {
	postId: number;
	userId: number;
	replyingTo: {
		id: number;
		userName: string;
		content: string;
		type: "post" | "reply";
	} | null;
	onCancelReply: () => void;
}
// #endregion

export default function ReplyForm({
	postId,
	userId,
	replyingTo,
	onCancelReply,
}: ReplyFormProps) {
	// #region "State and Hooks"
	const [content, setContent] = useState("");
	const [isPending, startTransition] = useTransition();
	const editorRef = useRef(null);
	const { openModal } = useModal();

	// Initialize content with @username tag when replying to someone
	useEffect(() => {
		if (replyingTo) {
			// Focus the editor first
			setTimeout(() => {
				if (editorRef.current) {
					// @ts-ignore - ReactQuill editor has focus method
					const editor = editorRef.current.getEditor();
					if (editor) {
						// Insert a mention blot at the beginning of the editor
						const newDelta = editor.clipboard.convert(`<p></p>`);
						editor.setContents(newDelta);

						// Insert the mention at the beginning
						editor.focus();
						editor.insertEmbed(0, "mention", {
							username: replyingTo.userName,
							userId: replyingTo.id,
						});

						// Add a space after the mention
						editor.insertText(1, " ");

						// Move cursor after the mention and space
						editor.setSelection(2, 2);
					}
				}
			}, 100);
		}
	}, [replyingTo]);
	// #endregion

	// #region "Event Handlers"
	const handleSubmit = () => {
		if (!content.trim()) {
			showToast("error", "Please enter some content for your reply.");
			return;
		}

		startTransition(async () => {
			try {
				await createReply(content, postId, userId);
				showToast(
					"success",
					"Your reply has been created successfully!",
				);

				document.dispatchEvent(
					new CustomEvent("forum-reply-created", {
						detail: { postId },
					}),
				);
				setContent("");
				onCancelReply();
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to create your reply.",
				);
			}
		});
	};
	// #endregion

	// #region "Render"
	return (
		<Box sx={{ mt: 2, ml: replyingTo?.type === "reply" ? 4 : 0 }}>
			{replyingTo && (
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
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							left: 0,
							top: 0,
							bottom: 0,
							width: "4px",
							backgroundColor: (theme) =>
								theme.vars.palette.primary.main,
							borderTopLeftRadius: 2,
							borderBottomLeftRadius: 2,
						},
					}}
				>
					<Typography
						variant="subtitle1"
						fontWeight="bold"
						gutterBottom
						color="primary"
						sx={{ mb: 2 }}
					>
						Replying to {replyingTo.userName}:
					</Typography>
					<Box
						sx={{
							maxHeight: "100px",
							overflow: "hidden",
							textOverflow: "ellipsis",
							position: "relative",
						}}
						dangerouslySetInnerHTML={{ __html: replyingTo.content }}
					/>
				</Paper>
			)}

			<Box sx={{ mb: 3 }}>
				<TextEditor
					value={content}
					onChange={setContent}
					ref={editorRef}
					isDisabled={isPending}
					type="post"
				/>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
				<Button
					size="medium"
					variant="outlined"
					color="inherit"
					onClick={() => {
						if (content.trim()) {
							openModal({
								title: "Cancel Reply",
								subTitle:
									"Are you sure you want to cancel this reply? Your changes will be lost.",
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
										onClick: onCancelReply,
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
						} else {
							onCancelReply();
						}
					}}
					disabled={isPending}
					startIcon={<CancelIcon />}
				>
					Cancel
				</Button>
				<Button
					size="medium"
					variant="contained"
					color="secondary"
					onClick={handleSubmit}
					disabled={isPending || !content.trim()}
					startIcon={<ReplyIcon />}
				>
					{isPending ? "Submitting..." : "Submit Reply"}
				</Button>
			</Box>
		</Box>
	);
	// #endregion
}
