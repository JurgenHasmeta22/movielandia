"use client";

import { useState, useTransition } from "react";
import {
    Box,
    Container,
    Drawer,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter, useSearchParams } from "next/navigation";
import MessagedSidebar from "./MessagedSidebar";
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
    const [isPending, startTransition] = useTransition();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navigateToSection = (section: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("section", section);
        params.delete("editMessageId");
        router.push(`/messages?${params.toString()}`, { scroll: false });
    };

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
                            messagesPageCount={messagesPageCount}
                            initialMessageToEdit={initialMessageToEdit}
                        />
                    )}
                </Paper>
            </Box>
        </Container>
    );
}
