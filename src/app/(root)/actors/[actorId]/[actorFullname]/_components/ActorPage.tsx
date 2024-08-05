"use client";

import { DetailsPageCard } from "@/components/root/ui/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/ui/listDetail/ListDetail";
import Review from "@/components/root/features/review/Review";
import { Box, Stack } from "@mui/material";
import { useSession } from "next-auth/react";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/store";
import {
    addDownvoteActorReview,
    addFavoriteActorToUser,
    addReviewActor,
    addUpvoteActorReview,
    removeDownvoteActorReview,
    removeFavoriteActorToUser,
    removeReviewActor,
    removeUpvoteActorReview,
    updateReviewActor,
} from "@/lib/actions/user.actions";
import { useModal } from "@/providers/ModalProvider";
import { TextEditorForm } from "@/components/root/features/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/lib/toast/toast";
import ReviewsHeader from "@/components/root/features/reviewsHeader/ReviewsHeader";

export default function ActorPage({ searchParamsValues, actor, pageCount }: any) {
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
    async function onBookmarkActor() {
        if (!session?.user || !actor) return;

        try {
            await addFavoriteActorToUser(Number(session.user.id), actor.id);
            showToast("success", "Actor added to favorites!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error adding actor to favorites: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error adding actor to favorites.");
                showToast("error", "An unexpected error occurred while adding the actor to favorites.");
            }
        }
    }

    async function onRemoveBookmarkActor() {
        if (!session?.user || !actor) return;

        try {
            await removeFavoriteActorToUser(Number(session.user.id), actor.id, `/actors/${actor.title}`);
            showToast("success", "Actor removed from favorites!");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error removing actor from favorites: ${error.message}`);
                showToast("error", `An error occurred: ${error.message}`);
            } else {
                console.error("Unknown error removing actor from favorites.");
                showToast("error", "An unexpected error occurred while removing the actor from favorites.");
            }
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!session?.user || !actor) return;

        try {
            await addReviewActor({
                actorId: actor?.id,
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
                                actorId: actor?.id,
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
                actorId: actor?.id,
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
    async function onUpvoteActor(actorReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !actorReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor?.id,
                    actorReviewId,
                });
            } else {
                await removeDownvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor?.id,
                    actorReviewId,
                });

                await addUpvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor?.id,
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
                    actorId: actor?.id,
                    actorReviewId,
                });
            } else {
                await removeUpvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor?.id,
                    actorReviewId,
                });

                await addDownvoteActorReview({
                    userId: Number(session?.user?.id),
                    actorId: actor?.id,
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
                data={actor}
                type="actor"
                isBookmarked={actor.isBookmarked}
                onBookmark={onBookmarkActor}
                onRemoveBookmark={onRemoveBookmarkActor}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: actor?.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {actor?.reviews!.length > 0 && (
                    <ReviewsHeader
                        data={actor}
                        sortBy={searchParamsValues.sortBy!}
                        ascOrDesc={searchParamsValues.ascOrDesc!}
                    />
                )}
                {actor?.reviews!.map((review: any, index: number) => (
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
                        handleOpenUpvotesModal={handleOpenUpvotesModal}
                        handleOpenDownvotesModal={handleOpenDownvotesModal}
                    />
                ))}
                {actor?.totalReviews > 0 && (
                    <PaginationControl currentPage={Number(searchParamsValues.page)!} pageCount={pageCount} />
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
            </Box>
            <ListDetail data={actor.starredMovies!} type="actor" roleData="Movies" />
            <ListDetail data={actor.starredSeries!} type="actor" roleData="Series" />
        </Stack>
    );
}
