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
    addDownvoteSeasonReview,
    addFavoriteSeasonToUser,
    addReviewSeason,
    addUpvoteSeasonReview,
    removeDownvoteSeasonReview,
    removeFavoriteSeasonToUser,
    removeReviewSeason,
    removeUpvoteSeasonReview,
    updateReviewSeason,
} from "@/lib/actions/user.actions";
import { useModal } from "@/providers/ModalProvider";
import { TextEditorForm } from "@/components/root/features/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/lib/toast/toast";

export default function SeasonPage({ searchParamsValues, season, latestSeasons, relatedSeasons, pageCount }: any) {
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

    // #region "Handlers functions"

    // #region "Bookmarks"
    async function onBookmarkSeason() {
        if (!session?.user || !season) return;

        try {
            await addFavoriteSeasonToUser(Number(session.user.id), season.id);
            showToast("success", "Season added to favorites!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error adding season to favorites: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error adding season to favorites.");
                showToast("error", "An unexpected error occurred while adding the season to favorites.");
            }
        }
    }

    async function onRemoveBookmarkSeason() {
        if (!session?.user || !season) return;

        try {
            await removeFavoriteSeasonToUser(Number(session.user.id), season.id, `/seasons/${season.title}`);
            showToast("success", "Season removed from favorites!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error removing season from favorites: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error removing season from favorites.");
                showToast("error", "An unexpected error occurred while removing the season from favorites.");
            }
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!session?.user || !season) return;

        try {
            await addReviewSeason({
                seasonId: season?.id,
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
                                seasonId: season?.id,
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
                seasonId: season?.id,
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
    async function onUpvoteSeason(seasonReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !seasonReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season?.id,
                    seasonReviewId,
                });
            } else {
                await removeDownvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season?.id,
                    seasonReviewId,
                });

                await addUpvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season?.id,
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
                    seasonId: season?.id,
                    seasonReviewId,
                });
            } else {
                await removeUpvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season?.id,
                    seasonReviewId,
                });

                await addDownvoteSeasonReview({
                    userId: Number(session?.user?.id),
                    seasonId: season?.id,
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
                data={season}
                type="season"
                isSeasonBookmarked={season.isBookmarked}
                onBookmarkSeason={onBookmarkSeason}
                onRemoveBookmarkSeason={onRemoveBookmarkSeason}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: season?.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {season?.reviews!.length > 0 && (
                    <Reviews
                        data={season}
                        sortBy={searchParamsValues.sortBy!}
                        ascOrDesc={searchParamsValues.ascOrDesc!}
                    />
                )}
                {season?.reviews!.map((review: any, index: number) => (
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
                ))}
                {season?.totalReviews > 0 && (
                    <PaginationControl currentPage={Number(searchParamsValues.page)!} pageCount={pageCount} />
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
            </Box>
            <ListDetail data={latestSeasons!} type="season" roleData="latest" />
            <ListDetail data={relatedSeasons!} type="season" roleData="related" />
        </Stack>
    );
}
