"use client";

import React from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ICardItemProps {
    data: any;
    type?: string;
}

const CardItem = ({ data, type }: ICardItemProps): React.JSX.Element => {
    const router = useRouter();
    const path =
        type === "serie" ? `/series/${data.title.split(" ").join("-")}` : `/movies/${data.title.split(" ").join("-")}`;

    return (
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
            <Card
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    maxWidth: "200px",
                    cursor: "pointer",
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    borderRadius: 4,
                    "&:hover": {
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                }}
                onClick={() => {
                    router.push(path);
                }}
                elevation={6}
            >
                <Box sx={{ position: "relative" }}>
                    <Link
                        href={path}
                        style={{
                            textDecoration: "none",
                        }}
                    >
                        <Image src={data.photoSrc} alt={`${data.description}`} width={214} height={317} />
                    </Link>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            justifyContent: "start",
                            rowGap: 0.5,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                borderRadius: 10,
                                padding: "2px 8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                                },
                            }}
                        >
                            <Image src="/icons/imdb.svg" alt="IMDb Icon" width={20} height={20} />
                            <Typography color={"gold"} fontSize={12} component="span" sx={{ ml: 0.5 }}>
                                {data.ratingImdb !== 0 ? `${data.ratingImdb}` : "N/A"}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                borderRadius: 10,
                                padding: "2px 8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                                },
                            }}
                        >
                            <CalendarMonthIcon
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    color: "gold",
                                }}
                            />
                            <Typography color={"gold"} fontSize={12} component="span" sx={{ ml: 0.5 }}>
                                {data.releaseYear}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "end",
                            justifyContent: "start",
                            rowGap: 0.5,
                        }}
                    >
                        {data.duration && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    borderRadius: 10,
                                    padding: "2px 8px",
                                    "&:hover": {
                                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                                    },
                                }}
                            >
                                <AccessTimeIcon
                                    sx={{
                                        width: "20px",
                                        height: "20px",
                                        color: "gold",
                                    }}
                                />
                                <Typography color={"gold"} fontSize={12} component="span" sx={{ ml: 0.5 }}>
                                    {data.duration}
                                </Typography>
                            </Box>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                borderRadius: 10,
                                padding: "2px 8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                                },
                            }}
                        >
                            <StarIcon
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                    color: "gold",
                                }}
                            />
                            <Typography color={"gold"} fontSize={12} component="span" sx={{ ml: 0.5 }}>
                                {data.averageRating !== 0 ? `${data.averageRating}` : "N/A"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                        letterSpacing: 0.3,
                    }}
                >
                    <Typography variant="body1" fontWeight={600} fontSize={16}>
                        {data.title}
                    </Typography>
                    {data.genres && data.genres.length > 0 && (
                        <Stack
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                columnGap: 1,
                                rowGap: 1,
                                pt: 0.5,
                                pb: 0.5,
                            }}
                        >
                            {data?.genres?.map((genre: any, index: number) => (
                                <Link href={`/genres/${genre.name}`} style={{ textDecoration: "none" }} key={index}>
                                    <Typography
                                        component={"span"}
                                        key={index}
                                        onClick={function (e) {
                                            e.stopPropagation();
                                        }}
                                        sx={{
                                            backgroundColor: "gold",
                                            color: "black",
                                            borderRadius: "12px",
                                            padding: "4px 6px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            fontSize: 11,
                                            "&:hover": {
                                                backgroundColor: "#FFD700",
                                            },
                                        }}
                                    >
                                        {genre.name}
                                    </Typography>
                                </Link>
                            ))}
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CardItem;
