"use client";

import { DetailsPageCard } from "@/components/root/detailsPageCard/DetailsPageCard";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { ListDetail } from "@/components/root/listDetail/ListDetail";
import Review from "@/components/root/review/Review";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import { useEffect } from "react";
import { useState } from "react";
import * as CONSTANTS from "@/constants/Constants";
import { TextEditorForm } from "@/components/root/textEditorForm/TextEditorForm";
import { showToast } from "@/utils/helpers/toast";
import ReviewsHeader from "@/components/root/reviewsHeader/ReviewsHeader";
import { usePageDetailsData } from "@/hooks/usePageDetailsData";
import type { Movie } from "@prisma/client";
import {
	onBookmarkMovie,
	onRemoveBookmarkMovie,
} from "@/utils/features/movieFeaturesUtils";
import TrailerModal from "@/components/root/trailerModal/TrailerModal";
import {
	removeDownvoteMovieReview,
	addDownvoteMovieReview,
} from "@/actions/user/userDownvotes.actions";
import {
	addReviewMovie,
	removeReviewMovie,
	updateReviewMovie,
} from "@/actions/user/userReviews.actions";
import {
	removeUpvoteMovieReview,
	addUpvoteMovieReview,
} from "@/actions/user/userUpvotes.actions";

interface IMoviePageContentProps {
	searchParamsValues: {
		reviewsAscOrDesc: string | undefined;
		reviewsPage: number;
		reviewsSortBy: string;
		castPage: number;
		crewPage: number;
		relatedPage: number;
	};
	movie: any;
	relatedMovies: Movie[] | null;
	reviewsPageCount: number;
	castPageCount: number;
	crewPageCount: number;
	relatedPageCount: number;
}

