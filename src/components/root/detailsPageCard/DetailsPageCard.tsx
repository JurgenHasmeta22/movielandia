"use client";

import React, { useTransition } from "react";
import {
	Box,
	Typography,
	Chip,
	Button,
	Container,
	useTheme,
	CircularProgress,
} from "@mui/material";
import { AccessTime, CalendarToday, YouTube } from "@mui/icons-material";
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

const metaPillSx = {
	display: "flex",
	alignItems: "center",
	gap: 1,
	px: 1.75,
	py: 0.75,
	borderRadius: 999,
	border: "1px solid",
	borderColor: "divider",
	backgroundColor: "rgba(140, 127, 163, 0.12)",
	backdropFilter: "blur(8px)",
};

const peoplePanelSx = {
	p: { xs: 2, sm: 2.5 },
	borderRadius: "20px",
	border: "1px solid",
	borderColor: "divider",
	backgroundColor: "rgba(140, 127, 163, 0.08)",
	backdropFilter: "blur(10px)",
};

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

	const isPerson = type === "actor" || type === "crew";
	const heading = isPerson ? data.fullname : data.title;

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
			component="section"
			sx={{
				position: "relative",
				isolation: "isolate",
				overflow: "hidden",
				mt: { xs: -8, sm: -9 },
				pt: { xs: 8, sm: 9 },
				pb: { xs: 4, md: 6 },
			}}
		>
			{data.photoSrcProd && (
				<Box
					aria-hidden
					sx={{
						position: "absolute",
						inset: 0,
						zIndex: -2,
						opacity: 0.32,
						transform: "scale(1.3)",
						filter: "blur(60px) saturate(1.5)",
					}}
				>
					<Image
						src={data.photoSrcProd}
						alt=""
						fill
						sizes="100vw"
						style={{ objectFit: "cover" }}
					/>
				</Box>
			)}
			<Box
				aria-hidden
				sx={{
					position: "absolute",
					inset: 0,
					zIndex: -1,
					background: `linear-gradient(180deg, rgba(${theme.vars.palette.background.defaultChannel} / 0.55) 0%, rgba(${theme.vars.palette.background.defaultChannel} / 0.82) 55%, ${theme.vars.palette.background.default} 100%)`,
				}}
			/>

			<Container
				maxWidth={false}
				sx={{
					maxWidth: "1320px",
					px: { xs: 2, sm: 3, md: 4 },
					pt: { xs: 3, md: 5 },
				}}
			>
				{(type === "season" || type === "episode") && (
					<Button
						variant="outlined"
						color="primary"
						onClick={onGoBack}
						sx={{ mb: 3, width: "fit-content" }}
					>
						<ArrowBackIcon sx={{ mr: 1 }} />
						Go Back
					</Button>
				)}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							md: "minmax(240px, 320px) minmax(0, 1fr)",
						},
						gap: { xs: 4, md: 7 },
						alignItems: "start",
					}}
				>
					<Box
						sx={{
							position: { md: "sticky" },
							top: { md: 96 },
							justifySelf: { xs: "center", md: "stretch" },
							width: { xs: "min(100%, 260px)", md: "100%" },
							aspectRatio: "2 / 3",
							overflow: "hidden",
							borderRadius: "22px",
							boxShadow:
								"0 40px 80px rgba(5, 2, 12, 0.55), 0 0 0 1px rgba(243, 238, 230, 0.12)",
							bgcolor: theme.vars.palette.action.hover,
						}}
					>
						<Image
							src={data.photoSrcProd}
							alt={heading}
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
							display: "flex",
							flexDirection: "column",
							gap: 3,
							minWidth: 0,
						}}
					>
						<Box>
							<Typography
								component="h1"
								sx={{
									fontFamily: "var(--font-display)",
									fontSize: {
										xs: "2.4rem",
										sm: "3.2rem",
										md: "4.2rem",
									},
									fontWeight: 800,
									letterSpacing: "-0.045em",
									lineHeight: 0.98,
									textWrap: "balance",
									color: theme.vars.palette.text.primary,
								}}
							>
								{heading}
							</Typography>
							{data.genres?.length > 0 && (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 1,
										mt: 2.5,
									}}
								>
									{data.genres.map(
										(genre: any, index: number) => (
											<Link
												key={index}
												href={`/genres/${genre.genre.id}/${genre.genre.name}`}
												style={{ textDecoration: "none" }}
											>
												<Chip
													label={genre.genre.name}
													clickable
													variant="outlined"
													sx={{
														color: theme.vars
															.palette.text
															.primary,
														borderColor:
															"rgba(255, 178, 36, 0.5)",
														fontWeight: 600,
														"&:hover": {
															backgroundColor:
																"rgba(255, 178, 36, 0.16)",
															borderColor:
																theme.vars
																	.palette
																	.accent
																	.main,
														},
													}}
												/>
											</Link>
										),
									)}
								</Box>
							)}
						</Box>

						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								alignItems: "center",
								gap: { xs: 1, sm: 1.5 },
							}}
						>
							{!isPerson &&
								type !== "season" &&
								type !== "serie" && (
									<Box sx={metaPillSx}>
										<AccessTime
											sx={{
												fontSize: 20,
												color: "accent.main",
											}}
										/>
										<Typography variant="body2">
											{data.duration} mins
										</Typography>
									</Box>
								)}
							<Box sx={metaPillSx}>
								<CalendarToday
									sx={{
										fontSize: 20,
										color: "accent.main",
									}}
								/>
								<Typography variant="body2">
									{!isPerson
										? formatDate(new Date(data.dateAired))
										: data.debut}
								</Typography>
							</Box>
							{!isPerson && (
								<Box sx={metaPillSx}>
									<Image
										src={"/icons/imdb.svg"}
										alt={"Imdb rating"}
										height={24}
										width={24}
										priority
									/>
									<Typography variant="body2">
										{data.ratingImdb}
									</Typography>
								</Box>
							)}
							<Box sx={metaPillSx}>
								<StarRateIcon
									sx={{ color: "#FFB224", fontSize: 22 }}
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
							sx={{
								maxWidth: "68ch",
								lineHeight: 1.8,
								fontSize: { xs: "1rem", md: "1.075rem" },
								color: theme.vars.palette.text.secondary,
							}}
						>
							{data.description}
						</Typography>

						{(type !== "actor" || session?.user?.userName) && (
							<Box
								sx={{
									display: "flex",
									gap: 1.5,
									flexWrap: "wrap",
								}}
							>
								{type !== "actor" && (
									<Button
										variant="contained"
										color="secondary"
										size="large"
										startIcon={
											<YouTube
												sx={{ color: "red.main" }}
											/>
										}
										onClick={onPlayTrailer}
									>
										Watch trailer
									</Button>
								)}
								{session?.user?.userName && (
									<Button
										variant="contained"
										color={
											isBookmarked
												? "secondary"
												: "primary"
										}
										size="large"
										onClick={handleBookmarkAction}
										disabled={isPending}
										startIcon={
											isPending ? (
												<CircularProgress
													size={20}
													color="inherit"
												/>
											) : isBookmarked ? (
												<BookmarkIcon
													sx={{ color: "red.main" }}
												/>
											) : (
												<BookmarkBorderIcon />
											)
										}
										sx={{ minWidth: 150 }}
									>
										{isBookmarked
											? "Bookmarked"
											: "Bookmark"}
									</Button>
								)}
							</Box>
						)}

						{(type === "movie" || type === "serie") &&
							(cast || crew) && (
								<Box
									sx={{
										mt: 1,
										display: "grid",
										gridTemplateColumns: {
											xs: "1fr",
											lg: "1fr 1fr",
										},
										gap: 2.5,
									}}
								>
									{cast && cast.length > 0 && (
										<Box sx={peoplePanelSx}>
											<Typography
												variant="h6"
												component="h2"
												sx={{ mb: 2 }}
											>
												Featured Cast
											</Typography>
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
									)}
									{crew && crew.length > 0 && (
										<Box sx={peoplePanelSx}>
											<Typography
												variant="h6"
												component="h2"
												sx={{ mb: 2 }}
											>
												Featured Crew
											</Typography>
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
									)}
								</Box>
							)}
					</Box>
				</Box>
			</Container>
		</Box>
	);
}

export default DetailsPageCard;
