"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack, Button, Typography, useTheme } from "@mui/material";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { TextEditorForm } from "@/components/root/textEditorForm/TextEditorForm";
import * as CONSTANTS from "@/constants/Constants";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import { Episode } from "@prisma/client";
import { onBookmarkEpisode, onRemoveBookmarkEpisode } from "@/utils/features/episodeFeaturesUtils";
import { removeDownvoteEpisodeReview, addDownvoteEpisodeReview } from "@/actions/user/userDownvotes.actions";
import { addReviewEpisode, removeReviewEpisode, updateReviewEpisode } from "@/actions/user/userReviews.actions";
import { removeUpvoteEpisodeReview, addUpvoteEpisodeReview } from "@/actions/user/userUpvotes.actions";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IEpisodePageContentProps {
    searchParamsValues: {
        reviewsAscOrDesc: string | undefined;
        reviewsPage: number;
        reviewsSortBy: string;
        relatedPage: number;
    };
    episode: any;
    relatedEpisodes: Episode[] | null;
    reviewsPageCount: number;
    relatedPageCount: number;
}

export default function EpisodePage({
    searchParamsValues,
    episode,
    relatedEpisodes,
    reviewsPageCount,
    relatedPageCount,
}: IEpisodePageContentProps) {
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

    const router = useRouter();
    const pathname = usePathname();
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
        <Stack flexDirection={"column"} rowGap={2}>
            <DetailsPageCard
                data={episode}
                type="episode"
                isBookmarked={episode.isBookmarked}
                onBookmark={() => onBookmarkEpisode(session!, episode)}
                onRemoveBookmark={() => onRemoveBookmarkEpisode(session!, episode)}
                onGoBack={() => {
                    const currentPath = pathname;
                    const episodesIndex = currentPath.indexOf("episodes/");
                    const newPath = episodesIndex !== -1 ? currentPath.slice(0, episodesIndex) : currentPath;

                    router.replace(newPath);
                    router.refresh();
                }}
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
                            {episode.totalReviews >= 0 && (
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
                                    ({episode.totalReviews ? episode.totalReviews : 0})
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
                            {episode.reviews?.length > 0 ? (
                                <>
                                    <ReviewsHeader
                                        data={episode}
                                        sortingDataType="reviews"
                                        sortBy={searchParamsValues.reviewsSortBy!}
                                        ascOrDesc={searchParamsValues.reviewsAscOrDesc!}
                                    />
                                    {episode.reviews!.map(
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
                                                    handleUpvote={onUpvoteEpisode}
                                                    handleDownvote={onDownVoteEpisode}
                                                    type="episode"
                                                    data={episode}
                                                    handleOpenUpvotesModal={handleOpenUpvotesModal}
                                                    handleOpenDownvotesModal={handleOpenDownvotesModal}
                                                />
                                            ),
                                    )}
                                </>
                            ) : (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: "center",
                                        color: theme.vars.palette.text.secondary,
                                    }}
                                >
                                    No reviews yet. Be the first to review this episode!
                                </Typography>
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
                            {episode.totalReviews > 0 && (
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
            <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 6 }}>
                <ListDetail data={relatedEpisodes!} type="episode" roleData="related" />
                {relatedEpisodes && (
                    <PaginationControl
                        currentPage={searchParamsValues.relatedPage}
                        pageCount={relatedPageCount}
                        urlParamName="relatedPage"
                    />
                )}
            </Box>
        </Stack>
    );
}
