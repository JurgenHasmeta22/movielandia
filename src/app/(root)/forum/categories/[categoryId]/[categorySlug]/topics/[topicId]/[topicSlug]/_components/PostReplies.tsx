import { getRepliesByPostId } from "@/actions/forum/forumReply.actions";
import ReplyList from "./ReplyList";

interface PostRepliesProps {
    postId: number;
    userLoggedIn: any;
    topicLocked: boolean;
    replyingTo?: {
        id: number;
        userName: string;
        content: string;
        type: "post" | "reply";
    } | null;
    replyPage?: number;
    onReplyToReply: (reply: any) => void;
    onCancelReply?: () => void;
}

export default async function PostReplies({
    postId,
    userLoggedIn,
    topicLocked,
    onReplyToReply,
    replyingTo,
    onCancelReply,
    replyPage = 1,
}: PostRepliesProps) {
    const limit = 5;
    const replies = await getRepliesByPostId(postId, replyPage, limit);

    return (
        <ReplyList
            postId={postId}
            userLoggedIn={userLoggedIn}
            topicLocked={topicLocked}
            onReplyToReply={onReplyToReply}
            replyingTo={replyingTo}
            onCancelReply={onCancelReply}
            replies={replies}
            currentPage={replyPage}
            limit={limit}
        />
    );
}
