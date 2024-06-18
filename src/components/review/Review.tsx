"use client";

import { Avatar, Box, Paper, Typography, IconButton, Rating, Button, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { tokens } from "@/utils/theme";

interface ReviewProps {
    review: {
        id: number;
        content: string;
        createdAt: string;
        updatedAt: string;
        rating: number;
        upvotes: any[];
        downvotes: any[];
        _count: {
            upvotes: number;
            downvotes: number;
        };
        user: {
            userName: string;
            avatar: string;
        };
    };
    type: string;
    data: any;
}

const Review = ({ review }: ReviewProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getRatingLabelAndColor = (rating: number) => {
        if (rating <= 2) {
            return { label: "Very Bad", color: "red" };
        }

        if (rating <= 4) {
            return { label: "Bad", color: "orange" };
        }

        if (rating <= 6) {
            return { label: "Average", color: "yellow" };
        }

        if (rating <= 8) {
            return { label: "Good", color: "green" };
        }

        return { label: "Very Good", color: "green" };
    };

    const { label, color } = getRatingLabelAndColor(review.rating);

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar alt={review.user.userName} src={review.user.avatar} />
                    <Typography variant="h6">{review.user.userName}</Typography>
                    <Typography component="span" paddingLeft={1}>
                        - You
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                        {review.updatedAt ? "Edited" : format(new Date(review.createdAt), "MMMM dd, yyyy HH:mm")}
                    </Typography>
                    <IconButton size="medium">
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </Box>
            </Box>
            <Box dangerouslySetInnerHTML={{ __html: review.content }} sx={{ wordWrap: "break-word" }} />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                <Typography variant="body2" sx={{ mr: 1, color }}>
                    {label}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        {review?.rating?.toFixed(1)}
                    </Typography>
                    <Rating
                        name={`review-rating-${review.id}`}
                        value={review.rating}
                        readOnly
                        max={10}
                        precision={0.5}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1, columnGap: 4 }}>
                <Box display={"flex"} alignItems={"center"} columnGap={1}>
                    <motion.div whileTap={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                        <IconButton size="medium">
                            <ThumbUpIcon fontSize="medium" />
                        </IconButton>
                    </motion.div>
                    <Button
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
                    <motion.div whileTap={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                        <IconButton size="medium">
                            <ThumbDownIcon fontSize="medium" />
                        </IconButton>
                    </motion.div>
                    <Button
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
};

export default Review;
