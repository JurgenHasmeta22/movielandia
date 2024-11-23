"use client";

import { Box, Typography } from "@mui/material";
import CardItemProfile, { FavoriteType } from "./CardItemProfile";
import ReviewItemProfile from "./ReviewItemProfile";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface ITabContentProps {
    type: string;
    userLoggedIn: any;
    userInPage: any;
}

export default function TabContent({ type, userLoggedIn, userInPage }: ITabContentProps) {
    const searchParams = useSearchParams();

    const getContent = () => {
        const mainTab = searchParams?.get("maintab") || "bookmarks";

        // Handle bookmarks
        if (mainTab === "bookmarks") {
            switch (type.toLowerCase()) {
                case "movies":
                    return userInPage.favMovies;
                case "series":
                    return userInPage.favSeries;
                case "actors":
                    return userInPage.favActors;
                case "crew":
                    return userInPage.favCrew;
                case "seasons":
                    return userInPage.favSeasons;
                case "episodes":
                    return userInPage.favEpisodes;
                default:
                    return [];
            }
        }

        // Handle upvotes and downvotes
        const isUpvote = mainTab === "upvotes";
        const reviewType = type.toLowerCase().replace(" reviews", "");

        const getReviewsForType = () => {
            switch (reviewType) {
                case "movie":
                    return isUpvote ? userInPage.movieReviewsUpvoted : userInPage.movieReviewsDownvoted;
                case "serie":
                    return isUpvote ? userInPage.serieReviewsUpvoted : userInPage.serieReviewsDownvoted;
                case "season":
                    return isUpvote ? userInPage.seasonReviewsUpvoted : userInPage.seasonReviewsDownvoted;
                case "episode":
                    return isUpvote ? userInPage.episodeReviewsUpvoted : userInPage.episodeReviewsDownvoted;
                case "actor":
                    return isUpvote ? userInPage.actorReviewsUpvoted : userInPage.actorReviewsDownvoted;
                case "crew":
                    return isUpvote ? userInPage.crewReviewsUpvoted : userInPage.crewReviewsDownvoted;
                default:
                    return [];
            }
        };

        return getReviewsForType();
    };

    const content = getContent();
    const mainTab = searchParams?.get("maintab") || "bookmarks";
    const isReviewTab = mainTab === "upvotes" || mainTab === "downvotes";

    const getItemUrl = (favItem: any) => {
        let urlPath;
        let formattedTitle;
        let id;

        switch (type.toLowerCase()) {
            case "movies":
                urlPath = "movies";
                formattedTitle = favItem.movie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                id = favItem.movie.id;
                break;
            case "series":
                urlPath = "series";
                formattedTitle = favItem.serie.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                id = favItem.serie.id;
                break;
            case "actors":
                urlPath = "actors";
                formattedTitle = favItem.actor.fullname
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                id = favItem.actor.id;
                break;
            case "crew":
                urlPath = "crew";
                formattedTitle = favItem.crew.fullname
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                id = favItem.crew.id;
                break;
            case "seasons":
                urlPath = "seasons";
                formattedTitle = favItem.season.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                id = favItem.season.id;
                break;
            case "episodes":
                urlPath = "episodes";
                formattedTitle = favItem.episode.title
                    .split("")
                    .map((char: string) => (char === " " ? "-" : char))
                    .join("");
                id = favItem.episode.id;
                break;
            default:
                return undefined;
        }

        return `/${urlPath}/${id}/${formattedTitle}`;
    };

    if (!content || content.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    No {type.toLowerCase()} found
                </Typography>
            </Box>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: 4,
                        rowGap: 2,
                    }}
                >
                    {content.map((item: any) => (
                        <Box key={item.id}>
                            {isReviewTab ? (
                                <ReviewItemProfile
                                    review={item}
                                    type={type.toLowerCase().replace(" reviews", "") as any}
                                    variant={mainTab === "upvotes" ? "upvote" : "downvote"}
                                />
                            ) : (
                                <CardItemProfile
                                    favItem={item}
                                    type={(type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()) as FavoriteType}
                                    getItemUrl={getItemUrl}
                                    userLoggedIn={userLoggedIn}
                                    userInPage={userInPage}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            </motion.div>
        </AnimatePresence>
    );
}
