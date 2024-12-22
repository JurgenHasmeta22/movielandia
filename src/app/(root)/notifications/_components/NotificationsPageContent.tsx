"use client";

import { Box, Container, Typography, Stack, Avatar, Pagination, Paper } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { motion } from "framer-motion";

interface NotificationsContentProps {
    notifications: {
        items: Array<{
            id: number;
            content: string;
            createdAt: Date;
            isRead: boolean;
            sender: {
                id: number;
                userName: string;
                avatar?: { photoSrc: string } | null;
            };
        }>;
        total: number;
    };
}

export default function NotificationsContent({ notifications }: NotificationsContentProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams?.get("page")) || 1;
    const perPage = 10;
    const totalPages = Math.ceil(notifications.total / perPage);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("page", value.toString());

        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${window.location.pathname}${query}`, { scroll: false });
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, mt: 8, mb: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Your Notifications
            </Typography>

            <Stack spacing={2}>
                {notifications.items.length > 0 ? (
                    notifications.items.map((notification, index) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: index * 0.1 },
                            }}
                        >
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: notification.isRead ? "background.paper" : "action.hover",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: (theme) => theme.shadows[4],
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                        src={notification.sender.avatar?.photoSrc}
                                        alt={notification.sender.userName}
                                        sx={{ width: 50, height: 50 }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {notification.sender.userName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {notification.content}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ mt: 1, display: "block" }}
                                        >
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    ))
                ) : (
                    <Box
                        sx={{
                            py: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <NotificationsActiveIcon
                            sx={{
                                fontSize: 64,
                                color: "text.disabled",
                            }}
                        />
                        <Typography variant="h6" color="text.secondary" align="center">
                            No notifications yet
                        </Typography>
                    </Box>
                )}
            </Stack>

            {notifications.total > perPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Container>
    );
}
