"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack } from "@mui/material";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { TextEditorForm } from "@/components/root/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import { Season } from "@prisma/client";
import { onBookmarkSeason, onRemoveBookmarkSeason } from "@/utils/features/seasonFeaturesUtils";
import { removeDownvoteSeasonReview, addDownvoteSeasonReview } from "@/actions/user/userDownvotes.actions";
import { addReviewSeason, removeReviewSeason, updateReviewSeason } from "@/actions/user/userReviews.actions";
import { removeUpvoteSeasonReview, addUpvoteSeasonReview } from "@/actions/user/userUpvotes.actions";

interface ISeasonPageContentProps {
    searchParamsValues: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: number;
        reviewsSortBy: string;
        episodesPage: number;
        relatedPage: number;
    };
    season: any;
    relatedSeasons: Season[] | null;
    reviewsPageCount: number;
    episodesPageCount: number;
    relatedPageCount: number;
}

export default function SeasonPageContent({
    searchParamsValues,
    season,
    relatedSeasons,
    reviewsPageCount,
    episodesPageCount,
    relatedPageCount,
}: ISeasonPageContentProps) {
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
        setIsOpenVotesModal,
        openModal,
        textEditorRef,
        reviewRef,
        setListModalDataType,
        setUpvotesPageModal,
        setDownvotesPageModal,
        setSelectedReview,
        setHasMoreDownvotesModal,
        setHasMoreUpvotesModal,
    } = usePageDetailsData();
    // #endregion

    // #region "Handlers functions"

    // #region "Review"
    async function onSubmitReview() {
        if (!session?.user || !season) return;

        try {
            await addReviewSeason({
                seasonId: season.id,
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
        if (!session?.user || !season) return;

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
                            await removeReviewSeason({
                                seasonId: season.id,
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
        if (!session?.user || !season) return;

        try {
            await updateReviewSeason({
                seasonId: season.id,
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
    async function onUpvoteSeason(seasonReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !seasonReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season.id,
                    seasonReviewId,
                });
            } else {
                await removeDownvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season.id,
                    seasonReviewId,
                });

                await addUpvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season.id,
                    seasonReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while upvoting the season.");
            }
        }
    }

    async function onDownVoteSeason(seasonReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!season && !seasonReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season.id,
                    seasonReviewId,
                });
            } else {
                await removeUpvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season.id,
                    seasonReviewId,
                });

                await addDownvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season.id,
                    seasonReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while downvoting the season.");
            }
        }
    }
    // #endregion

    // #region "Modal handlers"
    const handleOpenUpvotesModal = (reviewData: any) => {
        setListModalDataType("upvotes");
        const hasMoreUpvotes = reviewData?._count?.upvotes !== reviewData?.upvotes?.length;
        setHasMoreUpvotesModal(hasMoreUpvotes);
        setSelectedReview(reviewData);

        openModal({
            onClose: () => handleCloseModal(),
            title: "Users who upvoted this review",
            subTitle: "Users list",
            hasList: true,
        });
    };

    const handleOpenDownvotesModal = (reviewData: any) => {
        setListModalDataType("downvotes");
        const hasMoreDownvotes = reviewData?._count?.downvotes !== reviewData?.downvotes?.length;
        setHasMoreDownvotesModal(hasMoreDownvotes);
        setSelectedReview(reviewData);

        openModal({
            onClose: () => handleCloseModal(),
            title: "Users who downvoted this review",
            subTitle: "Users list",
            hasList: true,
        });
    };

    const handleCloseModal = () => {
        setIsOpenVotesModal(false);
        setListModalDataType(null);
        setUpvotesPageModal(1);
        setDownvotesPageModal(1);
        setSelectedReview(null);
    };
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
                data={season}
                type="season"
                isBookmarked={season.isBookmarked}
                onBookmark={() => onBookmarkSeason(session!, season)}
                onRemoveBookmark={() => onRemoveBookmarkSeason(session!, season)}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: season.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {season.reviews!.length > 0 && (
                    <ReviewsHeader
                        data={season}
                        sortingDataType="reviews"
                        sortBy={searchParamsValues.reviewsSortBy!}
                        ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                    />
                )}
                {season.reviews!.map(
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
                                handleUpvote={onUpvoteSeason}
                                handleDownvote={onDownVoteSeason}
                                type="season"
                                data={season}
                                handleOpenUpvotesModal={handleOpenUpvotesModal}
                                handleOpenDownvotesModal={handleOpenDownvotesModal}
                            />
                        ),
                )}
                {session?.user && (!season.isReviewed || isEditMode) && (
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
                {season.totalReviews > 0 && (
                    <PaginationControl
                        currentPage={Number(searchParamsValues.reviewsPage)!}
                        pageCount={reviewsPageCount}
                        urlParamName="reviewsPage"
                    />
                )}
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={season.episodes} type="episode" roleData="episode" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.episodesPage)}
                    pageCount={episodesPageCount}
                    urlParamName="episodesPage"
                />
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={relatedSeasons!} type="season" roleData="related" />
                {relatedSeasons && (
                    <PaginationControl
                        currentPage={searchParamsValues.relatedPage}
                        pageCount={relatedPageCount}
                        urlParamName="relatedPage"
                    />
                )}
            </Box>
        </Stack>
    );
}
