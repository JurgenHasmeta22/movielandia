"use client";

import { useState, useCallback, useEffect } from "react";
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
    initialSelectedUser?: User | null;
}

export default function MessageCompose({ searchResults, userLoggedIn, initialSelectedUser }: MessageComposeProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSearchQuery = searchParams.get("search") || "";
    const selectedUserId = searchParams.get("selectedUser");

    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        if (initialSelectedUser) {
            setSelectedUser(initialSelectedUser);
        } else if (selectedUserId) {
            const user = searchResults.find((user) => user.id === Number(selectedUserId));
            if (user) {
                setSelectedUser(user);
            }
        } else {
            setSelectedUser(null);
        }
    }, [selectedUserId, searchResults, initialSelectedUser]);

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            const params = new URLSearchParams(searchParams);

            if (value) {
                params.set("search", value);
                params.delete("selectedUser");
            } else {
                params.delete("search");
            }

            router.push(`/messages?${params.toString()}`, { scroll: false });
        },
        [searchParams, router],
    );

    const handleSelectUser = (user: User) => {
        const params = new URLSearchParams(searchParams);
        params.delete("search");
        params.set("selectedUser", user.id.toString());
        router.push(`/messages?${params.toString()}`, { scroll: false });
    };

    const handleClearSelection = useCallback(() => {
        const params = new URLSearchParams(searchParams);
        params.delete("search");
        params.delete("selectedUser");
        router.push(`/messages?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

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

    const renderTextField = () => {
        if (selectedUser) {
            return (
                <TextField
                    label="To"
                    value=""
                    disabled
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Chip
                                    label={selectedUser.userName}
                                    onDelete={handleClearSelection}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
            );
        }

        return (
            <TextField
                label="To"
                value={currentSearchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                fullWidth
            />
        );
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">New Message</Typography>
            {renderTextField()}
            {!selectedUser && currentSearchQuery && searchResults.length > 0 && (
                <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                    <List>
                        {searchResults.map((user) => (
                            <ListItemButton key={user.id} onClick={() => handleSelectUser(user)}>
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
