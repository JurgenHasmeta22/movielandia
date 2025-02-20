"use client";

// #region "Imports"
import React, { useState, useTransition } from "react";
import { Box, Card, Typography, Button, useTheme, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import StarRateIcon from "@mui/icons-material/StarRate";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { onBookmarkEpisode, onRemoveBookmarkEpisode } from "@/utils/features/episodeFeaturesUtils";
import { onBookmarkSeason, onRemoveBookmarkSeason } from "@/utils/features/seasonFeaturesUtils";
import { onBookmarkMovie, onRemoveBookmarkMovie } from "@/utils/features/movieFeaturesUtils";
import { onBookmarkSerie, onRemoveBookmarkSerie } from "@/utils/features/serieFeaturesUtils";
import { onBookmarkActor, onRemoveBookmarkActor } from "@/utils/features/actorFeaturesUtils";
import { onBookmarkCrew, onRemoveBookmarkCrew } from "@/utils/features/crewFeaturesUtils";
// #endregion

// #region "Types and Interfaces"
export type CardItemType = "movie" | "serie" | "season" | "episode" | "actor" | "crew" | "user";

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
}
// #endregion

const CardItem: React.FC<ICardItemProps> = ({ data, type, path, isAutocomplete = false }): React.JSX.Element => {
    const { data: session } = useSession();

    const [isHovered, setIsHovered] = useState(false);
    const [isPending, startTransition] = useTransition();

    const params = useParams();
    const theme = useTheme();
    const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

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

        const bookmarkFunc = bookmarkFunctions[type as keyof typeof bookmarkFunctions];
        const removeBookmarkFunc = removeBookmarkFunctions[type as keyof typeof removeBookmarkFunctions];

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
        const formatTitle = (title: string) => encodeURIComponent(title.split(" ").join("-"));

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
                const serieId = typeof params.serieId === "string" ? params.serieId : "";
                const serieTitle = typeof params.serieTitle === "string" ? formatTitle(params.serieTitle) : "";

                return `/series/${serieId}/${serieTitle}/seasons/${data.id}/${formatTitle((data as SeasonCardData).title)}`;
            }
            case "episode": {
                const serieId = typeof params.serieId === "string" ? params.serieId : "";
                const serieTitle = typeof params.serieTitle === "string" ? formatTitle(params.serieTitle) : "";
                const seasonId = typeof params.seasonId === "string" ? params.seasonId : "";
                const seasonTitle = typeof params.seasonTitle === "string" ? formatTitle(params.seasonTitle) : "";

                return `/series/${serieId}/${serieTitle}/seasons/${seasonId}/${seasonTitle}/episodes/${data.id}/${formatTitle((data as EpisodeCardData).title)}`;
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

        const mediaData = data as MovieCardData | SerieCardData | SeasonCardData | EpisodeCardData;
        const year = mediaData.dateAired ? new Date(mediaData.dateAired).getFullYear() : "N/A";

        return `${mediaData.title} (${year})`;
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={handleCardClick}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={getPath()} tabIndex={0} aria-label={getDisplayTitle()}>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: isAutocomplete ? { xs: "120px", sm: "140px" } : { xs: "140px", sm: "160px" },
                        height: "100%",
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: theme.shadows[4],
                        transition: "box-shadow 0.3s ease-in-out",
                        "&:hover": {
                            boxShadow: theme.shadows[8],
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: isAutocomplete ? { xs: "180px", sm: "210px" } : { xs: "210px", sm: "240px" },
                            width: "100%",
                            overflow: "hidden",
                            "&:hover .hoverOverlay": {
                                opacity: 1,
                            },
                        }}
                    >
                        <Image
                            src={data.photoSrcProd || "/images/placeholder.jpg"}
                            alt={data.description || "No description available"}
                            fill
                            sizes="(max-width: 600px) 140px, 160px"
                            style={{ objectFit: "cover" }}
                            priority={false}
                        />
                        <Box
                            className="hoverOverlay"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                bgcolor: "rgba(0, 0, 0, 0.7)",
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
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", height: "1rem" }}>
                                                <Image src="/icons/imdb.svg" alt="IMDb" width={32} height={16} />
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "white",
                                                }}
                                            >
                                                {data.ratingImdb?.toFixed(1) || "N/A"}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <StarRateIcon sx={{ color: "#FFD700", fontSize: "1rem" }} />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "white",
                                                }}
                                            >
                                                {data.averageRating && data.averageRating !== 0.0
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
                                            cursor: isPending ? "not-allowed" : "pointer",
                                            opacity: isPending ? 0.7 : 1,
                                            "&:hover": {
                                                borderColor: "white",
                                                bgcolor: "rgba(255, 255, 255, 0.1)",
                                            },
                                        }}
                                    >
                                        {isPending ? (
                                            <CircularProgress size={20} sx={{ color: "white" }} />
                                        ) : data.isBookmarked ? (
                                            <BookmarkIcon sx={{ color: theme.vars.palette.error.main }} />
                                        ) : (
                                            <BookmarkBorderIcon sx={{ color: "white" }} />
                                        )}
                                    </Button>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "white",
                                            textTransform: "capitalize",
                                            fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                        }}
                                    >
                                        {isPending ? "Processing..." : data.isBookmarked ? "Bookmarked" : "Bookmark"}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Card>
            </Link>
        </motion.div>
    );
};

export default CardItem;
