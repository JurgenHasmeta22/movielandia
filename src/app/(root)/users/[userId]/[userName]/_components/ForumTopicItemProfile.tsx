"use client";

import { Box, Typography, Paper, Chip, Stack, Tooltip } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ForumTopicItemProfileProps {
    topic: {
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        slug: string;
        viewCount: number;
        category: {
            id: number;
            name: string;
            slug: string;
        };
        tags: {
            id: number;
            name: string;
        }[];
        _count: {
            posts: number;
            upvotes: number;
            downvotes: number;
        };
    };
}

export default function ForumTopicItemProfile({ topic }: ForumTopicItemProfileProps) {
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
            <Link
                href={`/forum/categories/${topic.category.id}/${topic.category.slug}/topics/${topic.id}/${topic.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
            >
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
                    {topic.title}
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
                    {topic.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}
                    {topic.content.length > 150 ? "..." : ""}
                </Typography>
            </Box>

            <Box sx={{ mb: 1.5 }}>
                <Link
                    href={`/forum/categories/${topic.category.id}/${topic.category.slug}`}
                    style={{ textDecoration: "none" }}
                >
                    <Chip
                        label={topic.category.name}
                        size="small"
                        color="primary"
                        sx={{ mr: 1, mb: 1 }}
                        clickable
                    />
                </Link>
                {topic.tags.slice(0, 3).map((tag) => (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                    />
                ))}
                {topic.tags.length > 3 && (
                    <Chip
                        label={`+${topic.tags.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                )}
            </Box>

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: "auto" }}
            >
                <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Tooltip title="Views">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <VisibilityIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                {topic.viewCount}
                            </Typography>
                        </Box>
                    </Tooltip>

                    <Tooltip title="Replies">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CommentIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                {topic.posts ? topic._count.posts : 0}
                            </Typography>
                        </Box>
                    </Tooltip>

                    <Tooltip title="Upvotes">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                {topic._count.upvotes}
                            </Typography>
                        </Box>
                    </Tooltip>

                    <Tooltip title="Downvotes">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ThumbDownIcon fontSize="small" sx={{ mr: 0.5, fontSize: "1rem", color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">
                                {topic._count.downvotes}
                            </Typography>
                        </Box>
                    </Tooltip>
                </Stack>
            </Stack>
        </Paper>
    );
}
