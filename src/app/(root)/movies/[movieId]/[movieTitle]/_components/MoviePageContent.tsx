"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack } from "@mui/material";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import * as CONSTANTS from "@/constants/Constants";
import { TextEditorForm } from "@/components/root/textEditorForm/TextEditorForm";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import { Movie } from "@prisma/client";
import { onBookmarkMovie, onRemoveBookmarkMovie } from "@/utils/features/movieFeaturesUtils";
import { removeDownvoteMovieReview, addDownvoteMovieReview } from "@/actions/user/userDownvotes.actions";
import { addReviewMovie, removeReviewMovie, updateReviewMovie } from "@/actions/user/userReviews.actions";
import { removeUpvoteMovieReview, addUpvoteMovieReview } from "@/actions/user/userUpvotes.actions";

interface IMoviePageContentProps {
    searchParamsValues: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: number;
        reviewsSortBy: string;
        castPage: number;
        crewPage: number;
    };
    movie: any;
    relatedMovies: Movie[] | null;
    reviewsPageCount: number;
    castPageCount: number;
    crewPageCount: number;
}

export default function MoviePageContent({
    searchParamsValues,
    movie,
    relatedMovies,
    reviewsPageCount,
    castPageCount,
    crewPageCount,
}: IMoviePageContentProps) {
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
        if (!session?.user || !movie) return;

        try {
            await addReviewMovie({
                movieId: movie.id,
                userId: Number(session.user.id),
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
        if (!session?.user || !movie) return;

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
                            await removeReviewMovie({
                                movieId: movie.id,
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
        if (!session?.user || !movie) return;

        try {
            await updateReviewMovie({
                movieId: movie.id,
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
    async function onUpvoteMovie(movieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !movieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteMovieReview({ userId: Number(session?.user?.id), movieId: movie.id, movieReviewId });
            } else {
                await removeDownvoteMovieReview({
                    userId: Number(session?.user?.id),
                    movieId: movie.id,
                    movieReviewId,
                });

                await addUpvoteMovieReview({ userId: Number(session?.user?.id), movieId: movie.id, movieReviewId });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while upvoting the movie.");
            }
        }
    }

    async function onDownVoteMovie(movieReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!movie && !movieReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteMovieReview({
                    userId: Number(session?.user?.id),
                    movieId: movie.id,
                    movieReviewId,
                });
            } else {
                await removeUpvoteMovieReview({ userId: Number(session?.user?.id), movieId: movie.id, movieReviewId });
                await addDownvoteMovieReview({ userId: Number(session?.user?.id), movieId: movie.id, movieReviewId });
            }
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while downvoting the movie.");
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
                data={movie}
                type="movie"
                isBookmarked={movie.isBookmarked}
                onBookmark={() => onBookmarkMovie(session!, movie)}
                onRemoveBookmark={() => onRemoveBookmarkMovie(session!, movie)}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: movie.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {movie.reviews!.length > 0 && (
                    <ReviewsHeader
                        data={movie}
                        sortingDataType="reviews"
                        sortBy={searchParamsValues.reviewsSortBy!}
                        ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                    />
                )}
                {movie.reviews!.map(
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
                                handleUpvote={onUpvoteMovie}
                                handleDownvote={onDownVoteMovie}
                                type="movie"
                                data={movie}
                                handleOpenUpvotesModal={handleOpenUpvotesModal}
                                handleOpenDownvotesModal={handleOpenDownvotesModal}
                            />
                        ),
                )}
                {session?.user && (!movie.isReviewed || isEditMode) && (
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
                {movie.totalReviews > 0 && (
                    <PaginationControl
                        currentPage={Number(searchParamsValues.reviewsPage)!}
                        pageCount={reviewsPageCount}
                    />
                )}
            </Box>
            {relatedMovies && relatedMovies.length !== 0 && (
                <ListDetail data={relatedMovies} type="movie" roleData="related" />
            )}
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={movie.cast} type="actor" roleData="cast" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.castPage)}
                    pageCount={castPageCount}
                    urlParamName="castPage"
                />
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={movie.crew} type="crew" roleData="production" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.crewPage)}
                    pageCount={crewPageCount}
                    urlParamName="crewPage"
                />
            </Box>
        </Stack>
    );
}
