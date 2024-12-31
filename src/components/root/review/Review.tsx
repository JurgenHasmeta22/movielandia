"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";
import { Box, Paper, Typography, IconButton, useTheme, Rating, Button } from "@mui/material";
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
            sx={{
                p: 3,
                mt: 2,
                mx: 3,
                backgroundColor:
                    review.user.id === Number(session?.user?.id)
                        ? theme.vars.palette.blue.dark
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
                                color: theme.vars.palette.primary.main,
                            }}
                        />
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            color:
                                review.user.id === Number(session?.user?.id)
                                    ? theme.vars.palette.blue.main
                                    : theme.vars.palette.primary.main,
                            fontWeight: review.user.id === Number(session?.user?.id) ? 900 : 300,
                            letterSpacing: 1,
                        }}
                    >
                        {review.user.userName}
                    </Typography>
                    {review.user.id === Number(session?.user?.id) && (
                        <Typography component={"span"} paddingLeft={1} color="primary">
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
                    <Typography variant="body1" sx={{ display: "flex", flexWrap: "wrap" }}>
                        {review.updatedAt && (
                            <Typography component={"span"} color="primary">
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
                    {review.user.id === Number(session?.user?.id) && !isEditMode && (
                        <IconButton
                            size="medium"
                            color="success"
                            onClick={() => {
                                setIsEditMode(true);
                                setReview(review.content);
                                setRating(review.rating);
                            }}
                        >
                            <EditIcon fontSize="medium" />
                        </IconButton>
                    )}
                    {review.user.id === Number(session?.user?.id) && !isEditMode && (
                        <Box ref={ref} tabIndex={-1}>
                            <IconButton size="medium" color="error" onClick={() => handleRemoveReview()}>
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
                    <Typography variant="body1" fontSize={19} fontWeight={900} sx={{ mr: 1, color, letterSpacing: 2 }}>
                        {label}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating
                        name={`review-rating-${review.id}`}
                        value={review?.rating}
                        readOnly
                        max={10}
                        precision={0.5}
                    />
                    <Typography variant="body2" fontSize={14} fontWeight={700} sx={{ ml: 1 }}>
                        {review?.rating ? review?.rating?.toFixed(1) : "0.0"}
                    </Typography>
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
                <Box display={"flex"} alignItems={"center"}>
                    <motion.div
                        whileTap={{ scale: 1 }}
                        animate={isClickedUpvote ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <IconButton
                            size="medium"
                            disabled={session?.user && review.user.id !== Number(session?.user?.id) ? false : true}
                            onClick={async () => {
                                handleClickUpVoteReview();
                            }}
                            sx={{
                                color: review.isUpvoted
                                    ? theme.vars.palette.green.main
                                    : theme.vars.palette.primary.main,
                                pr: 0.5,
                            }}
                        >
                            <ThumbUpIcon fontSize="medium" />
                        </IconButton>
                    </motion.div>
                    <Button
                        disabled={review._count.upvotes === 0}
                        onClick={() => {
                            if (review._count.upvotes > 0) {
                                router.push(`${pathname}/reviews/${review.id}/upvotes`);
                            }
                        }}
                        sx={{
                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: review._count.upvotes > 0 ? "underline" : "none",
                            },
                            color: theme.vars.palette.primary.main,
                            p: 0,
                            minWidth: "auto",
                            ml: 1,
                            cursor: review._count.upvotes > 0 ? "pointer" : "default",
                        }}
                    >
                        <Typography>{review._count.upvotes}</Typography>
                    </Button>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <motion.div
                        whileTap={{ scale: 1 }}
                        animate={isClickedDownvote ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <IconButton
                            size="medium"
                            disabled={session?.user && review.user.id !== Number(session?.user?.id) ? false : true}
                            onClick={async () => {
                                handleClickDownVoteReview();
                            }}
                            sx={{
                                color: review.isDownvoted
                                    ? theme.vars.palette.red.main
                                    : theme.vars.palette.primary.main,
                                pr: 0.5,
                            }}
                        >
                            <ThumbDownIcon fontSize="medium" />
                        </IconButton>
                    </motion.div>
                    <Button
                        disabled={review._count.downvotes === 0}
                        onClick={() => {
                            if (review._count.downvotes > 0) {
                                router.push(`${pathname}/reviews/${review.id}/downvotes`);
                            }
                        }}
                        sx={{
                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: review._count.downvotes > 0 ? "underline" : "none",
                            },
                            color: theme.vars.palette.primary.main,
                            p: 0,
                            minWidth: "auto",
                            ml: 1,
                            cursor: review._count.downvotes > 0 ? "pointer" : "default",
                        }}
                    >
                        <Typography>{review._count.downvotes}</Typography>
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default Review;
