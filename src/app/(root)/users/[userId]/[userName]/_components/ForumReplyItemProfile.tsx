"use client";

import { Box, Typography, Paper, Stack, Tooltip } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";

interface ForumReplyItemProfileProps {
    reply: {
        id: number;
        content: string;
        createdAt: Date;
        isEdited: boolean;
        editCount: number;
        post: {
            id: number;
            content: string;
            topic: {
                id: number;
                title: string;
                slug: string;
                categoryId: number;
                category: {
                    id: number;
                    name: string;
                    slug: string;
                };
            };
        };
        _count: {
            upvotes: number;
            downvotes: number;
        };
    };
}

export default function ForumReplyItemProfile({ reply }: ForumReplyItemProfileProps) {
    const topicUrl = `/forum/categories/${reply.post.topic.category.id}/${reply.post.topic.category.slug}/topics/${reply.post.topic.id}/${reply.post.topic.slug}`;
    
    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": {
                    boxShadow: (theme) => theme.shadows[3],
                    transform: "translateY(-2px)",
                },
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Link href={topicUrl} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.2,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                    }}
                >
                    Reply to: {reply.post.topic.title}
                </Typography>
            </Link>

            <Box sx={{ mb: 2, flex: 1 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {reply.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                    {reply.content.length > 150 ? "..." : ""}
                </Typography>
            </Box>

            <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                    <strong>In response to:</strong>{" "}
                    {reply.post.content.replace(/<[^>]*>?/gm, "").substring(0, 100)}
                    {reply.post.content.length > 100 ? "..." : ""}
                </Typography>
            </Box>

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: "auto" }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </Typography>
                    
                    {reply.isEdited && (
                        <Tooltip title={`Edited ${reply.editCount} ${reply.editCount === 1 ? 'time' : 'times'}`}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <EditIcon fontSize="small" sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
                            </Box>
                        </Tooltip>
                    )}
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Tooltip title="Upvotes">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                {reply._count.upvotes}
                            </Typography>
                        </Box>
                    </Tooltip>

                    <Tooltip title="Downvotes">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ThumbDownIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                {reply._count.downvotes}
                            </Typography>
                        </Box>
                    </Tooltip>
                </Stack>
            </Stack>
        </Paper>
    );
}
