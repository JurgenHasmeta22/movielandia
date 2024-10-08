"use client";

import { DetailsPageCard } from "@/components/root/ui/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/ui/listDetail/ListDetail";
import Review from "@/components/root/features/review/Review";
import { Box, Stack } from "@mui/material";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import {
    addDownvoteEpisodeReview,
    addReviewEpisode,
    addUpvoteEpisodeReview,
    removeDownvoteEpisodeReview,
    removeReviewEpisode,
    removeUpvoteEpisodeReview,
    updateReviewEpisode,
} from "@/actions/user.actions";
import { TextEditorForm } from "@/components/root/features/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/features/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import { Episode } from "@prisma/client";
import { onBookmarkEpisode, onRemoveBookmarkEpisode } from "@/utils/componentHelpers/features/episodeFeaturesUtils";

interface IEpisodePageContentProps {
    searchParamsValues: {
        ascOrDesc: string | undefined;
        page: number;
        sortBy: string;
    };
    episode: any;
    latestEpisodes: Episode[] | null;
    relatedEpisodes: Episode[] | null;
    pageCount: number;
}

export default function EpisodePage({
    searchParamsValues,
    episode,
    latestEpisodes,
    relatedEpisodes,
    pageCount,
}: IEpisodePageContentProps) {
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

    // #region "Reviews"
    async function onSubmitReview() {
        if (!session?.user || !episode) return;

        try {
            await addReviewEpisode({
                episodeId: episode.id,
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
        if (!session?.user || !episode) return;

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
                            await removeReviewEpisode({
                                episodeId: episode.id,
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
        if (!session?.user || !episode) return;

        try {
            await updateReviewEpisode({
                episodeId: episode.id,
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

    // #region "Upvotes, Downvotes"
    async function onUpvoteEpisode(episodeReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !episodeReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteEpisodeReview({
                    userId: Number(session?.user?.id),
                    episodeId: episode.id,
                    episodeReviewId,
                });
            } else {
                await removeDownvoteEpisodeReview({
                    userId: Number(session?.user?.id),
                    episodeId: episode.id,
                    episodeReviewId,
                });

                await addUpvoteEpisodeReview({
                    userId: Number(session?.user?.id),
                    episodeId: episode.id,
                    episodeReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while upvoting the episode.");
            }
        }
    }

    async function onDownVoteEpisode(episodeReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!episode && !episodeReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteEpisodeReview({
                    userId: Number(session?.user?.id),
                    episodeId: episode.id,
                    episodeReviewId,
                });
            } else {
                await removeUpvoteEpisodeReview({
                    userId: Number(session?.user?.id),
                    episodeId: episode.id,
                    episodeReviewId,
                });

                await addDownvoteEpisodeReview({
                    userId: Number(session?.user?.id),
                    episodeId: episode.id,
                    episodeReviewId,
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while downvoting the episode.");
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

    // #region "Focus functions"
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
                data={episode}
                type="episode"
                isBookmarked={episode.isBookmarked}
                onBookmark={() => onBookmarkEpisode(session!, episode)}
                onRemoveBookmark={() => onRemoveBookmarkEpisode(session!, episode)}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: episode.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {episode.reviews!.length > 0 && (
                    <ReviewsHeader
                        data={episode}
                        sortingDataType="reviews"
                        sortBy={searchParamsValues.sortBy!}
                        ascOrDesc={searchParamsValues.ascOrDesc!}
                    />
                )}
                {episode.reviews!.map((review: any, index: number) => (
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
                        handleUpvote={onUpvoteEpisode}
                        handleDownvote={onDownVoteEpisode}
                        type="episode"
                        data={episode}
                        handleOpenUpvotesModal={handleOpenUpvotesModal}
                        handleOpenDownvotesModal={handleOpenDownvotesModal}
                    />
                ))}
                {episode.totalReviews > 0 && (
                    <PaginationControl currentPage={Number(searchParamsValues.page)!} pageCount={pageCount} />
                )}
                {session?.user && (!episode.isReviewed || isEditMode) && (
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
            </Box>
            <ListDetail data={latestEpisodes!} type="episode" roleData="latest" />
            <ListDetail data={relatedEpisodes!} type="episode" roleData="related" />
        </Stack>
    );
}
