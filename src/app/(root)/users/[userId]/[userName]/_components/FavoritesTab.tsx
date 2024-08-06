"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "@/utils/theme/theme";
import ClearIcon from "@mui/icons-material/Clear";
import { Actor, Episode, Movie, Season, Serie } from "@prisma/client";
import {
    removeFavoriteActorToUser,
    removeFavoriteEpisodeToUser,
    removeFavoriteMovieToUser,
    removeFavoriteSeasonToUser,
    removeFavoriteSerieToUser,
} from "@/lib/actions/user.actions";
import Image from "next/image";
import { showToast } from "@/lib/toast/toast";
import Link from "next/link";

interface FavoritesTabProps {
    type: string;
    user: any | null;
}

export default function FavoritesTab({ type, user }: FavoritesTabProps) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    let favorites;

    switch (type) {
        case "Movies":
            favorites = user?.favMovies;
            break;
        case "Series":
            favorites = user?.favSeries;
            break;
        case "Actors":
            favorites = user?.favActors;
            break;
        case "Seasons":
            favorites = user?.favSeasons;
            break;
        case "Episodes":
            favorites = user?.favEpisodes;
            break;
        default:
            favorites = [];
            break;
    }

    // #region "Remvoing bookmark serie, season, episode, actor"
    async function onRemoveBookmarkMovie(movie: Movie) {
        if (!user || !movie) return;

        try {
            await removeFavoriteMovieToUser(user?.id, movie?.id, "/profile?tab=favMovies");
            showToast("success", "Movie unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }

    async function onRemoveBookmarkSerie(serie: Serie) {
        if (!user || !serie) return;

        try {
            await removeFavoriteSerieToUser(user.id, serie.id, "/profile?tab=favSeries");
            showToast("success", "Serie unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }

    async function onRemoveBookmarkSeason(season: Season) {
        if (!user || !season) return;

        try {
            await removeFavoriteSeasonToUser(user?.id, season?.id, "/profile?tab=favSeason");
            showToast("success", "Season unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }

    async function onRemoveBookmarkEpisode(episode: Episode) {
        if (!user || !episode) return;

        try {
            await removeFavoriteEpisodeToUser(user?.id, episode?.id, "/profile?tab=favEpisodes");
            showToast("success", "Episode unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }

    async function onRemoveBookmarkActor(actor: Actor) {
        if (!user || !actor) return;

        try {
            await removeFavoriteActorToUser(user?.id, actor?.id, "/profile?tab=favActors");
            showToast("success", "Actor unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }
    // #endregion

    function getItemUrl(favItem: any) {
        let urlPath;
        let formattedTitle;

        switch (type) {
            case "Movies":
                urlPath = "movies";
                formattedTitle = favItem.movie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                break;
            case "Series":
                urlPath = "series";
                formattedTitle = favItem.serie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                break;
            case "Actors":
                urlPath = "actors";
                formattedTitle = favItem.actor.fullname
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                break;
            case "Seasons":
                urlPath = "seasons";
                formattedTitle = favItem.season.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                break;
            case "Episodes":
                urlPath = "episodes";
                formattedTitle = favItem.episode.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                break;
            default:
                console.warn("Unknown type:", type);
                return;
        }

        return `/${urlPath}/${favItem.id}/${formattedTitle}`;
    }

    return (
        <Box component="section" minHeight={`${favorites.length > 0 ? "auto" : "70vh"}`} padding={4}>
            <Typography variant="h4" color={colors.primary[100]} mb={4}>
                Bookmarked {type}
            </Typography>
            <Stack flexDirection="row" flexWrap="wrap" columnGap={3} rowGap={3} justifyContent="start">
                {favorites.map((favItem: any, index: number) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ position: "relative", width: 150, borderRadius: "8px", overflow: "hidden" }}
                    >
                        <Link href={getItemUrl(favItem)!} style={{ textDecoration: "none" }}>
                            <Box sx={{ position: "relative", overflow: "hidden" }}>
                                <Image
                                    src={
                                        type === "Movies"
                                            ? favItem.movie.photoSrcProd
                                            : type === "Series"
                                              ? favItem.serie.photoSrcProd
                                              : type === "Actors"
                                                ? favItem.actor.photoSrcProd
                                                : type === "Seasons"
                                                  ? favItem.season.photoSrcProd
                                                  : favItem.episode.photoSrcProd
                                    }
                                    alt={
                                        type === "Movies"
                                            ? favItem.movie.title
                                            : type === "Series"
                                              ? favItem.serie.title
                                              : type === "Actors"
                                                ? favItem.actor.fullname
                                                : type === "Seasons"
                                                  ? favItem.season.title
                                                  : favItem.episode.title
                                    }
                                    layout="responsive"
                                    height={200}
                                    width={150}
                                    style={{ borderRadius: "8px" }}
                                />
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        color: colors.primary[100],
                                        mt: 1,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {type === "Movies"
                                        ? favItem.movie.title
                                        : type === "Series"
                                          ? favItem.serie.title
                                          : type === "Actors"
                                            ? favItem.actor.fullname
                                            : type === "Seasons"
                                              ? favItem.season.title
                                              : favItem.episode.title}
                                </Typography>
                            </Box>
                        </Link>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                padding: "4px",
                                cursor: "pointer",
                                backgroundColor: colors.primary[200],
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                switch (type) {
                                    case "Movies":
                                        await onRemoveBookmarkMovie(favItem.movie);
                                        break;
                                    case "Series":
                                        await onRemoveBookmarkSerie(favItem.serie);
                                        break;
                                    case "Actors":
                                        await onRemoveBookmarkActor(favItem.actor);
                                        break;
                                    case "Seasons":
                                        await onRemoveBookmarkSeason(favItem.season);
                                        break;
                                    case "Episodes":
                                        await onRemoveBookmarkEpisode(favItem.episode);
                                        break;
                                    default:
                                        console.warn("Unknown type:", type);
                                        break;
                                }
                            }}
                        >
                            <ClearIcon sx={{ color: colors.primary[900] }} />
                        </Box>
                    </motion.div>
                ))}
            </Stack>
        </Box>
    );
}
