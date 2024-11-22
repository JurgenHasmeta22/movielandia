"use client";

import { Box, Button, List, ListItem, Popper, Paper, ButtonGroup, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import type {} from "@mui/material/themeCssVarsAugmentation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface IHeaderLinksProps {
    genres: Genre[];
}

export function HeaderLinks({ genres }: IHeaderLinksProps) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const pathname = usePathname();
    const theme = useTheme();

    useEffect(() => {
        handleGenresLeave();
    }, [pathname]);

    const handleGenresHover = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleGenresLeave = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const getButtonStyle = (path: string) => ({
        display: "flex",
        fontSize: 16,
        columnGap: 0.5,
        textTransform: "capitalize",
        flexDirection: "row",
        alignItems: "center",
        color: isActive(path) ? theme.vars.palette.green.main : theme.vars.palette.primary.main,
        borderBottom: isActive(path) ? `2px solid ${theme.vars.palette.green.main}` : "none",
        borderRadius: 0,
        paddingBottom: 1,
        "&:hover": {
            backgroundColor: "transparent",
        },
    });

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
                    type={"mainLogo"}
                    onClick={() => {
                        if (isDrawerOpen) {
                            setIsDrawerOpen(false);
                        }
                    }}
                >
                    <Image src={"/icons/movielandia24-logo.png"} alt="MovieLandia24" height={70} width={200} />
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
                            sx={getButtonStyle("/movies")}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <MovieIcon fontSize={"large"} />
                            Movies
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            component={MuiNextLink}
                            href="/series"
                            prefetch={false}
                            sx={getButtonStyle("/series")}
                            onClick={() => {
                                if (isDrawerOpen) {
                                    setIsDrawerOpen(false);
                                }
                            }}
                        >
                            <LocalMoviesIcon fontSize={"large"} />
                            Series
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Box onMouseEnter={handleGenresHover} onMouseLeave={handleGenresLeave}>
                            <Button
                                component={MuiNextLink}
                                href="/genres"
                                prefetch={false}
                                sx={getButtonStyle("/genres")}
                                onClick={() => {
                                    if (isDrawerOpen) {
                                        setIsDrawerOpen(false);
                                    }
                                    handleGenresLeave();
                                }}
                            >
                                <SubtitlesIcon fontSize={"large"} />
                                Genres
                            </Button>
                            <Popper
                                open={open}
                                anchorEl={anchorEl}
                                placement={isDrawerOpen ? "right-start" : "bottom-start"}
                                sx={{
                                    zIndex: 1300,
                                    ...(isDrawerOpen && {
                                        position: "fixed",
                                        left: "240px",
                                    }),
                                }}
                            >
                                <Paper
                                    sx={{
                                        mt: 1,
                                        display: "grid",
                                        gridTemplateColumns: isDrawerOpen ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                                        gap: isDrawerOpen ? 0.5 : 1,
                                        p: isDrawerOpen ? 1 : 2,
                                    }}
                                >
                                    {genres.map((genre) => (
                                        <Link
                                            key={genre.id}
                                            href={`/genres/${genre.id}/${genre.name}`}
                                            style={{
                                                textDecoration: "none",
                                                color: theme.vars.palette.primary.main,
                                            }}
                                            onClick={() => {
                                                if (isDrawerOpen) {
                                                    setIsDrawerOpen(false);
                                                }
                                                handleGenresLeave();
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    cursor: "pointer",
                                                    padding: isDrawerOpen ? 0.75 : 1.5,
                                                    textAlign: "center",
                                                    transition: "background-color 0.2s",
                                                    "&:hover": {
                                                        backgroundColor: theme.vars.palette.green.main,
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    component={"span"}
                                                    sx={{
                                                        fontSize: isDrawerOpen ? 14 : 16,
                                                    }}
                                                >
                                                    {genre.name}
                                                </Typography>
                                            </Box>
                                        </Link>
                                    ))}
                                </Paper>
                            </Popper>
                        </Box>
                    </ListItem>
                </List>
            </Box>
        </>
    );
}
