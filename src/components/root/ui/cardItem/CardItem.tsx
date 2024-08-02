"use client";

import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ICardItemProps {
    data: any;
    type?: string;
    path?: string | null;
}

const CardItem = ({ data, type, path }: ICardItemProps): React.JSX.Element => {
    const router = useRouter();
    const params = useParams();

    const getPath = () => {
        switch (type) {
            case "serie":
                return `/series/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "movie":
                return `/movies/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "actor":
                if (path && path === "movies") {
                    return `/movies/${encodeURIComponent(data.title.split(" ").join("-"))}`;
                } else if (path && path === "actors") {
                    return `/actors/${encodeURIComponent(data.fullname.split(" ").join("-"))}`;
                } else {
                    return `/series/${encodeURIComponent(data.title.split(" ").join("-"))}`;
                }
            case "season":
                return `/series/${typeof params.serieTitle === "string" ? encodeURIComponent(params.serieTitle.split(" ").join("-")) : ""}/seasons/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            case "episode":
                return `/series/${typeof params.serieTitle === "string" ? encodeURIComponent(params.serieTitle.split(" ").join("-")) : ""}/seasons/${typeof params.seasonTitle === "string" ? encodeURIComponent(params.seasonTitle.split(" ").join("-")) : ""}/episodes/${encodeURIComponent(data.title.split(" ").join("-"))}`;
            default:
                return "/";
        }
    };

    const handleGoTo = () => {
        const path = getPath();
        router.push(path);
    };

    return (
        <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
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
                onClick={handleGoTo}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "250px",
                        overflow: "hidden",
                        "&:hover .hoverOverlay": {
                            opacity: 1,
                        },
                    }}
                >
                    <Image
                        src={data.photoSrcProd}
                        alt={`${data.description}`}
                        objectFit="cover"
                        height={250}
                        width={180}
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
                            justifyContent: "flex-start",
                            padding: 2,
                        }}
                    >
                        <Typography variant="body2" color="white" fontWeight={600} sx={{ fontSize: "1rem" }}>
                            {path === "actors" ? data.fullname : data.title} ({new Date(data.dateAired).getFullYear()})
                        </Typography>
                        <Stack flexDirection={"row"} columnGap={"10px"}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: 0.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: "gold",
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: "0.8rem",
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
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 0.5,
                                    fontSize: "0.8rem",
                                    color: "gold",
                                }}
                            >
                                <AccessTimeIcon sx={{ color: "gold", mr: 0.5, fontSize: "0.8rem" }} />
                                <Typography color={"white"} fontSize="0.8rem" component="span" width={"30ch"}>
                                    {data.duration}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "none",
                    }}
                />
            </Card>
        </motion.div>
    );
};

export default CardItem;
