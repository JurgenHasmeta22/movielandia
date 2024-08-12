import React from "react";
import { Box, Typography, Chip, Button, useTheme, CssVarsTheme } from "@mui/material";
import { AccessTime, CalendarToday, Star, YouTube } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { formatDate } from "@/utils/helpers/utils";

interface IDetailsPageCardProps {
    data: any;
    type: string;
    isBookmarked: boolean;
    onBookmark: () => Promise<void>;
    onRemoveBookmark?: () => Promise<void>;
}

export function DetailsPageCard({ data, type, isBookmarked, onBookmark, onRemoveBookmark }: IDetailsPageCardProps) {
    const { data: session } = useSession();

    const theme: CssVarsTheme = useTheme();

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
                        alt={type !== "actor" ? data.title : data.fullname}
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
                        {type !== "actor" ? data.title : data.fullname}
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
                        {type !== "season" && type !== "serie" && type !== "actor" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTime fontSize="small" />
                                <Typography variant="body1">Duration: {data.duration} mins</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" />
                            <Typography variant="body1">
                                {type !== "actor"
                                    ? `Aired on: ${formatDate(data.dateAired)}`
                                    : `Debut year: ${data.debut}`}
                            </Typography>
                        </Box>
                        {type !== "actor" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Star fontSize="small" />
                                <Typography variant="body1">Imdb rating: {data.ratingImdb}</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StarRateIcon />
                            <Typography component="span" variant="body1">
                                Average rating: {data.averageRating === 0 ? "N/A" : data.averageRating}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" paragraph color={theme.vars.palette.primary.light}>
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
                                        bgcolor: theme.vars.palette.red.main,
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
                                variant="outlined"
                                onClick={isBookmarked ? onRemoveBookmark : onBookmark}
                                sx={{
                                    color: theme.vars.palette.primary.light,
                                    bgcolor: isBookmarked ? theme.vars.palette.red.main : theme.vars.palette.green.main,
                                    "&:hover": {
                                        bgcolor: theme.vars.palette.secondary.light,
                                    },
                                    textTransform: "capitalize",
                                    fontSize: 16,
                                    fontWeight: 700,
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
