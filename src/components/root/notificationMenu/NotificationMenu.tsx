"use client";

import { markNotificationsAsRead } from "@/actions/user/userFollow.actions";
import { socket } from "@/lib/socket";
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
    Button,
    ClickAwayListener,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Session } from "next-auth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { formatDistanceToNow } from "date-fns";

interface INotificationMenu {
    session: Session | null;
}

export default function NotificationMenu({ session }: INotificationMenu) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        socket.on("getNotification", (data: any) => {
            setNotifications((prev) => [...prev, data]);
        });
    }, []);

    const handleMarkAllAsRead = async () => {
        if (session?.user?.id) {
            await markNotificationsAsRead(Number(session.user.id));
            setNotifications([]);
        }
    };

    const handleClickAway = () => {
        setNotificationAnchorEl(null);
        setIsOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
                <IconButton
                    sx={{
                        color: theme.vars.palette.primary.main,
                    }}
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        setIsOpen(!isOpen);

                        if (isOpen) {
                            setNotificationAnchorEl(null);
                            return;
                        }

                        setNotificationAnchorEl(event.currentTarget);
                    }}
                >
                    <Badge badgeContent={notifications.length} color="error">
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
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Button
                                                    size="small"
                                                    onClick={handleMarkAllAsRead}
                                                    disabled={notifications.length === 0}
                                                    sx={{
                                                        textTransform: "none",
                                                        fontSize: "0.8rem",
                                                        color: "primary.main",
                                                        "&:hover": {
                                                            backgroundColor: "transparent",
                                                            textDecoration: "underline",
                                                        },
                                                    }}
                                                >
                                                    Mark all as read
                                                </Button>
                                                <Link href="/notifications" style={{ textDecoration: "none" }}>
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
                                        </Stack>
                                        <Divider />
                                        <Stack spacing={2} sx={{ mt: 2 }}>
                                            {notifications.length > 0 ? (
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
                                                        >
                                                            <Stack direction="row" spacing={2} alignItems="flex-start">
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
                                                    <Typography variant="body1" color="text.secondary" align="center">
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
    );
}
