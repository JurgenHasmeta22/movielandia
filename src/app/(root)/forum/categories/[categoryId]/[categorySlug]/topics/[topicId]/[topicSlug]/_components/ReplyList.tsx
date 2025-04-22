"use client";

import { Box, Typography, Button, CircularProgress, Collapse } from "@mui/material";
import { useState, useEffect, useTransition } from "react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import ReplyItem from "./ReplyItem";
import { getRepliesByPostId } from "@/actions/forum/forumReply.actions";
import { useQueryState } from "nuqs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CommentIcon from "@mui/icons-material/Comment";

interface ReplyListProps {
    postId: number;
    userLoggedIn: any;
    topicLocked: boolean;
    onReplyToReply: (reply: any) => void;
}

export default function ReplyList({ postId, userLoggedIn, topicLocked, onReplyToReply }: ReplyListProps) {
    const [expanded, setExpanded] = useState(false);
    const [replies, setReplies] = useState<{ items: any[]; total: number }>({ items: [], total: 0 });
    const [isLoading, startTransition] = useTransition();

    const [replyPage, setReplyPage] = useQueryState(`replyPage_${postId}`, {
        defaultValue: "1",
        parse: (value) => value || "1",
        shallow: false,
        history: "push",
    });

    const currentPage = parseInt(replyPage);
    const limit = 5;

    useEffect(() => {
        startTransition(async () => {
            const repliesData = await getRepliesByPostId(postId, 1, 1);
            setReplies((prev) => ({ ...prev, total: repliesData.total }));
        });
    }, [postId]);

    useEffect(() => {
        if (expanded) {
            startTransition(async () => {
                const repliesData = await getRepliesByPostId(postId, currentPage, limit);
                setReplies(repliesData);
            });
        }
    }, [expanded, postId, currentPage]);

    // Auto-expand when replying to a post and refetch when replies are modified
    useEffect(() => {
        const handleReplyCreated = () => {
            // Always refetch the total count
            startTransition(async () => {
                const countData = await getRepliesByPostId(postId, 1, 1);
                setReplies((prev) => ({ ...prev, total: countData.total }));
            });

            if (!expanded) {
                setExpanded(true);
            } else {
                // Refetch replies if already expanded
                startTransition(async () => {
                    const repliesData = await getRepliesByPostId(postId, currentPage, limit);
                    setReplies(repliesData);
                });
            }
        };

        const handleReplyModified = () => {
            // Always refetch the total count
            startTransition(async () => {
                const countData = await getRepliesByPostId(postId, 1, 1);
                setReplies((prev) => ({ ...prev, total: countData.total }));
            });

            if (expanded) {
                // Refetch replies when a reply is modified (edited or deleted)
                startTransition(async () => {
                    const repliesData = await getRepliesByPostId(postId, currentPage, limit);
                    setReplies(repliesData);
                });
            }
        };

        document.addEventListener("forum-reply-created", handleReplyCreated);
        document.addEventListener("forum-reply-modified", handleReplyModified);
        document.addEventListener("forum-reply-deleted", handleReplyModified);

        return () => {
            document.removeEventListener("forum-reply-created", handleReplyCreated);
            document.removeEventListener("forum-reply-modified", handleReplyModified);
            document.removeEventListener("forum-reply-deleted", handleReplyModified);
        };
    }, [expanded, postId, currentPage, limit]);

    const handlePageChange = (page: number) => {
        setReplyPage(page.toString());
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);

        if (!expanded && replies.items.length === 0) {
            startTransition(async () => {
                const repliesData = await getRepliesByPostId(postId, currentPage, limit);
                setReplies(repliesData);
            });
        }
    };

    const pageCount = Math.ceil(replies.total / limit);

    return (
        <Box sx={{ mt: 2 }}>
            <Button
                variant="text"
                onClick={toggleExpanded}
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                endIcon={<CommentIcon />}
                sx={{ mb: 1 }}
            >
                {expanded ? "Hide Replies" : `Show Replies (${replies.total || "0"})`}
            </Button>

            <Collapse in={expanded}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                        <CircularProgress size={30} />
                    </Box>
                ) : replies.items.length > 0 ? (
                    <Box>
                        {replies.items.map((reply, index) => (
                            <ReplyItem
                                key={reply.id}
                                reply={reply}
                                userLoggedIn={userLoggedIn}
                                topicLocked={topicLocked}
                                onReplyToReply={onReplyToReply}
                                postId={postId}
                                index={index}
                                currentPage={currentPage}
                            />
                        ))}

                        {pageCount > 1 && (
                            <Box sx={{ mt: 2, mb: 1 }}>
                                <PaginationControl
                                    currentPage={currentPage}
                                    pageCount={pageCount}
                                    urlParamName={`replyPage_${postId}`}
                                    customUrlHandler={true}
                                    onPageChange={handlePageChange}
                                />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                        No replies yet.
                    </Typography>
                )}
            </Collapse>
        </Box>
    );
}
