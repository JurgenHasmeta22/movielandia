"use client";

// #region "Imports"
import {
	Box,
	Paper,
	Typography,
	Stack,
	Avatar,
	Divider,
	Button,
	CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import { formatDistanceToNow, format } from "date-fns";
import RichTextDisplay from "@/components/root/richTextDisplay/RichTextDisplay";
import React, { useState, useRef, useTransition } from "react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useModal } from "@/providers/ModalProvider";
import { deletePost, updatePost, upvotePost } from "@/actions/forum/forumPost.actions";
import { showToast } from "@/utils/helpers/toast";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import * as CONSTANTS from "@/constants/Constants";
import {
	WarningOutlined,
	CheckOutlined,
	CancelOutlined,
	SaveOutlined,
} from "@mui/icons-material";
import TextEditor from "@/components/root/textEditor/TextEditor";
import ReplyList from "./ReplyList";
import ReplyForm from "./ReplyForm";
// #endregion

// #region "Interfaces"
interface PostListProps {
	posts: {
		items: any[];
		total: number;
	};
	currentPage: number;
	totalPages: number;
	userLoggedIn: any;
	topicLocked: boolean;
}
// #endregion

export default function PostList({
	posts,
	currentPage,
	totalPages,
	userLoggedIn,
	topicLocked,
}: PostListProps) {
	// #region "State, hooks"
	const theme = useTheme();
	const { openModal } = useModal();

	const [editingPost, setEditingPost] = useState<{
		id: number;
		content: string;
	} | null>(null);
	const [editContent, setEditContent] = useState("");
	const [originalContent, setOriginalContent] = useState("");
	const [isPending, startUpdatePostTransition] = useTransition();
	const [isDeleting, startDeleteTransition] = useTransition();
	const [isUpvoting, startUpvoteTransition] = useTransition();

	const [replyingTo, setReplyingTo] = useState<{
		id: number;
		userName: string;
		content: string;
		type: "post" | "reply";
	} | null>(null);

	const editorRef = useRef(null);
	// #endregion

	// #region "Delete and Edit methods handlers"
	function handleDeletePost(postId: number) {
		if (!userLoggedIn) return;

		openModal({
			title: "Delete Post",
			subTitle:
				"Are you sure you want to delete this post? This action cannot be undone.",
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
					onClick: () => {
						startDeleteTransition(async () => {
							try {
								await deletePost(
									postId,
									Number(userLoggedIn.id),
								);
								showToast(
									"success",
									"Post deleted successfully!",
								);
							} catch (error) {
								showToast(
									"error",
									error instanceof Error
										? error.message
										: "Failed to delete post",
								);
							}
						});
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

	const handleStartEditing = (post: { id: number; content: string }) => {
		setEditingPost(post);
		setEditContent(post.content);
		setOriginalContent(post.content);
	};

	const handleCancelEditing = () => {
		setEditingPost(null);
		setEditContent("");
		setOriginalContent("");
	};

	const handleDiscardChanges = () => {
		if (editContent === originalContent) {
			handleCancelEditing();
			return;
		}

		openModal({
			title: "Discard Changes",
			subTitle: "Are you sure you want to discard changes on this post?",
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
					onClick: () => {
						handleCancelEditing();
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
	};

	const handleUpdatePost = async () => {
		if (!editingPost || !userLoggedIn) return;

		if (!editContent || editContent === "<p><br></p>") {
			showToast("error", "Please enter some content for your post.");
			return;
		}

		startUpdatePostTransition(async () => {
			try {
				await updatePost(
					editingPost.id,
					editContent,
					Number(userLoggedIn.id),
				);
				showToast("success", "Post updated successfully!");
				handleCancelEditing();
			} catch (err) {
				showToast(
					"error",
					err instanceof Error
						? err.message
						: "Failed to update post",
				);
			}
		});
	};

	const handleReplyToPost = (post: any) => {
		if (!userLoggedIn) return;

		setReplyingTo({
			id: post.id,
			userName: post.user.userName,
			content: post.content,
			type: "post",
		});
	};

	const handleReplyToReply = (reply: any) => {
		if (!userLoggedIn) return;

		setReplyingTo({
			id: reply.id,
			userName: reply.user.userName,
			content: reply.content,
			type: "reply",
		});
	};

	function handleUpvote(postId: number) {
		if (!userLoggedIn) return;

		startUpvoteTransition(async () => {
			try {
				await upvotePost(postId, Number(userLoggedIn.id));
				showToast("success", "Vote updated successfully");
			} catch (error) {
				showToast(
					"error",
					error instanceof Error
						? error.message
						: "Failed to upvote post",
				);
			}
		});
	}

	const handleCancelReply = () => {
		setReplyingTo(null);
	};
	// #endregion

	// #region "No Posts JSX"
	if (posts.items.length === 0) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 4,
					textAlign: "center",
					borderRadius: 2,
					backgroundColor: theme.vars.palette.secondary.light,
					border: `1px solid ${theme.vars.palette.primary.light}`,
				}}
			>
				<ChatIcon
					sx={{
						fontSize: 60,
						color: theme.vars.palette.primary.main,
						mb: 2,
						opacity: 0.7,
					}}
				/>
				<Typography variant="h6" gutterBottom>
					No posts yet
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 3 }}
				>
					Be the first to post in this topic!
				</Typography>
				{userLoggedIn && !topicLocked && (
					<Button
						variant="contained"
						color="secondary"
						onClick={() =>
							document
								.getElementById("post-form")
								?.scrollIntoView({ behavior: "smooth" })
						}
					>
						Create a Post
					</Button>
				)}
			</Paper>
		);
	}
	// #endregion

	return (
		<>
			<Stack spacing={3}>
				{posts.items.map((post) => (
					<Paper
						key={post.id}
						elevation={0}
						sx={{
							p: 3,
							borderRadius: 2,
							backgroundColor:
								userLoggedIn &&
								Number(userLoggedIn.id) === post.user.id
									? "rgba(25, 118, 210, 0.05)"
									: theme.vars.palette.secondary.light,
							border:
								userLoggedIn &&
								Number(userLoggedIn.id) === post.user.id
									? "1px solid rgba(25, 118, 210, 0.3)"
									: `1px solid ${theme.vars.palette.primary.light}`,
							position: "relative",
						}}
					>
						{((isPending && editingPost?.id === post.id) ||
							isDeleting) && (
							<Box
								sx={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: "rgba(0, 0, 0, 0.5)",
									zIndex: 10,
									borderRadius: 2,
								}}
							>
								<CircularProgress size={60} />
							</Box>
						)}
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
								<Avatar
									src={post.user.avatar?.photoSrc || ""}
									alt={post.user.userName}
									sx={{ width: 32, height: 32 }}
								/>
								<Box>
									<Link
										href={`/users/${post.user.id}/${post.user.userName}`}
										style={{ textDecoration: "none" }}
									>
										<Typography
											variant="subtitle1"
											color="primary"
											fontWeight="bold"
										>
											{post.user.userName}
										</Typography>
									</Link>
									<Typography
										variant="body2"
										color="text.secondary"
									>
										{format(
											new Date(post.createdAt),
											"PPP 'at' p",
										)}
									</Typography>
								</Box>
							</Box>
							<Typography variant="body2" color="text.secondary">
								#
								{currentPage > 1
									? (currentPage - 1) * 10 +
										posts.items.indexOf(post) +
										1
									: posts.items.indexOf(post) + 1}
							</Typography>
						</Box>
						<Divider sx={{ my: 2 }} />
						{editingPost && editingPost.id === post.id ? (
							<Box sx={{ mb: 2 }}>
								<TextEditor
									value={editContent}
									onChange={setEditContent}
									ref={editorRef}
									isDisabled={isPending}
									type="post"
								/>
								<Box
									sx={{
										mt: 2,
										display: "flex",
										justifyContent: "flex-end",
										gap: 2,
									}}
								>
									<Button
										onClick={handleDiscardChanges}
										color="error"
										variant="contained"
										disabled={isPending}
										startIcon={<CancelOutlined />}
									>
										Discard Changes
									</Button>
									<Button
										onClick={handleUpdatePost}
										color="success"
										variant="contained"
										disabled={
											isPending || !editContent.trim()
										}
										startIcon={
											isPending ? (
												<CircularProgress
													size={20}
													color="inherit"
												/>
											) : (
												<SaveOutlined />
											)
										}
									>
										{isPending
											? "Saving..."
											: "Save Changes"}
									</Button>
								</Box>
							</Box>
						) : (
							<>
								<Box sx={{ mb: 2 }}>
									<RichTextDisplay
										content={post.content}
										type="post"
									/>
								</Box>
								{post.isEdited && (
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mt: 2, fontStyle: "italic" }}
									>
										Last edited:{" "}
										{formatDistanceToNow(
											new Date(post.updatedAt),
											{ addSuffix: true },
										)}
									</Typography>
								)}
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										mt: 2,
										gap: 1,
									}}
								>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 2,
														}}
													>
														<Box
															sx={{
																display: "flex",
																alignItems: "center",
																gap: 0.5,
															}}
														>
															<Button
																size="small"
																onClick={() => handleUpvote(post.id)}
																disabled={isUpvoting || !userLoggedIn}
																sx={{
																	minWidth: "auto",
																	p: 0.5,
																	color: post.upvotes?.some(
																		(u: any) =>
																			u.userId ===
																			Number(userLoggedIn?.id),
																	)
																		? "success.main"
																		: "inherit",
																}}
															>
																{isUpvoting ? (
																	<CircularProgress
																		size={16}
																		color="inherit"
																	/>
																) : (
																	<ThumbUpIcon fontSize="small" />
																)}
															</Button>
															<Typography variant="body2">
																{post._count.upvotes}
															</Typography>
														</Box>
														{userLoggedIn && !topicLocked && (
															<Button
																variant="outlined"
																size="small"
																startIcon={<ReplyIcon />}
																onClick={() =>
																	handleReplyToPost(post)
																}
															>
																Reply
															</Button>
														)}
													</Box>

													{userLoggedIn &&
														Number(userLoggedIn.id) ===
															post.user.id &&
														!topicLocked && (
															<Box
																sx={{ display: "flex", gap: 1 }}
															>
																<Button
																	variant="outlined"
																	size="small"
																	startIcon={<EditIcon />}
																	onClick={() =>
																		handleStartEditing({
																			id: post.id,
																			content:
																				post.content,
																		})
																	}
																>
																	Edit
																</Button>
																<Button
																	variant="outlined"
																	size="small"
																	color="error"
																	startIcon={<DeleteIcon />}
																	onClick={() =>
																		handleDeletePost(
																			post.id,
																		)
																	}
																>
																	Delete
																</Button>
															</Box>
														)}
								</Box>
								{replyingTo &&
									replyingTo.type === "post" &&
									replyingTo.id === post.id &&
									userLoggedIn && (
										<ReplyForm
											postId={post.id}
											userId={Number(userLoggedIn.id)}
											replyingTo={replyingTo}
											onCancelReply={handleCancelReply}
										/>
									)}
								<ReplyList
									postId={post.id}
									userLoggedIn={userLoggedIn}
									topicLocked={topicLocked}
									onReplyToReply={handleReplyToReply}
									replyingTo={replyingTo}
									onCancelReply={handleCancelReply}
									replies={post.replies}
									currentPage={post.replyPage}
									limit={5}
								/>
							</>
						)}
					</Paper>
				))}
			</Stack>
			{totalPages > 1 && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
					<PaginationControl
						pageCount={totalPages}
						currentPage={currentPage}
					/>
				</Box>
			)}
		</>
	);
}
