"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";
import { Box, Paper, Typography, IconButton, useTheme, Rating, Button, Tooltip, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IReviewProps {
    review: Review;
    setRating: React.Dispatch<React.SetStateAction<number | null>>;
    ref: any;
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
    isEditMode: boolean;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    type: string;
    data: any;
    handleRemoveReview: () => void;
    handleFocusTextEditor: () => void;
    handleUpvote: (reviewId: number, isAlreadyUpvotedOrDownvoted: boolean) => void;
    handleDownvote: (reviewId: number, isAlreadyUpvotedOrDownvoted: boolean) => void;
}

type Review = {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    rating: number;
    upvotes: any[];
    downvotes: any[];
    isUpvoted: boolean;
    isDownvoted: boolean;
    _count: {
        upvotes: number;
        downvotes: number;
    };
    user: {
        id: number;
        userName: string;
        avatar: any;
    };
};

const Review: React.FC<IReviewProps> = ({
    review,
    handleRemoveReview,
    isEditMode,
    setIsEditMode,
    setReview,
    setRating,
    handleUpvote,
    handleDownvote,
    ref,
}) => {
    // #region "State, hooks, theme, also colorFunction utils"
    const getRatingLabelAndColor = (rating: number) => {
        if (rating <= 2) {
            return { label: "Very Bad", color: "error.main" };
        }

        if (rating <= 4) {
            return { label: "Bad", color: "warning.main" };
        }

        if (rating <= 6) {
            return { label: "Average", color: "info.main" };
        }

        if (rating <= 8) {
            return { label: "Good", color: "success.light" };
        }

        return { label: "Very Good", color: "success.main" };
    };

    const { data: session } = useSession();

    const [isClickedUpvote, setIsClickedUpvote] = useState(false);
    const [isClickedDownvote, setIsClickedDownvote] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    const { label, color } = getRatingLabelAndColor(review.rating);
    // #endregion

    // #region "Event handlers and other functions"
    async function handleClickUpVoteReview() {
        setIsClickedUpvote(true);

        if (review.isUpvoted) {
            handleUpvote(review.id, true);
        } else {
            handleUpvote(review.id, false);
        }
    }

    async function handleClickDownVoteReview() {
        setIsClickedDownvote(true);

        if (review.isDownvoted) {
            handleDownvote(review.id, true);
        } else {
            handleDownvote(review.id, false);
        }
    }
    // #endregion

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) => theme.shadows[4],
                },
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                    }}
                    onClick={() => router.push(`/users/${review.user.id}/${review.user.userName}`)}
                >
                    {review.user.avatar?.photoSrc ? (
                        <Image
                            alt={review.user.userName}
                            height={48}
                            width={48}
                            style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                            src={review.user.avatar?.photoSrc}
                        />
                    ) : (
                        <PersonOutlinedIcon sx={{ fontSize: 48 }} />
                    )}
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {review.user.userName}
                            {review.user.id === Number(session?.user?.id) && (
                                <Typography component="span" sx={{ ml: 1, color: "primary.main" }}>
                                    (You)
                                </Typography>
                            )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {!review.updatedAt
                                ? format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")
                                : `Edited ${format(new Date(review.updatedAt), "MMMM dd, yyyy HH:mm")}`}
                        </Typography>
                    </Box>
                </Box>

                {review.user.id === Number(session?.user?.id) && !isEditMode && (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                        }}
                    >
                        <Tooltip title="Edit review">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                    setIsEditMode(true);
                                    setReview(review.content);
                                    setRating(review.rating);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete review">
                            <Box
                                ref={ref}
                                tabIndex={-1}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <IconButton size="small" color="error" onClick={handleRemoveReview}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    </Box>
                )}
            </Box>

            <Box sx={{ mb: 2 }}>
                <Rating value={review.rating} readOnly max={10} precision={0.5} sx={{ mb: 1 }} />
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: getRatingLabelAndColor(review.rating).color,
                        fontWeight: 600,
                    }}
                >
                    {getRatingLabelAndColor(review.rating).label}
                </Typography>
            </Box>

            <Box
                dangerouslySetInnerHTML={{ __html: review.content }}
                sx={{
                    mb: 3,
                    wordWrap: "break-word",
                    "& img": { maxWidth: "100%", height: "auto" },
                }}
            />

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <motion.div whileTap={{ scale: 0.95 }} animate={isClickedUpvote ? { scale: [1, 1.2, 1] } : {}}>
                        <Tooltip title={session?.user ? "Upvote" : "Sign in to upvote"}>
                            <IconButton
                                disabled={!session?.user || review.user.id === Number(session?.user?.id)}
                                onClick={handleClickUpVoteReview}
                                sx={{
                                    color: review.isUpvoted ? "success.main" : "action.active",
                                }}
                            >
                                <ThumbUpIcon />
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                    <Button
                        disabled={review._count.upvotes === 0}
                        onClick={() => router.push(`${pathname}/reviews/${review.id}/upvotes`)}
                        sx={{
                            minWidth: "auto",
                            "&:hover": { backgroundColor: "transparent" },
                        }}
                    >
                        {review._count.upvotes}
                    </Button>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <motion.div whileTap={{ scale: 0.95 }} animate={isClickedDownvote ? { scale: [1, 1.2, 1] } : {}}>
                        <Tooltip title={session?.user ? "Downvote" : "Sign in to downvote"}>
                            <IconButton
                                disabled={!session?.user || review.user.id === Number(session?.user?.id)}
                                onClick={handleClickDownVoteReview}
                                sx={{
                                    color: review.isDownvoted ? "error.main" : "action.active",
                                }}
                            >
                                <ThumbDownIcon />
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                    <Button
                        disabled={review._count.downvotes === 0}
                        onClick={() => router.push(`${pathname}/reviews/${review.id}/downvotes`)}
                        sx={{
                            minWidth: "auto",
                            "&:hover": { backgroundColor: "transparent" },
                        }}
                    >
                        {review._count.downvotes}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default Review;
