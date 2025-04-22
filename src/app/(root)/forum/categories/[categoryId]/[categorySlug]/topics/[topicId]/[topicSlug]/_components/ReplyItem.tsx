"use client";

import { Box, Paper, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { format } from "date-fns";
import RichTextDisplay from "@/components/root/richTextDisplay/RichTextDisplay";
import React, { useState, useRef, useTransition } from "react";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { updateReply, deleteReply, upvoteReply, downvoteReply } from "@/actions/forum/forumReply.actions";
import { showToast } from "@/utils/helpers/toast";
import * as CONSTANTS from "@/constants/Constants";
import { CancelOutlined, SaveOutlined, WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useModal } from "@/providers/ModalProvider";

interface ReplyItemProps {
    reply: any;
    userLoggedIn: any;
    topicLocked: boolean;
    onReplyToReply: (reply: any) => void;
    postId: number;
    index: number;
    currentPage: number;
}

export default function ReplyItem({
    reply,
    userLoggedIn,
    topicLocked,
    onReplyToReply,
    postId,
    index,
    currentPage,
}: ReplyItemProps) {
    // #region "State and hooks"
    const theme = useTheme();
    const { openModal } = useModal();

    const [editingReply, setEditingReply] = useState<{ id: number; content: string } | null>(null);
    const [editContent, setEditContent] = useState("");
    const [originalContent, setOriginalContent] = useState("");
    const [isPending, startUpdateReplyTransition] = useTransition();
    const [isDeleting, startDeleteTransition] = useTransition();
    const [isUpvoting, startUpvoteTransition] = useTransition();

    const editorRef = useRef(null);
    // #endregion
    
    // #region "Delete and Edit methods handlers"
    function handleDeleteReply(replyId: number) {
        if (!userLoggedIn) return;

        openModal({
            title: "Delete Reply",
            subTitle: "Are you sure you want to delete this reply? This action cannot be undone.",
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
                                await deleteReply(replyId, Number(userLoggedIn.id));
                                showToast("success", "Reply deleted successfully");

                                document.dispatchEvent(
                                    new CustomEvent("forum-reply-deleted", { detail: { replyId, postId } }),
                                );
                            } catch (error) {
                                showToast("error", error instanceof Error ? error.message : "Failed to delete reply");
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

    function handleStartEditing(reply: { id: number; content: string }) {
        setEditingReply(reply);
        setEditContent(reply.content);
        setOriginalContent(reply.content);

        setTimeout(() => {
            if (editorRef.current) {
                // @ts-ignore - ReactQuill editor has focus method
                const editor = editorRef.current.getEditor();

                if (editor) {
                    editor.focus();
                }
            }
        }, 100);
    }

    function handleCancelEditing() {
        if (editContent !== originalContent) {
            openModal({
                title: "Discard Changes",
                subTitle: "Are you sure you want to discard changes on this reply?",
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
                            setEditingReply(null);
                            setEditContent("");
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
        } else {
            setEditingReply(null);
            setEditContent("");
        }
    }

    function handleSaveEditing() {
        if (!userLoggedIn || !editingReply) return;

        if (editContent.trim() === "") {
            showToast("error", "Reply content cannot be empty");
            return;
        }

        if (editContent === originalContent) {
            setEditingReply(null);
            return;
        }

        startUpdateReplyTransition(async () => {
            try {
                await updateReply(editingReply.id, editContent, Number(userLoggedIn.id));
                setEditingReply(null);
                showToast("success", "Reply updated successfully");

                document.dispatchEvent(
                    new CustomEvent("forum-reply-modified", { detail: { replyId: editingReply.id, postId } }),
                );
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to update reply");
            }
        });
    }

    function handleUpvote(replyId: number) {
        if (!userLoggedIn) return;

        startUpvoteTransition(async () => {
            try {
                await upvoteReply(replyId, Number(userLoggedIn.id));
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to upvote reply");
            }
        });
    }
    // #endregion

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.vars.palette.background.paper,
                border: `1px solid ${theme.vars.palette.divider}`,
                position: "relative",
                ml: 4,
                mb: 1,
            }}
        >
            {((isPending && editingReply?.id === reply.id) || isDeleting) && (
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
                    <CircularProgress size={40} />
                </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                        src={reply.user.avatar?.photoSrc || ""}
                        alt={reply.user.userName}
                        sx={{ width: 24, height: 24 }}
                    />
                    <Box>
                        <Link
                            href={`/users/${reply.user.id}/${reply.user.userName}`}
                            style={{ textDecoration: "none" }}
                        >
                            <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                {reply.user.userName}
                            </Typography>
                        </Link>
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(reply.createdAt), "PPP 'at' p")}
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                    #{currentPage > 1 ? (currentPage - 1) * 10 + index + 1 : index + 1}
                </Typography>
            </Box>

            {editingReply?.id === reply.id ? (
                <>
                    <Box sx={{ mb: 2 }}>
                        <TextEditor
                            value={editContent}
                            onChange={setEditContent}
                            ref={editorRef}
                            isDisabled={isPending}
                            type="post"
                        />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CancelOutlined />}
                            onClick={handleCancelEditing}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<SaveOutlined />}
                            onClick={handleSaveEditing}
                            disabled={isPending || editContent.trim() === ""}
                        >
                            Save
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Box sx={{ mb: 2 }}>
                        <RichTextDisplay content={reply.content} type="post" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Button
                                    size="small"
                                    onClick={() => handleUpvote(reply.id)}
                                    disabled={isUpvoting || !userLoggedIn}
                                    sx={{ minWidth: "auto", p: 0.5 }}
                                >
                                    <ThumbUpIcon fontSize="small" />
                                </Button>
                                <Typography variant="body2">{reply._count.upvotes}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {userLoggedIn && !topicLocked && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<ReplyIcon />}
                                    onClick={() => onReplyToReply(reply)}
                                >
                                    Reply
                                </Button>
                            )}

                            {userLoggedIn && Number(userLoggedIn.id) === reply.user.id && !topicLocked && (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleStartEditing({ id: reply.id, content: reply.content })}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteReply(reply.id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </Paper>
    );
}
