"use client";

import {
    getPaginatedNotifications,
    getUnreadNotificationsCount,
    markNotificationsAsRead,
} from "@/actions/user/userFollow.actions";
import { theme } from "@/utils/theme/theme";
import {
    Box,
    IconButton,
    Badge,
    Popper,
    Paper,
    Typography,
    Divider,
    Stack,
    Avatar,
    CircularProgress,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Session } from "next-auth";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { formatDistanceToNow } from "date-fns";

interface INotificationMenu {
    session: Session | null;
}

export default function NotificationMenu({ session }: INotificationMenu) {
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef<HTMLDivElement>(null);
    const isOpen = Boolean(notificationAnchorEl);

    const fetchNotifications = async (page: number) => {
        if (!session?.user?.id) return;

        if (page === 1) {
            setIsLoading(true);
        }

        try {
            const response = await fetch(`/api/notifications?userId=${session.user.id}&page=${page}&limit=5`);

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const newNotifications = await response.json();

            if (newNotifications.length < 5) {
                setHasMore(false);
            }

            setNotifications((prev) => (page === 1 ? newNotifications : [...prev, ...newNotifications]));
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && isOpen && !isLoading) {
                    fetchNotifications(currentPage + 1);
                }
            },
            { threshold: 0.1 },
        );

        const currentLoaderRef = loaderRef.current;
        if (currentLoaderRef) {
            observer.observe(currentLoaderRef);
        }

        return () => {
            if (currentLoaderRef) {
                observer.unobserve(currentLoaderRef);
            }
        };
    }, [currentPage, hasMore, isOpen, isLoading]);

    const handleNotificationClick = async (event: React.MouseEvent<HTMLElement>) => {
        if (isOpen) {
            setNotificationAnchorEl(null);
            return;
        }

        setIsLoading(true);
        setNotificationAnchorEl(event.currentTarget);
        setCurrentPage(1);
        setHasMore(true);
        setNotifications([]);

        if (session?.user?.id) {
            await markNotificationsAsRead(Number(session.user.id));
            setUnreadCount(0);
            await fetchNotifications(1);
        }
    };

    const handleClickAway = () => {
        setNotificationAnchorEl(null);
    };

    useEffect(() => {
        if (session?.user?.id) {
            const fetchNotifications = async () => {
                const count = await getUnreadNotificationsCount(Number(session.user.id));
                setUnreadCount(count);
            };

            fetchNotifications();
        }
    }, [session]);

    return (
        <Box>
            <ClickAwayListener onClickAway={handleClickAway}>
                <Box>
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
                        open={isOpen}
                        anchorEl={notificationAnchorEl}
                        placement="bottom-end"
                        sx={{
                            zIndex: 1300,
                        }}
                    >
                        <AnimatePresence>
                            {isOpen && (
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
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="space-between"
                                                sx={{ mb: 2 }}
                                            >
                                                <Typography variant="h6">Notifications</Typography>
                                                <Link
                                                    href="/notifications"
                                                    onClick={handleClickAway}
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "primary.main",
                                                            "&:hover": {
                                                                textDecoration: "underline",
                                                            },
                                                        }}
                                                    >
                                                        View All
                                                    </Typography>
                                                </Link>
                                            </Stack>
                                            <Divider />
                                            <Stack spacing={2} sx={{ mt: 2 }}>
                                                {isLoading ? (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            p: 4,
                                                        }}
                                                    >
                                                        <CircularProgress size={24} />
                                                    </Box>
                                                ) : notifications.length > 0 ? (
                                                    <>
                                                        {notifications.map((notification) => (
                                                            <Box
                                                                key={notification.id}
                                                                sx={{
                                                                    p: 1.5,
                                                                    borderRadius: 1,
                                                                    cursor: "default",
                                                                    transition: "all 0.2s",
                                                                    bgcolor:
                                                                        notification.status === "unread"
                                                                            ? "action.hover"
                                                                            : "transparent",
                                                                    "&:hover": {
                                                                        bgcolor: "background.default",
                                                                    },
                                                                }}
                                                                onClick={handleClickAway}
                                                            >
                                                                <Stack
                                                                    direction="row"
                                                                    spacing={2}
                                                                    alignItems="flex-start"
                                                                >
                                                                    <Avatar
                                                                        src={notification.sender.avatar?.photoSrc}
                                                                        alt={notification.sender.userName}
                                                                        sx={{ width: 40, height: 40 }}
                                                                    />
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                fontWeight:
                                                                                    notification.status === "unread"
                                                                                        ? 600
                                                                                        : 400,
                                                                            }}
                                                                        >
                                                                            {notification.sender.userName}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            sx={{
                                                                                mt: 0.5,
                                                                                opacity:
                                                                                    notification.status === "unread"
                                                                                        ? 1
                                                                                        : 0.7,
                                                                            }}
                                                                        >
                                                                            {notification.content}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                            sx={{
                                                                                mt: 0.5,
                                                                                display: "block",
                                                                                opacity: 0.8,
                                                                            }}
                                                                        >
                                                                            {formatDistanceToNow(
                                                                                new Date(notification.createdAt),
                                                                                { addSuffix: true },
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                </Stack>
                                                            </Box>
                                                        ))}
                                                        {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
                                                    </>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            py: 4,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <NotificationsActiveIcon
                                                            sx={{
                                                                fontSize: 48,
                                                                color: "text.disabled",
                                                            }}
                                                        />
                                                        <Typography
                                                            variant="body1"
                                                            color="text.secondary"
                                                            align="center"
                                                        >
                                                            No notifications yet
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Popper>
                </Box>
            </ClickAwayListener>
        </Box>
    );
}
