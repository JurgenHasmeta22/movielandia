"use client";

import { Box, Paper, Typography, Stack, Avatar, Divider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow, format } from "date-fns";
import TextEditor from "@/components/root/textEditor/TextEditor";
import React, { useRef, useState } from "react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import type {} from "@mui/material/themeCssVarsAugmentation";
import EditReplyModal from "./EditReplyModal";
import { useModal } from "@/providers/ModalProvider";
import { deleteReply } from "@/actions/forum/forumReply.actions";
import { showToast } from "@/utils/helpers/toast";
import * as CONSTANTS from "@/constants/Constants";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";

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

export default function PostList({ posts, currentPage, totalPages, userLoggedIn, topicLocked }: PostListProps) {
    const theme = useTheme();
    const router = useRouter();
    const { openModal } = useModal();
    const editorRefs = useRef<{ [key: number]: React.RefObject<any> }>({});
    const [editingReply, setEditingReply] = useState<{ id: number; content: string } | null>(null);

    posts.items.forEach((post) => {
        if (!editorRefs.current[post.id]) {
            editorRefs.current[post.id] = React.createRef();
        }
    });

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
                <ChatIcon sx={{ fontSize: 60, color: theme.vars.palette.primary.main, mb: 2, opacity: 0.7 }} />
                <Typography variant="h6" gutterBottom>
                    No replies yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Be the first to reply to this topic!
                </Typography>
                {userLoggedIn && !topicLocked && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => document.getElementById("reply-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        Post a Reply
                    </Button>
                )}
            </Paper>
        );
    }

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
                                userLoggedIn && userLoggedIn.id === post.user.id
                                    ? "rgba(25, 118, 210, 0.05)"
                                    : theme.vars.palette.secondary.light,
                            border:
                                userLoggedIn && userLoggedIn.id === post.user.id
                                    ? "1px solid rgba(25, 118, 210, 0.3)"
                                    : `1px solid ${theme.vars.palette.primary.light}`,
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                                        <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                            {post.user.userName}
                                        </Typography>
                                    </Link>
                                    <Typography variant="body2" color="text.secondary">
                                        {format(new Date(post.createdAt), "PPP 'at' p")}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                #
                                {currentPage > 1
                                    ? (currentPage - 1) * 10 + posts.items.indexOf(post) + 1
                                    : posts.items.indexOf(post) + 1}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            <TextEditor
                                value={post.content}
                                onChange={() => {}}
                                ref={editorRefs.current[post.id]}
                                isDisabled={true}
                                type="post"
                            />
                        </Box>
                        {post.isEdited && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
                                Last edited: {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                            </Typography>
                        )}
                        {userLoggedIn && userLoggedIn.id === post.user.id && !topicLocked && (
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditingReply({ id: post.id, content: post.content })}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteReply(post.id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        )}
                    </Paper>
                ))}
            </Stack>
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <PaginationControl pageCount={totalPages} currentPage={currentPage} />
                </Box>
            )}

            {/* Edit Reply Modal */}
            {editingReply && userLoggedIn && (
                <EditReplyModal
                    open={!!editingReply}
                    onClose={() => setEditingReply(null)}
                    reply={editingReply}
                    userId={userLoggedIn.id}
                    onSuccess={() => router.refresh()}
                />
            )}
        </>
    );

    // Function to handle reply deletion
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
                    onClick: async () => {
                        try {
                            await deleteReply(replyId, userLoggedIn.id);
                            showToast("success", "Reply deleted successfully!");
                            router.refresh();
                        } catch (error) {
                            showToast("error", error instanceof Error ? error.message : "Failed to delete reply");
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
}
