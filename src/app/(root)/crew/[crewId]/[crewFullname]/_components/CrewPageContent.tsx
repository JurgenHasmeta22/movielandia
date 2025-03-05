"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { TextEditorForm } from "@/components/root/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import { onBookmarkCrew, onRemoveBookmarkCrew } from "@/utils/features/crewFeaturesUtils";
import { removeDownvoteCrewReview, addDownvoteCrewReview } from "@/actions/user/userDownvotes.actions";
import { addReviewCrew, removeReviewCrew, updateReviewCrew } from "@/actions/user/userReviews.actions";
import { removeUpvoteCrewReview, addUpvoteCrewReview } from "@/actions/user/userUpvotes.actions";

interface ICrewPageContentProps {
    searchParamsValues: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: number;
        reviewsSortBy: string;
        producedMoviesPage: number;
        producedSeriesPage: number;
    };
    crew: any;
    reviewsPageCount: number;
    producedMoviesPageCount: number;
    producedSeriesPageCount: number;
}

export default function CrewPageContent({
    searchParamsValues,
    crew,
    reviewsPageCount,
    producedMoviesPageCount,
    producedSeriesPageCount,
}: ICrewPageContentProps) {
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
        if (!session?.user || !crew) return;

        try {
            await addReviewCrew({
                crewId: crew.id,
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
        if (!session?.user || !crew) return;

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
                            await removeReviewCrew({
                                crewId: crew.id,
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
        if (!session?.user || !crew) return;

        try {
            await updateReviewCrew({
                crewId: crew.id,
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
    async function onUpvoteCrew(crewReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !crewReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteCrewReview({
                    userId: Number(session?.user?.id),
                    crewId: crew.id,
                    crewReviewId,
                });
            } else {
                await removeDownvoteCrewReview({
                    userId: Number(session?.user?.id),
                    crewId: crew.id,
                    crewReviewId,
                });

                await addUpvoteCrewReview({
                    userId: Number(session?.user?.id),
                    crewId: crew.id,
                    crewReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while upvoting the crew.");
            }
        }
    }

    async function onDownVoteCrew(crewReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!crew && !crewReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteCrewReview({
                    userId: Number(session?.user?.id),
                    crewId: crew.id,
                    crewReviewId,
                });
            } else {
                await removeUpvoteCrewReview({
                    userId: Number(session?.user?.id),
                    crewId: crew.id,
                    crewReviewId,
                });

                await addDownvoteCrewReview({
                    userId: Number(session?.user?.id),
                    crewId: crew.id,
                    crewReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while downvoting the crew.");
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
                data={crew}
                type="crew"
                isBookmarked={crew.isBookmarked}
                onBookmark={() => onBookmarkCrew(session!, crew)}
                onRemoveBookmark={() => onRemoveBookmarkCrew(session!, crew)}
            />
            <Box
                sx={{
                    maxWidth: "1000px",
                    width: "100%",
                    mx: "auto",
                    px: { xs: 2, sm: 3 },
                    py: 4,
                }}
            >
                {/* Reviews Header Section */}
                <Box 
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        mb: 4,
                        pb: 2,
                        borderBottom: `1px solid ${theme.vars.palette.divider}`,
                    }}
                >
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: theme.vars.palette.text.primary,
                                }}
                            >
                                User Reviews
                            </Typography>
                            {crew.totalReviews >= 0 && (
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        color: theme.vars.palette.text.secondary,
                                    }}
                                >
                                    ({crew.totalReviews})
                                </Typography>
                            )}
                        </Box>
                        {crew.reviews?.length > 0 && (
                            <Box sx={{ minWidth: 200 }}>
                                <ReviewsHeader
                                    data={crew}
                                    sortingDataType="reviews"
                                    sortBy={searchParamsValues.reviewsSortBy!}
                                    ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Write Review Section */}
                {session?.user && (!crew.isReviewed || isEditMode) && (
                    <Box 
                        sx={{ 
                            mb: 4,
                            p: 3,
                            bgcolor: theme.vars.palette.background.paper,
                            borderRadius: 1,
                            border: `1px solid ${theme.vars.palette.divider}`,
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2,
                                fontWeight: 600,
                                color: theme.vars.palette.text.primary 
                            }}
                        >
                            {isEditMode ? "Edit your review" : "Write a review"}
                        </Typography>
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
                    </Box>
                )}

                {/* Reviews List Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {crew.reviews && crew.reviews.length > 0 ? (
                        crew.reviews.map(
                            (review: any, index: number) =>
                                (!isEditMode || review.user.id !== Number(session?.user?.id)) && (
                                    <Box
                                        key={index}
                                        sx={{
                                            bgcolor: theme.vars.palette.background.paper,
                                            borderRadius: 1,
                                            border: `1px solid ${theme.vars.palette.divider}`,
                                            p: { xs: 2, sm: 3 },
                                            '&:hover': {
                                                bgcolor: theme.vars.palette.action.hover,
                                            }
                                        }}
                                    >
                                        <Review
                                            review={review}
                                            handleRemoveReview={onSubmitRemoveReview}
                                            isEditMode={isEditMode}
                                            setIsEditMode={setIsEditMode}
                                            setReview={setReview}
                                            handleFocusTextEditor={handleFocusTextEditor}
                                            ref={reviewRef}
                                            setRating={setRating}
                                            handleUpvote={onUpvoteCrew}
                                            handleDownvote={onDownVoteCrew}
                                            type="crew"
                                            data={crew}
                                        />
                                    </Box>
                                )
                        )
                    ) : (
                        <Box 
                            sx={{
                                textAlign: "center",
                                py: 6,
                                bgcolor: theme.vars.palette.background.paper,
                                borderRadius: 1,
                                border: `1px solid ${theme.vars.palette.divider}`,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: theme.vars.palette.text.secondary,
                                    mb: 1
                                }}
                            >
                                No reviews yet
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.vars.palette.text.secondary
                                }}
                            >
                                Be the first to review this crew member!
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Pagination Section */}
                {crew.totalReviews > 0 && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <PaginationControl
                            currentPage={Number(searchParamsValues.reviewsPage)}
                            pageCount={reviewsPageCount}
                            urlParamName="reviewsPage"
                        />
                    </Box>
                )}
            </Box>

            {/* Produced Movies Section */}
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={crew.producedMovies} type="crew" roleData="Movies" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.producedMoviesPage)}
                    pageCount={producedMoviesPageCount}
                    urlParamName="producedMoviesPage"
                />
            </Box>

            {/* Produced Series Section */}
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 6 }}>
                <ListDetail data={crew.producedSeries} type="crew" roleData="Series" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.producedSeriesPage)}
                    pageCount={producedSeriesPageCount}
                    urlParamName="producedSeriesPage"
                />
            </Box>
        </Stack>
    );
}
