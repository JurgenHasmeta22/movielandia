import React from "react";
import { Box, Typography, Chip, Button, useTheme, useMediaQuery } from "@mui/material";
import { AccessTime, CalendarToday, Star, YouTube } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { tokens } from "@/utils/theme/theme";
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

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: colors.primary[400],
                color: colors.primary[100],
                width: "100%",
                maxWidth: "1200px",
                margin: "auto",
                p: { xs: 1, sm: 2, md: 4 },
                borderRadius: 6,
                mt: 10,
            }}
        >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 3 }}>
                <Box
                    sx={{
                        flexShrink: 0,
                        width: { xs: "100%", md: "100%" },
                        maxWidth: "220px",
                        height: { xs: "300px", md: "315px" },
                        position: "relative",
                        alignSelf: "center",
                    }}
                >
                    <Image
                        src={data.photoSrcProd}
                        alt={type !== "actor" ? data.title : data.fullname}
                        fill
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                </Box>
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color={colors.primary[100]}>
                        {type !== "actor" ? data.title : data.fullname}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {data.genres?.map((genre: any, index: number) => (
                            <Link key={index} href={`/genres/${genre.genre.id}/${genre.genre.name}`} passHref>
                                <Chip
                                    label={genre.genre.name}
                                    component="a"
                                    clickable
                                    sx={{
                                        bgcolor: colors.primary[600],
                                        color: colors.primary[100],
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            bgcolor: colors.greenAccent[500],
                                        },
                                    }}
                                />
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
                        {type !== "season" && type !== "serie" && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTime fontSize="small" />
                                <Typography variant="body1">Duration: {data.duration} mins</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" />
                            <Typography variant="body1">Aired on : {formatDate(data.dateAired)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Star fontSize="small" />
                            <Typography variant="body1">Imdb rating: {data.ratingImdb}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <StarRateIcon />
                            <Typography component="span" variant="body1">
                                Average rating: {data.averageRating === 0 ? "N/A" : data.averageRating}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" paragraph color={colors.primary[200]}>
                        {data.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Button
                            variant="contained"
                            startIcon={<YouTube />}
                            href={data.trailerSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            fullWidth={isMobile}
                            sx={{
                                bgcolor: colors.redAccent[500],
                                color: colors.primary[100],
                                "&:hover": {
                                    bgcolor: colors.redAccent[900],
                                },
                                textTransform: "capitalize",
                                fontSize: 16,
                            }}
                        >
                            Watch trailer
                        </Button>
                        {session?.user?.userName && (
                            <Button
                                variant="outlined"
                                onClick={isBookmarked ? onRemoveBookmark : onBookmark}
                                fullWidth={isMobile}
                                sx={{
                                    color: colors.primary[100],
                                    bgcolor: isBookmarked ? colors.redAccent[500] : colors.greenAccent[500],
                                    "&:hover": {
                                        bgcolor: colors.redAccent[900],
                                    },
                                    textTransform: "capitalize",
                                    fontSize: 16,
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
