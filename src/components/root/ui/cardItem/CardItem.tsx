"use client";

import React, { useState } from "react";
import { Box, Card, Stack, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useParams } from "next/navigation";
import Image from "next/image";
import StarRateIcon from "@mui/icons-material/StarRate";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Link from "next/link";
import { onBookmarkEpisode, onRemoveBookmarkEpisode } from "@/utils/componentHelpers/features/episodeFeaturesUtils";
import { onBookmarkSeason, onRemoveBookmarkSeason } from "@/utils/componentHelpers/features/seasonFeaturesUtils";
import { onBookmarkMovie, onRemoveBookmarkMovie } from "@/utils/componentHelpers/features/movieFeaturesUtils";
import { onBookmarkSerie, onRemoveBookmarkSerie } from "@/utils/componentHelpers/features/serieFeaturesUtils";
import { onBookmarkActor, onRemoveBookmarkActor } from "@/utils/componentHelpers/features/actorFeaturesUtils";
import { useSession } from "next-auth/react";

interface ICardItemProps {
    data: any;
    type?: string;
    path?: string | null;
}

const CardItem = ({ data, type, path }: ICardItemProps): React.JSX.Element => {
    const { data: session } = useSession();

    const [isHovered, setIsHovered] = useState(false);
    const params = useParams();

    const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

    const bookmarkFunctions: any = {
        movie: onBookmarkMovie,
        serie: onBookmarkSerie,
        season: onBookmarkSeason,
        episode: onBookmarkEpisode,
        actor: onBookmarkActor,
    };

    const removeBookmarkFunctions: any = {
        movie: onRemoveBookmarkMovie,
        serie: onRemoveBookmarkSerie,
        season: onRemoveBookmarkSeason,
        episode: onRemoveBookmarkEpisode,
        actor: onRemoveBookmarkActor,
    };

    const handleBookmarkClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        const bookmarkFunc = bookmarkFunctions[type || ""];
        const removeBookmarkFunc = removeBookmarkFunctions[type || ""];

        if (data.isBookmarked) {
            if (removeBookmarkFunc) {
                await removeBookmarkFunc(session, data);
            }
        } else {
            if (bookmarkFunc) {
                await bookmarkFunc(session, data);
            }
        }
    };

    const getPath = () => {
        switch (type) {
            case "serie":
                return `/series/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "movie":
                return `/movies/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "actor":
                if (path && path === "movies") {
                    return `/movies/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
                } else if (path && path === "actors") {
                    return `/actors/${data.id}/${encodeURIComponent(data.fullname.split(" ").join("-"))}`;
                } else {
                    return `/series/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
                }
            case "season":
                return `/series/${typeof params.serieId === "string" ? params.serieId : ""}/${typeof params.serieTitle === "string" ? encodeURIComponent(params.serieTitle.split(" ").join("-")) : ""}/seasons/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "episode":
                return `/series/${typeof params.serieId === "string" ? params.serieId : ""}/${typeof params.serieTitle === "string" ? encodeURIComponent(params.serieTitle.split(" ").join("-")) : ""}/seasons/${typeof params.seasonId === "string" ? params.seasonId : ""}/${typeof params.seasonTitle === "string" ? encodeURIComponent(params.seasonTitle.split(" ").join("-")) : ""}/episodes/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "user":
                return `/users/${data.id}/${encodeURIComponent(data.userName.split(" ").join("-"))}`;
            default:
                return "/";
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if (isTouchDevice && !isHovered) {
            e.preventDefault();
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (isTouchDevice) {
            setIsHovered(false);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={handleCardClick}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={getPath()}>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "200px",
                        cursor: "pointer",
                        height: "auto",
                        width: "100%",
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        "&:hover": {
                            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: "280px",
                            overflow: "hidden",
                            "&:hover .hoverOverlay": {
                                opacity: 1,
                            },
                        }}
                    >
                        <Image src={data.photoSrcProd} alt={`${data.description}`} height={280} width={200} />
                        <Box
                            className="hoverOverlay"
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                top: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                opacity: isHovered ? 1 : 0,
                                transition: "opacity 0.3s ease-in-out",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                padding: 2,
                            }}
                        >
                            <Box>
                                <Typography color="white" sx={{ fontSize: "0.8rem" }}>
                                    {path === "actors"
                                        ? data.fullname + " " + "(" + data.debut + ")"
                                        : path === "users"
                                          ? data.userName
                                          : data.title + " (" + data.dateAired.split("/")[2] + ")"}
                                </Typography>
                                {session?.user?.userName && type !== "user" && (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "start",
                                        }}
                                        onClick={handleBookmarkClick}
                                    >
                                        <Button variant="outlined">
                                            {data.isBookmarked ? (
                                                <BookmarkIcon color={data.isBookmarked ? "error" : "success"} />
                                            ) : (
                                                <BookmarkBorderIcon color={data.isBookmarked ? "error" : "success"} />
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {data.isBookmarked ? "Unbookmark" : "Bookmark"}
                                            </Typography>
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                            {type !== "user" && (
                                <Box>
                                    <Stack
                                        flexDirection={"row"}
                                        columnGap={"40px"}
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        {type !== "actor" && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Image
                                                    src="/icons/imdb.svg"
                                                    alt="IMDb Icon"
                                                    width={14}
                                                    height={14}
                                                    style={{ marginRight: 2 }}
                                                />
                                                {data.ratingImdb !== 0 ? `${data.ratingImdb}` : "N/A"}
                                            </Box>
                                        )}
                                        {type !== "serie" && type !== "season" && type !== "actor" && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <AccessTimeIcon sx={{ color: "gold", mr: 0.5, fontSize: "0.8rem" }} />
                                                <Typography
                                                    color={"white"}
                                                    fontSize="0.8rem"
                                                    component="span"
                                                    width={"30ch"}
                                                >
                                                    {data.duration} min
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                    <Stack
                                        flexDirection={"row"}
                                        columnGap={"40px"}
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                alignContent: "center",
                                                alignSelf: "center",
                                            }}
                                        >
                                            <StarRateIcon sx={{ color: "gold", mr: 0.5, fontSize: "1rem" }} />
                                            <Typography color={"white"} fontSize="0.9rem" component="span">
                                                {data.averageRating ? data.averageRating : "N/A"}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Card>
            </Link>
        </motion.div>
    );
};

export default CardItem;
