"use client"

import { Box, Paper, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { Message } from "./MessagesPageContent";

interface MessagesListProps {
    messages: {
        items: Message[];
        total: number;
    };
    currentSection: "inbox" | "sent";
    currentPage: number;
    isLoading: boolean;
    onMessageSelect: (message: Message) => void;
    onMessageDelete: (messageId: number) => void;
}

export default function MessagesList({
    messages,
    currentSection,
    currentPage,
    isLoading,
    onMessageSelect,
    onMessageDelete,
}: MessagesListProps) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {currentSection === "inbox" ? "Inbox" : "Sent Messages"}
            </Typography>
            {messages.items.length > 0 ? (
                <>
                    {messages.items.map((message) => (
                        <Paper
                            key={message.id}
                            sx={{
                                p: 2,
                                mb: 2,
                                cursor: "pointer",
                                opacity: isLoading ? 0.7 : 1,
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                            onClick={() => onMessageSelect(message)}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    {currentSection === "inbox" ? message.sender.userName : message.receiver.userName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDistanceToNow(new Date(message.createdAt), {
                                        addSuffix: true,
                                    })}
                                </Typography>
                            </Box>
                            <Typography variant="body2" noWrap dangerouslySetInnerHTML={{ __html: message.text }} />
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMessageDelete(message.id);
                                }}
                                disabled={isLoading}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Paper>
                    ))}
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <PaginationControl
                            pageCount={Math.ceil(messages.total / 10)}
                            currentPage={currentPage}
                            urlParamName="page"
                        />
                    </Box>
                </>
            ) : (
                <Typography color="text.secondary">No messages to display</Typography>
            )}
        </Box>
    );
}
