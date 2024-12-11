"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

type ResultType = "movie" | "serie" | "season" | "episode" | "actor" | "crew" | "user";

type PathType = "movies" | "actors" | "crew" | null;

interface BaseResultData {
    id: number;
    photoSrcProd?: string;
    description?: string;
    dateAired?: string;
}

interface MediaResultData extends BaseResultData {
    title: string;
}

interface PersonResultData extends BaseResultData {
    fullname: string;
    debut: string;
}

interface UserResultData extends BaseResultData {
    userName: string;
    bio?: string;
}

type ResultData = MediaResultData | PersonResultData | UserResultData;

interface SearchResultCardProps {
    data: ResultData;
    type: ResultType;
    path?: PathType;
}

const SearchResultCard = ({ data, type, path }: SearchResultCardProps) => {
    const theme = useTheme();
    const params = useParams();

    const getPath = (): string => {
        const formatTitle = (title: string) => encodeURIComponent(title.split(" ").join("-"));

        switch (type) {
            case "serie":
                return `/series/${data.id}/${formatTitle((data as MediaResultData).title)}`;
            case "movie":
                return `/movies/${data.id}/${formatTitle((data as MediaResultData).title)}`;
            case "actor":
                if (path === "movies") {
                    return `/movies/${data.id}/${formatTitle((data as MediaResultData).title)}`;
                } else if (path === "actors") {
                    return `/actors/${data.id}/${formatTitle((data as PersonResultData).fullname)}`;
                }

                return `/series/${data.id}/${formatTitle((data as MediaResultData).title)}`;
            case "crew":
                if (path === "movies") {
                    return `/movies/${data.id}/${formatTitle((data as MediaResultData).title)}`;
                } else if (path === "crew") {
                    return `/crew/${data.id}/${formatTitle((data as PersonResultData).fullname)}`;
                }

                return `/series/${data.id}/${formatTitle((data as MediaResultData).title)}`;
            case "season": {
                const serieId = typeof params.serieId === "string" ? params.serieId : "";
                const serieTitle = typeof params.serieTitle === "string" ? formatTitle(params.serieTitle) : "";
                return `/series/${serieId}/${serieTitle}/seasons/${data.id}/${formatTitle((data as MediaResultData).title)}`;
            }

            case "episode": {
                const serieId = typeof params.serieId === "string" ? params.serieId : "";
                const serieTitle = typeof params.serieTitle === "string" ? formatTitle(params.serieTitle) : "";
                const seasonId = typeof params.seasonId === "string" ? params.seasonId : "";
                const seasonTitle = typeof params.seasonTitle === "string" ? formatTitle(params.seasonTitle) : "";
                return `/series/${serieId}/${serieTitle}/seasons/${seasonId}/${seasonTitle}/episodes/${data.id}/${formatTitle((data as MediaResultData).title)}`;
            }

            case "user":
                return `/users/${data.id}/${formatTitle((data as UserResultData).userName)}`;
            default:
                return "/";
        }
    };

    const getDisplayTitle = () => {
        if (type === "actor" || type === "crew") {
            const personData = data as PersonResultData;
            return `${personData.fullname}${personData.debut ? ` (${personData.debut})` : ""}`;
        }

        if (type === "user") {
            return (data as UserResultData).userName;
        }

        const mediaData = data as MediaResultData;
        return `${mediaData.title}${mediaData.dateAired ? ` (${mediaData.dateAired.split("/")[2]})` : ""}`;
    };

    const getDescription = () => {
        if (type === "user") {
            return (data as UserResultData).bio;
        }

        return data.description;
    };

    return (
        <Link href={getPath()} style={{ textDecoration: "none" }}>
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                        bgcolor: theme.vars.palette.action.hover,
                    },
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: 45,
                        height: 65,
                        flexShrink: 0,
                        borderRadius: 0.5,
                        overflow: "hidden",
                    }}
                >
                    <Image
                        src={data.photoSrcProd || "/images/placeholder.jpg"}
                        alt={data.description || "No description available"}
                        fill
                        sizes="45px"
                        style={{ objectFit: "cover" }}
                        priority
                    />
                </Box>
                <Box sx={{ overflow: "hidden" }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: theme.vars.palette.text.primary,
                            mb: 0.5,
                        }}
                    >
                        {getDisplayTitle()}
                    </Typography>
                    {getDescription() && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.vars.palette.text.secondary,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.2,
                            }}
                        >
                            {getDescription()}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Link>
    );
};

export default SearchResultCard;
