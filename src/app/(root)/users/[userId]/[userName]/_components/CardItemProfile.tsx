"use client";

import React from "react";
import { motion } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import Image from "next/image";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import { showToast } from "@/utils/helpers/toast";
import {
    removeFavoriteMovieToUser,
    removeFavoriteSerieToUser,
    removeFavoriteSeasonToUser,
    removeFavoriteEpisodeToUser,
    removeFavoriteActorToUser,
    removeFavoriteCrewToUser,
} from "@/actions/user/userBookmarks.actions";

export type FavoriteType = "Movies" | "Series" | "Actors" | "Crew" | "Seasons" | "Episodes";

interface FavoriteMovie {
    id: number;
    movie: Movie;
}

interface FavoriteSerie {
    id: number;
    serie: Serie;
}

interface FavoriteActor {
    id: number;
    actor: Actor;
}

interface FavoriteCrew {
    id: number;
    crew: Crew;
}

interface FavoriteSeason {
    id: number;
    season: Season;
}

interface FavoriteEpisode {
    id: number;
    episode: Episode;
}

type FavoriteItem = FavoriteMovie | FavoriteSerie | FavoriteActor | FavoriteCrew | FavoriteSeason | FavoriteEpisode;

interface CardItemProfileProps {
    favItem: FavoriteItem;
    type: FavoriteType;
    getItemUrl: (favItem: FavoriteItem) => string | undefined;
    userLoggedIn: User | null;
    userInPage: User | null;
}

const CardItemProfile: React.FC<CardItemProfileProps> = ({ favItem, type, userLoggedIn, getItemUrl, userInPage }) => {
    const theme = useTheme();

    // #region "Removing bookmark"
    async function onRemoveBookmarkMovie(movie: Movie) {
        if (!userLoggedIn || !movie) return;

        try {
            await removeFavoriteMovieToUser(
                Number(userLoggedIn.id),
                movie.id,
                `/users/${userLoggedIn.id}/${userLoggedIn.userName}?tab=favMovies`,
            );

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
        if (!userLoggedIn || !serie) return;

        try {
            await removeFavoriteSerieToUser(
                Number(userLoggedIn.id),
                serie.id,
                `/users/${userLoggedIn.id}/${userLoggedIn.userName}?tab=favSeries`,
            );

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
        if (!userLoggedIn || !season) return;

        try {
            await removeFavoriteSeasonToUser(
                Number(userLoggedIn.id),
                season.id,
                `/users/${userLoggedIn.id}/${userLoggedIn.userName}?tab=favSeason`,
            );

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
        if (!userLoggedIn || !episode) return;

        try {
            await removeFavoriteEpisodeToUser(
                Number(userLoggedIn.id),
                episode.id,
                `/users/${userLoggedIn.id}/${userLoggedIn.userName}?tab=favEpisodes`,
            );

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
        if (!userLoggedIn || !actor) return;

        try {
            await removeFavoriteActorToUser(
                Number(userLoggedIn.id),
                actor.id,
                `/users/${userLoggedIn.id}/${userLoggedIn.userName}?tab=favActors`,
            );

            showToast("success", "Actor unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }

    async function onRemoveBookmarkCrew(crew: Crew) {
        if (!userLoggedIn || !crew) return;

        try {
            await removeFavoriteCrewToUser(
                Number(userLoggedIn.id),
                crew.id,
                `/users/${userLoggedIn.id}/${userLoggedIn.userName}?tab=favCrew`,
            );

            showToast("success", "Crew unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while removing the bookmark");
            }
        }
    }
    // #endregion

    const getPhotoSrc = () => {
        switch (type) {
            case "Movies":
                return (favItem as FavoriteMovie).movie.photoSrcProd;
            case "Series":
                return (favItem as FavoriteSerie).serie.photoSrcProd;
            case "Actors":
                return (favItem as FavoriteActor).actor.photoSrcProd;
            case "Crew":
                return (favItem as FavoriteCrew).crew.photoSrcProd;
            case "Seasons":
                return (favItem as FavoriteSeason).season.photoSrcProd;
            case "Episodes":
                return (favItem as FavoriteEpisode).episode.photoSrcProd;
            default:
                return "";
        }
    };

    const getTitle = () => {
        switch (type) {
            case "Movies":
                return (favItem as FavoriteMovie).movie.title;
            case "Series":
                return (favItem as FavoriteSerie).serie.title;
            case "Actors":
                return (favItem as FavoriteActor).actor.fullname;
            case "Crew":
                return (favItem as FavoriteCrew).crew.fullname;
            case "Seasons":
                return (favItem as FavoriteSeason).season.title;
            case "Episodes":
                return (favItem as FavoriteEpisode).episode.title;
            default:
                return "";
        }
    };

    const handleRemoveBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        switch (type) {
            case "Movies":
                await onRemoveBookmarkMovie((favItem as FavoriteMovie).movie);
                break;
            case "Series":
                await onRemoveBookmarkSerie((favItem as FavoriteSerie).serie);
                break;
            case "Actors":
                await onRemoveBookmarkActor((favItem as FavoriteActor).actor);
                break;
            case "Crew":
                await onRemoveBookmarkCrew((favItem as FavoriteCrew).crew);
                break;
            case "Seasons":
                await onRemoveBookmarkSeason((favItem as FavoriteSeason).season);
                break;
            case "Episodes":
                await onRemoveBookmarkEpisode((favItem as FavoriteEpisode).episode);
                break;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ position: "relative", width: 113, borderRadius: "8px", overflow: "hidden" }}
        >
            <Link href={getItemUrl(favItem)!} style={{ textDecoration: "none" }}>
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <Image
                        src={getPhotoSrc()}
                        alt={getTitle()}
                        height={150}
                        width={113}
                        style={{
                            borderRadius: "8px",
                            objectFit: "cover",
                            transition: "transform 0.2s ease-in-out",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                            opacity: 0,
                            transition: "opacity 0.2s ease-in-out",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: 1,
                            "&:hover": {
                                opacity: 1,
                            },
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: "white",
                                fontWeight: 600,
                                textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {getTitle()}
                        </Typography>
                    </Box>
                </Box>
            </Link>
            {userLoggedIn?.id === userInPage?.id && (
                <IconButton
                    onClick={handleRemoveBookmark}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: theme.vars.palette.error.main,
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                        },
                    }}
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
            )}
        </motion.div>
    );
};

export default CardItemProfile;
