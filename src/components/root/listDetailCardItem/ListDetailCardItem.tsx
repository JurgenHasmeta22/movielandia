"use client";

import { Box, Typography, useTheme, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { CardItemType } from "../cardItem/CardItem";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helpers/toast";
import {
    removeMovieFromList,
    removeSerieFromList,
    removeSeasonFromList,
    removeEpisodeFromList,
    removeActorFromList,
    removeCrewFromList,
} from "@/actions/list/listItems.actions";

interface ListDetailCardItemProps {
    data: any;
    type: CardItemType;
    listId: number;
    userId: number;
    showActions?: boolean;
}

export default function ListDetailCardItem({
    data,
    type,
    listId,
    userId,
    showActions = true,
}: ListDetailCardItemProps) {
    const theme = useTheme();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDeleteItem = () => {
        startTransition(async () => {
            try {
                const itemId = getItemId();

                switch (type) {
                    case "movie":
                        await removeMovieFromList(itemId, listId, userId);
                        break;
                    case "serie":
                        await removeSerieFromList(itemId, listId, userId);
                        break;
                    case "season":
                        await removeSeasonFromList(itemId, listId, userId);
                        break;
                    case "episode":
                        await removeEpisodeFromList(itemId, listId, userId);
                        break;
                    case "actor":
                        await removeActorFromList(itemId, listId, userId);
                        break;
                    case "crew":
                        await removeCrewFromList(itemId, listId, userId);
                        break;
                    default:
                        throw new Error("Invalid content type");
                }
                showToast("success", "Item removed from list");
                router.refresh();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to remove item");
            }
        });
    };

    const getItemId = () => {
        switch (type) {
            case "movie":
                return data.movie.id;
            case "serie":
                return data.serie.id;
            case "season":
                return data.season.id;
            case "episode":
                return data.episode.id;
            case "actor":
                return data.actor.id;
            case "crew":
                return data.crew.id;
            case "user":
                return data.user.id;
            default:
                return null;
        }
    };

    const getPath = (): string => {
        const formatTitle = (title: string) => encodeURIComponent(title.split(" ").join("-"));

        switch (type) {
            case "serie":
                return `/series/${data.serie.id}/${formatTitle(data.serie.title)}`;
            case "movie":
                return `/movies/${data.movie.id}/${formatTitle(data.movie.title)}`;
            case "actor":
                return `/actors/${data.actor.id}/${formatTitle(data.actor.fullname)}`;
            case "crew":
                return `/crew/${data.crew.id}/${formatTitle(data.crew.fullname)}`;
            case "season":
                return `/series/${data.season.serieId}/${formatTitle(data.season.serieTitle)}/seasons/${data.season.id}/${formatTitle(data.season.title)}`;
            case "episode":
                return `/series/${data.episode.serieId}/${formatTitle(data.episode.serieTitle)}/seasons/${data.episode.seasonId}/${formatTitle(data.episode.seasonTitle)}/episodes/${data.episode.id}/${formatTitle(data.episode.title)}`;
            case "user":
                return `/users/${data.user.id}/${formatTitle(data.user.userName)}`;
            default:
                return "/";
        }
    };

    const getTitle = () => {
        switch (type) {
            case "serie":
                return data.serie.title;
            case "movie":
                return data.movie.title;
            case "actor":
                return data.actor.fullname;
            case "crew":
                return data.crew.fullname;
            case "season":
                return data.season.title;
            case "episode":
                return data.episode.title;
            case "user":
                return data.user.userName;
            default:
                return "";
        }
    };

    const getPhotoSrc = () => {
        switch (type) {
            case "serie":
                return data.serie.photoSrcProd;
            case "movie":
                return data.movie.photoSrcProd;
            case "actor":
                return data.actor.photoSrcProd;
            case "crew":
                return data.crew.photoSrcProd;
            case "season":
                return data.season.photoSrcProd;
            case "episode":
                return data.episode.photoSrcProd;
            case "user":
                return data.user.image;
            default:
                return "/images/placeholder.jpg";
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            <Box sx={{ position: "relative" }}>
                <Link href={getPath()} style={{ textDecoration: "none" }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: { xs: 70, sm: 80, md: 90, lg: 100 },
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "3/4",
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: theme.shadows[4],
                                transition: "box-shadow 0.3s ease-in-out",
                                "&:hover": {
                                    boxShadow: theme.shadows[8],
                                    "& .overlay": {
                                        opacity: 1,
                                    },
                                },
                            }}
                        >
                            <Image
                                src={getPhotoSrc() || "/images/placeholder.jpg"}
                                alt={getTitle()}
                                fill
                                sizes="(max-width: 600px) 70px, (max-width: 900px) 80px, (max-width: 1200px) 90px, 100px"
                                style={{ objectFit: "cover" }}
                                priority
                            />
                            <Box
                                className="overlay"
                                sx={{
                                    position: "absolute",
                                    inset: 0,
                                    bgcolor: "rgba(0, 0, 0, 0.3)",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            />
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "text.primary",
                                textAlign: "center",
                                fontSize: { xs: 11, sm: 12, md: 13 },
                            }}
                        >
                            {getTitle()}
                        </Typography>
                    </Box>
                </Link>
                {showActions && (
                    <IconButton
                        onClick={handleDeleteItem}
                        disabled={isPending}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "background.paper",
                            "&:hover": {
                                bgcolor: "error.main",
                                "& .MuiSvgIcon-root": {
                                    color: "common.white",
                                },
                            },
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </motion.div>
    );
}
