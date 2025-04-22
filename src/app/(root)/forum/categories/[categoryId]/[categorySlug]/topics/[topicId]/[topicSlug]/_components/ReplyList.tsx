"use client";

// #region "Imports"
import { Box, Typography, Button, CircularProgress, Collapse } from "@mui/material";
import React, { useState, useEffect, useTransition } from "react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import ReplyItem from "./ReplyItem";
import ReplyForm from "./ReplyForm";
import { getRepliesByPostId } from "@/actions/forum/forumReply.actions";
import { useQueryState } from "nuqs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CommentIcon from "@mui/icons-material/Comment";
// #endregion

// #region "Interfaces"
interface ReplyListProps {
    postId: number;
    userLoggedIn: any;
    topicLocked: boolean;
    onReplyToReply: (reply: any) => void;
    replyingTo?: {
        id: number;
        userName: string;
        content: string;
        type: "post" | "reply";
    } | null;
    onCancelReply?: () => void;
}
// #endregion

export default function ReplyList({ postId, userLoggedIn, topicLocked, onReplyToReply, replyingTo, onCancelReply }: ReplyListProps) {
    // #region "State and Hooks"
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
    const limit = 5; // Smaller limit for replies
    // #endregion

    // #region "Effects"
    // Initial load of reply count
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

    // Auto-expand when replying to a reply
    useEffect(() => {
        if (replyingTo && replyingTo.type === "reply" && !expanded) {
            setExpanded(true);
        }
    }, [replyingTo, expanded]);

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

        const handleReplyVoted = () => {
            if (expanded) {
                // Refetch replies when a reply is voted on
                startTransition(async () => {
                    const repliesData = await getRepliesByPostId(postId, currentPage, limit);
                    setReplies(repliesData);
                });
            }
        };

        document.addEventListener("forum-reply-created", handleReplyCreated);
        document.addEventListener("forum-reply-modified", handleReplyModified);
        document.addEventListener("forum-reply-deleted", handleReplyModified);
        document.addEventListener("forum-reply-voted", handleReplyVoted);

        return () => {
            document.removeEventListener("forum-reply-created", handleReplyCreated);
            document.removeEventListener("forum-reply-modified", handleReplyModified);
            document.removeEventListener("forum-reply-deleted", handleReplyModified);
            document.removeEventListener("forum-reply-voted", handleReplyVoted);
        };
    }, [expanded, postId, currentPage, limit]);
    // #endregion

    // #region "Event Handlers"
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
    // #endregion

    const pageCount = Math.ceil(replies.total / limit);

    // #region "Render"
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
                            <React.Fragment key={reply.id}>
                                <ReplyItem
                                    reply={reply}
                                    userLoggedIn={userLoggedIn}
                                    topicLocked={topicLocked}
                                    onReplyToReply={onReplyToReply}
                                    postId={postId}
                                    index={index}
                                    currentPage={currentPage}
                                />
                                {replyingTo && replyingTo.type === "reply" && replyingTo.id === reply.id && userLoggedIn && onCancelReply && (
                                    <ReplyForm
                                        postId={postId}
                                        userId={Number(userLoggedIn.id)}
                                        replyingTo={replyingTo}
                                        onCancelReply={onCancelReply}
                                    />
                                )}
                            </React.Fragment>
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
    // #endregion
}
