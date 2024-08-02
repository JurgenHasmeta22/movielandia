"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Box, Button, Divider, Grid, List, ListItem, Typography, useTheme } from "@mui/material";
import { tokens } from "@/utils/theme/theme";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface IDetailsPageCardProps {
    data: any;
    type: string;
    isMovieBookmarked?: boolean;
    isSerieBookmarked?: boolean;
    isSeasonBookmarked?: boolean;
    isEpisodeBookmarked?: boolean;
    isActorBookmarked?: boolean;
    onBookmarkMovie?(): Promise<void>;
    onRemoveBookmarkMovie?(): Promise<void>;
    onBookmarkSerie?(): Promise<void>;
    onRemoveBookmarkSerie?(): Promise<void>;
    onBookmarkSeason?(): Promise<void>;
    onRemoveBookmarkSeason?(): Promise<void>;
    onBookmarkEpisode?(): Promise<void>;
    onRemoveBookmarkEpisode?(): Promise<void>;
    onBookmarkActor?(): Promise<void>;
    onRemoveBookmarkActor?(): Promise<void>;
}

export function DetailsPageCard({
    data,
    type,
    onBookmarkMovie,
    onBookmarkSerie,
    onBookmarkSeason,
    onBookmarkEpisode,
    onBookmarkActor,
    onRemoveBookmarkMovie,
    onRemoveBookmarkSerie,
    onRemoveBookmarkSeason,
    onRemoveBookmarkEpisode,
    onRemoveBookmarkActor,
    isMovieBookmarked,
    isSerieBookmarked,
    isSeasonBookmarked,
    isEpisodeBookmarked,
    isActorBookmarked,
}: IDetailsPageCardProps) {
    const { data: session } = useSession();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            sx={{
                pt: 8,
                pb: 4,
            }}
            component={"section"}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    columnGap: 6,
                    padding: 4,
                    backgroundColor: `${colors.primary[400]}`,
                }}
            >
                <Image
                    src={data.photoSrcProd}
                    alt={type !== "actor" ? data.title : data.fullname}
                    width={220}
                    height={300}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center", // Centering the content
                    }}
                >
                    <Typography fontSize={[20, 24, 28, 32]} textAlign={"center"} component={"h1"} pt={2}>
                        {data.title}
                    </Typography>
                    <List
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            placeSelf: "center",
                            placeItems: "center",
                            flexWrap: "wrap",
                            rowGap: 3,
                            mt: 1,
                        }}
                    >
                        {data.genres?.map((genre: any, index: number) => (
                            <Box key={index}>
                                <ListItem key={index}>
                                    <Link
                                        href={`/genres/${genre.genre.id}/${genre.genre.name}`}
                                        style={{
                                            textDecoration: "none",
                                        }}
                                    >
                                        <Typography
                                            component={"span"}
                                            sx={{
                                                backgroundColor: colors.primary[100],
                                                color: colors.primary[900],
                                                borderRadius: "20px",
                                                padding: "12px 14px",
                                                fontWeight: "900",
                                                cursor: "pointer",
                                                fontSize: 12,
                                                "&:hover": {
                                                    backgroundColor: colors.greenAccent[500],
                                                },
                                            }}
                                        >
                                            {genre.genre.name}
                                        </Typography>
                                    </Link>
                                </ListItem>
                                {index < data.genres!.length - 1 && (
                                    <Divider orientation="vertical" flexItem color="error" />
                                )}
                            </Box>
                        ))}
                    </List>
                    <Grid
                        container
                        rowGap={1}
                        justifyContent="start"
                        alignContent="center"
                        alignItems="center"
                        pt={2}
                        pb={2}
                    >
                        {type !== "serie" && type !== "season" && type !== "actor" && (
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                display="flex"
                                justifyContent="center"
                                alignContent={"center"}
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <AccessTimeIcon fontSize="medium" />
                                    <Typography component="span">
                                        Duration: {data.duration} min ({Math.floor(data.duration / 60)} hr{" "}
                                        {data.duration % 60} min)
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={12} md={12} display="flex" justifyContent="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <CalendarMonthIcon fontSize="medium" />
                                <Typography component="span">
                                    Date aired: {type !== "actor" ? data.dateAired : data.debut}
                                </Typography>
                            </Box>
                        </Grid>
                        {type !== "actor" && (
                            <Grid item xs={12} sm={12} md={12} display="flex" justifyContent="center">
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Image src="/icons/imdb.svg" alt="IMDb Icon" width={25} height={25} />
                                    <Typography component="span">
                                        Rating IMDb: {data.ratingImdb !== 0 ? `${data.ratingImdb}` : "N/A"}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={12} md={12} display="flex" justifyContent="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <StarRateIcon />
                                <Typography component="span">
                                    Average rating: {data.averageRating === 0 ? "N/A" : data.averageRating}
                                </Typography>
                                <Typography component="span">({data.totalReviews})</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box display={"flex"} justifyContent={"center"} pt={2}>
                        <Typography textAlign={"center"} width={["40ch", "45ch", "50ch", "55ch", "60ch"]}>
                            {data.description}
                        </Typography>
                    </Box>
                    {type !== "actor" && (
                        <Button
                            href={data.trailerSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="text"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                placeSelf: "center",
                                width: "50%",
                                columnGap: 1,
                                marginTop: 3,
                                padding: 1,
                                "&:hover": {
                                    backgroundColor: colors.primary[900],
                                },
                            }}
                        >
                            <YouTubeIcon
                                sx={{
                                    color: colors.primary[100],
                                }}
                            />
                            <Typography
                                component={"span"}
                                color={colors.primary[100]}
                                fontWeight={700}
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Watch Trailer
                            </Typography>
                        </Button>
                    )}
                    {session?.user?.userName && (
                        <Button
                            onClick={async () => {
                                if (type === "movie") {
                                    if (!isMovieBookmarked) {
                                        onBookmarkMovie ? await onBookmarkMovie() : {};
                                    } else {
                                        onRemoveBookmarkMovie ? await onRemoveBookmarkMovie() : {};
                                    }
                                } else if (type === "serie") {
                                    if (!isSerieBookmarked) {
                                        onBookmarkSerie ? await onBookmarkSerie() : {};
                                    } else {
                                        onRemoveBookmarkSerie ? await onRemoveBookmarkSerie() : {};
                                    }
                                } else if (type === "episode") {
                                    if (!isEpisodeBookmarked) {
                                        onBookmarkEpisode ? await onBookmarkEpisode() : {};
                                    } else {
                                        onRemoveBookmarkEpisode ? await onRemoveBookmarkEpisode() : {};
                                    }
                                } else if (type === "actor") {
                                    if (!isActorBookmarked) {
                                        onBookmarkActor ? await onBookmarkActor() : {};
                                    } else {
                                        onRemoveBookmarkActor ? await onRemoveBookmarkActor() : {};
                                    }
                                } else {
                                    if (!isSeasonBookmarked) {
                                        onBookmarkSeason ? await onBookmarkSeason() : {};
                                    } else {
                                        onRemoveBookmarkSeason ? await onRemoveBookmarkSeason() : {};
                                    }
                                }
                            }}
                            variant="text"
                            sx={{
                                display: "flex",
                                placeSelf: "center",
                                width: "50%",
                                columnGap: 1,
                                marginTop: 1,
                                padding: 1,
                                color: colors.primary[100],
                                "&:hover": {
                                    backgroundColor: colors.primary[900],
                                },
                            }}
                        >
                            {(type === "movie" && !isMovieBookmarked) ||
                            (type === "serie" && !isSerieBookmarked) ||
                            (type === "season" && !isSeasonBookmarked) ||
                            (type === "episode" && !isEpisodeBookmarked) ||
                            (type === "actor" && !isActorBookmarked) ? (
                                <BookmarkAddIcon color="success" fontSize="medium" />
                            ) : (
                                <BookmarkRemoveIcon color="error" fontSize="medium" />
                            )}
                            <Typography
                                component="span"
                                sx={{
                                    textTransform: "capitalize",
                                }}
                                fontWeight={700}
                            >
                                {isMovieBookmarked ||
                                isSerieBookmarked ||
                                isSeasonBookmarked ||
                                isEpisodeBookmarked ||
                                isActorBookmarked
                                    ? "Bookmarked"
                                    : "Bookmark"}
                            </Typography>
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default DetailsPageCard;
