"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import { useState, useRef, useTransition } from "react";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { createReply } from "@/actions/forum/forumReply.actions";
import { showToast } from "@/utils/helpers/toast";
import ReplyIcon from "@mui/icons-material/Reply";
import CancelIcon from "@mui/icons-material/Cancel";
import { useModal } from "@/providers/ModalProvider";
import * as CONSTANTS from "@/constants/Constants";
import { WarningOutlined, CheckOutlined } from "@mui/icons-material";

interface ReplyFormProps {
    postId: number;
    userId: number;
    replyingTo: {
        id: number;
        userName: string;
        content: string;
        type: "post" | "reply";
    } | null;
    onCancelReply: () => void;
}

export default function ReplyForm({ postId, userId, replyingTo, onCancelReply }: ReplyFormProps) {
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();
    const editorRef = useRef(null);
    const { openModal } = useModal();

    const handleSubmit = () => {
        if (!content.trim()) {
            showToast("error", "Please enter some content for your reply.");
            return;
        }

        startTransition(async () => {
            try {
                await createReply(content, postId, userId);
                showToast("success", "Your reply has been created successfully!");
                
                document.dispatchEvent(new CustomEvent("forum-reply-created", { detail: { postId } }));
                setContent("");
                onCancelReply();
            } catch (error) {
                showToast("error", error instanceof Error ? error.message : "Failed to create your reply.");
            }
        });
    };

    return (
        <Box sx={{ mt: 2, ml: replyingTo?.type === "reply" ? 4 : 0 }}>
            {replyingTo && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        backgroundColor: (theme) => theme.vars.palette.action.hover,
                        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                    }}
                >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Replying to {replyingTo.userName}:
                    </Typography>
                    <Box
                        sx={{
                            maxHeight: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            position: "relative",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "20px",
                                background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))",
                            },
                        }}
                        dangerouslySetInnerHTML={{ __html: replyingTo.content }}
                    />
                </Paper>
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                    size="medium"
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                        if (content.trim()) {
                            openModal({
                                title: "Cancel Reply",
                                subTitle: "Are you sure you want to cancel this reply? Your changes will be lost.",
                                actions: [
                                    {
                                        label: CONSTANTS.MODAL__DELETE__NO,
                                        onClick: () => {},
                                        color: "secondary",
                                        variant: "contained",
                                        sx: {
                                            bgcolor: "#ff5252",
                                        },
                                        icon: <WarningOutlined />,
                                    },
                                    {
                                        label: CONSTANTS.MODAL__DELETE__YES,
                                        onClick: onCancelReply,
                                        type: "submit",
                                        color: "secondary",
                                        variant: "contained",
                                        sx: {
                                            bgcolor: "#30969f",
                                        },
                                        icon: <CheckOutlined />,
                                    },
                                ],
                            });
                        } else {
                            onCancelReply();
                        }
                    }}
                    disabled={isPending}
                    startIcon={<CancelIcon />}
                >
                    Cancel
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isPending || !content.trim()}
                    startIcon={<ReplyIcon />}
                >
                    {isPending ? "Submitting..." : "Submit Reply"}
                </Button>
            </Box>
        </Box>
    );
}
