"use client";

import { DetailsPageCard } from "@/components/root/ui/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/ui/listDetail/ListDetail";
import Review from "@/components/root/features/review/Review";
import Reviews from "@/components/root/features/reviews/Reviews";
import { Box, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/store";
import {
    addDownvoteSerieReview,
    addFavoriteSerieToUser,
    addReviewSerie,
    addUpvoteSerieReview,
    removeDownvoteSerieReview,
    removeFavoriteSerieToUser,
    removeReviewSerie,
    removeUpvoteSerieReview,
    updateReviewSerie,
} from "@/lib/actions/user.actions";
import { useModal } from "@/providers/ModalProvider";
import { TextEditorForm } from "@/components/root/features/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/lib/toast/toast";

export default function SeriePage({ searchParamsValues, serie, latestSeries, relatedSeries, pageCount }: any) {
    // #region "Data for the page, session hook, state, refs, custom hooks, zustand"
    const { data: session } = useSession();

    const [review, setReview] = useState<string>("");
    const [rating, setRating] = useState<number | null>(0);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openVotesModal, setIsOpenVotesModal] = useState(false);

    const { openModal } = useModal();
    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);

    const {
        setListModalDataType,
        setUpvotesPageModal,
        setDownvotesPageModal,
        setSelectedReview,
        setHasMoreDownvotesModal,
        setHasMoreUpvotesModal,
    } = useStore();
    // #endregion

    // #region "Handlers functions"

    // #region "Bookmarks"
    async function onBookmarkSerie() {
        if (!session?.user || !serie) return;

        try {
            await addFavoriteSerieToUser(Number(session.user.id), serie.id);
            showToast("success", "Serie added to favorites!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error adding serie to favorites: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error adding serie to favorites.");
                showToast("error", "An unexpected error occurred while adding the serie to favorites.");
            }
        }
    }

    async function onRemoveBookmarkSerie() {
        if (!session?.user || !serie) return;

        try {
            await removeFavoriteSerieToUser(Number(session.user.id), serie.id, `/series/${serie.title}`);
            showToast("success", "Serie removed from favorites!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error removing serie from favorites: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error removing serie from favorites.");
                showToast("error", "An unexpected error occurred while removing the serie from favorites.");
            }
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!session?.user || !serie) return;

        try {
            await addReviewSerie({
                serieId: serie?.id,
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
                                serieId: serie?.id,
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
                serieId: serie?.id,
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
    async function onUpvoteSerie(serieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !serieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie?.id, serieReviewId });
            } else {
                await removeDownvoteSerieReview({
                    userId: Number(session?.user?.id),
                    serieId: serie?.id,
                    serieReviewId,
                });

                await addUpvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie?.id, serieReviewId });
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
                    serieId: serie?.id,
                    serieReviewId,
                });
            } else {
                await removeUpvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie?.id, serieReviewId });
                await addDownvoteSerieReview({ userId: Number(session?.user?.id), serieId: serie?.id, serieReviewId });
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
                data={serie}
                type="serie"
                isSerieBookmarked={serie.isBookmarked}
                onBookmarkSerie={onBookmarkSerie}
                onRemoveBookmarkSerie={onRemoveBookmarkSerie}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: serie?.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {serie?.reviews!.length > 0 && (
                    <Reviews
                        data={serie}
                        sortBy={searchParamsValues.sortBy!}
                        ascOrDesc={searchParamsValues.ascOrDesc!}
                    />
                )}
                {serie?.reviews!.map((review: any, index: number) => (
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
                ))}
                {serie?.totalReviews > 0 && (
                    <PaginationControl currentPage={Number(searchParamsValues.page)!} pageCount={pageCount} />
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
            </Box>
            <ListDetail data={latestSeries!} type="serie" roleData="latest" />
            <ListDetail data={relatedSeries!} type="serie" roleData="related" />
            <ListDetail data={serie?.seasons} type="season" roleData="season" />
            <ListDetail data={serie.cast} type="actor" roleData="cast" />
        </Stack>
    );
}
