"use client";

import { useState, useEffect } from "react";
import { Box, Container, Drawer, Paper, Typography, useTheme, useMediaQuery, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { deleteMessage } from "@/actions/user/userMessages.actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
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
    initialSearchQuery: string;
    userLoggedIn: any;
}

export default function MessagesPageContent({
    initialMessages,
    searchResults,
    currentSection,
    currentPage,
    initialSearchQuery,
    userLoggedIn,
}: MessagesPageContentProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const router = useRouter();
    const searchParams = useSearchParams();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

    const handleDeleteMessage = async (messageId: number) => {
        try {
            setIsLoading(true);
            await deleteMessage(messageId);
        } catch (error) {
            console.error("Failed to delete message:", error);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (debouncedSearchQuery !== searchQuery) {
            const params = new URLSearchParams(searchParams);

            if (debouncedSearchQuery) {
                params.set("search", debouncedSearchQuery);
            } else {
                params.delete("search");
            }

            router.push(`/messages?${params.toString()}`);
        }
    }, [debouncedSearchQuery, router, searchParams, searchQuery]);

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
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    ) : (
                        <MessagesList
                            messages={initialMessages}
                            currentSection={currentSection}
                            currentPage={currentPage}
                            isLoading={isLoading}
                            onMessageSelect={setSelectedMessage}
                            onMessageDelete={handleDeleteMessage}
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
