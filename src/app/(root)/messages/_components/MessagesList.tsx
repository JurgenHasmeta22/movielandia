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
import { useRouter } from "next/navigation";
import { Message } from "./MessagesPageContent";
import { deleteMessage, markMessageAsRead } from "@/actions/user/userMessages.actions";
import { useModal } from "@/providers/ModalProvider";
import { WarningOutlined, CheckOutlined, Circle, Email, MarkEmailRead } from "@mui/icons-material";
import * as CONSTANTS from "@/constants/Constants";
import { useSession } from "next-auth/react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { showToast } from "@/utils/helpers/toast";
import Link from "next/link";
import { useQueryState } from "nuqs";

interface MessagesListProps {
    messages: any;
    currentSection: string;
    currentPage: number;
    isLoading: boolean;
    messagesPageCount: number;
    initialMessageToEdit?: Message | null;
}

const MessagesList: React.FC<MessagesListProps> = ({ messages, currentSection, currentPage, messagesPageCount }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { openModal } = useModal();
    const { data: session } = useSession();

    const [section, setSection] = useQueryState("section", {
        defaultValue: "inbox",
        parse: (value) => value || "inbox",
        history: "push",
        shallow: false,
    });

    const [editMessageId, setEditMessageId] = useQueryState("editMessageId", {
        defaultValue: "",
        parse: (value) => value || "",
        history: "push",
        shallow: false,
    });

    const [selectedUserId, setSelectedUserId] = useQueryState("selectedUser", {
        defaultValue: "",
        parse: (value) => value || "",
        history: "push",
        shallow: false,
    });

    const handleDeleteMessage = async (messageId: number) => {
        startTransition(async () => {
            await deleteMessage(messageId);
        });

        showToast("success", "Message deleted successfully!");
        router.refresh();
    };

    const handleOpenMessage = async (message: Message) => {
        if (section === "inbox" && !message.read) {
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
                    <Box key={message.id} onClick={() => handleOpenMessage(message)}>
                        <ListItemButton
                            sx={{
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                                padding: 2,
                                backgroundColor: message.read ? "rgba(0, 0, 0, 0.02)" : "transparent",
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
                                <Link
                                    href={`/users/${
                                        currentSection === "inbox" ? message.sender.id : message.receiver.id
                                    }/${
                                        currentSection === "inbox" ? message.sender.userName : message.receiver.userName
                                    }`}
                                    style={{
                                        fontWeight: message.read === false ? "bold" : "normal",
                                        color: "inherit",
                                        textDecoration: "none",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {currentSection === "inbox" ? message.sender.userName : message.receiver.userName}
                                </Link>
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
                                        {currentSection === "inbox" && (
                                            <>
                                                {message.read ? (
                                                    <MarkEmailRead
                                                        sx={{
                                                            fontSize: "0.7rem",
                                                            color: "grey",
                                                            marginLeft: "0.2rem",
                                                        }}
                                                    />
                                                ) : (
                                                    <Email
                                                        sx={{
                                                            fontSize: "0.7rem",
                                                            color: "#30969f",
                                                            marginLeft: "0.2rem",
                                                        }}
                                                    />
                                                )}
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ marginLeft: "0.2rem" }}
                                                >
                                                    {message.read ? "Read" : "Unread"}
                                                </Typography>
                                            </>
                                        )}
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
                                                setEditMessageId(String(message.id));
                                                setSelectedUserId(message.receiverId);
                                                setSection("compose");
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
