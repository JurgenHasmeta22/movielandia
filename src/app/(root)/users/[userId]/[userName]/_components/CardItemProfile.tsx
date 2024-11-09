"use client";

import React from "react";
import { motion } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, useTheme } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie } from "@prisma/client";
import {
    removeFavoriteActorToUser,
    removeFavoriteCrewToUser,
    removeFavoriteEpisodeToUser,
    removeFavoriteMovieToUser,
    removeFavoriteSeasonToUser,
    removeFavoriteSerieToUser,
} from "@/actions/user.actions";
import { showToast } from "@/utils/helpers/toast";

interface CardItemProfileProps {
    favItem: any;
    type: string;
    getItemUrl(favItem: any): string | undefined;
    userLoggedIn?: any;
    userInPage?: any;
}

const CardItemProfile: React.FC<CardItemProfileProps> = ({
    favItem,
    type,
    userLoggedIn,
    getItemUrl,
    userInPage,
}: CardItemProfileProps) => {
    const theme = useTheme();

    // #region "Remvoing bookmark"
    async function onRemoveBookmarkMovie(movie: Movie) {
        if (!userLoggedIn || !movie) return;

        try {
            await removeFavoriteMovieToUser(
                Number(userLoggedIn?.id),
                movie?.id,
                `/users/${Number(userLoggedIn.id)}/${userLoggedIn.userName}?tab=favMovies`,
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
                `/users/${Number(userLoggedIn.id)}/${userLoggedIn.userName}?tab=favSeries`,
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
                Number(userLoggedIn?.id),
                season?.id,
                `/users/${Number(userLoggedIn.id)}/${userLoggedIn.userName}?tab=favSeason`,
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
                Number(userLoggedIn?.id),
                episode?.id,
                `/users/${Number(userLoggedIn.id)}/${userLoggedIn.userName}?tab=favEpisodes`,
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
                Number(userLoggedIn?.id),
                actor?.id,
                `/users/${Number(userLoggedIn.id)}/${userLoggedIn.userName}?tab=favActors`,
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
                Number(userLoggedIn?.id),
                crew?.id,
                `/users/${Number(userLoggedIn.id)}/${userLoggedIn.userName}?tab=favCrew`,
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

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ position: "relative", width: 113, borderRadius: "8px", overflow: "hidden" }}
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
                                    : type === "Crew"
                                      ? favItem.crew.photoSrcProd
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
                                    : type === "Crew"
                                      ? favItem.crew.fullname
                                      : type === "Seasons"
                                        ? favItem.season.title
                                        : favItem.episode.title
                        }
                        height={150}
                        width={113}
                        style={{ borderRadius: "8px" }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            color: theme.vars.palette.primary.main,
                            mt: 1,
                            textAlign: "center",
                        }}
                    >
                        {type === "Movies"
                            ? favItem.movie.title
                            : type === "Series"
                              ? favItem.serie.title
                              : type === "Actors"
                                ? favItem.actor.fullname
                                : type === "Crew"
                                  ? favItem.crew.fullname
                                  : type === "Seasons"
                                    ? favItem.season.title
                                    : favItem.episode.title}
                    </Typography>
                </Box>
            </Link>
            {Number(userLoggedIn.id) === userInPage.id && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        padding: "4px",
                        cursor: "pointer",
                        backgroundColor: theme.vars.palette.primary.light,
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
                            case "Crew":
                                await onRemoveBookmarkCrew(favItem.crew);
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
                    <ClearIcon sx={{ color: theme.vars.palette.primary.dark }} fontSize="small" />
                </Box>
            )}
        </motion.div>
    );
};

export default CardItemProfile;
