"use client";

import { Box, Typography, Pagination, Stack } from "@mui/material";
import CardItemProfile, { FavoriteType } from "./CardItemProfile";
import ReviewItemProfile from "./ReviewItemProfile";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

interface ITabContentProps {
    type: string;
    userLoggedIn: any;
    userInPage: any;
}

export default function TabContent({ type, userLoggedIn, userInPage }: ITabContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams?.get("page")) || 1;
    const perPage = 20;

    const getContent = () => {
        const mainTab = searchParams?.get("maintab") || "bookmarks";
        let content = [];

        // Handle bookmarks
        if (mainTab === "bookmarks") {
            switch (type.toLowerCase()) {
                case "movies":
                    content = userInPage.favMovies;
                    break;
                case "series":
                    content = userInPage.favSeries;
                    break;
                case "actors":
                    content = userInPage.favActors;
                    break;
                case "crew":
                    content = userInPage.favCrew;
                    break;
                case "seasons":
                    content = userInPage.favSeasons;
                    break;
                case "episodes":
                    content = userInPage.favEpisodes;
                    break;
                default:
                    content = [];
            }
        } else {
            // Handle upvotes and downvotes
            const isUpvote = mainTab === "upvotes";
            const reviewType = type.toLowerCase().replace(" reviews", "");

            switch (reviewType) {
                case "movie":
                    content = isUpvote ? userInPage.movieReviewsUpvoted : userInPage.movieReviewsDownvoted;
                    break;
                case "serie":
                    content = isUpvote ? userInPage.serieReviewsUpvoted : userInPage.serieReviewsDownvoted;
                    break;
                case "season":
                    content = isUpvote ? userInPage.seasonReviewsUpvoted : userInPage.seasonReviewsDownvoted;
                    break;
                case "episode":
                    content = isUpvote ? userInPage.episodeReviewsUpvoted : userInPage.episodeReviewsDownvoted;
                    break;
                case "actor":
                    content = isUpvote ? userInPage.actorReviewsUpvoted : userInPage.actorReviewsDownvoted;
                    break;
                case "crew":
                    content = isUpvote ? userInPage.crewReviewsUpvoted : userInPage.crewReviewsDownvoted;
                    break;
                default:
                    content = [];
            }
        }

        // Handle reviews tab
        if (mainTab === "reviews") {
            switch (type.toLowerCase()) {
                case "movies":
                    content = userInPage.movieReviews;
                    break;
                case "series":
                    content = userInPage.serieReviews;
                    break;
                case "seasons":
                    content = userInPage.seasonReviews;
                    break;
                case "episodes":
                    content = userInPage.episodeReviews;
                    break;
                case "actors":
                    content = userInPage.actorReviews;
                    break;
                case "crew":
                    content = userInPage.crewReviews;
                    break;
                default:
                    content = [];
            }
        }

        return content;
    };

    const content = getContent();
    const totalItems = content?.length || 0;
    const totalPages = Math.ceil(totalItems / perPage);
    const paginatedContent = content?.slice((page - 1) * perPage, page * perPage) || [];

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", value.toString());
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${window.location.pathname}${query}`);
    };

    const getReviewType = (item: any): "movie" | "serie" | "season" | "episode" => {
        if (item.movie || item.movieId) return "movie";
        if (item.serie || item.serieId) return "serie";
        if (item.season || item.seasonId) return "season";
        if (item.episode || item.episodeId) return "episode";
        return "movie"; // fallback
    };

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

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 2,
                        minHeight: "200px", // Add minimum height to prevent layout shift
                    }}
                >
                    <AnimatePresence mode="wait">
                        {paginatedContent.length > 0 ? (
                            paginatedContent.map((item: any, index: number) => {
                                const mainTab = searchParams?.get("maintab") || "bookmarks";
                                if (mainTab === "reviews") {
                                    const reviewType = getReviewType(item);
                                    // Properly format the review data
                                    const reviewItem = {
                                        [`${reviewType}Review`]: {
                                            ...item,
                                            user: userInPage, // Add the user data
                                            movie: item.movie,
                                            serie: item.serie,
                                            season: item.season,
                                            episode: item.episode,
                                            _count: {
                                                upvotes: item._count?.upvotes || 0,
                                                downvotes: item._count?.downvotes || 0
                                            }
                                        }
                                    };
                                    return (
                                        <ReviewItemProfile
                                            key={index}
                                            review={reviewItem}
                                            type={reviewType}
                                            variant="upvote"
                                        />
                                    );
                                } else if (mainTab === "upvotes" || mainTab === "downvotes") {
                                    return (
                                        <ReviewItemProfile
                                            key={index}
                                            review={item}
                                            type={getReviewType(item)}
                                            variant={mainTab === "upvotes" ? "upvote" : "downvote"}
                                        />
                                    );
                                }
                                return (
                                    <CardItemProfile
                                        key={index}
                                        favItem={item}
                                        type={type as FavoriteType}
                                        getItemUrl={getItemUrl}
                                        userLoggedIn={userLoggedIn}
                                        userInPage={userInPage}
                                    />
                                );
                            })
                        ) : (
                            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ gridColumn: "1/-1", py: 4 }}>
                                No items found
                            </Typography>
                        )}
                    </AnimatePresence>
                </Box>
                <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={Math.max(1, totalPages)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="medium"
                        showFirstButton
                        showLastButton
                        disabled={totalItems === 0}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'text.secondary',
                                borderRadius: 1,
                                minWidth: '35px',
                                height: '35px',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            },
                            '& .Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                            },
                            '& .MuiPaginationItem-firstLast': {
                                borderRadius: 1,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            },
                            '& .MuiPaginationItem-previousNext': {
                                borderRadius: 1,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            },
                        }}
                    />
                </Stack>
            </Box>
        </Box>
    );
}
