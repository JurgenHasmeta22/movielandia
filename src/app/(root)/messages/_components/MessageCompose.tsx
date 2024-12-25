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
    CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { sendMessage } from "@/actions/user/userMessages.actions";
import { showToast } from "@/utils/helpers/toast";

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
    editMessage?: (messageId: number, text: string) => Promise<void>;
    initialMessageToEdit?: any | null;
    onCancelEdit?: () => void;
}

export default function MessageCompose({
    searchResults,
    userLoggedIn,
    initialSelectedUser,
    editMessage,
    initialMessageToEdit,
    onCancelEdit,
}: MessageComposeProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSearchQuery = searchParams.get("search") || "";
    const selectedUserId = searchParams.get("selectedUser");

    const [messageText, setMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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

    useEffect(() => {
        if (initialMessageToEdit) {
            setMessageText(initialMessageToEdit.text);
            setIsEditing(true);
            setSelectedUser(initialMessageToEdit.receiver);
        } else {
            setMessageText("");
            setIsEditing(false);
        }
    }, [initialMessageToEdit]);

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
        if ((!selectedUser && !isEditing) || !messageText.trim() || isLoading) return;

        try {
            setIsLoading(true);
            if (isEditing && initialMessageToEdit && editMessage) {
                await editMessage(initialMessageToEdit.id, messageText);
                showToast("success", "Message edited successfully!");
                onCancelEdit?.();
            } else if (selectedUser) {
                await sendMessage(selectedUser.id, messageText, Number(userLoggedIn.id));
                showToast("success", "Message sent successfully!");
            }
            setMessageText("");
            setSelectedUser(null);

            const params = new URLSearchParams(searchParams);
            params.set("section", "sent");
            router.push(`/messages?${params.toString()}`);
        } catch (error) {
            console.error("Failed to send/edit message:", error);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setMessageText("");
        setIsEditing(false);
        setSelectedUser(null);
        onCancelEdit?.();
        const params = new URLSearchParams(searchParams);
        params.delete("editMessageId");
        router.push(`/messages?${params.toString()}`, { scroll: false });
    };

    const renderTextField = () => {
        if (selectedUser) {
            return (
                <TextField
                    label="To"
                    value=""
                    disabled
                    fullWidth
                    slotProps={{
                        input: {
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
                        },
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
            <Typography variant="h6">{isEditing ? "Edit Message" : "New Message"}</Typography>
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
            <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                    onClick={handleSendMessage}
                    sx={{
                        textTransform: "capitalize",
                        fontSize: 18,
                        fontWeight: 500,
                    }}
                    disabled={(!selectedUser && !isEditing) || !messageText.trim() || isLoading}
                >
                    {isLoading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : isEditing ? "Save" : "Send Message"}
                </Button>
                {isEditing && (
                    <Button
                        onClick={handleCancelEdit}
                        sx={{
                            textTransform: "capitalize",
                            fontSize: 18,
                            fontWeight: 500,
                        }}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
}
