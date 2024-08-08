"use client";

import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useParams } from "next/navigation";
import Image from "next/image";
import StarRateIcon from "@mui/icons-material/StarRate";
import Link from "next/link";

interface ICardItemProps {
    data: any;
    type?: string;
    path?: string | null;
}

const CardItem = ({ data, type, path }: ICardItemProps): React.JSX.Element => {
    const params = useParams();

    const getPath = () => {
        switch (type) {
            case "serie":
                return `/series/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "movie":
                return `/movies/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "actor":
                if (path && path === "movies") {
                    return `/movies/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
                } else if (path && path === "actors") {
                    return `/actors/${data.id}/${encodeURIComponent(data.fullname.split(" ").join("-"))}`;
                } else {
                    return `/series/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
                }
            case "season":
                return `/series/${typeof params.serieId === "string" ? params.serieId : ""}/${typeof params.serieTitle === "string" ? encodeURIComponent(params.serieTitle.split(" ").join("-")) : ""}/seasons/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "episode":
                return `/series/${typeof params.serieId === "string" ? params.serieId : ""}/${typeof params.serieTitle === "string" ? encodeURIComponent(params.serieTitle.split(" ").join("-")) : ""}/seasons/${typeof params.seasonId === "string" ? params.seasonId : ""}/${typeof params.seasonTitle === "string" ? encodeURIComponent(params.seasonTitle.split(" ").join("-")) : ""}/episodes/${data.id}/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            default:
                return "/";
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            <Link href={getPath()}>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "180px",
                        cursor: "pointer",
                        height: "auto",
                        width: "100%",
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        "&:hover": {
                            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            height: "280px",
                            overflow: "hidden",
                            "&:hover .hoverOverlay": {
                                opacity: 1,
                            },
                        }}
                    >
                        <Image
                            src={data.photoSrcProd}
                            alt={`${data.description}`}
                            height={280}
                            width={180}
                            style={{
                                objectFit: "cover",
                            }}
                        />
                        <Box
                            className="hoverOverlay"
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                top: 0,
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                opacity: 0,
                                transition: "opacity 0.3s ease-in-out",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                padding: 2,
                            }}
                        >
                            <Typography color="white" sx={{ fontSize: "0.8rem" }}>
                                {path === "actors"
                                    ? data.fullname
                                    : data.title + " " + "(" + new Date(data.dateAired).getFullYear() + ")"}
                            </Typography>
                            {type !== "actor" && (
                                <Stack
                                    flexDirection={"row"}
                                    columnGap={"40px"}
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            src="/icons/imdb.svg"
                                            alt="IMDb Icon"
                                            width={14}
                                            height={14}
                                            style={{ marginRight: 2 }}
                                        />
                                        {data.ratingImdb !== 0 ? `${data.ratingImdb}` : "N/A"}
                                    </Box>
                                    {type !== "serie" && type !== "season" && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <AccessTimeIcon sx={{ color: "gold", mr: 0.5, fontSize: "0.8rem" }} />
                                            <Typography
                                                color={"white"}
                                                fontSize="0.8rem"
                                                component="span"
                                                width={"30ch"}
                                            >
                                                {data.duration} min
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            alignContent: "center",
                                            alignSelf: "center",
                                        }}
                                    >
                                        <StarRateIcon sx={{ color: "gold", mr: 0.5, fontSize: "1rem" }} />
                                        <Typography color={"white"} fontSize="0.9rem" component="span">
                                            {data.averageRating ? data.averageRating : "N/A"}
                                        </Typography>
                                    </Box>
                                </Stack>
                            )}
                        </Box>
                    </Box>
                    <CardContent
                        sx={{
                            flexGrow: 1,
                            display: "none",
                        }}
                    />
                </Card>
            </Link>
        </motion.div>
    );
};

export default CardItem;
