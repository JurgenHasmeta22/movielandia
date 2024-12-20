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
                data={crew}
                type="crew"
                isBookmarked={crew.isBookmarked}
                onBookmark={() => onBookmarkCrew(session!, crew)}
                onRemoveBookmark={() => onRemoveBookmarkCrew(session!, crew)}
            />
            <Box
                sx={{
                    maxWidth: "900px",
                    width: "100%",
                    mx: "auto",
                    my: 4,
                    "& .MuiAccordion-root": {
                        mb: 2,
                    },
                }}
            >
                <Accordion
                    defaultExpanded={false}
                    sx={{
                        bgcolor: theme.vars.palette.secondary.light,
                        borderRadius: "12px",
                        "&:before": {
                            display: "none",
                        },
                        "& .MuiAccordionSummary-root": {
                            borderRadius: "12px",
                            transition: "background-color 0.2s",
                            "&:hover": {
                                bgcolor: theme.vars.palette.secondary.dark,
                            },
                        },
                        "& .MuiAccordionSummary-expandIconWrapper": {
                            color: theme.vars.palette.primary.main,
                            transition: "transform 0.3s",
                            "&.Mui-expanded": {
                                transform: "rotate(180deg)",
                            },
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="reviews-content"
                        id="reviews-header"
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: theme.vars.palette.primary.main,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            Reviews
                            {crew.totalReviews >= 0 && (
                                <Typography
                                    component="span"
                                    sx={{
                                        color: theme.vars.palette.primary.main,
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                        py: 0.5,
                                        borderRadius: "16px",
                                    }}
                                >
                                    ({crew.totalReviews ? crew.totalReviews : 0})
                                </Typography>
                            )}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderTop: `1px solid ${theme.vars.palette.divider}`,
                        }}
                    >
                        <Box
                            component="section"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                            }}
                        >
                            {crew.reviews!.length > 0 ? (
                                <ReviewsHeader
                                    data={crew}
                                    sortBy={searchParamsValues.reviewsSortBy!}
                                    ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                                    sortingDataType="reviews"
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: "center",
                                        color: theme.vars.palette.text.secondary,
                                    }}
                                >
                                    No reviews yet. Be the first to review this crew!
                                </Typography>
                            )}
                            {crew.reviews.map(
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
                                            handleUpvote={onUpvoteCrew}
                                            handleDownvote={onDownVoteCrew}
                                            type="crew"
                                            data={crew}
                                            handleOpenUpvotesModal={handleOpenUpvotesModal}
                                            handleOpenDownvotesModal={handleOpenDownvotesModal}
                                        />
                                    ),
                            )}
                            {session?.user && (!crew.isReviewed || isEditMode) && (
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
                            {crew.totalReviews > 0 && (
                                <PaginationControl
                                    currentPage={Number(searchParamsValues.reviewsPage)}
                                    pageCount={reviewsPageCount}
                                    urlParamName="reviewsPage"
                                />
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <ListDetail data={crew.producedMovies} type="crew" roleData="Movies" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.producedMoviesPage)}
                    pageCount={producedMoviesPageCount}
                    urlParamName="producedMoviesPage"
                />
            </Box>
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
