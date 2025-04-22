"use client";

// #region "Imports"
import { Box, Typography, Button, Collapse } from "@mui/material";
import React, { useState, useEffect } from "react";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import ReplyItem from "./ReplyItem";
import ReplyForm from "./ReplyForm";
import { useRouter, useSearchParams } from "next/navigation";
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
    replies: {
        items: any[];
        total: number;
    };
    currentPage: number;
    limit: number;
}
// #endregion

export default function ReplyList({
    postId,
    userLoggedIn,
    topicLocked,
    onReplyToReply,
    replyingTo,
    onCancelReply,
    replies,
    currentPage,
    limit,
}: ReplyListProps) {
    // #region "State and Hooks"
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageCount = Math.ceil(replies.total / limit);
    // #endregion

    // #region "Event Handlers"
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set(`replyPage_${postId}`, page.toString());
        router.push(`?${params.toString()}`);
    };

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };
    // #endregion

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
                {replies.items.length > 0 ? (
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
                                {replyingTo &&
                                    replyingTo.type === "reply" &&
                                    replyingTo.id === reply.id &&
                                    userLoggedIn &&
                                    onCancelReply && (
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
