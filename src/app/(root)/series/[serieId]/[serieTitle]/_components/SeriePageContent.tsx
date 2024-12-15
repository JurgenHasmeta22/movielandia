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
import { Serie } from "@prisma/client";
import { onBookmarkSerie, onRemoveBookmarkSerie } from "@/utils/features/serieFeaturesUtils";
import { removeDownvoteSerieReview, addDownvoteSerieReview } from "@/actions/user/userDownvotes.actions";
import { addReviewSerie, removeReviewSerie, updateReviewSerie } from "@/actions/user/userReviews.actions";
import { removeUpvoteSerieReview, addUpvoteSerieReview } from "@/actions/user/userUpvotes.actions";

interface ISeriePageContentProps {
    searchParamsValues: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: number;
        reviewsSortBy: string;
        castPage: number;
        crewPage: number;
        seasonsPage: number;
    };
    serie: any;
    relatedSeries: Serie[] | null;
    reviewsPageCount: number;
    castPageCount: number;
    crewPageCount: number;
    seasonsPageCount: number;
}

export default function SeriePageContent({
    searchParamsValues,
    serie,
    relatedSeries,
    reviewsPageCount,
    castPageCount,
    crewPageCount,
    seasonsPageCount,
}: ISeriePageContentProps) {
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
        if (!session?.user || !serie) return;

        try {
            await addReviewSerie({
                serieId: serie.id,
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
        if (!session?.user || !serie) return;

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
                            await removeReviewSerie({
                                serieId: serie.id,
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
        if (!session?.user || !serie) return;

        try {
            await updateReviewSerie({
                serieId: serie.id,
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
    async function onUpvoteSerie(serieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !serieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie.id, serieReviewId });
            } else {
                await removeDownvoteSerieReview({
                    userId: Number(session?.user?.id),
                    serieId: serie.id,
                    serieReviewId,
                });

                await addUpvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie.id, serieReviewId });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while upvoting the serie.");
            }
        }
    }

    async function onDownVoteSerie(serieReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!serie && !serieReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteSerieReview({
                    userId: Number(session?.user?.id),
                    serieId: serie.id,
                    serieReviewId,
                });
            } else {
                await removeUpvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie.id, serieReviewId });
                await addDownvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie.id, serieReviewId });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while downvoting the serie.");
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
                data={serie}
                type="serie"
                isBookmarked={serie.isBookmarked}
                onBookmark={() => onBookmarkSerie(session!, serie)}
                onRemoveBookmark={() => onRemoveBookmarkSerie(session!, serie)}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: serie.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {serie.reviews!.length > 0 && (
                    <ReviewsHeader
                        data={serie}
                        sortingDataType="reviews"
                        sortBy={searchParamsValues.reviewsSortBy!}
                        ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                    />
                )}
                {serie.reviews!.map(
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
                                handleUpvote={onUpvoteSerie}
                                handleDownvote={onDownVoteSerie}
                                type="serie"
                                data={serie}
                                handleOpenUpvotesModal={handleOpenUpvotesModal}
                                handleOpenDownvotesModal={handleOpenDownvotesModal}
                            />
                        ),
                )}
                {session?.user && (!serie.isReviewed || isEditMode) && (
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
                {serie.totalReviews > 0 && (
                    <PaginationControl
                        currentPage={Number(searchParamsValues.reviewsPage)}
                        pageCount={reviewsPageCount}
                        urlParamName="reviewsPage"
                    />
                )}
            </Box>
            {relatedSeries && relatedSeries.length !== 0 && (
                <ListDetail data={relatedSeries} type="serie" roleData="related" />
            )}
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={serie.seasons} type="season" roleData="season" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.seasonsPage)}
                    pageCount={seasonsPageCount}
                    urlParamName="seasonsPage"
                />
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={serie.cast} type="actor" roleData="cast" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.castPage)}
                    pageCount={castPageCount}
                    urlParamName="castPage"
                />
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={serie.crew} type="crew" roleData="production" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.crewPage)}
                    pageCount={crewPageCount}
                    urlParamName="crewPage"
                />
            </Box>
        </Stack>
    );
}
