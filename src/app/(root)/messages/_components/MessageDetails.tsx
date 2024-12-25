"use client";

import { Paper, Box, Typography, IconButton, Divider, CircularProgress, Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Message } from "./MessagesPageContent";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IMessageDetails {
    selectedMessage: Message;
    setSelectedMessage: any;
}

export function MessageDetails({ selectedMessage, setSelectedMessage }: IMessageDetails) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleBack = () => {
        setSelectedMessage(null);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ width: 300, ml: 2, p: 2, display: { xs: "none", md: "block" } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Message Details</Typography>
                <IconButton size="small" onClick={handleBack}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">From: {selectedMessage.sender.userName}</Typography>
                <Typography variant="subtitle2">To: {selectedMessage.receiver.userName}</Typography>
                <div
                    style={{ marginTop: "16px", wordWrap: "break-word", overflowWrap: "break-word" }}
                    dangerouslySetInnerHTML={{ __html: selectedMessage.text }}
                />
                {selectedMessage.editedAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        Edited {formatDistanceToNow(new Date(selectedMessage.editedAt), { addSuffix: true })}
                    </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                    {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                </Typography>
                <Button onClick={handleBack} sx={{ mt: 2 }}>
                    Back to Messages
                </Button>
            </Box>
        </Paper>
    );
}
