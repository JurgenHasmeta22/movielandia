"use client";

import { Box, Button, Paper } from "@mui/material";
import { useState, useRef } from "react";
import { createPost } from "@/actions/forum/forumPost.actions";
import { toast } from "react-toastify";
import TextEditor from "@/components/root/textEditor/TextEditor";

interface CreatePostFormProps {
    topicId: number;
    userId: number;
}

export default function CreatePostForm({ topicId, userId }: CreatePostFormProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editorRef = useRef(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Please enter some content for your post.");
            return;
        }

        setIsSubmitting(true);

        try {
            await createPost(content, topicId, userId);
            toast.success("Your reply has been posted successfully!");
            setContent("");
        } catch (error) {
            toast.error("Failed to post your reply. Please try again.");
            console.error("Error creating post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} id="reply-form">
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.vars.palette.secondary.light,
                    border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
                }}
            >
                <TextEditor
                    value={content}
                    onChange={setContent}
                    ref={editorRef}
                    isDisabled={isSubmitting}
                    type="reply"
                />
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !content.trim()}>
                    {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
            </Box>
        </Box>
    );
}
