"use client";

import { Box, Paper, Typography, Pagination, Stack, Avatar, Divider, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import ChatIcon from "@mui/icons-material/Chat";
import { formatDistanceToNow, format } from "date-fns";
import TextEditor from "@/components/root/textEditor/TextEditor";
import React, { useRef } from "react";

interface PostListProps {
    posts: {
        items: any[];
        total: number;
    };
    currentPage: number;
    totalPages: number;
    userLoggedIn: any;
    topicLocked: boolean;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function PostList({
    posts,
    currentPage,
    totalPages,
    onPageChange,
    userLoggedIn,
    topicLocked,
}: PostListProps) {
    const theme = useTheme();
    const editorRefs = useRef<{ [key: number]: React.RefObject<any> }>({});

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
                            backgroundColor: theme.vars.palette.secondary.light,
                            border: `1px solid ${theme.vars.palette.primary.light}`,
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
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    href={`/forum/posts/${post.id}/edit?returnUrl=/forum/categories/${post.topic?.categoryId}/${post.topic?.category?.slug}/topics/${post.topic?.id}/${post.topic?.slug}`}
                                >
                                    Edit
                                </Button>
                            </Box>
                        )}
                    </Paper>
                ))}
            </Stack>
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </>
    );
}
