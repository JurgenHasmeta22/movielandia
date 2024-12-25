"use client";

import { useState, useEffect, useTransition } from "react";
import {
    Box,
    Container,
    Drawer,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { deleteMessage, editMessage } from "@/actions/user/userMessages.actions";
import { useRouter, useSearchParams } from "next/navigation";
import MessagedSidebar from "./MessagedSidebar";
import { MessageDetails } from "./MessageDetails";
import MessagesList from "./MessagesList";
import MessageCompose from "./MessageCompose";

export interface Message {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    createdAt: Date;
    read: boolean;
    editedAt?: Date | null;
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

interface MessagesData {
    items: any[];
    total: number;
}

interface MessagesPageContentProps {
    initialMessages: MessagesData;
    users: any[];
    searchResults: any[];
    currentSection: "inbox" | "sent";
    currentPage: number;
    userLoggedIn: any;
    initialSelectedUser: any;
    messagesPageCount: number;
    initialMessageToEdit?: any | null;
}

export default function MessagesPageContent({
    initialMessages,
    searchResults,
    currentSection,
    currentPage,
    initialSelectedUser,
    userLoggedIn,
    messagesPageCount,
    initialMessageToEdit,
}: MessagesPageContentProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const router = useRouter();
    const searchParams = useSearchParams();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isPending, startTransition] = useTransition();
    const [loadingPage, setLoadingPage] = useState(true);
    const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);

    useEffect(() => {
        setLoadingPage(false);
    }, [initialMessages]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navigateToSection = (section: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("section", section);
        router.push(`/messages?${params.toString()}`, { scroll: false });
    };

    const handleDeleteMessage = async (messageId: number) => {
        startTransition(async () => {
            await deleteMessage(messageId);
            setSelectedMessage(null);
        });
    };

    const handleEditMessage = (message: Message) => {
        setMessageToEdit(message);
        const params = new URLSearchParams(searchParams);
        params.set("section", "compose");
        router.push(`/messages?${params.toString()}`, { scroll: false });
    };

    if (loadingPage) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 14, mb: 10 }}>
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
                        <MessagedSidebar navigateToSection={navigateToSection} />
                    </Drawer>
                ) : (
                    <Paper sx={{ width: 250, mr: 2 }}>
                        <MessagedSidebar navigateToSection={navigateToSection} />
                    </Paper>
                )}
                <Paper sx={{ flexGrow: 1, p: 2 }}>
                    {searchParams.get("section") === "compose" ? (
                        <MessageCompose
                            searchResults={searchResults}
                            userLoggedIn={userLoggedIn}
                            initialSelectedUser={initialSelectedUser}
                            initialMessageToEdit={initialMessageToEdit}
                        />
                    ) : (
                        <MessagesList
                            messages={initialMessages}
                            currentSection={currentSection}
                            currentPage={currentPage}
                            isLoading={isPending}
                            onMessageSelect={setSelectedMessage}
                            onMessageDelete={handleDeleteMessage}
                            messagesPageCount={messagesPageCount}
                            onEditMessage={handleEditMessage}
                            initialMessageToEdit={initialMessageToEdit}
                        />
                    )}
                </Paper>
                {selectedMessage && (
                    <MessageDetails selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} />
                )}
            </Box>
        </Container>
    );
}
