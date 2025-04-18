"use client";

import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import { createPost } from "@/actions/forum/forumPost.actions";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface CreatePostFormProps {
    topicId: number;
    userId: number;
}

export default function CreatePostForm({ topicId, userId }: CreatePostFormProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write your reply here..."
                    modules={{
                        toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link", "image"],
                            ["clean"],
                        ],
                    }}
                    style={{ minHeight: "200px", marginBottom: "50px" }}
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
