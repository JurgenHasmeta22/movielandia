"use client";

import { Avatar, Box, Card, CardContent, IconButton, Rating, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ReviewItemProfileProps {
    review: any;
    type: "movie" | "serie" | "season" | "episode";
    variant: "upvote" | "downvote";
}

export default function ReviewItemProfile({ review, type, variant }: ReviewItemProfileProps) {
    // Helper function to get the content title and link
    const getContentInfo = () => {
        console.log('Review data:', review);
        console.log('Type:', type);
        console.log('Variant:', variant);

        switch (type) {
            case "movie":
                if (!review?.movieReview?.movie) {
                    console.log('Missing movie data:', review);
                    return { title: "", link: "", review: null };
                }
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
            case "season": {
                const seasonReview = review.seasonReview;
                const season = seasonReview.season;
                const serie = seasonReview.serie || season.serie;

                if (!serie) {
                    return {
                        title: season.title,
                        link: `/seasons/${season.id}/${season.title.toLowerCase().replace(/\s+/g, "-")}`,
                        review: seasonReview,
                    };
                }

                return {
                    title: season.title,
                    link: `/series/${serie.id}/${serie.title.toLowerCase().replace(/\s+/g, "-")}/seasons/${
                        season.id
                    }/${season.title.toLowerCase().replace(/\s+/g, "-")}`,
                    review: seasonReview,
                };
            }
            case "episode": {
                const episodeReview = review.episodeReview;
                const episode = episodeReview.episode;
                const season = episodeReview.season || episode.season;
                const serie = episodeReview.serie || season?.serie;

                if (!season || !serie) {
                    return {
                        title: episode.title,
                        link: `/episodes/${episode.id}/${episode.title.toLowerCase().replace(/\s+/g, "-")}`,
                        review: episodeReview,
                    };
                }

                return {
                    title: episode.title,
                    link: `/series/${serie.id}/${serie.title.toLowerCase().replace(/\s+/g, "-")}/seasons/${
                        season.id
                    }/${season.title.toLowerCase().replace(/\s+/g, "-")}/episodes/${
                        episode.id
                    }/${episode.title.toLowerCase().replace(/\s+/g, "-")}`,
                    review: episodeReview,
                };
            }
            default:
                return { title: "", link: "", review: null };
        }
    };

    const { title, link, review: contentReview } = getContentInfo();

    if (!contentReview) return null;

    const modules = {
        toolbar: false, // Disable toolbar for read-only mode
    };

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
                    width: "100%",
                    maxWidth: "800px",
                }}
            >
                <CardContent>
                    <Stack spacing={2}>
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
                        <Box
                            sx={{
                                "& .quill": {
                                    border: "none",
                                    "& .ql-container": {
                                        border: "none",
                                    },
                                    "& .ql-editor": {
                                        padding: 0,
                                        "& p": {
                                            color: "text.secondary",
                                        },
                                    },
                                },
                            }}
                        >
                            <ReactQuill value={contentReview.content} readOnly={true} modules={modules} theme="snow" />
                        </Box>
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{
                                width: "100%",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Rating
                                    value={contentReview.rating}
                                    max={10}
                                    readOnly
                                    precision={0.5}
                                    sx={{ "& .MuiRating-icon": { fontSize: "1.2rem" } }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {contentReview.rating.toFixed(1)}/10
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    ml: "auto",
                                }}
                            >
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
