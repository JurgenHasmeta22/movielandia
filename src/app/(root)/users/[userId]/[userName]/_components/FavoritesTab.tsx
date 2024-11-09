"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import type {} from "@mui/material/themeCssVarsAugmentation";
import CardItemProfile from "./CardItemProfile";

interface FavoritesTabProps {
    type: string;
    userLoggedIn: any | null;
    userInPage: any | null;
}

export default function FavoritesTab({ type, userLoggedIn, userInPage }: FavoritesTabProps) {
    const theme = useTheme();

    let favorites;

    switch (type) {
        case "Movies":
            favorites = userInPage?.favMovies;
            break;
        case "Series":
            favorites = userInPage?.favSeries;
            break;
        case "Actors":
            favorites = userInPage?.favActors;
            break;
        case "Crew":
            favorites = userInPage?.favCrew;
            break;
        case "Seasons":
            favorites = userInPage?.favSeasons;
            break;
        case "Episodes":
            favorites = userInPage?.favEpisodes;
            break;
        default:
            favorites = [];
            break;
    }

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
            case "Crew":
                urlPath = "crew";
                formattedTitle = favItem.crew.fullname
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
            <Typography
                variant="h4"
                color={theme.vars.palette.primary.main}
                sx={{
                    mb: 4,
                }}
            >
                Bookmarked {type}
            </Typography>
            <Stack flexDirection="row" flexWrap="wrap" columnGap={3} rowGap={4} justifyContent="start">
                {favorites.map((favItem: any, index: number) => (
                    <CardItemProfile
                        favItem={favItem}
                        key={index}
                        type={type}
                        getItemUrl={getItemUrl}
                        userLoggedIn={userLoggedIn}
                        userInPage={userInPage}
                    />
                ))}
            </Stack>
        </Box>
    );
}
