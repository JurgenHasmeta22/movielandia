"use client";

// #region "Imports"
import React, { useState, useTransition } from "react";
import {
	Box,
	Card,
	Typography,
	Button,
	useTheme,
	CircularProgress,
} from "@mui/material";
import { useParams } from "next/navigation";
import Image from "next/image";
import StarRateIcon from "@mui/icons-material/StarRate";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
	onBookmarkEpisode,
	onRemoveBookmarkEpisode,
} from "@/utils/features/episodeFeaturesUtils";
import {
	onBookmarkSeason,
	onRemoveBookmarkSeason,
} from "@/utils/features/seasonFeaturesUtils";
import {
	onBookmarkMovie,
	onRemoveBookmarkMovie,
} from "@/utils/features/movieFeaturesUtils";
import {
	onBookmarkSerie,
	onRemoveBookmarkSerie,
} from "@/utils/features/serieFeaturesUtils";
import {
	onBookmarkActor,
	onRemoveBookmarkActor,
} from "@/utils/features/actorFeaturesUtils";
import {
	onBookmarkCrew,
	onRemoveBookmarkCrew,
} from "@/utils/features/crewFeaturesUtils";
// #endregion

// #region "Types and Interfaces"
export type CardItemType =
	"movie" | "serie" | "season" | "episode" | "actor" | "crew" | "user";

export type PathType = "movies" | "actors" | "crew" | null;

interface BaseCardData {
	id: number;
	photoSrcProd?: string;
	description?: string;
	dateAired?: Date | null;
	isBookmarked?: boolean;
}

interface RatedCardData extends BaseCardData {
	ratingImdb?: number;
	averageRating?: number;
}

interface MovieCardData extends RatedCardData {
	title: string;
}

interface SerieCardData extends RatedCardData {
	title: string;
}

interface SeasonCardData extends RatedCardData {
	title: string;
}

interface EpisodeCardData extends RatedCardData {
	title: string;
}

interface ActorCardData extends RatedCardData {
	fullname: string;
	debut: string;
}

interface CrewCardData extends RatedCardData {
	fullname: string;
	debut: string;
}

interface UserCardData extends BaseCardData {
	userName: string;
}

type CardData =
	| MovieCardData
	| SerieCardData
	| SeasonCardData
	| EpisodeCardData
	| ActorCardData
	| CrewCardData
	| UserCardData;

interface ICardItemProps {
	data: CardData;
	type: CardItemType;
	path?: string;
	isAutocomplete?: boolean;
	isPriority?: boolean;
	presentation?: "poster";
}
// #endregion

