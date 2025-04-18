"use client";

import { useState, useRef, useTransition } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box,
    Typography,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { updateReply } from "@/actions/forum/forumReply.actions";
import { showToast } from "@/utils/helpers/toast";

interface EditReplyModalProps {
    open: boolean;
    onClose: () => void;
    reply: {
        id: number;
        content: string;
    };
    userId: number;
    onSuccess?: () => void;
}

export default function EditReplyModal({ open, onClose, reply, userId, onSuccess }: EditReplyModalProps) {
    const [content, setContent] = useState(reply.content);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const editorRef = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content || content === "<p><br></p>") {
            setError("Please enter some content for your reply.");
            return;
        }

        setError(null);

        startTransition(async () => {
            try {
                await updateReply(reply.id, content, userId);
                showToast("success", "Reply updated successfully!");
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred while updating your reply.");
                showToast("error", "Failed to update reply.");
            }
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    bgcolor: "#1e2330",
                    boxShadow: 3,
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    bgcolor: "#2c3347",
                    color: "#fff",
                    py: 2,
                    px: 3,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6">Edit Reply</Typography>
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <TextEditor
                            value={content}
                            onChange={setContent}
                            ref={editorRef}
                            isDisabled={isPending}
                            type="reply"
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                <Button onClick={onClose} variant="outlined" disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isPending || !content.trim()}
                >
                    {isPending ? "Updating..." : "Update Reply"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
