"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import YouTubeIcon from "@mui/icons-material/YouTube";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Box, Button, Divider, List, ListItem, Typography, useTheme } from "@mui/material";
import { tokens } from "@/utils/theme/theme";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface IDetailsPageCardProps {
    data: any;
    type: string;
    isMovieBookmarked?: boolean;
    isSerieBookmarked?: boolean;
    onBookmarkMovie?(): Promise<void>;
    onRemoveBookmarkMovie?(): Promise<void>;
    onBookmarkSerie?(): Promise<void>;
    onRemoveBookmarkSerie?(): Promise<void>;
}

export function DetailsPageCard({
    data,
    type,
    onBookmarkMovie,
    onBookmarkSerie,
    onRemoveBookmarkMovie,
    onRemoveBookmarkSerie,
    isMovieBookmarked,
    isSerieBookmarked,
}: IDetailsPageCardProps) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { data: session } = useSession();

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
                <Image src={data.photoSrc} alt={data.title} width={220} height={300} />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography fontSize={[20, 24, 28, 32]} textAlign={"center"} component={"h1"}>
                        {data.title}
                    </Typography>
                    <List
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            placeSelf: "center",
                            placeItems: "center",
                            mt: 1,
                        }}
                    >
                        {data.genres?.map((genre: any, index: number) => (
                            <Box key={index}>
                                <ListItem key={index}>
                                    <Link
                                        href={`/genres/${genre.genre.name}`}
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
                    <List
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            placeSelf: "center",
                        }}
                    >
                        {type === "movie" && (
                            <ListItem>
                                <AccessTimeIcon fontSize="medium" />
                                <Typography component={"span"} width={"8ch"} paddingLeft={1}>
                                    {/* @ts-expect-error jooho */}
                                    {data.duration}
                                </Typography>
                            </ListItem>
                        )}
                        <ListItem>
                            <CalendarMonthIcon fontSize="medium" />
                            <Typography component={"span"} paddingLeft={1}>
                                {data.releaseYear}
                            </Typography>
                        </ListItem>
                        <ListItem
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 0.5,
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection="row"
                                columnGap={0.5}
                                alignItems={"center"}
                                justifyContent={"start"}
                            >
                                <Image src="/icons/imdb.svg" alt="IMDb Icon" width={25} height={25} />
                                <Typography fontSize={12} component="span">
                                    {data.ratingImdb !== 0 ? `${data.ratingImdb}` : "N/A"}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                columnGap: 0.5,
                            }}
                        >
                            <Box
                                display="flex"
                                flexDirection="row"
                                columnGap={0.5}
                                alignItems={"center"}
                                justifyContent={"start"}
                            >
                                <StarRateIcon />
                                <Typography fontSize={16} component="span">
                                    {data.averageRating === 0 ? "N/A" : data.averageRating}
                                </Typography>
                                <Typography fontSize={16} component="span">
                                    ({data.totalReviews})
                                </Typography>
                            </Box>
                        </ListItem>
                    </List>
                    <Typography textAlign={"center"} width={["45ch", "50ch", "55ch", "60ch"]}>
                        {data.description}
                    </Typography>
                    <Button
                        href={data.trailerSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="text"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            placeSelf: "center",
                            width: "30%",
                            columnGap: 1,
                            marginTop: 3,
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
                    {session?.user?.userName && (
                        <Button
                            onClick={async () => {
                                if (type === "movie") {
                                    if (!isMovieBookmarked) {
                                        onBookmarkMovie ? await onBookmarkMovie() : {};
                                    } else {
                                        onRemoveBookmarkMovie ? await onRemoveBookmarkMovie() : {};
                                    }
                                } else {
                                    if (!isSerieBookmarked) {
                                        onBookmarkSerie ? await onBookmarkSerie() : {};
                                    } else {
                                        onRemoveBookmarkSerie ? await onRemoveBookmarkSerie() : {};
                                    }
                                }
                            }}
                            variant="text"
                            sx={{
                                display: "flex",
                                placeSelf: "center",
                                width: "30%",
                                columnGap: 1,
                                marginTop: 1,
                                color: colors.primary[100],
                                "&:hover": {
                                    backgroundColor: colors.primary[900],
                                },
                            }}
                        >
                            {(type === "movie" && !isMovieBookmarked) || (type === "serie" && !isSerieBookmarked) ? (
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
                                {isMovieBookmarked || isSerieBookmarked ? "Bookmarked" : "Bookmark"}
                            </Typography>
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default DetailsPageCard;
