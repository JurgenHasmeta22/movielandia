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
import { updatePost } from "@/actions/forum/forumPost.actions";
import { showToast } from "@/utils/helpers/toast";

interface EditPostModalProps {
    open: boolean;
    post: {
        id: number;
        content: string;
    };
    userId: number;
    onClose: () => void;
}

export default function EditPostModal({ open, onClose, post, userId }: EditPostModalProps) {
    const [content, setContent] = useState(post.content);
    const [error, setError] = useState<string | null>(null);

    const [isPending, startTransition] = useTransition();
    const editorRef = useRef(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content || content === "<p><br></p>") {
            setError("Please enter some content for your post.");
            return;
        }

        setError(null);

        startTransition(async () => {
            try {
                await updatePost(post.id, content, Number(userId));
                showToast("success", "Post updated successfully!");
                onClose();
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred while updating your post.");
                showToast("error", "Failed to update post.");
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
                <Typography variant="h6" component="div" fontWeight={500} fontSize="1.1rem">
                    Edit Post
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    disabled={isPending}
                    sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                            color: "#fff",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: "#1e2330", color: "white", p: 3, pt: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <TextEditor
                            value={content}
                            onChange={setContent}
                            ref={editorRef}
                            isDisabled={isPending}
                            type="post"
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)", bgcolor: "#2c3347" }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    size="medium"
                    color="primary"
                    disabled={isPending}
                    sx={{
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        color: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                            color: "#fff",
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="medium"
                    color="primary"
                    disabled={isPending || !content.trim()}
                    sx={{
                        bgcolor: "#30969f",
                        "&:hover": {
                            bgcolor: "#30969fcc",
                        },
                    }}
                >
                    {isPending ? "Updating..." : "Update Post"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
