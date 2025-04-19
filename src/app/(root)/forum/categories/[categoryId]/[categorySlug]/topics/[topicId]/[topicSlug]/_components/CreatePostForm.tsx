"use client";

import { Box, Button, Paper } from "@mui/material";
import { useState, useRef, useTransition } from "react";
import { createPost } from "@/actions/forum/forumPost.actions";
import { toast } from "react-toastify";
import TextEditor from "@/components/root/textEditor/TextEditor";

interface CreatePostFormProps {
    topicId: number;
    userId: number;
}

export default function CreatePostForm({ topicId, userId }: CreatePostFormProps) {
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const editorRef = useRef(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Please enter some content for your post.");
            return;
        }

        startTransition(async () => {
            try {
                await createPost(content, topicId, userId);
                toast.success("Your post has been created successfully!");
                setContent("");
            } catch (error) {
                toast.error("Failed to create your post. Please try again.");
                console.error("Error creating post:", error);
            }
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} id="post-form">
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
                <TextEditor value={content} onChange={setContent} ref={editorRef} isDisabled={isPending} type="post" />
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    size="large"
                    type="submit"
                    variant="outlined"
                    color="primary"
                    disabled={isPending || !content.trim()}
                >
                    {isPending ? "Creating..." : "Create Post"}
                </Button>
            </Box>
        </Box>
    );
}
