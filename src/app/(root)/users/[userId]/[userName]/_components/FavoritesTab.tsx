"use client";

import { Box, Grid, Typography, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { motion } from "framer-motion";
import CardItemProfile, { FavoriteType } from "./CardItemProfile";

interface FavoritesTabProps {
    type: string;
    userLoggedIn: any | null;
    userInPage: any | null;
}

export default function FavoritesTab({ type, userLoggedIn, userInPage }: FavoritesTabProps) {
    const theme = useTheme();

    let items = [];
    const normalizedType = type.toLowerCase().replace(" ", "");

    // Convert string type to FavoriteType
    const getCardType = (type: string): FavoriteType => {
        const typeMap: { [key: string]: FavoriteType } = {
            movies: "Movies",
            series: "Series",
            actors: "Actors",
            crew: "Crew",
            seasons: "Seasons",
            episodes: "Episodes",
            moviereviews: "Movies",
            seriereviews: "Series",
            episodereviews: "Episodes",
        };
        return typeMap[normalizedType] || "Movies";
    };

    // Handle both bookmarks and reviews
    switch (normalizedType) {
        // Bookmarks
        case "movies":
            items = userInPage?.favMovies || [];
            break;
        case "series":
            items = userInPage?.favSeries || [];
            break;
        case "actors":
            items = userInPage?.favActors || [];
            break;
        case "crew":
            items = userInPage?.favCrew || [];
            break;
        case "seasons":
            items = userInPage?.favSeasons || [];
            break;
        case "episodes":
            items = userInPage?.favEpisodes || [];
            break;

        // Reviews
        case "moviereviews":
            items = userInPage?.movieReviews || [];
            break;
        case "seriereviews":
            items = userInPage?.serieReviews || [];
            break;
        case "episodereviews":
            items = userInPage?.episodeReviews || [];
            break;

        default:
            items = [];
            break;
    }

    function getItemUrl(item: any) {
        let urlPath;
        let formattedTitle;
        let id;

        // Handle both bookmarks and reviews
        if (normalizedType.includes("reviews")) {
            switch (normalizedType) {
                case "moviereviews":
                    urlPath = "movies";
                    formattedTitle = item.movie.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.movie.id;
                    break;
                case "seriereviews":
                    urlPath = "series";
                    formattedTitle = item.serie.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.serie.id;
                    break;
                case "episodereviews":
                    urlPath = "episodes";
                    formattedTitle = item.episode.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.episode.id;
                    break;
                default:
                    return undefined;
            }
        } else {
            const cardType = getCardType(normalizedType);
            switch (cardType) {
                case "Movies":
                    urlPath = "movies";
                    formattedTitle = item.movie.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.movie.id;
                    break;
                case "Series":
                    urlPath = "series";
                    formattedTitle = item.serie.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.serie.id;
                    break;
                case "Actors":
                    urlPath = "actors";
                    formattedTitle = item.actor.fullname
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.actor.id;
                    break;
                case "Crew":
                    urlPath = "crew";
                    formattedTitle = item.crew.fullname
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.crew.id;
                    break;
                case "Seasons":
                    urlPath = "seasons";
                    formattedTitle = item.season.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.season.id;
                    break;
                case "Episodes":
                    urlPath = "episodes";
                    formattedTitle = item.episode.title
                        .split("")
                        .map((char: string) => (char === " " ? "-" : char))
                        .join("");
                    id = item.episode.id;
                    break;
            }
        }

        return `/${urlPath}/${id}/${formattedTitle}`;
    }

    return (
        <Box component="section" minHeight={items.length > 0 ? "auto" : "50vh"}>
            {items.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50vh",
                        textAlign: "center",
                        color: "text.secondary",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        No {type.toLowerCase()} found
                    </Typography>
                    <Typography variant="body2">
                        {normalizedType.includes("reviews")
                            ? `Start writing reviews for ${type.toLowerCase().replace("reviews", "")} to see them here`
                            : `Bookmark some ${type.toLowerCase()} to see them here`}
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {items.map((item: any, index: number) => (
                        <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <CardItemProfile
                                    favItem={item}
                                    type={getCardType(normalizedType)}
                                    getItemUrl={getItemUrl}
                                    userLoggedIn={userLoggedIn}
                                    userInPage={userInPage}
                                />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