export default function MoviePageContent({
	searchParamsValues,
	movie,
	relatedMovies,
	reviewsPageCount,
	castPageCount,
	crewPageCount,
	relatedPageCount,
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
		openModal,
		textEditorRef,
		reviewRef,
	} = usePageDetailsData();

	const theme = useTheme();
	const [trailerOpen, setTrailerOpen] = useState(false);
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
				showToast(
					"error",
					"An unexpected error occurred while submitting the review.",
				);
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
				showToast(
					"error",
					"An unexpected error occurred while updating the review.",
				);
			}
		}
	}
	// #endregion

	// #region "Upvote, Downvote"
	async function onUpvoteMovie(
		movieReviewId: number,
		isAlreadyUpvoted: boolean,
	) {
		if (!session?.user || !movieReviewId) return;

		try {
			if (isAlreadyUpvoted) {
				await removeUpvoteMovieReview({
					userId: Number(session?.user?.id),
					movieId: movie.id,
					movieReviewId,
				});
			} else {
				await removeDownvoteMovieReview({
					userId: Number(session?.user?.id),
					movieId: movie.id,
					movieReviewId,
				});

				await addUpvoteMovieReview({
					userId: Number(session?.user?.id),
					movieId: movie.id,
					movieReviewId,
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				showToast("error", `Error: ${error.message}`);
			} else {
				showToast(
					"error",
					"An unexpected error occurred while upvoting the movie.",
				);
			}
		}
	}

	async function onDownVoteMovie(
		movieReviewId: number,
		isAlreadyDownvoted: boolean,
	) {
		if (!session?.user || (!movie && !movieReviewId)) return;

		try {
			if (isAlreadyDownvoted) {
				await removeDownvoteMovieReview({
					userId: Number(session?.user?.id),
					movieId: movie.id,
					movieReviewId,
				});
			} else {
				await removeUpvoteMovieReview({
					userId: Number(session?.user?.id),
					movieId: movie.id,
					movieReviewId,
				});
				await addDownvoteMovieReview({
					userId: Number(session?.user?.id),
					movieId: movie.id,
					movieReviewId,
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				showToast("error", `Error: ${error.message}`);
			} else {
				showToast(
					"error",
					"An unexpected error occurred while downvoting the movie.",
				);
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
		<>
			{movie && (
				<script
					type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Movie",
							name: movie.title,
							description: movie.description,
							image: movie.photoSrcProd || undefined,
							director: movie.crew?.map((c: any) => ({
								"@type": "Person",
								name: c?.crew?.fullname,
							})),
							actor: movie.cast?.map((c: any) => ({
								"@type": "Person",
								name: c?.actor?.fullname,
							})),
							datePublished: movie.dateAired,
							duration: `PT${movie.duration}M`,
							aggregateRating: movie.totalReviews
								? {
										"@type": "AggregateRating",
										ratingValue: Number(
											movie.averageRating?.toFixed(1),
										),
										reviewCount: Number(movie.totalReviews),
									}
								: undefined,
						}),
					}}
				/>
			)}

			<Stack flexDirection={"column"} rowGap={4}>
				<DetailsPageCard
					data={movie}
					type="movie"
					isBookmarked={movie.isBookmarked}
					onBookmark={() => onBookmarkMovie(session!, movie)}
					onRemoveBookmark={() =>
						onRemoveBookmarkMovie(session!, movie)
					}
					onPlayTrailer={() => setTrailerOpen(true)}
					cast={movie.cast}
					crew={movie.crew}
					currentCastPage={Number(searchParamsValues.castPage)!}
					castPageCount={castPageCount}
					currentCrewPage={Number(searchParamsValues.crewPage)!}
					crewPageCount={crewPageCount}
				/>

				<Box
					component="section"
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
								<Typography
									variant="subtitle1"
									sx={{
										color: theme.vars.palette.text
											.secondary,
										fontWeight: 500,
									}}
								>
									({movie.totalReviews || 0})
								</Typography>
							</Box>
							{movie.averageRating > 0 && (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										color: theme.vars.palette.text
											.secondary,
									}}
								>
									<Typography
										variant="body2"
										sx={{ fontWeight: 500 }}
									>
										Average Rating:{" "}
										{movie.averageRating.toFixed(1)}/10
									</Typography>
								</Box>
							)}
						</Box>

						{movie.reviews && movie.reviews.length > 0 && (
							<Box sx={{ minWidth: 200 }}>
								<ReviewsHeader
									data={movie}
									sortingDataType="reviews"
									sortBy={searchParamsValues.reviewsSortBy!}
									ascOrDesc={
										searchParamsValues.reviewsAscOrDesc!
									}
								/>
							</Box>
						)}
					</Box>

					{/* Write Review Section */}
					{session?.user && (!movie.isReviewed || isEditMode) && (
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
								{isEditMode
									? "Edit your review"
									: "Write a review"}
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
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 3,
						}}
					>
						{movie.reviews && movie.reviews.length > 0 ? (
							movie.reviews.map(
								(review: any, index: number) =>
									(!isEditMode ||
										review.user.id !==
											Number(session?.user?.id)) && (
										<Box
											key={index}
											sx={{
												bgcolor:
													theme.vars.palette
														.background.paper,
												borderRadius: 1,
												border: `1px solid ${theme.vars.palette.divider}`,
												p: { xs: 2, sm: 3 },
												"&:hover": {
													bgcolor:
														theme.vars.palette
															.action.hover,
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
												handleUpvote={onUpvoteMovie}
												handleDownvote={onDownVoteMovie}
												type="movie"
												data={movie}
											/>
										</Box>
									),
							)
						) : (
							<Box
								sx={{
									textAlign: "center",
									py: 6,
									bgcolor:
										theme.vars.palette.background.paper,
									borderRadius: 1,
									border: `1px solid ${theme.vars.palette.divider}`,
								}}
							>
								<Typography
									variant="h6"
									sx={{
										color: theme.vars.palette.text
											.secondary,
										mb: 1,
									}}
								>
									No reviews yet
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: theme.vars.palette.text
											.secondary,
									}}
								>
									Be the first to review this movie!
								</Typography>
							</Box>
						)}
					</Box>

					{/* Pagination Section */}
					{movie.totalReviews > 0 && (
						<Box
							sx={{
								mt: 4,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<PaginationControl
								currentPage={
									Number(searchParamsValues.reviewsPage)!
								}
								pageCount={reviewsPageCount}
								urlParamName="reviewsPage"
							/>
						</Box>
					)}
				</Box>

				{/* Related Movies Section */}
				{relatedMovies && relatedMovies.length !== 0 && (
					<Box sx={{ mb: 6 }}>
						<ListDetail
							data={relatedMovies}
							type="movie"
							roleData="related"
						/>
						<Box
							sx={{
								mt: 2,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<PaginationControl
								currentPage={searchParamsValues.relatedPage}
								pageCount={relatedPageCount}
								urlParamName="relatedPage"
							/>
						</Box>
					</Box>
				)}
			</Stack>
			<TrailerModal
				open={trailerOpen}
				onClose={() => setTrailerOpen(false)}
				trailerSrc={movie?.trailerSrc}
			/>
		</>
	);
}
