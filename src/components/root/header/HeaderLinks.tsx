"use client";

import { Box, Button, List, ListItem, Popper, Paper, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useSession } from "next-auth/react";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface IHeaderLinksProps {
    genres: Genre[];
}

// Create a loading component for My Stuff button
const MyStuffLoadingButton = () => (
    <Button
        variant="text"
        component="div"
        disabled
        sx={{
            minWidth: "120px", // Match the width of actual button to prevent layout shift
            "& .MuiCircularProgress-root": {
                marginRight: 1,
            },
        }}
        startIcon={<CircularProgress size={20} />}
    >
        My Stuff
    </Button>
);

export function HeaderLinks({ genres }: IHeaderLinksProps) {
    const [genresOpen, setGenresOpen] = useState(false);
    const [peopleOpen, setPeopleOpen] = useState(false);
    const [myStuffOpen, setMyStuffOpen] = useState(false);
    const [genresAnchorEl, setGenresAnchorEl] = useState<null | HTMLElement>(null);
    const [peopleAnchorEl, setPeopleAnchorEl] = useState<null | HTMLElement>(null);
    const [myStuffAnchorEl, setMyStuffAnchorEl] = useState<null | HTMLElement>(null);
    const [activeMainTab, setActiveMainTab] = useState<string | null>(null);
    const [isSubMenuHovered, setIsSubMenuHovered] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout>();
    const currentTargetRef = useRef<HTMLElement | null>(null);
    const subMenuTimeoutRef = useRef<NodeJS.Timeout>();
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
            currentTargetRef.current = event.currentTarget;
            clearTimeout(hoverTimeoutRef.current);
            clearTimeout(subMenuTimeoutRef.current);
            hoverTimeoutRef.current = setTimeout(() => {
                setMyStuffAnchorEl(currentTargetRef.current);
                setMyStuffOpen(true);
            }, 50);
        }
    };

    const handleMyStuffLeave = () => {
        clearTimeout(hoverTimeoutRef.current);
        if (!isSubMenuHovered) {
            subMenuTimeoutRef.current = setTimeout(() => {
                setMyStuffOpen(false);
                setMyStuffAnchorEl(null);
                setActiveMainTab(null);
            }, 100);
        }
    };

    const handleSubMenuEnter = () => {
        clearTimeout(hoverTimeoutRef.current);
        clearTimeout(subMenuTimeoutRef.current);
        setIsSubMenuHovered(true);
    };

    const handleSubMenuLeave = () => {
        clearTimeout(hoverTimeoutRef.current);
        clearTimeout(subMenuTimeoutRef.current);
        setIsSubMenuHovered(false);
        setMyStuffOpen(false);
        setMyStuffAnchorEl(null);
        setActiveMainTab(null);
    };

    const handleMainTabHover = (param: string) => {
        const tab = myStuffTabs.find((t) => t.param === param);
        if (!tab?.noSubMenu) {
            setActiveMainTab(param);
        }
    };

    const handleMainTabLeave = () => {
        setActiveMainTab(null);
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
        {
            label: "Lists",
            icon: <CollectionsBookmarkIcon />,
            param: "lists",
            href: session?.user ? `/users/${session.user.id}/${session.user.userName}/lists` : undefined,
            noSubMenu: true, // Add this flag
        },
        { label: "Bookmarks", icon: <BookmarkIcon />, param: "bookmarks" },
        { label: "Upvotes", icon: <ThumbUpIcon />, param: "upvotes" },
        { label: "Downvotes", icon: <ThumbDownIcon />, param: "downvotes" },
        { label: "Reviews", icon: <RateReviewIcon />, param: "reviews" },
    ];

    const subTabs: Record<string, Array<{ label: string; icon: JSX.Element }>> = {
        bookmarks: [
            { label: "Movies", icon: <LocalMoviesIcon /> },
            { label: "Series", icon: <LiveTvIcon /> },
            { label: "Seasons", icon: <VideoLibraryIcon /> },
            { label: "Episodes", icon: <OndemandVideoIcon /> },
            { label: "Actors", icon: <PersonIcon /> },
            { label: "Crew", icon: <GroupIcon /> },
        ],
        upvotes: [
            { label: "Movies", icon: <LocalMoviesIcon /> },
            { label: "Series", icon: <LiveTvIcon /> },
            { label: "Seasons", icon: <VideoLibraryIcon /> },
            { label: "Episodes", icon: <OndemandVideoIcon /> },
            { label: "Actors", icon: <PersonIcon /> },
            { label: "Crew", icon: <GroupIcon /> },
        ],
        downvotes: [
            { label: "Movies", icon: <LocalMoviesIcon /> },
            { label: "Series", icon: <LiveTvIcon /> },
            { label: "Seasons", icon: <VideoLibraryIcon /> },
            { label: "Episodes", icon: <OndemandVideoIcon /> },
            { label: "Actors", icon: <PersonIcon /> },
            { label: "Crew", icon: <GroupIcon /> },
        ],
        reviews: [
            { label: "Movies", icon: <LocalMoviesIcon /> },
            { label: "Series", icon: <LiveTvIcon /> },
            { label: "Seasons", icon: <VideoLibraryIcon /> },
            { label: "Episodes", icon: <OndemandVideoIcon /> },
            { label: "Actors", icon: <PersonIcon /> },
            { label: "Crew", icon: <GroupIcon /> },
        ],
    };

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
                        mr: { xs: 1, sm: 2 },
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
                        height={60}
                        width={192}
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
                    flexWrap: { xs: "wrap", md: "nowrap" },
                }}
            >
                <List
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        gap: { xs: 0.5, sm: 1 },
                        m: 0,
                        p: 0,
                    }}
                >
                    <ListItem sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}>
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
                    <ListItem sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}>
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
                    <ListItem sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}>
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
                    <ListItem sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}>
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
                        <ListItem sx={{ width: "auto", p: { xs: 0.125, sm: 0.25 } }}>
                            <Suspense fallback={<MyStuffLoadingButton />}>
                                <Box
                                    onMouseEnter={handleMyStuffHover}
                                    onMouseLeave={handleMyStuffLeave}
                                    sx={{ position: "relative" }}
                                >
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
                                        modifiers={[
                                            {
                                                name: "offset",
                                                options: {
                                                    offset: [0, -1], // Reduce the gap between main menu and submenu
                                                },
                                            },
                                        ]}
                                    >
                                        <Paper
                                            onMouseEnter={handleSubMenuEnter}
                                            onMouseLeave={handleSubMenuLeave}
                                            sx={{
                                                mt: 0.5,
                                                minWidth: 180,
                                                display: "flex",
                                                "&::before": {
                                                    content: '""',
                                                    position: "absolute",
                                                    top: -10,
                                                    left: 0,
                                                    right: 0,
                                                    height: 10,
                                                },
                                            }}
                                        >
                                            <Box>
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
                                                        {tab.href ? (
                                                            <Link
                                                                href={tab.href}
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: theme.vars.palette.primary.main,
                                                                }}
                                                                onClick={() => {
                                                                    if (isDrawerOpen) setIsDrawerOpen(false);
                                                                    handleSubMenuLeave();
                                                                    setActiveMainTab(null); // Add this to clear the active tab
                                                                    setIsSubMenuHovered(false); // Add this to ensure sub-menu state is cleared
                                                                }}
                                                            >
                                                                <Box
                                                                    onMouseEnter={() => {
                                                                        if (!tab.noSubMenu) {
                                                                            handleMainTabHover(tab.param);
                                                                        } else {
                                                                            // For Lists, clear any active sub-menu
                                                                            setActiveMainTab(null);
                                                                            setIsSubMenuHovered(false);
                                                                        }
                                                                    }}
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 1,
                                                                        px: 2,
                                                                        py: 1.5,
                                                                        transition: "all 0.2s",
                                                                        bgcolor:
                                                                            activeMainTab === tab.param
                                                                                ? "action.selected"
                                                                                : "transparent",
                                                                        "&:hover": {
                                                                            backgroundColor:
                                                                                theme.vars.palette.action.hover,
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
                                                        ) : (
                                                            <Box
                                                                onMouseEnter={() => handleMainTabHover(tab.param)}
                                                                sx={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 1,
                                                                    px: 2,
                                                                    py: 1.5,
                                                                    transition: "all 0.2s",
                                                                    bgcolor:
                                                                        activeMainTab === tab.param
                                                                            ? "action.selected"
                                                                            : "transparent",
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            theme.vars.palette.action.hover,
                                                                        color: theme.vars.palette.primary.main,
                                                                    },
                                                                }}
                                                            >
                                                                {tab.icon}
                                                                <Typography sx={{ fontSize: "0.875rem" }}>
                                                                    {tab.label}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </Box>
                                            <AnimatePresence>
                                                {activeMainTab && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Paper
                                                            elevation={3}
                                                            sx={{
                                                                ml: 1,
                                                                minWidth: 180,
                                                                borderLeft: 1,
                                                                borderColor: "divider",
                                                            }}
                                                        >
                                                            {subTabs[activeMainTab]?.map((subTab, index) => (
                                                                <motion.div
                                                                    key={`${subTab.label}-${index}`}
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
                                                                        href={`/users/${session.user.id}/${session.user.userName}?maintab=${activeMainTab}&subtab=${subTab.label.toLowerCase()}`}
                                                                        style={{
                                                                            textDecoration: "none",
                                                                            color: theme.vars.palette.primary.main,
                                                                        }}
                                                                        onClick={() => {
                                                                            if (isDrawerOpen) setIsDrawerOpen(false);
                                                                            handleSubMenuLeave();
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
                                                                                    backgroundColor:
                                                                                        theme.vars.palette.action.hover,
                                                                                    color: theme.vars.palette.primary
                                                                                        .main,
                                                                                },
                                                                            }}
                                                                        >
                                                                            {subTab.icon}
                                                                            <Typography sx={{ fontSize: "0.875rem" }}>
                                                                                {subTab.label}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Link>
                                                                </motion.div>
                                                            ))}
                                                        </Paper>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Paper>
                                    </Popper>
                                </Box>
                            </Suspense>
                        </ListItem>
                    )}
                </List>
            </Box>
        </>
    );
}
