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
    additionalData: any;
}

export default function TabContent({ type, userLoggedIn, userInPage, additionalData }: ITabContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams?.get("page")) || 1;
    const perPage = 10;
    const totalItems = additionalData.total || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    console.log(additionalData);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", value.toString());

        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${window.location.pathname}${query}`);
    };

    const getReviewType = (item: any): "movie" | "serie" | "season" | "episode" | "actor" | "crew" => {
        if (item.movie || item.movieId) return "movie";
        if (item.serie || item.serieId) return "serie";
        if (item.season || item.seasonId) return "season";
        if (item.episode || item.episodeId) return "episode";
        if (item.actor || item.actorId) return "actor";
        if (item.crew || item.crewId) return "crew";

        return "movie";
    };

    const getReviewVotesType = (
        item: any,
    ): "movieReview" | "serieReview" | "seasonReview" | "episodeReview" | "actorReview" | "crewReview" => {
        if (item.movieReview || item.movieReviewId) return "movieReview";
        if (item.serieReview || item.serieReviewId) return "serieReview";
        if (item.seasonReview || item.seasonReviewId) return "seasonReview";
        if (item.episodeReview || item.episodeReviewId) return "episodeReview";
        if (item.actorReview || item.actorReviewId) return "actorReview";
        if (item.crewReview || item.crewReviewId) return "crewReview";

        return "movieReview";
    };

    const formatTitle = (text: string) =>
        text
            .split("")
            .map((char: string) => (char === " " ? "-" : char))
            .join("");

    const getItemUrl = (favItem: any) => {
        switch (type.toLowerCase()) {
            case "movies":
                return `/movies/${favItem.movie.id}/${formatTitle(favItem.movie.title)}`;
            case "series":
                return `/series/${favItem.serie.id}/${formatTitle(favItem.serie.title)}`;
            case "actors":
                return `/actors/${favItem.actor.id}/${formatTitle(favItem.actor.fullname)}`;
            case "crew":
                return `/crew/${favItem.crew.id}/${formatTitle(favItem.crew.fullname)}`;
            case "seasons": {
                const season = favItem.season;

                if (!season?.serie) {
                    return `/seasons/${season.id}/${formatTitle(season.title)}`;
                }

                return `/series/${season.serie.id}/${formatTitle(season.serie.title)}/seasons/${season.id}/${formatTitle(season.title)}`;
            }
            case "episodes": {
                const episode = favItem.episode;
                const season = episode.season;

                if (!season?.serie) {
                    return `/episodes/${episode.id}/${formatTitle(episode.title)}`;
                }

                return `/series/${season.serie.id}/${formatTitle(season.serie.title)}/seasons/${season.id}/${formatTitle(season.title)}/episodes/${episode.id}/${formatTitle(episode.title)}`;
            }
            default:
                return undefined;
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, justifyItems: "center" }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs:
                                searchParams.get("maintab") === "reviews" ||
                                searchParams.get("maintab") === "upvotes" ||
                                searchParams.get("maintab") === "downvotes"
                                    ? "repeat(auto-fill, minmax(300px, 1fr))"
                                    : "repeat(auto-fill, minmax(100px, 1fr))",
                            sm:
                                searchParams.get("maintab") === "reviews" ||
                                searchParams.get("maintab") === "upvotes" ||
                                searchParams.get("maintab") === "downvotes"
                                    ? "repeat(2, minmax(350px, 1fr))"
                                    : "repeat(3, minmax(120px, 1fr))",
                            md:
                                searchParams.get("maintab") === "reviews" ||
                                searchParams.get("maintab") === "upvotes" ||
                                searchParams.get("maintab") === "downvotes"
                                    ? "repeat(3, minmax(300px, 1fr))"
                                    : "repeat(5, minmax(140px, 1fr))",
                        },
                        gap: { xs: 1, sm: 1.5 },
                        justifyContent: "center",
                        width: "100%",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        minHeight: additionalData.items.length === 0 ? "auto" : "200px",
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    <AnimatePresence mode="wait">
                        {additionalData.items.length > 0 ? (
                            additionalData.items.map((item: any, index: number) => {
                                const mainTab = searchParams?.get("maintab") || "bookmarks";

                                if (mainTab === "reviews") {
                                    const reviewType = getReviewType(item);
                                    const reviewItem = {
                                        ...item,
                                        ...item[reviewType],
                                        user: userInPage,
                                        _count: {
                                            upvotes: item._count?.upvotes || 0,
                                            downvotes: item._count?.downvotes || 0,
                                        },
                                    };

                                    console.log(reviewItem, reviewType);

                                    return (
                                        <ReviewItemProfile
                                            key={index}
                                            review={reviewItem}
                                            type={reviewType}
                                            variant="upvote"
                                            userLoggedIn={userLoggedIn}
                                        />
                                    );
                                } else if (mainTab === "upvotes" || mainTab === "downvotes") {
                                    const reviewType = getReviewVotesType(item);
                                    const reviewItem = {
                                        ...item[reviewType],
                                        user: userInPage,
                                        _count: {
                                            upvotes: item._count?.upvotes || 0,
                                            downvotes: item._count?.downvotes || 0,
                                        },
                                    };

                                    console.log(reviewItem, reviewType);
                                    return (
                                        <ReviewItemProfile
                                            key={index}
                                            review={reviewItem}
                                            type={getReviewType(item)}
                                            variant={mainTab === "upvotes" ? "upvote" : "downvote"}
                                            userLoggedIn={userLoggedIn}
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
                            <Box
                                sx={{
                                    gridColumn: "1/-1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    py: { xs: 2, sm: 3 },
                                    minHeight: "100px",
                                }}
                            >
                                <Typography variant="body1" color="text.secondary" textAlign="center">
                                    No items found
                                </Typography>
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>
                {totalItems > 0 && (
                    <Stack spacing={2} alignItems="center" sx={{ mt: { xs: 1, sm: 2 } }}>
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
                                "& .MuiPaginationItem-root": {
                                    color: "text.secondary",
                                    borderRadius: 1,
                                    minWidth: "35px",
                                    height: "35px",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                },
                                "& .Mui-selected": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "primary.main",
                                    },
                                },
                                "& .MuiPaginationItem-firstLast": {
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                },
                                "& .MuiPaginationItem-previousNext": {
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                },
                            }}
                        />
                    </Stack>
                )}
            </Box>
        </Box>
    );
}
