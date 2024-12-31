"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import { TextEditorForm } from "@/components/root/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import { onBookmarkActor, onRemoveBookmarkActor } from "@/utils/features/actorFeaturesUtils";
import { removeDownvoteActorReview, addDownvoteActorReview } from "@/actions/user/userDownvotes.actions";
import { addReviewActor, removeReviewActor, updateReviewActor } from "@/actions/user/userReviews.actions";
import { removeUpvoteActorReview, addUpvoteActorReview } from "@/actions/user/userUpvotes.actions";

interface IActorPageContentProps {
    searchParamsValues: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: number;
        reviewsSortBy: string;
        starredMoviesPage: number;
        starredSeriesPage: number;
    };
    actor: any;
    reviewsPageCount: number;
    starredMoviesPageCount: number;
    starredSeriesPageCount: number;
}

export default function ActorPageContent({
    searchParamsValues,
    actor,
    reviewsPageCount,
    starredMoviesPageCount,
    starredSeriesPageCount,
}: IActorPageContentProps) {
    // #region "Data for the page"
    const {
        session,
        review,
        setReview,
        rating,
        setRating,
        isEditMode,
        setIsEditMode,
        setOpen,
        openModal,
        textEditorRef,
        reviewRef,
    } = usePageDetailsData();

    const theme = useTheme();
    // #endregion

    // #region "Handlers functions"

    // #region "Review"
    async function onSubmitReview() {
        if (!session?.user || !actor) return;

        try {
            await addReviewActor({
                actorId: actor.id,
                userId: Number(session?.user?.id),
                content: review,
                rating: rating ? rating : 0,
            });

            setReview("");
            setRating(null);
            showToast("success", "Review submitted successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while submitting the review.");
            }
        }
    }

    async function onSubmitRemoveReview() {
        if (!session?.user || !actor) return;

        openModal({
            onClose: () => setOpen(false),
            title: "Remove Review",
            actions: [
                {
                    label: CONSTANTS.MODAL__DELETE__NO,
                    onClick: () => setOpen(false),
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#ff5252",
                    },
                    icon: <WarningOutlined />,
                },
                {
                    label: CONSTANTS.MODAL__DELETE__YES,
                    onClick: async () => {
                        try {
                            await removeReviewActor({
                                actorId: actor.id,
                                userId: Number(session?.user?.id),
                            });

                            setReview("");
                            showToast("success", "Review removed successfully!");
                        } catch (error) {
                            if (error instanceof Error) {
                                showToast("error", `Error: ${error.message}`);
                            } else {
                                showToast("error", "An unexpected error occurred while deleting the review.");
                            }
                        }
                    },
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#30969f",
                    },
                    icon: <CheckOutlined />,
                },
            ],
            subTitle: "Are you sure that you want to delete this review ?",
        });
    }

    async function onSubmitUpdateReview() {
        if (!session?.user || !actor) return;

        try {
            await updateReviewActor({
                actorId: actor.id,
                userId: Number(session?.user?.id),
                content: review,
                rating: rating ? rating : 0,
            });

            setReview("");
            setRating(null);
            setIsEditMode(false);
            handleFocusReview();
            showToast("success", "Review updated successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while updating the review.");
            }
        }
    }
    // #endregion

    // #region "Upvote, Downvote"
    async function onUpvoteActor(actorReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !actorReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor.id,
                    actorReviewId,
                });
            } else {
                await removeDownvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor.id,
                    actorReviewId,
                });

                await addUpvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor.id,
                    actorReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while upvoting the actor.");
            }
        }
    }

    async function onDownVoteActor(actorReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!actor && !actorReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor.id,
                    actorReviewId,
                });
            } else {
                await removeUpvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor.id,
                    actorReviewId,
                });

                await addDownvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor.id,
                    actorReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while downvoting the actor.");
            }
        }
    }
    // #endregion

    // #region "Focus handlers"
    const handleFocusTextEditor = () => {
        if (textEditorRef.current) {
            textEditorRef.current.focus();
        }
    };

    const handleFocusReview = () => {
        if (reviewRef.current) {
            reviewRef.current.focus();
        }
    };

    useEffect(() => {
        if (isEditMode) {
            handleFocusTextEditor();
        }
    }, [isEditMode]);
    // #endregion

    // #endregion

    return (
        <Stack flexDirection={"column"} rowGap={4}>
            <DetailsPageCard
                data={actor}
                type="actor"
                isBookmarked={actor.isBookmarked}
                onBookmark={() => onBookmarkActor(session!, actor)}
                onRemoveBookmark={() => onRemoveBookmarkActor(session!, actor)}
            />
            <Box
                sx={{
                    maxWidth: "900px",
                    width: "100%",
                    mx: "auto",
                    my: 4,
                    "& .MuiAccordion-root": {
                        mb: 2,
                    },
                }}
            >
                <Accordion
                    defaultExpanded={false}
                    sx={{
                        bgcolor: theme.vars.palette.secondary.light,
                        borderRadius: "12px",
                        "&:before": {
                            display: "none",
                        },
                        "& .MuiAccordionSummary-root": {
                            borderRadius: "12px",
                            transition: "background-color 0.2s",
                            "&:hover": {
                                bgcolor: theme.vars.palette.secondary.dark,
                            },
                        },
                        "& .MuiAccordionSummary-expandIconWrapper": {
                            color: theme.vars.palette.primary.main,
                            transition: "transform 0.3s",
                            "&.Mui-expanded": {
                                transform: "rotate(180deg)",
                            },
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="reviews-content"
                        id="reviews-header"
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: theme.vars.palette.primary.main,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            Reviews
                            {actor.totalReviews >= 0 && (
                                <Typography
                                    component="span"
                                    sx={{
                                        color: theme.vars.palette.primary.main,
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        py: 0.5,
                                        borderRadius: "16px",
                                    }}
                                >
                                    ({actor.totalReviews ? actor.totalReviews : 0})
                                </Typography>
                            )}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderTop: `1px solid ${theme.vars.palette.divider}`,
                        }}
                    >
                        <Box
                            component="section"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                            }}
                        >
                            {actor.reviews!.length > 0 ? (
                                <ReviewsHeader
                                    data={actor}
                                    sortBy={searchParamsValues.reviewsSortBy!}
                                    ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                                    sortingDataType="reviews"
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: "center",
                                        color: theme.vars.palette.text.secondary,
                                    }}
                                >
                                    No reviews yet. Be the first to review this actor!
                                </Typography>
                            )}
                            {actor.reviews.map(
                                (review: any, index: number) =>
                                    (!isEditMode || review.user.id !== Number(session?.user?.id)) && (
                                        <Review
                                            key={index}
                                            review={review}
                                            handleRemoveReview={onSubmitRemoveReview}
                                            isEditMode={isEditMode}
                                            setIsEditMode={setIsEditMode}
                                            setReview={setReview}
                                            handleFocusTextEditor={handleFocusTextEditor}
                                            ref={reviewRef}
                                            setRating={setRating}
                                            handleUpvote={onUpvoteActor}
                                            handleDownvote={onDownVoteActor}
                                            type="actor"
                                            data={actor}
                                        />
                                    ),
                            )}
                            {session?.user && (!actor.isReviewed || isEditMode) && (
                                <TextEditorForm
                                    review={review}
                                    setReview={setReview}
                                    rating={rating}
                                    setRating={setRating}
                                    isEditMode={isEditMode}
                                    setIsEditMode={setIsEditMode}
                                    setOpen={setOpen}
                                    textEditorRef={textEditorRef}
                                    handleFocusReview={handleFocusReview}
                                    onSubmitReview={onSubmitReview}
                                    onSubmitUpdateReview={onSubmitUpdateReview}
                                />
                            )}
                            {actor.totalReviews > 0 && (
                                <PaginationControl
                                    currentPage={Number(searchParamsValues.reviewsPage)}
                                    pageCount={reviewsPageCount}
                                    urlParamName="reviewsPage"
                                />
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={actor.starredMovies} type="actor" roleData="Movies" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.starredMoviesPage)}
                    pageCount={starredMoviesPageCount}
                    urlParamName="starredMoviesPage"
                />
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 6 }}>
                <ListDetail data={actor.starredSeries} type="actor" roleData="Series" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.starredSeriesPage)}
                    pageCount={starredSeriesPageCount}
                    urlParamName="starredSeriesPage"
                />
            </Box>
        </Stack>
    );
}
