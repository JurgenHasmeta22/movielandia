"use client";

import { useState, useEffect, useTransition } from "react";
import {
    List,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    Button,
    ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Message } from "./MessagesPageContent";
import { markMessageAsRead } from "@/actions/user/userMessages.actions";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";
import { useSession } from "next-auth/react";

interface MessagesListProps {
    messages: any;
    currentSection: string;
    currentPage: number;
    isLoading: boolean;
    messagesPageCount: number;
    onMessageSelect: (message: Message) => void;
    onMessageDelete: (messageId: number) => void;
    onEditMessage: (message: Message) => void;
    initialMessageToEdit?: Message | null;
}

const MessagesList: React.FC<MessagesListProps> = ({
    messages,
    currentSection,
    currentPage,
    isLoading,
    messagesPageCount,
    onMessageSelect,
    onMessageDelete,
    onEditMessage,
    initialMessageToEdit,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const { openModal } = useModal();
    const { data: session } = useSession();

    const handleOpenMessage = async (message: Message) => {
        onMessageSelect(message);

        if (currentSection === "inbox" && !message.read) {
            await markMessageAsRead(message.id);
        }
    };

    const handleOpenDeleteDialog = (messageId: number) => {
        openModal({
            onClose: () => {},
            title: `Delete selected message`,
            subTitle: "Do you want to delete selected message?",
            actions: [
                {
                    label: CONSTANTS.MODAL__DELETE__NO,
                    onClick: () => {},
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#ff5252",
                    },
                    icon: <WarningOutlined />,
                },
                {
                    label: CONSTANTS.MODAL__DELETE__YES,
                    onClick: async () => {
                        startTransition(async () => {
                            await onMessageDelete(messageId);
                        });
                    },
                    type: "submit",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        bgcolor: "#30969f",
                    },
                    icon: <CheckOutlined />,
                },
            ],
        });
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", String(newPage));
        startTransition(() => {
            router.push(`/messages?${params.toString()}`, { scroll: false });
        });
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    const inboxMessages = messages.items.filter(
        (message: any) => currentSection === "inbox" && message.receiverId === Number(session?.user.id),
    );

    if (currentSection === "inbox" && (!inboxMessages || inboxMessages.length === 0)) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Typography variant="body1">No messages received.</Typography>
            </Box>
        );
    }

    if (!messages.items || messages.items.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <Typography variant="body1">No messages found.</Typography>
            </Box>
        );
    }

    return (
        <>
            <List>
                {messages.items.map((message: Message) => (
                    <Box key={message.id}>
                        {currentSection === "inbox" ? (
                            message.receiverId === Number(session?.user.id) && (
                                <ListItemButton
                                    onClick={() => handleOpenMessage(message)}
                                    sx={{
                                        backgroundColor: message.read === false ? "#f0f8ff" : "transparent",
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
                                            fontWeight={message.read === false ? "bold" : "normal"}
                                        >
                                            {currentSection === "inbox"
                                                ? message.sender.userName
                                                : message.receiver.userName}
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
                                                    wordWrap: "break-word",
                                                    overflowWrap: "break-word",
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
                                            console.log(message.id);
                                            handleOpenDeleteDialog(message.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemButton>
                            )
                        ) : (
                            <ListItemButton
                                onClick={() => handleOpenMessage(message)}
                                sx={{
                                    backgroundColor:
                                        message.read === false && currentSection === "inbox"
                                            ? "#f0f8ff"
                                            : "transparent",
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
                                        fontWeight={message.read === false ? "bold" : "normal"}
                                    >
                                        {currentSection === "inbox"
                                            ? message.sender.userName
                                            : message.receiver.userName}
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
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const params = new URLSearchParams(searchParams);
                                            params.set("editMessageId", String(message.id));
                                            params.set("section", "compose");
                                            router.push(`/messages?${params.toString()}`, { scroll: false });
                                        }}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(message.id);
                                            handleOpenDeleteDialog(message.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </ListItemButton>
                        )}
                        <Divider />
                    </Box>
                ))}
            </List>
            {messagesPageCount > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 1 }}>
                    {Array.from({ length: messagesPageCount }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            variant={Number(currentPage) === page ? "contained" : "outlined"}
                            disabled={isPending}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
            )}
        </>
    );
};

export default MessagesList;
