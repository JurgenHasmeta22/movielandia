"use client";

import { Box, Button, List, ListItem, Menu, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Image from "next/image";

interface IHeaderLinksProps {
    genres: Genre[];
    anchorElGenres: HTMLElement | null;
    openMenuGenres: (event: React.MouseEvent<HTMLLIElement>) => void;
    closeMenuGenres: () => void;
}

export function HeaderLinks({ genres, openMenuGenres, closeMenuGenres, anchorElGenres }: IHeaderLinksProps) {
    const { isDrawerOpen, setIsDrawerOpen } = useStore();
    const theme = useTheme();

    return (
        <>
            <Box
                sx={{
                    marginLeft: {
                        xs: 2,
                        sm: 2,
                        md: 0,
                    },
                    marginBottom: {
                        xs: 1,
                        sm: 1,
                        md: 0,
                    },
                }}
            >
                <Button
                    component={MuiNextLink}
                    href={"/"}
                    prefetch={false}
                    onClick={() => {
                        if (isDrawerOpen) {
                            setIsDrawerOpen(false);
                        }
                    }}
                >
                    <Image src={"/icons/movielandia24-logo.png"} alt="MovieLandia24" height={80} width={200} />
                </Button>
            </Box>
            <Box>
                <List
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "column",
                            md: "row",
                        },
                    }}
                >
                    <ListItem>
                        <Button
                            component={MuiNextLink}
                            href="/movies"
                            prefetch={false}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 3,
                                color: theme.vars.palette.primary.main,
                            }}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <MovieIcon fontSize={"large"} />
                            <Typography
                                component={"span"}
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    textTransform: "capitalize",
                                }}
                            >
                                Movies
                            </Typography>
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            component={MuiNextLink}
                            href="/series"
                            prefetch={false}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 3,
                                color: theme.vars.palette.primary.main,
                            }}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <LocalMoviesIcon fontSize={"large"} />
                            <Typography
                                component={"span"}
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    textTransform: "capitalize",
                                }}
                            >
                                Series
                            </Typography>
                        </Button>
                    </ListItem>
                    <ListItem onMouseEnter={openMenuGenres} onMouseLeave={closeMenuGenres} sx={{ cursor: "pointer" }}>
                        <Button
                            component={MuiNextLink}
                            href="/genres"
                            prefetch={false}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: 3,
                                color: theme.vars.palette.primary.main,
                            }}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <SubtitlesIcon fontSize={"large"} />
                            <Typography
                                component={"span"}
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    textTransform: "capitalize",
                                }}
                            >
                                Genres
                            </Typography>
                        </Button>
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
                                        color: theme.vars.palette.primary.main,
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
                                                backgroundColor: theme.vars.palette.green.main,
                                            },
                                        }}
                                    >
                                        <Typography component={"span"}>{genre.name}</Typography>
                                    </Box>
                                </Link>
                            ))}
                        </Menu>
                    </ListItem>
                </List>
            </Box>
        </>
    );
}
