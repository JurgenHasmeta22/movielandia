"use client";

import { DetailsPageCard } from "@/components/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/paginationControl/PaginationControl";
import { ListDetail } from "@/components/listDetail/ListDetail";
import Review from "@/components/review/Review";
import Reviews from "@/components/reviews/Reviews";
import { Box, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
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
} from "@/lib/actions/user.action";
import { useModal } from "@/providers/ModalContext";
import { TextEditorForm } from "@/components/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";

export default function SeriePageDetails({ searchParamsValues, serie, latestSeries, relatedSeries, pageCount }: any) {
    const { data: session } = useSession();

    const [review, setReview] = useState<string>("");
    const [rating, setRating] = useState<number | null>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [open, setOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [openVotesModal, setIsOpenVotesModal] = useState(false);

    const { openModal } = useModal();

    const textEditorRef = useRef<any>(null);
    const reviewRef = useRef<any>(null);

    const {
        setUser,
        setListModalDataType,
        setUpvotesPageModal,
        setDownvotesPageModal,
        setSelectedReview,
        setHasMoreDownvotesModal,
        setHasMoreUpvotesModal,
    } = useStore();

    // #region "Handlers functions"

    // #region "Bookmarks"
    async function onBookmarkSerie() {
        if (!session?.user || !serie) return;

        try {
            await addFavoriteSerieToUser(Number(session?.user?.id), serie?.id);
        } catch (error) {
            toast.error("An error occurred while adding the serie to favorites.");
        }
    }

    async function onRemoveBookmarkSerie() {
        if (!session?.user || !serie) return;

        try {
            await removeFavoriteSerieToUser(Number(session?.user?.id), serie?.id);
        } catch (error) {
            toast.error("An error occurred while removing the serie from favorites.");
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!session?.user || !serie) return;

        try {
            const response = await addReviewSerie({
                serieId: serie?.id,
                userId: session?.user?.id,
                content: review,
                rating,
            });

            if (response) {
                setReview("");
                setRating(null);
                setUser(response);
                toast.success("Review submitted successfully!");
            } else {
                toast.error("Review submission failed!");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the review.");
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
                            const response = await removeReviewSerie({ serieId: serie?.id, userId: session?.user?.id });

                            if (response && !response.error) {
                                setReview("");
                                setUser(response);
                                toast.success("Review removed successfully!");
                            } else {
                                toast.error("Review removal failed!");
                            }
                        } catch (error) {
                            toast.error("An error occurred while trying to remove the review.");
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
            const response = await updateReviewSerie({
                seriedId: serie?.id,
                userId: session?.user?.id,
                content: review,
                rating,
            });

            if (response && !response.error) {
                setReview("");
                setRating(null);
                setIsEditMode(false);
                setUser(response);
                handleFocusReview();
                toast.success("Review updated successfully!");
            } else {
                toast.error("Review updation failed!");
            }
        } catch (error) {
            toast.error("An error occurred while updating the review.");
        }
    }
    // #endregion

    // #region "upvotes, downvotes"
    async function onUpvoteSerie(serieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !serieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteSerieReview({ userId: session?.user?.id, serieId: serie?.id, serieReviewId });
            } else {
                await removeDownvoteSerieReview({ userId: session?.user?.id, serieId: serie?.id, serieReviewId });
                await addUpvoteSerieReview({ userId: session?.user?.id, serieId: serie?.id, serieReviewId });
            }
        } catch (error) {
            toast.error("An error occurred while adding the upvote to serie review.");
        }
    }

    async function onDownVoteSerie(serieReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!serie && !serieReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteSerieReview({ userId: session?.user?.id, serieId: serie?.id, serieReviewId });
            } else {
                await removeUpvoteSerieReview({ userId: session?.user?.id, serieId: serie?.id, serieReviewId });
                await addDownvoteSerieReview({ userId: session?.user?.id, serieId: serie?.id, serieReviewId });
            }
        } catch (error) {
            toast.error("An error occurred while adding the downvoted to serie review.");
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
            <ListDetail data={latestSeries!} type="serie" roleData={"latest"} />
            <ListDetail data={relatedSeries!} type="serie" roleData="related" />
        </Stack>
    );
}
