"use client";

import React, { Dispatch, SetStateAction, forwardRef, useState } from "react";
import { format } from "date-fns";
import { Box, Paper, Typography, IconButton, useTheme, Rating, Button, CssVarsTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

interface Review {
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
}

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

const Review = forwardRef<HTMLElement, IReviewProps>(
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
            handleOpenUpvotesModal,
            handleOpenDownvotesModal,
        },
        ref,
    ) => {
        // #region "State, hooks, theme"
        const { data: session } = useSession();

        const [isClickedUpvote, setIsClickedUpvote] = useState(false);
        const [isClickedDownvote, setIsClickedDownvote] = useState(false);

        const router = useRouter();

        const theme: CssVarsTheme = useTheme();

        const { label, color } = getRatingLabelAndColor(review.rating);
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
                sx={{
                    p: 3,
                    mt: 2,
                    mx: 3,
                    backgroundColor:
                        review.user.userName === session?.user?.userName
                            ? theme.vars.palette.red.main
                            : theme.vars.palette.background.default,
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
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            router.push(`/users/${review.user.id}/${review.user.userName}`);
                        }}
                    >
                        {review.user.avatar?.photoSrc ? (
                            <Image
                                alt={review.user.userName}
                                height={50}
                                width={50}
                                style={{
                                    borderRadius: 20,
                                }}
                                src={review.user.avatar?.photoSrc}
                            />
                        ) : (
                            <PersonOutlinedIcon
                                sx={{
                                    fontSize: 24,
                                    mr: 1,
                                    color: theme.vars.palette.secondary.main,
                                }}
                            />
                        )}
                        <Typography
                            variant="h6"
                            sx={{
                                color:
                                    review.user.userName === session?.user?.userName
                                        ? theme.vars.palette.blue.main
                                        : theme.vars.palette.primary.main,
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
                                    color: review.isUpvoted
                                        ? theme.vars.palette.green.main
                                        : theme.vars.palette.primary.main,
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
                                color: theme.vars.palette.primary.main,
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
                                    color: review.isDownvoted
                                        ? theme.vars.palette.red.main
                                        : theme.vars.palette.primary.main,
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
