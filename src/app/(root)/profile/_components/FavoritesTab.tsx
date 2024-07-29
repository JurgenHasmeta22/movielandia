"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "@/utils/theme/theme";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/navigation";
import { Movie, Prisma, Serie, User } from "@prisma/client";
import { removeFavoriteMovieToUser, removeFavoriteSerieToUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { showToast } from "@/lib/toast/toast";

interface FavoritesTabProps {
    type: "Movies" | "Series";
    user: any | null;
}

export default function FavoritesTab({ type, user }: FavoritesTabProps) {
    const router = useRouter();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const favorites = type === "Movies" ? user?.favMovies : user?.favSeries;

    async function onRemoveBookmarkMovie(movie: Movie) {
        if (!user || !movie) return;

        try {
            await removeFavoriteMovieToUser(user?.id, movie?.id, "/profile?tab=favMovies");
            showToast("success", "Movie unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while submitting the review.");
            }
        }
    }

    async function onRemoveBookmarkSerie(serie: Serie) {
        if (!user || !serie) return;

        try {
            await removeFavoriteSerieToUser(user.id, serie.id, "/profile?tab=favSeries");
            showToast("success", "Serie unbookmarked successfully!");
        } catch (error) {
            if (error instanceof Error) {
                showToast("error", `Error: ${error.message}`);
            } else {
                showToast("error", "An unexpected error occurred while submitting the review.");
            }
        }
    }

    return (
        <Box
            component={"section"}
            height={`${user?.favMovies?.length > 0 || user?.favSeries?.length > 0 ? "auto" : "100vh"}`}
        >
            <Typography variant="h4">Bookmarked {type}</Typography>
            <Stack flexDirection={"row"} flexWrap={"wrap"} columnGap={6} rowGap={4} mt={4}>
                {favorites?.map((favItem: any, index: number) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ position: "relative" }}
                    >
                        <Box
                            onClick={() => {
                                const urlPath = type === "Movies" ? "movies" : "series";
                                const formattedTitle =
                                    type === "Movies"
                                        ? favItem.movie.title
                                        : favItem.serie.title
                                              .split("")
                                              .map((char: string) => (char === " " ? "-" : char))
                                              .join("");

                                router.push(`/${urlPath}/${formattedTitle}`);
                            }}
                            sx={{
                                height: "100%",
                                width: "100%",
                                cursor: "pointer",
                            }}
                        >
                            <Image
                                src={type === "Movies" ? favItem.movie.photoSrc : favItem.serie.photoSrc}
                                alt={type === "Movies" ? favItem.movie.title : favItem.serie.title}
                                height={200}
                                width={150}
                            />
                            <Typography component={"h4"} fontSize={14}>
                                {type === "Movies" ? favItem.movie.title : favItem.serie.title}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                padding: "6px 6px",
                                cursor: "pointer",
                                backgroundColor: colors.primary[100],
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={async (e) => {
                                e.stopPropagation();

                                if (type === "Movies") {
                                    await onRemoveBookmarkMovie(favItem.movie);
                                } else {
                                    await onRemoveBookmarkSerie(favItem.serie);
                                }
                            }}
                        >
                            <ClearIcon
                                sx={{
                                    color: colors.primary[900],
                                }}
                            />
                        </Box>
                    </motion.div>
                ))}
            </Stack>
        </Box>
    );
}
