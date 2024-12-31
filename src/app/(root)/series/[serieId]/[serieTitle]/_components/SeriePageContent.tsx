"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack, Typography, useTheme } from "@mui/material";
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
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    const theme = useTheme();

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
        openModal,
        textEditorRef,
        reviewRef,
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
                cast={serie.cast}
                crew={serie.crew}
                currentCastPage={Number(searchParamsValues.castPage)!}
                castPageCount={castPageCount}
                currentCrewPage={Number(searchParamsValues.crewPage)!}
                crewPageCount={crewPageCount}
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
                    defaultExpanded={true}
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
                            {serie.totalReviews >= 0 && (
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
                                    ({serie.totalReviews})
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
                            {serie.reviews!.length > 0 ? (
                                <ReviewsHeader
                                    data={serie}
                                    sortingDataType="reviews"
                                    sortBy={searchParamsValues.reviewsSortBy!}
                                    ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: "center",
                                        color: theme.vars.palette.text.secondary,
                                    }}
                                >
                                    No reviews yet. Be the first to review this serie!
                                </Typography>
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
                    </AccordionDetails>
                </Accordion>
            </Box>
            {relatedSeries && relatedSeries.length !== 0 && (
                <ListDetail data={relatedSeries} type="serie" roleData="related" />
            )}
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 6 }}>
                <ListDetail data={serie.seasons} type="season" roleData="season" />
                <PaginationControl
                    currentPage={Number(searchParamsValues.seasonsPage)}
                    pageCount={seasonsPageCount}
                    urlParamName="seasonsPage"
                />
            </Box>
        </Stack>
    );
}