const CardItem: React.FC<ICardItemProps> = ({
	data,
	type,
	path,
	isAutocomplete = false,
	isPriority = false,
	presentation,
}): React.JSX.Element => {
	const { data: session } = useSession();

	const [isHovered, setIsHovered] = useState(false);
	const [isPending, startTransition] = useTransition();

	const params = useParams();
	const theme = useTheme();
	const isTouchDevice =
		typeof window !== "undefined" && "ontouchstart" in window;

	const bookmarkFunctions = {
		movie: onBookmarkMovie,
		serie: onBookmarkSerie,
		season: onBookmarkSeason,
		episode: onBookmarkEpisode,
		actor: onBookmarkActor,
		crew: onBookmarkCrew,
	} as const;

	const removeBookmarkFunctions = {
		movie: onRemoveBookmarkMovie,
		serie: onRemoveBookmarkSerie,
		season: onRemoveBookmarkSeason,
		episode: onRemoveBookmarkEpisode,
		actor: onRemoveBookmarkActor,
		crew: onRemoveBookmarkCrew,
	} as const;

	const handleBookmarkClick = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();

		if (!session?.user || isPending) return;

		const bookmarkFunc =
			bookmarkFunctions[type as keyof typeof bookmarkFunctions];
		const removeBookmarkFunc =
			removeBookmarkFunctions[
				type as keyof typeof removeBookmarkFunctions
			];

		startTransition(async () => {
			try {
				if (data.isBookmarked) {
					if (removeBookmarkFunc) {
						await removeBookmarkFunc(session, data);
					}
				} else {
					if (bookmarkFunc) {
						await bookmarkFunc(session, data);
					}
				}
			} catch (error) {
				console.error("Error toggling bookmark:", error);
			}
		});
	};

	const getPath = (): string => {
		const formatTitle = (title: string) =>
			encodeURIComponent(title.split(" ").join("-"));

		switch (type) {
			case "serie":
				return `/series/${data.id}/${formatTitle((data as SerieCardData).title)}`;
			case "movie":
				return `/movies/${data.id}/${formatTitle((data as MovieCardData).title)}`;
			case "actor":
				if (path === "movies") {
					return `/movies/${data.id}/${formatTitle((data as MovieCardData).title)}`;
				} else if (path === "actors") {
					return `/actors/${data.id}/${formatTitle((data as ActorCardData).fullname)}`;
				}

				return `/series/${data.id}/${formatTitle((data as SerieCardData).title)}`;
			case "crew":
				if (path === "movies") {
					return `/movies/${data.id}/${formatTitle((data as MovieCardData).title)}`;
				} else if (path === "crew") {
					return `/crew/${data.id}/${formatTitle((data as CrewCardData).fullname)}`;
				}

				return `/series/${data.id}/${formatTitle((data as SerieCardData).title)}`;
			case "season": {
				const serieId =
					typeof params.serieId === "string" ? params.serieId : "";
				const serieTitle =
					typeof params.serieTitle === "string"
						? formatTitle(params.serieTitle)
						: "";

				return `/series/${serieId}/${serieTitle}/seasons/${data.id}/${formatTitle(
					(data as SeasonCardData).title,
				)}`;
			}
			case "episode": {
				const serieId =
					typeof params.serieId === "string" ? params.serieId : "";
				const serieTitle =
					typeof params.serieTitle === "string"
						? formatTitle(params.serieTitle)
						: "";
				const seasonId =
					typeof params.seasonId === "string" ? params.seasonId : "";
				const seasonTitle =
					typeof params.seasonTitle === "string"
						? formatTitle(params.seasonTitle)
						: "";

				return `/series/${serieId}/${serieTitle}/seasons/${seasonId}/${seasonTitle}/episodes/${
					data.id
				}/${formatTitle((data as EpisodeCardData).title)}`;
			}
			case "user":
				return `/users/${data.id}/${formatTitle((data as UserCardData).userName)}`;
			default:
				return "/";
		}
	};

	const handleCardClick = (e: React.MouseEvent) => {
		if (isTouchDevice && !isHovered) {
			e.preventDefault();
			setIsHovered(true);
		}
	};

	const handleMouseLeave = () => {
		if (isTouchDevice) {
			setIsHovered(false);
		}
	};

	const getDisplayTitle = () => {
		if (path === "actors" || path === "crew") {
			const personData = data as ActorCardData | CrewCardData;
			return `${personData.fullname} Debut Year: (${personData.debut})`;
		}

		if (type === "user") {
			return (data as UserCardData).userName;
		}

		const mediaData = data as
			MovieCardData | SerieCardData | SeasonCardData | EpisodeCardData;
		const year = mediaData.dateAired
			? new Date(mediaData.dateAired).getFullYear()
			: "N/A";

		return `${mediaData.title} (${year})`;
	};

	return (
		<Link
			href={getPath()}
			tabIndex={0}
			aria-label={getDisplayTitle()}
			style={{
				display: presentation === "poster" ? "block" : undefined,
				width: presentation === "poster" ? "100%" : undefined,
				textDecoration: presentation === "poster" ? "none" : undefined,
				color: presentation === "poster" ? "inherit" : undefined,
			}}
		>
			<Card
				sx={{
					display: "flex",
					flexDirection: "column",
					width:
						presentation === "poster"
							? "100%"
							: isAutocomplete
								? { xs: "120px", sm: "140px" }
								: { xs: "140px", sm: "160px" },
					height: "100%",
					position: "relative",
					overflow: "visible",
					border: "none",
					borderRadius: 0,
					backgroundColor: "transparent",
					boxShadow: "none",
					"& .posterFrame": {
						transition:
							"transform 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms ease",
					},
					"&:hover .posterFrame": {
						transform: "translateY(-6px)",
						boxShadow: `0 0 0 2px ${theme.vars.palette.accent.main}, 0 24px 40px rgba(5, 2, 12, 0.5)`,
					},
					"&:hover .posterImage": {
						transform: "scale(1.06)",
					},
					"&:hover .posterTitle": {
						color: theme.vars.palette.accent.main,
					},
				}}
			>
				<Box
					className="posterFrame"
					sx={{
						position: "relative",
						height:
							presentation === "poster"
								? { xs: "240px", sm: "290px", md: "320px" }
								: isAutocomplete
									? { xs: "180px", sm: "210px" }
									: { xs: "210px", sm: "240px" },
						width: "100%",
						overflow: "hidden",
						borderRadius: "14px",
						backgroundColor: theme.vars.palette.background.paper,
						boxShadow: "0 10px 24px rgba(5, 2, 12, 0.3)",
						"&:hover .hoverOverlay": {
							opacity: 1,
						},
					}}
				>
					<Image
						className="posterImage"
						src={data.photoSrcProd || "/images/placeholder.jpg"}
						alt={data.description || "No description available"}
						fill
						sizes="(max-width: 600px) 140px, 160px"
						style={{
							objectFit: "cover",
							transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
						}}
						loading={isPriority ? "eager" : undefined}
					/>
					<Box
						className="hoverOverlay"
						sx={{
							position: "absolute",
							inset: 0,
							background:
								"linear-gradient(0deg, rgba(13, 10, 18, 0.96) 0%, rgba(13, 10, 18, 0.82) 55%, rgba(13, 10, 18, 0.55) 100%)",
							opacity: isHovered ? 1 : 0,
							transition: "opacity 0.3s ease-in-out",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							p: { xs: 1.5, sm: 2 },
						}}
					>
						<Box>
							<Typography
								color="white"
								sx={{
									fontSize: { xs: "0.75rem", sm: "0.85rem" },
									fontWeight: 500,
									lineHeight: 1.4,
									mb: 1,
								}}
							>
								{getDisplayTitle()}
							</Typography>

							{type !== "user" && "ratingImdb" in data && (
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										mb: 1,
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
										}}
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												height: "1rem",
											}}
										>
											<Image
												src="/icons/imdb.svg"
												alt="IMDb"
												width={32}
												height={16}
											/>
										</Box>
										<Typography
											variant="caption"
											sx={{
												color: "white",
											}}
										>
											{data.ratingImdb?.toFixed(1) ||
												"N/A"}
										</Typography>
									</Box>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
										}}
									>
										<StarRateIcon
											sx={{
												color: "#FFB224",
												fontSize: "1rem",
											}}
										/>
										<Typography
											variant="caption"
											sx={{
												color: "white",
											}}
										>
											{data.averageRating &&
											data.averageRating !== 0.0
												? data.averageRating.toFixed(1)
												: "N/A"}
										</Typography>
									</Box>
								</Box>
							)}
							{data.description && (
								<Typography
									variant="caption"
									sx={{
										color: "white",
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
									}}
								>
									{data.description}
								</Typography>
							)}
						</Box>
						{session?.user?.userName && type !== "user" && (
							<Box
								onClick={handleBookmarkClick}
								sx={{
									mt: "auto",
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}
							>
								<Button
									variant="outlined"
									size="small"
									disabled={isPending}
									sx={{
										minWidth: "auto",
										p: 1,
										borderColor: "white",
										cursor: isPending
											? "not-allowed"
											: "pointer",
										opacity: isPending ? 0.7 : 1,
										"&:hover": {
											borderColor: "white",
											bgcolor: "rgba(255, 255, 255, 0.1)",
										},
									}}
								>
									{isPending ? (
										<CircularProgress
											size={20}
											sx={{ color: "white" }}
										/>
									) : data.isBookmarked ? (
										<BookmarkIcon
											sx={{
												color: theme.vars.palette.error
													.main,
											}}
										/>
									) : (
										<BookmarkBorderIcon
											sx={{ color: "white" }}
										/>
									)}
								</Button>
								<Typography
									variant="body2"
									sx={{
										color: "white",
										textTransform: "capitalize",
										fontSize: {
											xs: "0.75rem",
											sm: "0.85rem",
										},
									}}
								>
									{isPending
										? "Processing..."
										: data.isBookmarked
											? "Bookmarked"
											: "Bookmark"}
								</Typography>
							</Box>
						)}
					</Box>
				</Box>
				{presentation === "poster" && (
					<Box sx={{ px: 0.5, pt: 1.5, pb: 0.5 }}>
						<Typography
							component="span"
							className="posterTitle"
							sx={{
								display: "-webkit-box",
								overflow: "hidden",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: 1,
								fontFamily: "var(--font-display)",
								fontSize: { xs: "0.9rem", sm: "1rem" },
								fontWeight: 600,
								letterSpacing: "-0.01em",
								lineHeight: 1.4,
								color: "text.primary",
								transition: "color 200ms ease",
							}}
						>
							{path === "actors" || path === "crew"
								? (data as ActorCardData | CrewCardData)
										.fullname
								: getDisplayTitle()}
						</Typography>
						{(path === "actors" || path === "crew") && (
							<Typography
								component="span"
								variant="caption"
								sx={{
									display: "block",
									mt: 0.25,
									color: "text.secondary",
								}}
							>
								Debut Year: (
								{(data as ActorCardData | CrewCardData).debut})
							</Typography>
						)}
					</Box>
				)}
			</Card>
		</Link>
	);
};

export default CardItem;
