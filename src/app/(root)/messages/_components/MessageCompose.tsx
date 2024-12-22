"use client";

import { useState, useCallback } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    List,
    ListItemButton,
    ListItemText,
    InputAdornment,
    Chip,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { sendMessage } from "@/actions/user/userMessages.actions";

interface User {
    id: number;
    userName: string;
    email: string;
    avatar?: {
        photoSrc: string;
    };
}

interface MessageComposeProps {
    searchResults: User[];
    userLoggedIn: any;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function MessageCompose({
    searchResults,
    userLoggedIn,
    searchQuery,
    setSearchQuery,
}: MessageComposeProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [messageText, setMessageText] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setSearchQuery(value);
            const params = new URLSearchParams(searchParams);

            if (value) {
                params.set("search", value);
            } else {
                params.delete("search");
            }

            router.push(`/messages?${params.toString()}`);
        },
        [searchParams, router, setSearchQuery],
    );

    const handleSendMessage = async () => {
        if (!selectedUser || !messageText.trim() || isLoading) return;

        try {
            setIsLoading(true);
            await sendMessage(selectedUser.id, messageText, Number(userLoggedIn.id));

            setMessageText("");
            setSelectedUser(null);

            const params = new URLSearchParams(searchParams);
            params.set("section", "sent");
            params.set("page", "1");
            router.push(`/messages?${params.toString()}`);
        } catch (error) {
            console.error("Failed to send message:", error);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">New Message</Typography>
            <TextField
                label="To"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                fullWidth
                slotProps={{
                    input: {
                        startAdornment: selectedUser && (
                            <InputAdornment position="start">
                                <Chip
                                    label={selectedUser.userName}
                                    onDelete={() => {
                                        setSelectedUser(null);
                                        setSearchQuery("");

                                        const params = new URLSearchParams(searchParams);
                                        params.delete("search");
                                        router.push(`/messages?${params.toString()}`);
                                    }}
                                    size="small"
                                />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            {searchQuery && !selectedUser && searchResults.length > 0 && (
                <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                    <List>
                        {searchResults.map((user) => (
                            <ListItemButton
                                key={user.id}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setSearchQuery("");
                                }}
                            >
                                <ListItemText primary={user.userName} secondary={user.email} />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}
            <TextEditor onChange={(content: any) => setMessageText(content)} value={messageText} type="message" />
            <Button
                onClick={handleSendMessage}
                sx={{
                    textTransform: "capitalize",
                    fontSize: 18,
                    fontWeight: 500,
                }}
                disabled={!selectedUser || !messageText.trim() || isLoading}
            >
                {isLoading ? "Sending..." : "Send Message"}
            </Button>
        </Box>
    );
}
