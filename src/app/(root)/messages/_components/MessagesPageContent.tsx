"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Autocomplete,
    Pagination,
    ListItemButton,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { sendMessage, deleteMessage } from "@/actions/user/userMessages.actions";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

interface Message {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    createdAt: Date;
    sender: {
        userName: string;
        avatar?: {
            photoSrc: string;
        };
    };
    receiver: {
        userName: string;
        avatar?: {
            photoSrc: string;
        };
    };
}

interface User {
    id: number;
    userName: string;
    email: string;
    avatar?: {
        photoSrc: string;
    };
}

interface MessagesData {
    items: any[];
    total: number;
}

interface MessagesPageContentProps {
    initialMessages: MessagesData;
    users: any;
    currentSection: "inbox" | "sent";
    currentPage: number;
}

export default function MessagesPageContent({
    initialMessages,
    users,
    currentSection,
    currentPage,
}: MessagesPageContentProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const router = useRouter();
    const searchParams = useSearchParams();

    const [messages, setMessages] = useState<Message[]>(initialMessages.items);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navigateToSection = (section: string) => {
        const params = new URLSearchParams(searchParams);

        params.set("section", section);
        params.set("page", "1");
        router.push(`/messages?${params.toString()}`);

        if (isMobile) setMobileOpen(false);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/messages?${params.toString()}`);
    };

    const handleSendMessage = async () => {
        if (!selectedUser || !messageText.trim() || isLoading) return;

        const optimisticMessage: Message = {
            id: Date.now(),
            text: messageText,
            senderId: -1,
            receiverId: selectedUser.id,
            createdAt: new Date(),
            sender: { userName: "You" },
            receiver: selectedUser,
        };

        try {
            setIsLoading(true);
            setMessages((prev) => [optimisticMessage, ...prev]);

            await sendMessage(selectedUser.id, messageText);

            setMessageText("");
            setSelectedUser(null);
            navigateToSection("sent");
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            setIsLoading(true);
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

            await deleteMessage(messageId);
            setSelectedMessage(null);
        } catch (error) {
            console.error("Failed to delete message:", error);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    const drawer = (
        <Box sx={{ width: 250 }}>
            <List>
                <ListItemButton onClick={() => navigateToSection("inbox")}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItemButton>
                <ListItemButton onClick={() => navigateToSection("sent")}>
                    <ListItemIcon>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sent Messages" />
                </ListItemButton>
                <ListItemButton onClick={() => navigateToSection("compose")}>
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText primary="Compose New Message" />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
            <Box sx={{ display: "flex" }}>
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h4" component="h1" gutterBottom>
                    Messages
                </Typography>
            </Box>

            <Box sx={{ display: "flex", mt: 2 }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Paper sx={{ width: 250, mr: 2 }}>{drawer}</Paper>
                )}

                <Paper sx={{ flexGrow: 1, p: 2 }}>
                    {searchParams.get("section") === "compose" ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="h6">New Message</Typography>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(option) => option.userName}
                                value={selectedUser}
                                onChange={(_, newValue) => setSelectedUser(newValue)}
                                renderInput={(params) => <TextField {...params} label="Recipient" />}
                            />
                            <TextField
                                label="Message"
                                multiline
                                rows={4}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSendMessage}
                                disabled={!selectedUser || !messageText.trim() || isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Message"}
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {currentSection === "inbox" ? "Inbox" : "Sent Messages"}
                            </Typography>
                            {messages.length > 0 ? (
                                <>
                                    {messages.map((message) => (
                                        <Paper
                                            key={message.id}
                                            sx={{
                                                p: 2,
                                                mb: 2,
                                                cursor: "pointer",
                                                opacity: isLoading ? 0.7 : 1,
                                                "&:hover": { bgcolor: "action.hover" },
                                            }}
                                            onClick={() => setSelectedMessage(message)}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography variant="subtitle1">
                                                    {currentSection === "inbox"
                                                        ? message.sender.userName
                                                        : message.receiver.userName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDistanceToNow(new Date(message.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" noWrap>
                                                {message.text}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMessage(message.id);
                                                }}
                                                disabled={isLoading}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Paper>
                                    ))}
                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                                        <Pagination
                                            count={Math.ceil(initialMessages.total / 10)}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </Box>
                                </>
                            ) : (
                                <Typography color="text.secondary">No messages to display</Typography>
                            )}
                        </Box>
                    )}
                </Paper>

                {selectedMessage && (
                    <Paper sx={{ width: 300, ml: 2, p: 2, display: { xs: "none", md: "block" } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6">Message Details</Typography>
                            <IconButton size="small" onClick={() => setSelectedMessage(null)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">From: {selectedMessage.sender.userName}</Typography>
                            <Typography variant="subtitle2">To: {selectedMessage.receiver.userName}</Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {selectedMessage.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                                {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Container>
    );
}
