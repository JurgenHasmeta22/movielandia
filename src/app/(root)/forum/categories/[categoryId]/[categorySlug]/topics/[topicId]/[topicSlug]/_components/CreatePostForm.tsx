"use client";

import { Box, Button, Paper, Typography, Chip } from "@mui/material";
import { useState, useRef, useTransition, useEffect } from "react";
import { createPost } from "@/actions/forum/forumPost.actions";
import { toast } from "react-toastify";
import TextEditor from "@/components/root/textEditor/TextEditor";
import ReplyIcon from "@mui/icons-material/Reply";
import CancelIcon from "@mui/icons-material/Cancel";
import RichTextDisplay from "@/components/root/richTextDisplay/RichTextDisplay";

interface CreatePostFormProps {
    topicId: number;
    userId: number;
}

export default function CreatePostForm({ topicId, userId }: CreatePostFormProps) {
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isReplyMode, setIsReplyMode] = useState(false);

    const [originalPost, setOriginalPost] = useState<{
        id: number;
        userName: string;
        postDate: string;
        content: string;
    } | null>(null);

    const editorRef = useRef(null);

    useEffect(() => {
        const handleReplyEvent = (event: CustomEvent) => {
            const { originalPost } = event.detail;

            setOriginalPost(originalPost);
            setIsReplyMode(true);
            setContent("");

            if (editorRef.current) {
                // @ts-ignore - ReactQuill editor has focus method
                const editor = editorRef.current.getEditor();

                if (editor) {
                    setTimeout(() => {
                        editor.focus();
                    }, 100);
                }
            }
        };

        document.addEventListener("forum-reply", handleReplyEvent as EventListener);

        return () => {
            document.removeEventListener("forum-reply", handleReplyEvent as EventListener);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Please enter some content for your post.");
            return;
        }

        startTransition(async () => {
            try {
                let finalContent = content;

                if (isReplyMode && originalPost) {
                    const quotedContent = `<blockquote class="forum-quote">
                        <p><strong>${originalPost.userName} wrote on ${originalPost.postDate}:</strong></p>
                        ${originalPost.content}
                        </blockquote>
                    `;
                    
                    finalContent = `${quotedContent}\n${content}`;
                }

                await createPost(finalContent, topicId, userId);
                toast.success("Your post has been created successfully!");

                setContent("");
                setIsReplyMode(false);
                setOriginalPost(null);
            } catch (error) {
                toast.error("Failed to create your post. Please try again.");
                console.error("Error creating post:", error);
            }
        });
    };

    const handleCancelReply = () => {
        setIsReplyMode(false);
        setOriginalPost(null);
        setContent("");
    };

    return (
        <Box component="form" onSubmit={handleSubmit} id="post-form">
            {isReplyMode && originalPost && (
                <Box sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                            backgroundColor: (theme) => theme.vars.palette.background.paper,
                            borderRadius: 1,
                            p: 1.5,
                            border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ReplyIcon
                                sx={{
                                    color: (theme) => theme.vars.palette.primary.main,
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                    color: (theme) => theme.vars.palette.text.primary,
                                }}
                            >
                                Replying to post #{originalPost.id}
                            </Typography>
                            <Chip
                                label="Reply Mode"
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: (theme) => theme.vars.palette.primary.main,
                                    color: (theme) => theme.vars.palette.primary.main,
                                    height: 20,
                                    fontSize: "0.7rem",
                                }}
                            />
                        </Box>
                        <Button
                            size="small"
                            variant="text"
                            sx={{
                                color: (theme) => theme.vars.palette.error.main,
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                            }}
                            startIcon={<CancelIcon fontSize="small" />}
                            onClick={handleCancelReply}
                        >
                            Cancel Reply
                        </Button>
                    </Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 1,
                            position: "relative",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                fontWeight: 500,
                            }}
                        >
                            {originalPost.userName} wrote on {originalPost.postDate}:
                        </Typography>
                        <Box
                            sx={{
                                opacity: 0.9,
                                mt: 2,
                            }}
                        >
                            <RichTextDisplay content={originalPost.content} type="post" />
                        </Box>
                    </Paper>
                </Box>
            )}
            <Paper
                elevation={0}
                sx={{
                    p: 0,
                    mb: 2,
                    borderRadius: 1,
                }}
            >
                <Box>
                    <TextEditor
                        value={content}
                        onChange={setContent}
                        ref={editorRef}
                        isDisabled={isPending}
                        type="post"
                    />
                </Box>
            </Paper>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isPending || !content.trim()}
                    startIcon={isReplyMode ? <ReplyIcon /> : undefined}
                    sx={{
                        borderRadius: 1,
                        textTransform: "none",
                        fontWeight: 500,
                        backgroundColor: (theme) => theme.vars.palette.primary.main,
                    }}
                >
                    {isPending ? "Creating..." : isReplyMode ? "Submit Reply" : "Create Post"}
                </Button>
            </Box>
        </Box>
    );
}
