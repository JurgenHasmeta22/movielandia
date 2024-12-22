"use client";

import { Paper, Box, Typography, IconButton, Divider } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { Message } from "./MessagesPageContent";
import CloseIcon from "@mui/icons-material/Close";

interface IMessageDetails {
    selectedMessage: Message;
    setSelectedMessage: any;
}

export function MessageDetails({ selectedMessage, setSelectedMessage }: IMessageDetails) {
    return (
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
                <Typography variant="body1" sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: selectedMessage.text }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                    {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                </Typography>
            </Box>
        </Paper>
    );
}
