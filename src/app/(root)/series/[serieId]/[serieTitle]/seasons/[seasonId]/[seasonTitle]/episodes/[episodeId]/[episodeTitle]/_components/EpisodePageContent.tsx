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
import { Episode } from "@prisma/client";
import {
	onBookmarkEpisode,
	onRemoveBookmarkEpisode,
} from "@/utils/features/episodeFeaturesUtils";
import {
	removeDownvoteEpisodeReview,
	addDownvoteEpisodeReview,
} from "@/actions/user/userDownvotes.actions";
import {
	addReviewEpisode,
	removeReviewEpisode,
	updateReviewEpisode,
} from "@/actions/user/userReviews.actions";
import {
	removeUpvoteEpisodeReview,
	addUpvoteEpisodeReview,
} from "@/actions/user/userUpvotes.actions";
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
		openModal,
		textEditorRef,
		reviewRef,
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
				showToast(
					"error",
					"An unexpected error occurred while submitting the review.",
				);
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
							showToast(
								"success",
								"Review removed successfully!",
							);
						} catch (error) {
							if (error instanceof Error) {
								showToast("error", `Error: ${error.message}`);
							} else {
								showToast(
									"error",
									"An unexpected error occurred while deleting the review.",
								);
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
				showToast(
					"error",
					"An unexpected error occurred while updating the review.",
				);
			}
		}
	}
	// #endregion

	// #region "Upvotes, Downvotes"
	async function onUpvoteEpisode(
		episodeReviewId: number,
		isAlreadyUpvoted: boolean,
	) {
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
				showToast(
					"error",
					"An unexpected error occurred while upvoting the episode.",
				);
			}
		}
	}

	async function onDownVoteEpisode(
		episodeReviewId: number,
		isAlreadyDownvoted: boolean,
	) {
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
				showToast(
					"error",
					"An unexpected error occurred while downvoting the episode.",
				);
			}
		}
	}
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
				onRemoveBookmark={() =>
					onRemoveBookmarkEpisode(session!, episode)
				}
				onGoBack={() => {
					const currentPath = pathname;
					const episodesIndex = currentPath.indexOf("episodes/");
					const newPath =
						episodesIndex !== -1
							? currentPath.slice(0, episodesIndex)
							: currentPath;

					router.replace(newPath);
					router.refresh();
				}}
			/>
			<Box
				sx={{
					maxWidth: "1000px",
					width: "100%",
					mx: "auto",
					px: { xs: 2, sm: 3 },
					py: 4,
				}}
			>
				{/* Reviews Header Section */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", sm: "row" },
						justifyContent: "space-between",
						alignItems: { xs: "flex-start", sm: "center" },
						gap: 2,
						mb: 4,
						pb: 2,
						borderBottom: `1px solid ${theme.vars.palette.divider}`,
					}}
				>
					<Box>
						<Box
							sx={{
								display: "flex",
								alignItems: "baseline",
								gap: 1.5,
								mb: 1,
							}}
						>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 700,
									color: theme.vars.palette.text.primary,
								}}
							>
								User Reviews
							</Typography>
							{episode.totalReviews >= 0 && (
								<Typography
									variant="subtitle1"
									sx={{
										color: theme.vars.palette.text
											.secondary,
									}}
								>
									({episode.totalReviews})
								</Typography>
							)}
						</Box>
						{episode.reviews?.length > 0 && (
							<Box sx={{ minWidth: 200 }}>
								<ReviewsHeader
									data={episode}
									sortingDataType="reviews"
									sortBy={searchParamsValues.reviewsSortBy!}
									ascOrDesc={
										searchParamsValues.reviewsAscOrDesc!
									}
								/>
							</Box>
						)}
					</Box>
				</Box>

				{/* Write Review Section */}
				{session?.user && (!episode.isReviewed || isEditMode) && (
					<Box
						sx={{
							mb: 4,
							p: 3,
							bgcolor: theme.vars.palette.background.paper,
							borderRadius: 1,
							border: `1px solid ${theme.vars.palette.divider}`,
						}}
					>
						<Typography
							variant="h6"
							sx={{
								mb: 2,
								fontWeight: 600,
								color: theme.vars.palette.text.primary,
							}}
						>
							{isEditMode ? "Edit your review" : "Write a review"}
						</Typography>
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
					</Box>
				)}

				{/* Reviews List Section */}
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					{episode.reviews && episode.reviews.length > 0 ? (
						episode.reviews.map(
							(review: any, index: number) =>
								(!isEditMode ||
									review.user.id !==
										Number(session?.user?.id)) && (
									<Box
										key={index}
										sx={{
											bgcolor:
												theme.vars.palette.background
													.paper,
											borderRadius: 1,
											border: `1px solid ${theme.vars.palette.divider}`,
											p: { xs: 2, sm: 3 },
											"&:hover": {
												bgcolor:
													theme.vars.palette.action
														.hover,
											},
										}}
									>
										<Review
											review={review}
											handleRemoveReview={
												onSubmitRemoveReview
											}
											isEditMode={isEditMode}
											setIsEditMode={setIsEditMode}
											setReview={setReview}
											handleFocusTextEditor={
												handleFocusTextEditor
											}
											ref={reviewRef}
											setRating={setRating}
											handleUpvote={onUpvoteEpisode}
											handleDownvote={onDownVoteEpisode}
											type="episode"
											data={episode}
										/>
									</Box>
								),
						)
					) : (
						<Box
							sx={{
								textAlign: "center",
								py: 6,
								bgcolor: theme.vars.palette.background.paper,
								borderRadius: 1,
								border: `1px solid ${theme.vars.palette.divider}`,
							}}
						>
							<Typography
								variant="h6"
								sx={{
									color: theme.vars.palette.text.secondary,
									mb: 1,
								}}
							>
								No reviews yet
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: theme.vars.palette.text.secondary,
								}}
							>
								Be the first to review this episode!
							</Typography>
						</Box>
					)}
				</Box>

				{/* Pagination Section */}
				{episode.totalReviews > 0 && (
					<Box
						sx={{
							mt: 4,
							display: "flex",
							justifyContent: "center",
						}}
					>
						<PaginationControl
							currentPage={Number(searchParamsValues.reviewsPage)}
							pageCount={reviewsPageCount}
							urlParamName="reviewsPage"
						/>
					</Box>
				)}
			</Box>

			{/* Related Episodes Section */}
			{relatedEpisodes && relatedEpisodes.length !== 0 && (
				<Box sx={{ mb: 6 }}>
					<ListDetail
						data={relatedEpisodes}
						type="episode"
						roleData="related"
					/>
					<PaginationControl
						currentPage={searchParamsValues.relatedPage}
						pageCount={relatedPageCount}
						urlParamName="relatedPage"
					/>
				</Box>
			)}
		</Stack>
	);
}
