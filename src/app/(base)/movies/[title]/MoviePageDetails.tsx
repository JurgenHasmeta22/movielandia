/* eslint-disable @typescript-eslint/no-unused-vars */
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
    addDownvoteMovieReview,
    addFavoriteMovieToUser,
    addReviewMovie,
    addUpvoteMovieReview,
    removeDownvoteMovieReview,
    removeFavoriteMovieToUser,
    removeReviewMovie,
    removeUpvoteMovieReview,
    updateReviewMovie,
} from "@/lib/actions/user.action";

export default function MoviePageDetails({ searchParamsValues, movie, latestMovies, relatedMovies, pageCount }: any) {
    const { data: session } = useSession();

    const [review, setReview] = useState<string>("");
    const [rating, setRating] = useState<number | null>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [openVotesModal, setIsOpenVotesModal] = useState(false);

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
    async function onBookmarkMovie() {
        if (!session?.user || !movie) return;

        try {
            const response = await addFavoriteMovieToUser(movie?.id, session?.user?.id);

            if (response) {
                setUser(response);
            }
        } catch (error) {
            toast.error("An error occurred while adding the movie to favorites.");
        }
    }

    async function onRemoveBookmarkMovie() {
        if (!session?.user || !movie) return;

        try {
            const response = await removeFavoriteMovieToUser(movie?.id, session?.user?.id);

            if (response) {
                setUser(response);
            }
        } catch (error) {
            toast.error("An error occurred while removing the movie from favorites.");
        }
    }
    // #endregion

    // #region "Reviews"
    async function onSubmitReview() {
        if (!session?.user || !movie) return;

        try {
            const response = await addReviewMovie({
                movieId: movie?.id,
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
        if (!session?.user || !movie) return;

        // openModal({
        //     onClose: () => setOpen(false),
        //     title: "Remove Review",
        //     actions: [
        //         {
        //             label: CONSTANTS.MODAL__DELETE__NO,
        //             onClick: () => setOpen(false),
        //             color: "secondary",
        //             variant: "contained",
        //             sx: {
        //                 bgcolor: "#ff5252",
        //             },
        //             icon: <WarningOutlined />,
        //         },
        //         {
        //             label: CONSTANTS.MODAL__DELETE__YES,
        //             onClick: async () => {
        //                 try {
        //                     const response = await removeReviewMovie({ movieId: movie?.id, userId: session?.user?.id });

        //                     if (response && !response.error) {
        //                         setReview("");
        //                         setUser(response);
        //                         toast.success("Review removed successfully!");
        //                     } else {
        //                         toast.error("Review removal failed!");
        //                     }
        //                 } catch (error) {
        //                     toast.error("An error occurred while trying to remove the review.");
        //                 }
        //             },
        //             type: "submit",
        //             color: "secondary",
        //             variant: "contained",
        //             sx: {
        //                 bgcolor: "#30969f",
        //             },
        //             icon: <CheckOutlined />,
        //         },
        //     ],
        //     subTitle: "Are you sure that you want to delete this review ?",
        // });
    }

    async function onSubmitUpdateReview() {
        if (!session?.user || !movie) return;

        try {
            const response = await updateReviewMovie({
                moviedId: movie?.id,
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
    async function onUpvoteMovie(movieReviewId: number, isAlreadyUpvoted: boolean) {
        if (!session?.user || !movieReviewId) return;

        try {
            if (isAlreadyUpvoted) {
                await removeUpvoteMovieReview({ userId: session?.user?.id, movieId: movie?.id, movieReviewId });
            } else {
                await removeDownvoteMovieReview({ userId: session?.user?.id, movieId: movie?.id, movieReviewId });
                await addUpvoteMovieReview({ userId: session?.user?.id, movieId: movie?.id, movieReviewId });
            }
        } catch (error) {
            toast.error("An error occurred while adding the upvote to movie review.");
        }
    }

    async function onDownVoteMovie(movieReviewId: number, isAlreadyDownvoted: boolean) {
        if (!session?.user || (!movie && !movieReviewId)) return;

        try {
            if (isAlreadyDownvoted) {
                await removeDownvoteMovieReview({ userId: session?.user?.id, movieId: movie?.id, movieReviewId });
            } else {
                await removeUpvoteMovieReview({ userId: session?.user?.id, movieId: movie?.id, movieReviewId });
                await addDownvoteMovieReview({ userId: session?.user?.id, movieId: movie?.id, movieReviewId });
            }
        } catch (error) {
            toast.error("An error occurred while adding the downvoted to movie review.");
        }
    }
    // #endregion

    // #region "Modal handlers"
    const handleOpenUpvotesModal = (reviewData: any) => {
        setListModalDataType("upvotes");
        const hasMoreUpvotes = reviewData?._count?.upvotes !== reviewData?.upvotes?.length;
        setHasMoreUpvotesModal(hasMoreUpvotes);
        setSelectedReview(reviewData);

        // openModal({
        //     onClose: () => handleCloseModal(),
        //     title: "Users who upvoted this review",
        //     subTitle: "Users list",
        //     hasList: true,
        // });
    };

    const handleOpenDownvotesModal = (reviewData: any) => {
        setListModalDataType("downvotes");
        const hasMoreDownvotes = reviewData?._count?.downvotes !== reviewData?.downvotes?.length;
        setHasMoreDownvotesModal(hasMoreDownvotes);
        setSelectedReview(reviewData);

        // openModal({
        //     onClose: () => handleCloseModal(),
        //     title: "Users who downvoted this review",
        //     subTitle: "Users list",
        //     hasList: true,
        // });
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
            <DetailsPageCard data={movie} type="movie" />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 2,
                    mb: movie?.reviews!.length > 0 ? 4 : 0,
                }}
                component={"section"}
            >
                {movie?.reviews!.length > 0 && (
                    <Reviews
                        data={movie}
                        sortBy={searchParamsValues.sortBy!}
                        ascOrDesc={searchParamsValues.ascOrDesc!}
                    />
                )}
                {movie?.reviews!.map((review: any, index: number) => (
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
                ))}
                {movie?.totalReviews > 0 && (
                    <PaginationControl currentPage={Number(searchParamsValues.page)!} pageCount={pageCount} />
                )}
                {/* {session?.user && (!movie.isReviewed) && <TextEditorForm review={review} rating={rating} />} */}
            </Box>
            <ListDetail data={latestMovies!} type="movie" roleData={"latest"} />
            <ListDetail data={relatedMovies!} type="movie" roleData="related" />
        </Stack>
    );
}
