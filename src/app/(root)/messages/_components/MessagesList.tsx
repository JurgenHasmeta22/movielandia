"use client";

import { useTransition } from "react";
import {
    List,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { Message } from "./MessagesPageContent";
import { deleteMessage, markMessageAsRead } from "@/actions/user/userMessages.actions";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";
import { useSession } from "next-auth/react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { showToast } from "@/utils/helpers/toast";

interface MessagesListProps {
    messages: any;
    currentSection: string;
    currentPage: number;
    isLoading: boolean;
    messagesPageCount: number;
    initialMessageToEdit?: Message | null;
}

const MessagesList: React.FC<MessagesListProps> = ({
    messages,
    currentSection,
    currentPage,
    isLoading,
    messagesPageCount,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const { openModal } = useModal();
    const { data: session } = useSession();

    const handleDeleteMessage = async (messageId: number) => {
        startTransition(async () => {
            await deleteMessage(messageId);
        });

        showToast("success", "Message deleted successfully!");
        router.refresh();
    };

    const handleOpenMessage = async (message: Message) => {
        if (currentSection === "inbox" && !message.read) {
            await markMessageAsRead(message.id);
        }

        router.push(`/messages/${message.id}`, { scroll: false });
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
                        await handleDeleteMessage(messageId);
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

    if (isPending) {
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
                {messages.items.map((message: any) => (
                    <Box
                        key={message.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMessage(message);
                        }}
                    >
                        <ListItemButton
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                                padding: 2,
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
                                <Typography variant="subtitle2" fontWeight={message.read === false ? "bold" : "normal"}>
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
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        {message.editedAt && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                (edited{" "}
                                                {formatDistanceToNow(new Date(message.editedAt), {
                                                    addSuffix: true,
                                                })}
                                                )
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            created{" "}
                                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {currentSection !== "inbox" && (
                                    <>
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
                                            <EditIcon color="success" />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDeleteDialog(message.id);
                                            }}
                                        >
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </ListItemButton>
                        <Divider />
                    </Box>
                ))}
            </List>
            <Box sx={{ mt: 2 }}>
                <PaginationControl pageCount={messagesPageCount} currentPage={currentPage} urlParamName="page" />
            </Box>
        </>
    );
};

export default MessagesList;
