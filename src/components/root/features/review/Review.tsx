"use client";

import React, { Dispatch, SetStateAction, forwardRef, useState } from "react";
import { format } from "date-fns";
import { Avatar, Box, Paper, Typography, IconButton, useTheme, Rating, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { tokens } from "@/utils/theme/theme";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface ReviewProps {
    review: {
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
            userName: string;
            avatar: string;
        };
    };
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
    handleOpenUpvotesModal: (review: any) => void;
    handleOpenDownvotesModal: (review: any) => void;
}

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

const Review = forwardRef<HTMLElement, ReviewProps>(
    (
        {
            review,
            handleRemoveReview,
            isEditMode,
            setIsEditMode,
            setReview,
            setRating,
            handleUpvote,
            handleDownvote,
            type,
            handleOpenUpvotesModal,
            handleOpenDownvotesModal,
            // handleFocusTextEditor,
        },
        ref,
    ) => {
        // #region "State, hooks, theme"
        const [isClickedUpvote, setIsClickedUpvote] = useState(false);
        const [isClickedDownvote, setIsClickedDownvote] = useState(false);
        const { label, color } = getRatingLabelAndColor(review.rating);
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        const { data: session } = useSession();
        // #endregion

        // #region "Event handlers"
        async function onClickUpvotesReviewList() {
            handleOpenUpvotesModal(review);
        }

        async function onClickDownvotesReviewList() {
            handleOpenDownvotesModal(review);
        }

        async function handleClickUpVoteReview() {
            setIsClickedUpvote(true);

            if (type === "movie" && review.isUpvoted) {
                handleUpvote(review.id, true);
            } else if (type === "serie" && review.isUpvoted) {
                handleUpvote(review.id, true);
            } else {
                handleUpvote(review.id, false);
            }
        }

        async function handleClickDownVoteReview() {
            setIsClickedDownvote(true);

            if (type === "movie" && review.isDownvoted) {
                handleDownvote(review.id, true);
            } else if (type === "serie" && review.isDownvoted) {
                handleDownvote(review.id, true);
            } else {
                handleDownvote(review.id, false);
            }
        }
        // #endregion

        return (
            <Paper
                sx={{
                    p: 2,
                    mt: 2,
                    backgroundColor:
                        review.user.userName === session?.user?.userName ? colors.redAccent[700] : colors.primary[400],
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Avatar alt={review.user.userName} src={review.user.avatar} />
                        <Typography
                            variant="h6"
                            sx={{
                                color:
                                    review.user.userName === session?.user?.userName
                                        ? colors.blueAccent[200]
                                        : colors.primary[100],
                                fontWeight: review.user.userName === session?.user?.userName ? 900 : 300,
                                letterSpacing: 1,
                            }}
                        >
                            {review.user.userName}
                        </Typography>
                        {review.user.userName === session?.user?.userName && (
                            <Typography component={"span"} paddingLeft={1}>
                                - You
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ display: "flex", flexWrap: "wrap" }}>
                            {review.updatedAt && (
                                <Typography component={"span"} color={"error"}>
                                    Edited
                                </Typography>
                            )}
                            {!review.updatedAt ? (
                                <Typography component={"span"} paddingLeft={1}>
                                    {format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")}
                                </Typography>
                            ) : (
                                <Typography component={"span"} paddingLeft={1}>
                                    {format(new Date(review.updatedAt), "MMMM dd, yyyy HH:mm")}
                                </Typography>
                            )}
                        </Typography>
                        {review.user.userName === session?.user?.userName && !isEditMode && (
                            <IconButton
                                size="medium"
                                onClick={() => {
                                    setIsEditMode(true);
                                    setReview(review.content);
                                    setRating(review.rating);
                                }}
                            >
                                <EditIcon fontSize="medium" />
                            </IconButton>
                        )}
                        {review.user.userName === session?.user?.userName && (
                            <Box ref={ref} tabIndex={-1}>
                                <IconButton size="medium" onClick={() => handleRemoveReview()}>
                                    <CloseIcon fontSize="medium" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box
                    dangerouslySetInnerHTML={{ __html: review.content }}
                    sx={{
                        wordWrap: "break-word",
                        "& img": { maxWidth: "70%", height: "auto" },
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" fontSize={14} fontWeight={900} sx={{ mr: 1, color }}>
                            {label}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" fontSize={14} fontWeight={700} sx={{ mr: 1 }}>
                            {review?.rating ? review?.rating?.toFixed(1) : "0.0"}
                        </Typography>
                        <Rating
                            name={`review-rating-${review.id}`}
                            value={review?.rating}
                            readOnly
                            max={10}
                            precision={0.5}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                        columnGap: 4,
                    }}
                >
                    <Box display={"flex"} alignItems={"center"} columnGap={1}>
                        <motion.div
                            whileTap={{ scale: 1 }}
                            animate={isClickedUpvote ? { scale: [1, 1.5, 1] } : {}}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <IconButton
                                size="medium"
                                disabled={
                                    session?.user && review.user.userName !== session?.user?.userName ? false : true
                                }
                                onClick={async () => {
                                    handleClickUpVoteReview();
                                }}
                                sx={{
                                    color:
                                        (type === "movie" && review.isUpvoted) || (type === "serie" && review.isUpvoted)
                                            ? colors.greenAccent[700]
                                            : colors.primary[100],
                                }}
                            >
                                <ThumbUpIcon fontSize="medium" />
                            </IconButton>
                        </motion.div>
                        <Button
                            disabled={review?.upvotes?.length === 0}
                            onClick={() => {
                                onClickUpvotesReviewList();
                            }}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                                color: colors.primary[100],
                            }}
                        >
                            <Typography>{review._count.upvotes}</Typography>
                        </Button>
                    </Box>
                    <Box display={"flex"} alignItems={"center"} columnGap={1}>
                        <motion.div
                            whileTap={{ scale: 1 }}
                            animate={isClickedDownvote ? { scale: [1, 1.5, 1] } : {}}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <IconButton
                                size="medium"
                                disabled={
                                    session?.user && review.user.userName !== session?.user?.userName ? false : true
                                }
                                onClick={async () => {
                                    handleClickDownVoteReview();
                                }}
                                sx={{
                                    color:
                                        (type === "movie" && review.isDownvoted) ||
                                        (type === "serie" && review.isDownvoted)
                                            ? colors.redAccent[700]
                                            : colors.primary[100],
                                }}
                            >
                                <ThumbDownIcon fontSize="medium" />
                            </IconButton>
                        </motion.div>
                        <Button
                            disabled={review?.downvotes?.length === 0}
                            onClick={() => {
                                onClickDownvotesReviewList();
                            }}
                            color={"error"}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "transparent",
                                },
                            }}
                        >
                            <Typography>{review._count.downvotes}</Typography>
                        </Button>
                    </Box>
                </Box>
            </Paper>
        );
    },
);

Review.displayName = "ReviewComponent";
export default Review;
