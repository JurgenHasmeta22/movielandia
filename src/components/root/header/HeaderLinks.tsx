"use client";

import {
    Box,
    Button,
    List,
    ListItem,
    Popper,
    Paper,
    Typography,
    useTheme,
    IconButton,
    Avatar,
    Divider,
    Stack,
} from "@mui/material";
import Link from "next/link";
import { Genre } from "@prisma/client";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import { useStore } from "@/store/store";
import MuiNextLink from "../muiNextLink/MuiNextLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {} from "@mui/material/themeCssVarsAugmentation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import {
    getRecentNotifications,
    getUnreadNotificationsCount,
    markNotificationsAsRead,
} from "@/actions/user/userFollow.actions";
import { Session } from "next-auth";

interface IHeaderLinksProps {
    genres: Genre[];
    session: Session | null;
}

export function HeaderLinks({ genres, session }: IHeaderLinksProps) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isDrawerOpen, setIsDrawerOpen } = useStore();
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    const pathname = usePathname();
    const theme = useTheme();

    useEffect(() => {
        handleGenresLeave();
    }, [pathname]);

    useEffect(() => {
        if (session?.user?.id) {
            const fetchNotifications = async () => {
                const count = await getUnreadNotificationsCount(Number(session.user.id));
                const recent = await getRecentNotifications(Number(session.user.id));
                setUnreadCount(count);
                setNotifications(recent);
            };

            fetchNotifications();
        }
    }, [session]);

    const handleGenresHover = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleGenresLeave = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const handleNotificationClick = async (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
        if (session?.user?.id) {
            await markNotificationsAsRead(Number(session.user.id));
            setUnreadCount(0);
        }
    };

    const handleNotificationClose = (): any => {
        setNotificationAnchorEl(null);
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const getButtonStyle = (path: string) => ({
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        fontSize: "1rem",
        textTransform: "none",
        color: isActive(path) ? theme.vars.palette.green.main : theme.vars.palette.primary.main,
        borderBottom: isActive(path) ? `2px solid ${theme.vars.palette.green.main}` : "none",
        borderRadius: 0,
        fontWeight: 500,
        letterSpacing: "0.02em",
        height: 48,
        "&:hover": {
            backgroundColor: "transparent",
            color: theme.vars.palette.green.main,
        },
    });

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Button
                    LinkComponent={MuiNextLink}
                    href={"/"}
                    type="button"
                    sx={{
                        padding: 0,
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                        "&:active": {
                            backgroundColor: "transparent",
                        },
                    }}
                    onClick={() => {
                        if (isDrawerOpen) {
                            setIsDrawerOpen(false);
                        }
                    }}
                >
                    <Image
                        src={"/icons/movielandia24-logo.png"}
                        alt="MovieLandia24"
                        height={70}
                        width={200}
                        style={{ pointerEvents: "none" }}
                    />
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                }}
            >
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
                            LinkComponent={MuiNextLink}
                            href="/movies"
                            variant="text"
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
                            LinkComponent={MuiNextLink}
                            href="/series"
                            variant="text"
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
                                LinkComponent={MuiNextLink}
                                href="/genres"
                                variant="text"
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
                                <AnimatePresence>
                                    {open && (
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
                                                                        fontSize: "0.875rem",
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
                {session?.user && (
                    <Box sx={{ ml: 2 }}>
                        <IconButton
                            onClick={handleNotificationClick}
                            sx={{
                                color: theme.vars.palette.primary.main,
                            }}
                        >
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Popper
                            open={Boolean(notificationAnchorEl)}
                            anchorEl={notificationAnchorEl}
                            placement="bottom-end"
                            sx={{
                                zIndex: 1300,
                            }}
                        >
                            <AnimatePresence>
                                {Boolean(notificationAnchorEl) && (
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
                                        style={{ transformOrigin: "top right" }}
                                    >
                                        <Paper
                                            sx={{
                                                mt: 1,
                                                width: 360,
                                                maxHeight: 400,
                                                overflow: "auto",
                                            }}
                                        >
                                            <Box sx={{ p: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Notifications
                                                </Typography>
                                                <Divider />
                                                <Stack spacing={2} sx={{ mt: 2 }}>
                                                    {notifications.map((notification) => (
                                                        <Box
                                                            key={notification.id}
                                                            sx={{
                                                                p: 1.5,
                                                                borderRadius: 1,
                                                                cursor: "pointer",
                                                                transition: "all 0.2s",
                                                                "&:hover": {
                                                                    bgcolor: "background.default",
                                                                },
                                                            }}
                                                            onClick={handleNotificationClose}
                                                        >
                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                <Avatar
                                                                    src={notification.sender.avatar?.photoSrc}
                                                                    alt={notification.sender.userName}
                                                                    sx={{ width: 40, height: 40 }}
                                                                />
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{ fontWeight: 500 }}
                                                                    >
                                                                        {notification.sender.userName}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{ mt: 0.5 }}
                                                                    >
                                                                        {notification.content}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </Box>
                                            <Divider />
                                            <Box
                                                component={Link}
                                                href="/notifications"
                                                onClick={handleNotificationClose}
                                                sx={{
                                                    display: "block",
                                                    textAlign: "center",
                                                    p: 2,
                                                    textDecoration: "none",
                                                    color: theme.vars.palette.primary.main,
                                                    "&:hover": {
                                                        bgcolor: "background.default",
                                                    },
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    View all notifications
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Popper>
                    </Box>
                )}
            </Box>
        </>
    );
}
