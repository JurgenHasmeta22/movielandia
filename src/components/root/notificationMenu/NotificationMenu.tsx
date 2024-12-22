"use client";

import {
    getRecentNotifications,
    getUnreadNotificationsCount,
    markNotificationsAsRead,
} from "@/actions/user/userFollow.actions";
import { theme } from "@/utils/theme/theme";
import { Box, IconButton, Badge, Popper, Paper, Typography, Divider, Stack, Avatar } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Session } from "next-auth";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

interface INotificationMenu {
    session: Session | null;
}

export default function NotificationMenu({ session }: INotificationMenu) {
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const isOpen = Boolean(notificationAnchorEl);

    const handleNotificationClick = async (event: React.MouseEvent<HTMLElement>) => {
        if (isOpen) {
            setNotificationAnchorEl(null);
            return;
        }

        setNotificationAnchorEl(event.currentTarget);

        if (session?.user?.id) {
            await markNotificationsAsRead(Number(session.user.id));
            setUnreadCount(0);
        }
    };

    const handleClickAway = () => {
        setNotificationAnchorEl(null);
    };

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

    return (
        <Box sx={{ ml: 2 }}>
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
                                            <Typography variant="h6" gutterBottom>
                                                Notifications
                                            </Typography>
                                            <Divider />
                                            <Stack spacing={2} sx={{ mt: 2 }}>
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification) => (
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
                                                            onClick={handleClickAway}
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
                                                    ))
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
                                        <Divider />
                                        <Box
                                            component={Link}
                                            href="/notifications"
                                            onClick={handleClickAway}
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
            </ClickAwayListener>
        </Box>
    );
}
