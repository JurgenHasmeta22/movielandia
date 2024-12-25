"use client";

import { useState, useEffect } from "react";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Message } from "./MessagesPageContent";
import { markMessageAsRead } from "@/actions/user/userMessages.actions";

interface MessagesListProps {
    messages: any;
    currentSection: "inbox" | "sent";
    currentPage: number;
    isLoading: boolean;
    onMessageSelect: (message: Message) => void;
    onMessageDelete: (messageId: number) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
    messages,
    currentSection,
    currentPage,
    isLoading,
    onMessageSelect,
    onMessageDelete,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
    const [totalMessages, setTotalMessages] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (messages) {
            setCurrentMessages(messages.items);
            setTotalMessages(messages.total);
            setTotalPages(Math.ceil(messages.total / 10));
        }
    }, [messages]);

    const handleOpenMessage = async (message: Message) => {
        onMessageSelect(message);
        if (currentSection === "inbox" && !message.read) {
            await markMessageAsRead(message.id);
        }
    };

    const handleOpenDeleteDialog = (messageId: number) => {
        setMessageToDelete(messageId);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setMessageToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (messageToDelete) {
            await onMessageDelete(messageToDelete);
            handleCloseDeleteDialog();
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(newPage));
        router.push(`/messages?${params.toString()}`, { scroll: false });
        setLoadingMessages(true);
    };

    useEffect(() => {
        setLoadingMessages(false);
    }, [messages]);

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={Number(currentPage) === page ? "contained" : "outlined"}
                        disabled={loadingMessages}
                    >
                        {page}
                    </Button>
                ))}
            </Box>
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentMessages || currentMessages.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Typography variant="body1">No messages found.</Typography>
            </Box>
        );
    }

    return (
        <>
            <List>
                {currentMessages.map((message: Message) => (
                    <Box key={message.id}>
                        <ListItemButton
                            onClick={() => handleOpenMessage(message)}
                            sx={{
                                backgroundColor:
                                    message.read === false && currentSection === "inbox" ? "#f0f8ff" : "transparent",
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={
                                        currentSection === "inbox"
                                            ? message.sender?.avatar?.photoSrc
                                            : message.receiver?.avatar?.photoSrc
                                    }
                                >
                                    {currentSection === "inbox"
                                        ? message.sender?.userName.charAt(0).toUpperCase()
                                        : message.receiver?.userName.charAt(0).toUpperCase()}
                                </Avatar>
                            </ListItemAvatar>
                            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={
                                        message.read === false && currentSection === "inbox" ? "bold" : "normal"
                                    }
                                >
                                    {currentSection === "inbox" ? message.sender.userName : message.receiver.userName}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            maxWidth: "200px",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: message.text.replace(/<[^>]*>/g, "").slice(0, 50),
                                        }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDeleteDialog(message.id);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </ListItemButton>
                        <Divider />
                    </Box>
                ))}
            </List>
            {renderPagination()}
            <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>{"Delete Message?"}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MessagesList;
