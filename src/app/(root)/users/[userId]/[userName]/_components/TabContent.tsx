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
        } else if (mainTab === "reviews") {
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
        } else {
            const isSubTabUpvotes = mainTab === "upvotes";
            const isSubTabDownvotes = mainTab === "downvotes";
            // Fix the type processing to handle "X Reviews" format
            const reviewType = type
                .toLowerCase()
                .replace(/\s*reviews\s*/g, "") // Remove "reviews" with any surrounding spaces
                .replace(/s$/, ""); // Remove trailing 's'

            if (isSubTabUpvotes) {
                const upvotedContent = userInPage[`${reviewType}ReviewsUpvoted`];
            }

            if (isSubTabDownvotes) {
                const downvotedContent = userInPage[`${reviewType}ReviewsDownvoted`];
            }

            switch (reviewType) {
                case "movie": {
                    const upvotedContent = userInPage.movieReviewsUpvoted || [];
                    const downvotedContent = userInPage.movieReviewsDownvoted || [];

                    content = isSubTabUpvotes
                        ? upvotedContent
                              .map((item: any) => {
                                  if (!item?.movieReview || !item?.movie) return null;
                                  return {
                                      id: item.movieReviewId,
                                      content: item.movieReview.content,
                                      rating: item.movieReview.rating,
                                      createdAt: item.movieReview.createdAt,
                                      updatedAt: item.movieReview.updatedAt,
                                      userId: item.movieReview.userId,
                                      movieId: item.movieReview.movieId,
                                      movie: item.movie,
                                      user: item.movieReview.user || item.user,
                                      _count: item.movieReview._count || { upvotes: 0, downvotes: 0 },
                                  };
                              })
                              .filter(Boolean)
                        : isSubTabDownvotes
                          ? downvotedContent
                                .map((item: any) => {
                                    if (!item?.movieReview || !item?.movie) return null;
                                    return {
                                        id: item.movieReviewId,
                                        content: item.movieReview.content,
                                        rating: item.movieReview.rating,
                                        createdAt: item.movieReview.createdAt,
                                        updatedAt: item.movieReview.updatedAt,
                                        userId: item.movieReview.userId,
                                        movieId: item.movieReview.movieId,
                                        movie: item.movie,
                                        user: item.movieReview.user || item.user,
                                        _count: item.movieReview._count || { upvotes: 0, downvotes: 0 },
                                    };
                                })
                                .filter(Boolean)
                          : [];
                    break;
                }
                case "serie": {
                    const upvotedContent = userInPage.serieReviewsUpvoted || [];
                    const downvotedContent = userInPage.serieReviewsDownvoted || [];

                    content = isSubTabUpvotes
                        ? upvotedContent
                              .map((item: any) => {
                                  if (!item?.serieReview || !item?.serie) return null;
                                  return {
                                      id: item.serieReviewId,
                                      content: item.serieReview.content,
                                      rating: item.serieReview.rating,
                                      createdAt: item.serieReview.createdAt,
                                      updatedAt: item.serieReview.updatedAt,
                                      userId: item.serieReview.userId,
                                      serieId: item.serieReview.serieId,
                                      serie: item.serie,
                                      user: item.serieReview.user || item.user,
                                      _count: item.serieReview._count || { upvotes: 0, downvotes: 0 },
                                  };
                              })
                              .filter(Boolean)
                        : isSubTabDownvotes
                          ? downvotedContent
                                .map((item: any) => {
                                    if (!item?.serieReview || !item?.serie) return null;
                                    return {
                                        id: item.serieReviewId,
                                        content: item.serieReview.content,
                                        rating: item.serieReview.rating,
                                        createdAt: item.serieReview.createdAt,
                                        updatedAt: item.serieReview.updatedAt,
                                        userId: item.serieReview.userId,
                                        serieId: item.serieReview.serieId,
                                        serie: item.serie,
                                        user: item.serieReview.user || item.user,
                                        _count: item.serieReview._count || { upvotes: 0, downvotes: 0 },
                                    };
                                })
                                .filter(Boolean)
                          : [];
                    break;
                }
                case "season": {
                    const upvotedContent = userInPage.seasonReviewsUpvoted || [];
                    const downvotedContent = userInPage.seasonReviewsDownvoted || [];

                    content = isSubTabUpvotes
                        ? upvotedContent
                              .map((item: any) => {
                                  if (!item?.seasonReview || !item?.season) return null;
                                  return {
                                      id: item.seasonReviewId,
                                      content: item.seasonReview.content,
                                      rating: item.seasonReview.rating,
                                      createdAt: item.seasonReview.createdAt,
                                      updatedAt: item.seasonReview.updatedAt,
                                      userId: item.seasonReview.userId,
                                      seasonId: item.seasonReview.seasonId,
                                      season: item.season,
                                      user: item.seasonReview.user || item.user,
                                      _count: item.seasonReview._count || { upvotes: 0, downvotes: 0 },
                                  };
                              })
                              .filter(Boolean)
                        : isSubTabDownvotes
                          ? downvotedContent
                                .map((item: any) => {
                                    if (!item?.seasonReview || !item?.season) return null;
                                    return {
                                        id: item.seasonReviewId,
                                        content: item.seasonReview.content,
                                        rating: item.seasonReview.rating,
                                        createdAt: item.seasonReview.createdAt,
                                        updatedAt: item.seasonReview.updatedAt,
                                        userId: item.seasonReview.userId,
                                        seasonId: item.seasonReview.seasonId,
                                        season: item.season,
                                        user: item.seasonReview.user || item.user,
                                        _count: item.seasonReview._count || { upvotes: 0, downvotes: 0 },
                                    };
                                })
                                .filter(Boolean)
                          : [];
                    break;
                }
                case "episode": {
                    const upvotedContent = userInPage.episodeReviewsUpvoted || [];
                    const downvotedContent = userInPage.episodeReviewsDownvoted || [];

                    content = isSubTabUpvotes
                        ? upvotedContent
                              .map((item: any) => {
                                  if (!item?.episodeReview || !item?.episode) return null;
                                  return {
                                      id: item.episodeReviewId,
                                      content: item.episodeReview.content,
                                      rating: item.episodeReview.rating,
                                      createdAt: item.episodeReview.createdAt,
                                      updatedAt: item.episodeReview.updatedAt,
                                      userId: item.episodeReview.userId,
                                      episodeId: item.episodeReview.episodeId,
                                      episode: item.episode,
                                      user: item.episodeReview.user || item.user,
                                      _count: item.episodeReview._count || { upvotes: 0, downvotes: 0 },
                                  };
                              })
                              .filter(Boolean)
                        : isSubTabDownvotes
                          ? downvotedContent
                                .map((item: any) => {
                                    if (!item?.episodeReview || !item?.episode) return null;
                                    return {
                                        id: item.episodeReviewId,
                                        content: item.episodeReview.content,
                                        rating: item.episodeReview.rating,
                                        createdAt: item.episodeReview.createdAt,
                                        updatedAt: item.episodeReview.updatedAt,
                                        userId: item.episodeReview.userId,
                                        episodeId: item.episodeReview.episodeId,
                                        episode: item.episode,
                                        user: item.episodeReview.user || item.user,
                                        _count: item.episodeReview._count || { upvotes: 0, downvotes: 0 },
                                    };
                                })
                                .filter(Boolean)
                          : [];
                    break;
                }
                case "actor": {
                    const upvotedContent = userInPage.actorReviewsUpvoted || [];
                    const downvotedContent = userInPage.actorReviewsDownvoted || [];

                    content = isSubTabUpvotes
                        ? upvotedContent
                              .map((item: any) => {
                                  if (!item?.actorReview || !item?.actor) return null;
                                  return {
                                      id: item.actorReviewId,
                                      content: item.actorReview.content,
                                      rating: item.actorReview.rating,
                                      createdAt: item.actorReview.createdAt,
                                      updatedAt: item.actorReview.updatedAt,
                                      userId: item.actorReview.userId,
                                      actorId: item.actorReview.actorId,
                                      actor: item.actor,
                                      user: item.actorReview.user || item.user,
                                      _count: item.actorReview._count || { upvotes: 0, downvotes: 0 },
                                  };
                              })
                              .filter(Boolean)
                        : isSubTabDownvotes
                          ? downvotedContent
                                .map((item: any) => {
                                    if (!item?.actorReview || !item?.actor) return null;
                                    return {
                                        id: item.actorReviewId,
                                        content: item.actorReview.content,
                                        rating: item.actorReview.rating,
                                        createdAt: item.actorReview.createdAt,
                                        updatedAt: item.actorReview.updatedAt,
                                        userId: item.actorReview.userId,
                                        actorId: item.actorReview.actorId,
                                        actor: item.actor,
                                        user: item.actorReview.user || item.user,
                                        _count: item.actorReview._count || { upvotes: 0, downvotes: 0 },
                                    };
                                })
                                .filter(Boolean)
                          : [];
                    break;
                }
                case "crew": {
                    const upvotedContent = userInPage.crewReviewsUpvoted || [];
                    const downvotedContent = userInPage.crewReviewsDownvoted || [];

                    content = isSubTabUpvotes
                        ? upvotedContent
                              .map((item: any) => {
                                  if (!item?.crewReview || !item?.crew) return null;
                                  return {
                                      id: item.crewReviewId,
                                      content: item.crewReview.content,
                                      rating: item.crewReview.rating,
                                      createdAt: item.crewReview.createdAt,
                                      updatedAt: item.crewReview.updatedAt,
                                      userId: item.crewReview.userId,
                                      crewId: item.crewReview.crewId,
                                      crew: item.crew,
                                      user: item.crewReview.user || item.user,
                                      _count: item.crewReview._count || { upvotes: 0, downvotes: 0 },
                                  };
                              })
                              .filter(Boolean)
                        : isSubTabDownvotes
                          ? downvotedContent
                                .map((item: any) => {
                                    if (!item?.crewReview || !item?.crew) return null;
                                    return {
                                        id: item.crewReviewId,
                                        content: item.crewReview.content,
                                        rating: item.crewReview.rating,
                                        createdAt: item.crewReview.createdAt,
                                        updatedAt: item.crewReview.updatedAt,
                                        userId: item.crewReview.userId,
                                        crewId: item.crewReview.crewId,
                                        crew: item.crew,
                                        user: item.crewReview.user || item.user,
                                        _count: item.crewReview._count || { upvotes: 0, downvotes: 0 },
                                    };
                                })
                                .filter(Boolean)
                          : [];
                    break;
                }
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

        return "movie";
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
                        minHeight: "200px",
                    }}
                >
                    <AnimatePresence mode="wait">
                        {paginatedContent.length > 0 ? (
                            paginatedContent.map((item: any, index: number) => {
                                const mainTab = searchParams?.get("maintab") || "bookmarks";
                                if (mainTab === "reviews") {
                                    const reviewType = getReviewType(item);
                                    const reviewItem = {
                                        ...item,
                                        [`${reviewType}`]: reviewType === "movie" ? item.movie : 
                                                         reviewType === "serie" ? item.serie :
                                                         reviewType === "season" ? item.season :
                                                         item.episode,
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
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                textAlign="center"
                                sx={{ gridColumn: "1/-1", py: 4 }}
                            >
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
            </Box>
        </Box>
    );
}
