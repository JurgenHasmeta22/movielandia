"use client";

import { Box, Typography, Pagination, Stack } from "@mui/material";
import CardItemProfile, { FavoriteType } from "./CardItemProfile";
import ReviewItemProfile from "./ReviewItemProfile";
import ForumTopicItemProfile from "./ForumTopicItemProfile";
import ForumReplyItemProfile from "./ForumReplyItemProfile";
import { motion } from "framer-motion";
import ProfileSearchBar from "./ProfileSearchBar";
import { useQueryState } from "nuqs";

interface ITabContentProps {
    type: string;
    userLoggedIn: any;
    userInPage: any;
    additionalData: any;
    mainTab: string;
}

export default function TabContent({ type, userLoggedIn, userInPage, additionalData, mainTab }: ITabContentProps) {
    const [search, setSearch] = useQueryState("search", {
        defaultValue: "",
        parse: (value) => value || "",
        shallow: false,
    });

    const [page, setPage] = useQueryState("page", {
        defaultValue: "1",
        shallow: false,
    });

    const perPage = 10;
    const totalItems = additionalData.total || 0;
    const totalPages = Math.ceil(totalItems / perPage);

    const startIndex = (Number(page) - 1) * perPage + 1;
    const endIndex = Math.min(Number(page) * perPage, totalItems);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(String(value));
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

                return `/series/${season.serie.id}/${formatTitle(season.serie.title)}/seasons/${
                    season.id
                }/${formatTitle(season.title)}`;
            }
            case "episodes": {
                const episode = favItem.episode;
                const season = episode.season;

                if (!season?.serie) {
                    return `/episodes/${episode.id}/${formatTitle(episode.title)}`;
                }

                return `/series/${season.serie.id}/${formatTitle(season.serie.title)}/seasons/${
                    season.id
                }/${formatTitle(season.title)}/episodes/${episode.id}/${formatTitle(episode.title)}`;
            }
            default:
                return undefined;
        }
    };

    const getEmptyStateMessage = () => {
        if (search) {
            switch (mainTab) {
                case "reviews":
                    return `No ${type.toLowerCase()} reviews found matching "${search}"`;
                case "upvotes":
                    return `No upvoted ${type.toLowerCase()} reviews found matching "${search}"`;
                case "downvotes":
                    return `No downvoted ${type.toLowerCase()} reviews found matching "${search}"`;
                case "forum":
                    if (type.toLowerCase() === "topics") {
                        return `No forum topics found matching "${search}"`;
                    } else {
                        return `No forum replies found matching "${search}"`;
                    }
                default:
                    return `No ${type.toLowerCase()} bookmarks found matching "${search}"`;
            }
        }

        switch (mainTab) {
            case "reviews":
                return `No ${type.toLowerCase()} have been reviewed yet`;
            case "upvotes":
                return `No ${type.toLowerCase()} reviews have been upvoted yet`;
            case "downvotes":
                return `No ${type.toLowerCase()} reviews have been downvoted yet`;
            case "forum":
                if (type.toLowerCase() === "topics") {
                    return "No forum topics have been created yet";
                } else {
                    return "No forum replies have been posted yet";
                }
            default:
                return `No ${type.toLowerCase()} have been bookmarked yet`;
        }
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            sx={{ width: "100%" }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <ProfileSearchBar
                    search={search}
                    page={Number(page)}
                    mainTab={mainTab}
                    setPage={setPage}
                    setSearch={setSearch}
                />
                {totalItems > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            px: { xs: 1, sm: 2 },
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Showing {startIndex}-{endIndex} of {totalItems} items
                            {search && ` for "${search}"`}
                        </Typography>
                    </Box>
                )}

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs:
                                mainTab === "reviews" || mainTab === "upvotes" || mainTab === "downvotes" || mainTab === "forum"
                                    ? "repeat(auto-fill, minmax(300px, 1fr))"
                                    : "repeat(auto-fill, minmax(100px, 1fr))",
                            sm:
                                mainTab === "reviews" || mainTab === "upvotes" || mainTab === "downvotes" || mainTab === "forum"
                                    ? "repeat(2, minmax(350px, 1fr))"
                                    : "repeat(3, minmax(120px, 1fr))",
                            md:
                                mainTab === "reviews" || mainTab === "upvotes" || mainTab === "downvotes" || mainTab === "forum"
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
                    {additionalData.items.length > 0 ? (
                        additionalData.items.map((item: any, index: number) => {
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
                                    user: item[reviewType].user,
                                    _count: {
                                        upvotes: item[reviewType]._count?.upvotes || 0,
                                        downvotes: item[reviewType]._count?.downvotes || 0,
                                    },
                                };

                                return (
                                    <ReviewItemProfile
                                        key={index}
                                        review={reviewItem}
                                        type={getReviewType(item)}
                                        variant={mainTab === "upvotes" ? "upvote" : "downvote"}
                                        userLoggedIn={userLoggedIn}
                                    />
                                );
                            } else if (mainTab === "forum") {
                                if (type.toLowerCase() === "topics") {
                                    return (
                                        <ForumTopicItemProfile
                                            key={index}
                                            topic={item}
                                        />
                                    );
                                } else {
                                    return (
                                        <ForumReplyItemProfile
                                            key={index}
                                            reply={item}
                                        />
                                    );
                                }
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
                                flexDirection: "column",
                                gap: 1,
                                py: { xs: 4, sm: 6 },
                                minHeight: "200px",
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" textAlign="center">
                                {getEmptyStateMessage()}
                            </Typography>
                            {search && (
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Try adjusting your search to find what you&apos;re looking for
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
                {totalItems > 0 && (
                    <Stack spacing={2} alignItems="center" sx={{ mt: { xs: 1, sm: 2 } }}>
                        <Pagination
                            count={Math.max(1, totalPages)}
                            page={Number(page)}
                            onChange={handlePageChange}
                            size="large"
                            shape="rounded"
                            showFirstButton
                            showLastButton
                            disabled={totalItems === 0}
                        />
                    </Stack>
                )}
            </Box>
        </Box>
    );
}
