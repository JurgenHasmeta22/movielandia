"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
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
import { editMessage, sendMessage } from "@/actions/user/userMessages.actions";
import { showToast } from "@/utils/helpers/toast";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    initialMessageToEdit?: any | null;
}

export default function MessageCompose({
    searchResults,
    userLoggedIn,
    initialSelectedUser,
    initialMessageToEdit,
}: MessageComposeProps) {
    const theme = useTheme();
    const router = useRouter();

    const searchParams = useSearchParams();
    const currentSearchQuery = searchParams.get("search") || "";
    const selectedUserId = searchParams.get("selectedUser");

    const [messageText, setMessageText] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [initialText, setInitialText] = useState("");
    const [isPending, startTransition] = useTransition();

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
            setInitialText(initialMessageToEdit.text);
        } else {
            setMessageText("");
            setIsEditing(false);
            setInitialText("");
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
        [searchParams],
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
    }, [searchParams]);

    const handleSendMessage = async () => {
        if ((!selectedUser && !isEditing) || !messageText.trim() || isPending) return;

        startTransition(async () => {
            try {
                if (isEditing && initialMessageToEdit) {
                    await editMessage(initialMessageToEdit.id, messageText);
                    showToast("success", "Message edited successfully!");
                } else if (selectedUser) {
                    await sendMessage(selectedUser.id, messageText, Number(userLoggedIn.id));
                    showToast("success", "Message sent successfully!");
                }

                const params = new URLSearchParams(searchParams);
                params.set("section", "sent");
                params.delete("editMessageId");
                params.delete("selectedUser");
                router.push(`/messages?${params.toString()}`);
            } catch (error) {
                console.error("Failed to send/edit message:", error);
                router.refresh();
            }
        });
    };

    const handleCancelEdit = () => {
        setMessageText(initialText);
    };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{isEditing ? "Edit Message" : "New Message"}</Typography>
                <Button onClick={handleGoBack} startIcon={<ArrowBackIcon />} sx={{ textTransform: 'capitalize' }}>
                    Back
                </Button>
            </Box>
            {selectedUser ? (
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
            ) : (
                <TextField
                    label="To"
                    value={currentSearchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search users..."
                    fullWidth
                />
            )}
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
            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    onClick={handleSendMessage}
                    sx={{
                        textTransform: "capitalize",
                        fontSize: 18,
                        fontWeight: 500,
                        bgcolor: theme.palette.success.main,
                        color: theme.palette.success.contrastText,
                        "&:disabled": {
                            bgcolor: theme.palette.grey[400],
                            color: theme.palette.grey[100],
                        },
                        padding: "5px 15px",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                            bgcolor: theme.palette.success.dark,
                        },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    disabled={
                        (!selectedUser && !isEditing) ||
                        !messageText.trim() ||
                        isPending ||
                        (isEditing && messageText === initialText)
                    }
                    startIcon={!isPending ? <SaveIcon /> : null}
                >
                    {isPending ? <CircularProgress size={24} sx={{ mr: 1 }} /> : isEditing ? "Save" : "Send Message"}
                </Button>
                {isEditing && (
                    <Button
                        onClick={handleCancelEdit}
                        sx={{
                            textTransform: "capitalize",
                            fontSize: 18,
                            fontWeight: 500,
                            color: theme.palette.error.contrastText,
                            bgcolor: theme.palette.error.main,
                            "&:disabled": {
                                bgcolor: theme.palette.grey[100],
                                color: theme.palette.grey[500],
                            },
                            padding: "5px 15px",
                            transition: "background-color 0.3s ease",
                            "&:hover": {
                                bgcolor: theme.palette.error.dark,
                            },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        startIcon={!isPending ? <CancelIcon /> : null}
                        disabled={isPending || (isEditing && messageText === initialText)}
                    >
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
}
