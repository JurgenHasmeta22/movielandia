"use client";

import { Box, Button, List, ListItem, Popper, Paper, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";

interface IHeaderLinksProps {
    genres: Genre[];
}

export function HeaderLinks({ genres }: IHeaderLinksProps) {
    const [genresOpen, setGenresOpen] = useState(false);
    const [peopleOpen, setPeopleOpen] = useState(false);
    const [genresAnchorEl, setGenresAnchorEl] = useState<null | HTMLElement>(null);
    const [peopleAnchorEl, setPeopleAnchorEl] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();

    const pathname = usePathname();
    const theme = useTheme();

    useEffect(() => {
        handleGenresLeave();
        handlePeopleLeave();
    }, [pathname]);

    const handleGenresHover = (event: React.MouseEvent<HTMLElement>) => {
        setGenresAnchorEl(event.currentTarget);
        setGenresOpen(true);
    };

    const handleGenresLeave = () => {
        setGenresOpen(false);
        setGenresAnchorEl(null);
    };

    const handlePeopleHover = (event: React.MouseEvent<HTMLElement>) => {
        setPeopleAnchorEl(event.currentTarget);
        setPeopleOpen(true);
    };

    const handlePeopleLeave = () => {
        setPeopleOpen(false);
        setPeopleAnchorEl(null);
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        if (path === "/people") {
            return pathname.startsWith("/actors") || pathname.startsWith("/crew");
        }
        return pathname.startsWith(path);
    };

    const getButtonStyle = (path: string) => ({
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        fontSize: "0.9rem", // Slightly reduced font size
        textTransform: "none",
        color: isActive(path) ? theme.vars.palette.green.main : theme.vars.palette.primary.main,
        borderBottom: isActive(path) ? `2px solid ${theme.vars.palette.green.main}` : "none",
        borderRadius: 0,
        fontWeight: 500,
        letterSpacing: "0.01em", // Slightly reduced letter spacing
        height: 42,
        px: 1.5, // Increased horizontal padding
        minWidth: "auto", // Allow buttons to be more compact
        "&:hover": {
            backgroundColor: "transparent",
            color: theme.vars.palette.green.main,
        },
    });

    const peopleLinks = [
        { path: "/actors", name: "Actors", icon: <PersonIcon /> },
        { path: "/crew", name: "Crew", icon: <GroupIcon /> },
    ];

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: "0 0 auto", // Prevent flex growth
                }}
            >
                <Button
                    LinkComponent={MuiNextLink}
                    href={"/"}
                    type="button"
                    sx={{
                        padding: 0,
                        mr: 2,
                        "&:hover": { backgroundColor: "transparent" },
                        "&:active": { backgroundColor: "transparent" },
                    }}
                    onClick={() => {
                        if (isDrawerOpen) setIsDrawerOpen(false);
                    }}
                >
                    <Image
                        src={"/icons/movielandia24-logo.png"}
                        alt="MovieLandia24"
                        height={50}
                        width={160}
                        priority={true}
                        style={{ pointerEvents: "none" }}
                    />
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: "0 0 auto", // Prevent flex growth
                }}
            >
                <List
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        m: 0,
                        p: 0,
                    }}
                >
                    <ListItem sx={{ width: "auto", p: 0.25 }}>
                        <Button
                            LinkComponent={MuiNextLink}
                            href="/movies"
                            variant="text"
                            sx={getButtonStyle("/movies")}
                            onClick={() => {
                                if (isDrawerOpen) setIsDrawerOpen(false);
                            }}
                            startIcon={<MovieIcon />}
                        >
                            Movies
                        </Button>
                    </ListItem>
                    <ListItem sx={{ width: "auto", p: 0.25 }}>
                        <Button
                            LinkComponent={MuiNextLink}
                            href="/series"
                            variant="text"
                            sx={getButtonStyle("/series")}
                            onClick={() => {
                                if (isDrawerOpen) setIsDrawerOpen(false);
                            }}
                            startIcon={<TvIcon />}
                        >
                            TV Series
                        </Button>
                    </ListItem>
                    <ListItem sx={{ width: "auto", p: 0.25 }}>
                        <Box onMouseEnter={handlePeopleHover} onMouseLeave={handlePeopleLeave}>
                            <Button
                                variant="text"
                                component="div"
                                disableRipple
                                sx={{
                                    ...getButtonStyle("/people"),
                                    cursor: "default",
                                    pointerEvents: "none",
                                }}
                                startIcon={<PersonIcon />}
                            >
                                People
                            </Button>
                            <Popper
                                open={peopleOpen}
                                anchorEl={peopleAnchorEl}
                                placement={isDrawerOpen ? "right-start" : "bottom-start"}
                                sx={{
                                    zIndex: 1300,
                                    ...(isDrawerOpen && {
                                        position: "fixed",
                                        left: "240px",
                                    }),
                                }}
                            >
                                <AnimatePresence>
                                    {peopleOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                            }}
                                            style={{ transformOrigin: "top" }}
                                        >
                                            <Paper sx={{ mt: 1, minWidth: 180 }}>
                                                {peopleLinks.map((link, index) => (
                                                    <motion.div
                                                        key={link.path}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                            transition: {
                                                                delay: index * 0.1,
                                                            },
                                                        }}
                                                    >
                                                        <Link
                                                            href={link.path}
                                                            style={{
                                                                textDecoration: "none",
                                                                color: theme.vars.palette.primary.main,
                                                            }}
                                                            onClick={() => {
                                                                if (isDrawerOpen) setIsDrawerOpen(false);
                                                                handlePeopleLeave();
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 1,
                                                                    p: 1.5,
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            theme.vars.palette.action.hover,
                                                                        color: theme.vars.palette.primary.main,
                                                                    },
                                                                }}
                                                            >
                                                                {link.icon}
                                                                <Typography sx={{ fontSize: "0.875rem" }}>
                                                                    {link.name}
                                                                </Typography>
                                                            </Box>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </Paper>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Popper>
                        </Box>
                    </ListItem>
                    <ListItem sx={{ width: "auto", p: 0.25 }}>
                        <Box onMouseEnter={handleGenresHover} onMouseLeave={handleGenresLeave}>
                            <Button
                                LinkComponent={MuiNextLink}
                                href="/genres"
                                variant="text"
                                sx={getButtonStyle("/genres")}
                                onClick={() => {
                                    if (isDrawerOpen) setIsDrawerOpen(false);
                                    handleGenresLeave();
                                }}
                                startIcon={<CategoryIcon />}
                            >
                                Genres
                            </Button>
                            <Popper
                                open={genresOpen}
                                anchorEl={genresAnchorEl}
                                placement={isDrawerOpen ? "right-start" : "bottom-start"}
                                sx={{
                                    zIndex: 1300,
                                    ...(isDrawerOpen && {
                                        position: "fixed",
                                        left: "240px",
                                    }),
                                }}
                            >
                                <AnimatePresence>
                                    {genresOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.6, y: -40 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 20,
                                                },
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.6,
                                                y: -20,
                                                transition: {
                                                    duration: 0.2,
                                                },
                                            }}
                                            style={{ transformOrigin: "top" }}
                                        >
                                            <Paper
                                                sx={{
                                                    mt: 1,
                                                    display: "grid",
                                                    gridTemplateColumns: isDrawerOpen
                                                        ? "repeat(2, 1fr)"
                                                        : "repeat(4, 1fr)",
                                                    gap: isDrawerOpen ? 0.5 : 1,
                                                    p: isDrawerOpen ? 1 : 2,
                                                }}
                                            >
                                                {genres.map((genre, index) => (
                                                    <motion.div
                                                        key={genre.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            transition: {
                                                                delay: index * 0.05,
                                                                duration: 0.3,
                                                            },
                                                        }}
                                                        whileHover={{
                                                            scale: 1.1,
                                                            rotate: [0, -2, 2, 0],
                                                            transition: {
                                                                rotate: {
                                                                    duration: 0.3,
                                                                    repeat: 0,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <Link
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
                                                                    padding: isDrawerOpen ? 0.75 : 1,
                                                                    textAlign: "center",
                                                                    transition: "background-color 0.2s",
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            theme.vars.palette.action.hover,
                                                                        color: theme.vars.palette.primary.main,
                                                                    },
                                                                }}
                                                            >
                                                                <Typography
                                                                    component={"span"}
                                                                    sx={{
                                                                        fontSize: "0.8rem",
                                                                        fontWeight: 500,
                                                                        letterSpacing: "0.02em",
                                                                        color: "inherit",
                                                                    }}
                                                                >
                                                                    {genre.name}
                                                                </Typography>
                                                            </Box>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </Paper>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Popper>
                        </Box>
                    </ListItem>
                </List>
            </Box>
        </>
    );
}
