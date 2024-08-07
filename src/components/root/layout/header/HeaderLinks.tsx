"use client";

import { Box, colors, List, ListItem, Menu, Typography, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { tokens } from "@/utils/theme/theme";
import { Genre } from "@prisma/client";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { useStore } from "@/store/store";

interface IHeaderLinks {
    genres: Genre[];
    anchorElGenres: HTMLElement | null;
    openMenuGenres: (event: React.MouseEvent<HTMLLIElement>) => void;
    closeMenuGenres: () => void;
}

export function HeaderLinks({ genres, openMenuGenres, closeMenuGenres, anchorElGenres }: IHeaderLinks) {
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");

    return (
        <>
            <Box>
                <Link
                    href={"/"}
                    style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        fontSize: 24,
                        color: colors.primary[100],
                        marginLeft: isMobile ? 8 : 0,
                        marginBottom: isMobile ? 3 : 0,
                    }}
                    onClick={() => {
                        if (isDrawerOpen) {
                            setIsDrawerOpen(false);
                        }
                    }}
                >
                    MovieLandia24
                </Link>
            </Box>
            <Box>
                <List sx={{ display: "flex", flexDirection: `${isMobile ? "column" : "row"}`, columnGap: 2 }}>
                    <ListItem>
                        <Link
                            href="/movies"
                            style={{
                                fontSize: "16px",
                                textDecoration: "none",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 3,
                                color: colors.primary[100],
                            }}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <MovieIcon fontSize={"large"} />
                            Movies
                        </Link>
                    </ListItem>
                    <ListItem onMouseEnter={openMenuGenres} onMouseLeave={closeMenuGenres} sx={{ cursor: "pointer" }}>
                        <Link
                            href="/genres"
                            style={{
                                fontSize: "16px",
                                textDecoration: "none",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 3,
                                color: colors.primary[100],
                            }}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <SubtitlesIcon fontSize={"large"} />
                            Genres
                        </Link>
                        <Menu
                            anchorEl={anchorElGenres}
                            open={Boolean(anchorElGenres)}
                            onClose={closeMenuGenres}
                            MenuListProps={{
                                onMouseLeave: closeMenuGenres,
                                sx: {
                                    display: "grid",
                                    height: "auto",
                                    width: "auto",
                                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                    padding: 3,
                                },
                            }}
                        >
                            {genres.map((genre, index: number) => (
                                <Link
                                    key={index}
                                    href={`/genres/${genre.id}/${genre.name}`}
                                    style={{
                                        textDecoration: "none",
                                        color: colors.primary[100],
                                    }}
                                    onClick={() => {
                                        if (isDrawerOpen) {
                                            setIsDrawerOpen(false);
                                        }
                                    }}
                                >
                                    <Box
                                        key={genre.id}
                                        onClick={() => {
                                            closeMenuGenres();
                                        }}
                                        sx={{
                                            cursor: "pointer",
                                            padding: 1.5,
                                            textAlign: "center",
                                            transition: "background-color 0.2s",
                                            "&:hover": {
                                                backgroundColor: colors.greenAccent[800],
                                            },
                                        }}
                                    >
                                        <Typography component={"span"}>{genre.name}</Typography>
                                    </Box>
                                </Link>
                            ))}
                        </Menu>
                    </ListItem>
                    <ListItem>
                        <Link
                            href="/series"
                            style={{
                                fontSize: "16px",
                                textDecoration: "none",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 3,
                                color: colors.primary[100],
                            }}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <LocalMoviesIcon fontSize={"large"} />
                            Series
                        </Link>
                    </ListItem>
                </List>
            </Box>
        </>
    );
}
