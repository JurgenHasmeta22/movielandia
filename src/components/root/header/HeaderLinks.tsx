"use client";

import { Box, Button, List, ListItem, Popper, Paper, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useSession } from "next-auth/react";

interface IHeaderLinksProps {
    genres: Genre[];
}

export function HeaderLinks({ genres }: IHeaderLinksProps) {
    const [genresOpen, setGenresOpen] = useState(false);
    const [peopleOpen, setPeopleOpen] = useState(false);
    const [myStuffOpen, setMyStuffOpen] = useState(false);
    const [genresAnchorEl, setGenresAnchorEl] = useState<null | HTMLElement>(null);
    const [peopleAnchorEl, setPeopleAnchorEl] = useState<null | HTMLElement>(null);
    const [myStuffAnchorEl, setMyStuffAnchorEl] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();
    const { data: session } = useSession();
    const router = useRouter();

    const pathname = usePathname();
    const theme = useTheme();

    useEffect(() => {
        handleGenresLeave();
        handlePeopleLeave();
        handleMyStuffLeave();
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

    const handleMyStuffHover = (event: React.MouseEvent<HTMLElement>) => {
        if (session?.user) {
            setMyStuffAnchorEl(event.currentTarget);
            setMyStuffOpen(true);
        }
    };

    const handleMyStuffLeave = () => {
        setMyStuffOpen(false);
        setMyStuffAnchorEl(null);
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
        fontSize: "0.9rem",
        textTransform: "none",
        color: isActive(path) ? theme.vars.palette.green.main : theme.vars.palette.primary.main,
        borderBottom: isActive(path) ? `2px solid ${theme.vars.palette.green.main}` : "none",
        borderRadius: 0,
        fontWeight: 500,
        letterSpacing: "0.01em",
        height: 42,
        px: 1.5,
        minWidth: "auto",
        "&:hover": {
            backgroundColor: "transparent",
            color: theme.vars.palette.green.main,
        },
    });

    const peopleLinks = [
        { path: "/actors", name: "Actors", icon: <PersonIcon /> },
        { path: "/crew", name: "Crew", icon: <GroupIcon /> },
    ];

    const myStuffTabs = [
        { label: "Bookmarks", icon: <BookmarkIcon />, param: "bookmarks" },
        { label: "Upvotes", icon: <ThumbUpIcon />, param: "upvotes" },
        { label: "Downvotes", icon: <ThumbDownIcon />, param: "downvotes" },
        { label: "Reviews", icon: <RateReviewIcon />, param: "reviews" },
    ];

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: "0 0 auto",
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
                    flex: "0 0 auto",
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
                                Cast & Crew
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
                    {session?.user && (
                        <ListItem sx={{ width: "auto", p: 0.25 }}>
                            <Box onMouseEnter={handleMyStuffHover} onMouseLeave={handleMyStuffLeave}>
                                <Button
                                    variant="text"
                                    component="div"
                                    disableRipple
                                    sx={getButtonStyle("/users")}
                                    startIcon={<CollectionsBookmarkIcon />}
                                >
                                    My Stuff
                                </Button>
                                <Popper
                                    open={myStuffOpen}
                                    anchorEl={myStuffAnchorEl}
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
                                        {myStuffOpen && (
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
                                                    {myStuffTabs.map((tab, index) => (
                                                        <motion.div
                                                            key={tab.param}
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
                                                                href={`/users/${session.user.id}/${session.user.name}?maintab=${tab.param}&subtab=movies`}
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: theme.vars.palette.primary.main,
                                                                }}
                                                                onClick={() => {
                                                                    if (isDrawerOpen) setIsDrawerOpen(false);
                                                                    handleMyStuffLeave();
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 1,
                                                                        px: 2,
                                                                        py: 1.5,
                                                                        transition: "all 0.2s",
                                                                        "&:hover": {
                                                                            backgroundColor: theme.vars.palette.action.hover,
                                                                            color: theme.vars.palette.primary.main,
                                                                        },
                                                                    }}
                                                                >
                                                                    {tab.icon}
                                                                    <Typography sx={{ fontSize: "0.875rem" }}>
                                                                        {tab.label}
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
                    )}
                </List>
            </Box>
        </>
    );
}
