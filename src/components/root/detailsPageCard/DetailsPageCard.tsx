"use client";

import React, { useTransition } from "react";
import {
	Box,
	Typography,
	Chip,
	Button,
	useTheme,
	CircularProgress,
} from "@mui/material";
import { AccessTime, CalendarToday, Star, YouTube } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { formatDate } from "@/utils/helpers/utils";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type {} from "@mui/material/themeCssVarsAugmentation";
import PersonRoleCard from "./PersonRoleCard";
import PaginationPersonControl from "./PaginationPersonControl";

interface IDetailsPageCardProps {
	data: any;
	type: string;
	isBookmarked: boolean;
	cast?: any[];
	crew?: any[];
	currentCastPage?: number;
	currentCrewPage?: number;
	castPageCount?: number;
	crewPageCount?: number;
	onBookmark: () => Promise<void>;
	onRemoveBookmark: () => Promise<void>;
	onGoBack?: () => void;
	onPlayTrailer?: () => void;
}

export function DetailsPageCard({
	data,
	type,
	isBookmarked,
	onBookmark,
	onRemoveBookmark,
	onGoBack,
	onPlayTrailer,
	cast,
	crew,
	currentCastPage,
	currentCrewPage,
	castPageCount,
	crewPageCount,
}: IDetailsPageCardProps) {
	const { data: session } = useSession();

	const theme = useTheme();
	const [isPending, startTransition] = useTransition();

	const handleBookmarkAction = () => {
		if (!session?.user || !data) return;

		startTransition(async () => {
			if (isBookmarked) {
				await onRemoveBookmark();
			} else {
				await onBookmark();
			}
		});
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				bgcolor: theme.vars.palette.background.paper,
				color: theme.vars.palette.text.primary,
				width: "100%",
				maxWidth: "1280px",
				margin: "auto",
				p: { xs: 2, sm: 3, md: 4.5 },
				border: "1px solid",
				borderColor: theme.vars.palette.divider,
				borderRadius: { xs: 2, md: 3 },
				mt: { xs: 2, md: 4 },
			}}
		>
			{(type === "season" || type === "episode") && (
				<Button
					variant="outlined"
					onClick={onGoBack}
					sx={{
						mb: 2,
						display: "flex",
						alignItems: "center",
						width: "fit-content",
					}}
				>
					<ArrowBackIcon sx={{ mr: 1 }} />
					Go Back
				</Button>
			)}
			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: { xs: 3, md: 5 },
					alignItems: { xs: "center", md: "flex-start" },
				}}
			>
				<Box
					sx={{
						flexShrink: 0,
						width: { xs: "min(100%, 250px)", md: "250px" },
						maxWidth: "250px",
						height: { xs: "auto", md: "370px" },
						aspectRatio: "2 / 3",
						position: "relative",
						overflow: "hidden",
						borderRadius: 2,
						bgcolor: theme.vars.palette.action.hover,
					}}
				>
					<Image
						src={data.photoSrcProd}
						alt={
							type !== "actor" && type !== "crew"
								? data.title
								: data.fullname
						}
						height={317}
						width={214}
						priority
						style={{
							objectFit: "cover",
							borderRadius: "inherit",
							width: "100%",
							height: "100%",
						}}
					/>
				</Box>
				<Box
					sx={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						width: "100%",
						pt: { xs: 0, md: 0 },
					}}
				>
					<Typography
						component="h1"
						gutterBottom
						sx={{
							fontSize: {
								xs: "2rem",
								sm: "2.6rem",
								md: "3.25rem",
							},
							letterSpacing: "-0.055em",
							lineHeight: 1.05,
							fontWeight: 700,
						}}
						color={theme.vars.palette.text.primary}
					>
						{type !== "actor" && type !== "crew"
							? data.title
							: data.fullname}
					</Typography>
					<Box
						sx={{
							mb: 2,
							display: "flex",
							flexWrap: "wrap",
							alignItems: "center",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1,
								p: 0,
								borderRadius: 2,
							}}
						>
							{data.genres?.map((genre: any, index: number) => (
								<Link
									key={index}
									href={`/genres/${genre.genre.id}/${genre.genre.name}`}
									passHref
								>
									<Chip
										label={genre.genre.name}
										clickable
										sx={{
											bgcolor:
												theme.vars.palette.action.hover,
											color: theme.vars.palette.text
												.primary,
											textDecoration: "none",
											fontSize: "0.8rem",
											fontWeight: 600,
											border: "1px solid",
											borderColor:
												theme.vars.palette.divider,
										}}
									/>
								</Link>
							))}
						</Box>
					</Box>
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: { xs: 1.5, sm: 2.5 },
							mb: 3,
						}}
					>
						{type !== "season" &&
							type !== "serie" &&
							type !== "actor" &&
							type !== "crew" && (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 1,
										px: 1.25,
										py: 0.75,
										borderRadius: 1.5,
										bgcolor:
											theme.vars.palette.action.hover,
									}}
								>
									<AccessTime
										fontSize="medium"
										color="primary"
									/>
									<Typography variant="body1">
										{data.duration} mins
									</Typography>
								</Box>
							)}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								px: 1.25,
								py: 0.75,
								borderRadius: 1.5,
								bgcolor: theme.vars.palette.action.hover,
							}}
						>
							<CalendarToday fontSize="medium" color="primary" />
							<Typography variant="body2">
								{type !== "actor" && type !== "crew"
									? formatDate(new Date(data.dateAired))
									: data.debut}
							</Typography>
						</Box>
						{type !== "actor" && type !== "crew" && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									px: 1.25,
									py: 0.75,
									borderRadius: 1.5,
									bgcolor: theme.vars.palette.action.hover,
								}}
							>
								<Image
									src={"/icons/imdb.svg"}
									alt={"Imdb rating"}
									height={28}
									width={28}
									priority
								/>
								<Typography variant="body2">
									{data.ratingImdb}
								</Typography>
							</Box>
						)}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<StarRateIcon
								sx={{
									color: "gold",
								}}
								fontSize="medium"
							/>
							<Typography variant="body2">
								{data.averageRating === 0
									? "N/A"
									: data.averageRating.toFixed(2)}
							</Typography>
						</Box>
					</Box>
					<Typography
						variant="body1"
						color={theme.vars.palette.text.secondary}
						sx={{ maxWidth: "78ch", lineHeight: 1.75 }}
					>
						{data.description}
					</Typography>
					{(type === "movie" || type === "serie") &&
						(cast || crew) && (
							<Box
								sx={{
									mt: 4,
									mb: 2,
									display: "grid",
									gridTemplateColumns: {
										xs: "1fr",
										md: "1fr 1fr",
									},
									gap: 3,
								}}
							>
								{cast && cast.length > 0 && (
									<Box>
										<Typography
											variant="h6"
											sx={{
												mb: 2,
												fontWeight: 600,
												color: theme.vars.palette.text
													.primary,
												fontSize: 16,
											}}
										>
											Featured Cast
										</Typography>
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												gap: 2,
											}}
										>
											<Box
												sx={{
													display: "flex",
													flexWrap: "wrap",
													gap: 2,
													justifyContent: {
														xs: "center",
														sm: "flex-start",
													},
												}}
											>
												{cast.map((person, index) => (
													<PersonRoleCard
														key={index}
														data={person.actor}
														type="actor"
													/>
												))}
											</Box>
											<PaginationPersonControl
												currentPage={currentCastPage!}
												pageCount={castPageCount!}
												urlParamName="castPage"
											/>
										</Box>
									</Box>
								)}
								{crew && crew.length > 0 && (
									<Box>
										<Typography
											variant="h6"
											sx={{
												mb: 2,
												fontWeight: 600,
												color: theme.vars.palette.text
													.primary,
												fontSize: 16,
											}}
										>
											Featured Crew
										</Typography>
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												gap: 2,
											}}
										>
											<Box
												sx={{
													display: "flex",
													flexWrap: "wrap",
													gap: 2,
													justifyContent: {
														xs: "center",
														sm: "flex-start",
													},
												}}
											>
												{crew.map((person, index) => (
													<PersonRoleCard
														key={index}
														data={person.crew}
														type="crew"
													/>
												))}
											</Box>
											<PaginationPersonControl
												currentPage={currentCrewPage!}
												pageCount={crewPageCount!}
												urlParamName="crewPage"
											/>
										</Box>
									</Box>
								)}
							</Box>
						)}
					<Box
						sx={{
							mt: 2,
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
						}}
					>
						{type !== "actor" && (
							<Button
								variant="contained"
								startIcon={<YouTube />}
								onClick={onPlayTrailer}
								sx={{
									bgcolor: theme.vars.palette.red.main,
									color: theme.vars.palette.text.primary,
									textTransform: "capitalize",
									fontSize: 16,
									borderRadius: 1.5,
								}}
							>
								Watch trailer
							</Button>
						)}
						{session?.user?.userName && (
							<Button
								variant="contained"
								onClick={handleBookmarkAction}
								disabled={isPending}
								startIcon={
									isPending ? (
										<CircularProgress
											size={20}
											color="inherit"
										/>
									) : isBookmarked ? (
										<BookmarkIcon color="error" />
									) : (
										<BookmarkBorderIcon color="success" />
									)
								}
								sx={{
									color: theme.vars.palette.text.primary,
									bgcolor: isBookmarked
										? theme.vars.palette.red.main
										: theme.vars.palette.green.main,
									"&:hover": {
										bgcolor: theme.vars.palette.green.light,
									},
									"&:disabled": {
										bgcolor: isBookmarked
											? theme.vars.palette.red.main
											: theme.vars.palette.green.main,
										opacity: 0.7,
									},
									textTransform: "capitalize",
									fontSize: 16,
									minWidth: 130,
									borderRadius: 1.5,
								}}
							>
								{isBookmarked ? "Bookmarked" : "Bookmark"}
							</Button>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default DetailsPageCard;
