"use client";

import React, { useTransition } from "react";
import { Box, Typography, Chip, Button, useTheme, CircularProgress } from "@mui/material";
import { AccessTime, CalendarToday, Star, YouTube } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { formatDate } from "@/utils/helpers/utils";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface IDetailsPageCardProps {
    data: any;
    type: string;
    isBookmarked: boolean;
    onBookmark: () => Promise<void>;
    onRemoveBookmark: () => Promise<void>;
    onGoBack?: () => void;
}

export function DetailsPageCard({
    data,
    type,
    isBookmarked,
    onBookmark,
    onRemoveBookmark,
    onGoBack,
}: IDetailsPageCardProps) {
    const { data: session } = useSession();

    const theme = useTheme();
    const [isPending, startTransition] = useTransition();

    const handleBookmarkAction = () => {
        if (!session?.user || !data) return;

        startTransition(async () => {
            if (isBookmarked) {
                await onRemoveBookmark();
            } else {
                await onBookmark();
            }
        });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.vars.palette.secondary.light,
                color: theme.vars.palette.primary.main,
                width: "100%",
                maxWidth: "1200px",
                margin: "auto",
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 6,
                mt: 10,
            }}
        >
            {(type === "season" || type === "episode") && (
                <Button
                    variant="outlined"
                    onClick={onGoBack}
                    sx={{ mb: 2, display: "flex", alignItems: "center", width: "fit-content" }}
                >
                    <ArrowBackIcon sx={{ mr: 1 }} />
                    Go Back
                </Button>
            )}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 3 }}>
                <Box
                    sx={{
                        flexShrink: 0,
                        width: { xs: "100%", md: "100%" },
                        maxWidth: "214px",
                        height: { xs: "300px", md: "317px" },
                        position: "relative",
                        alignSelf: "center",
                    }}
                >
                    <Image
                        src={data.photoSrcProd}
                        alt={type !== "actor" && type !== "crew" ? data.title : data.fullname}
                        height={317}
                        width={214}
                        priority
                    />
                </Box>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        fontWeight="bold"
                        color={theme.vars.palette.primary.main}
                    >
                        {type !== "actor" && type !== "crew" ? data.title : data.fullname}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {data.genres?.map((genre: any, index: number) => (
                            <Link key={index} href={`/genres/${genre.genre.id}/${genre.genre.name}`} passHref>
                                <Chip
                                    label={genre.genre.name}
                                    clickable
                                    sx={{
                                        bgcolor: theme.vars.palette.secondary.light,
                                        color: theme.vars.palette.red.main,
                                        textDecoration: "none",
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            bgcolor: theme.vars.palette.blue.light,
                                        },
                                    }}
                                />
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
                        {type !== "season" && type !== "serie" && type !== "actor" && type !== "crew" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTime fontSize="small" />
                                <Typography variant="body1">Duration: {data.duration} mins</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" />
                            <Typography variant="body1">
                                {type !== "actor" && type !== "crew"
                                    ? `Aired on: ${formatDate(data.dateAired)}`
                                    : `Debut year: ${data.debut}`}
                            </Typography>
                        </Box>
                        {type !== "actor" && type !== "crew" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Star fontSize="small" />
                                <Typography variant="body1">Imdb rating: {data.ratingImdb}</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StarRateIcon />
                            <Typography component="span" variant="body1">
                                Average rating: {data.averageRating === 0 ? "N/A" : data.averageRating.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" color={theme.vars.palette.primary.light}>
                        {data.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {type !== "actor" && (
                            <Button
                                variant="contained"
                                startIcon={<YouTube />}
                                href={data.trailerSrc}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: theme.vars.palette.red.main,
                                    color: theme.vars.palette.primary.main,
                                    "&:hover": {
                                        bgcolor: theme.vars.palette.secondary.light,
                                    },
                                    textTransform: "capitalize",
                                    fontSize: 16,
                                }}
                            >
                                Watch trailer
                            </Button>
                        )}
                        {session?.user?.userName && (
                            <Button
                                variant="contained"
                                onClick={handleBookmarkAction}
                                disabled={isPending}
                                startIcon={
                                    isPending ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : isBookmarked ? (
                                        <BookmarkIcon color="error" />
                                    ) : (
                                        <BookmarkBorderIcon color="success" />
                                    )
                                }
                                sx={{
                                    color: theme.vars.palette.primary.main,
                                    bgcolor: isBookmarked ? theme.vars.palette.red.main : theme.vars.palette.green.main,
                                    "&:hover": {
                                        bgcolor: theme.vars.palette.secondary.light,
                                    },
                                    "&:disabled": {
                                        bgcolor: isBookmarked
                                            ? theme.vars.palette.red.main
                                            : theme.vars.palette.green.main,
                                        opacity: 0.7,
                                    },
                                    textTransform: "capitalize",
                                    fontSize: 16,
                                    minWidth: 130,
                                }}
                            >
                                {isBookmarked ? "Bookmarked" : "Bookmark"}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default DetailsPageCard;
