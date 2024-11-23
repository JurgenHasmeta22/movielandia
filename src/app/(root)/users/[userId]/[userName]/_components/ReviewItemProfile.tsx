"use client";

import { Avatar, Box, Card, CardContent, IconButton, Rating, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { formatDistanceToNow } from "date-fns";

interface ReviewItemProfileProps {
    review: any;
    type: "movie" | "serie" | "season" | "episode";
    variant: "upvote" | "downvote";
}

export default function ReviewItemProfile({ review, type, variant }: ReviewItemProfileProps) {
    // Helper function to get the content title and link
    const getContentInfo = () => {
        switch (type) {
            case "movie":
                return {
                    title: review.movieReview.movie.title,
                    link: `/movies/${review.movieReview.movie.id}/${review.movieReview.movie.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                    review: review.movieReview,
                };
            case "serie":
                return {
                    title: review.serieReview.serie.title,
                    link: `/series/${review.serieReview.serie.id}/${review.serieReview.serie.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                    review: review.serieReview,
                };
            case "season":
                return {
                    title: review.seasonReview.season.title,
                    link: `/seasons/${review.seasonReview.season.id}/${review.seasonReview.season.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                    review: review.seasonReview,
                };
            case "episode":
                return {
                    title: review.episodeReview.episode.title,
                    link: `/episodes/${review.episodeReview.episode.id}/${review.episodeReview.episode.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                    review: review.episodeReview,
                };
            default:
                return { title: "", link: "", review: null };
        }
    };

    const { title, link, review: contentReview } = getContentInfo();

    if (!contentReview) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                elevation={0}
                sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "translateY(-4px)",
                    },
                }}
            >
                <CardContent>
                    <Stack spacing={2}>
                        {/* Content Title and Link */}
                        <Link href={link} style={{ textDecoration: "none" }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "primary.main",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                {title}
                            </Typography>
                        </Link>

                        {/* Review Content */}
                        <Typography variant="body1" color="text.secondary">
                            {contentReview.content}
                        </Typography>

                        {/* Rating and Stats */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Rating value={contentReview.rating} readOnly precision={0.5} />
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <IconButton
                                    size="small"
                                    color={variant === "upvote" ? "primary" : "default"}
                                    sx={{ cursor: "default" }}
                                >
                                    <ThumbUpIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                    {contentReview._count?.upvotes || 0}
                                </Typography>
                                <IconButton
                                    size="small"
                                    color={variant === "downvote" ? "error" : "default"}
                                    sx={{ cursor: "default" }}
                                >
                                    <ThumbDownIcon fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                    {contentReview._count?.downvotes || 0}
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Review Metadata */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
                            <Avatar
                                src={contentReview.user.avatar?.photoSrc || "/default-avatar.jpg"}
                                alt={contentReview.user.userName}
                                sx={{ width: 24, height: 24 }}
                            />
                            <Typography variant="body2">
                                {formatDistanceToNow(new Date(contentReview.createdAt), {
                                    addSuffix: true,
                                })}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );
}
