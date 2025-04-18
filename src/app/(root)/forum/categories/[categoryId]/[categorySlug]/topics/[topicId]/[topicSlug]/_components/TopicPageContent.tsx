"use client";

import { Box, Container, Typography, Breadcrumbs, Link as MuiLink, Chip, Avatar, Paper } from "@mui/material";
import { useQueryState } from "nuqs";
import Link from "next/link";
import { ForumCategory, ForumTopic, ForumTag } from "@prisma/client";
import PostList from "./PostList";
import CreatePostForm from "./CreatePostForm";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PushPinIcon from "@mui/icons-material/PushPin";
import LockIcon from "@mui/icons-material/Lock";
import { formatDistanceToNow, format } from "date-fns";
import TagDisplay from "@/app/(root)/forum/_components/TagDisplay";
import TextEditor from "@/components/root/textEditor/TextEditor";
import { useRef } from "react";

interface ITopicPageContentProps {
    topic: ForumTopic & {
        user: {
            id: number;
            userName: string;
            avatar?: { photoSrc: string } | null;
        };
        tags: ForumTag[];
    };
    category: ForumCategory;
    searchParams?: {
        page?: string;
    };
    session: any;
    posts: {
        items: any[];
        total: number;
    };
    currentPage: number;
}

export default function TopicPageContent({ topic, category, session, posts, currentPage }: ITopicPageContentProps) {
    const [_page, setPage] = useQueryState("page");
    const limit = 10;
    const editorRef = useRef(null);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value === 1 ? null : value.toString());
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4, mt: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
                    Forum
                </MuiLink>
                <MuiLink
                    component={Link}
                    href={`/forum/categories/${category.id}/${category.slug}`}
                    underline="hover"
                    color="inherit"
                >
                    {category.name}
                </MuiLink>
                <Typography color="text.primary">{topic.title}</Typography>
            </Breadcrumbs>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.vars.palette.secondary.light,
                    border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    {topic.isPinned && <PushPinIcon fontSize="small" color="primary" />}
                    {topic.isLocked && <LockIcon fontSize="small" color="error" />}
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        {topic.title}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                    <Avatar
                        src={topic.user.avatar?.photoSrc || ""}
                        alt={topic.user.userName}
                        sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        Started by{" "}
                        <Link
                            href={`/users/${topic.user.id}/${topic.user.userName}`}
                            style={{ textDecoration: "none" }}
                        >
                            {topic.user.userName}
                        </Link>{" "}
                        {format(new Date(topic.createdAt), "PPP")}
                    </Typography>
                    {topic.status !== "Open" && (
                        <Chip
                            label={topic.status}
                            size="small"
                            color={topic.status === "Closed" ? "error" : "warning"}
                            sx={{ ml: 2 }}
                        />
                    )}
                </Box>
                <Box sx={{ mb: 3 }}>
                    <TextEditor
                        value={topic.content}
                        onChange={() => {}}
                        ref={editorRef}
                        isDisabled={true}
                        type="topic"
                    />
                </Box>
                {topic.tags && topic.tags.length > 0 && <TagDisplay tags={topic.tags} label="Tags" size="medium" />}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                        Last updated: {formatDistanceToNow(new Date(topic.updatedAt), { addSuffix: true })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Views: {topic.viewCount}
                    </Typography>
                </Box>
            </Paper>
            <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
                Replies
            </Typography>
            <PostList
                posts={posts}
                currentPage={currentPage}
                totalPages={Math.ceil(posts.total / limit)}
                onPageChange={handlePageChange}
                userLoggedIn={session?.user}
                topicLocked={topic.isLocked}
            />
            {session?.user && !topic.isLocked && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" component="h3" fontWeight="bold" sx={{ mb: 2 }}>
                        Post a Reply
                    </Typography>
                    <CreatePostForm topicId={topic.id} userId={Number(session.user.id)} />
                </Box>
            )}
        </Container>
    );
}
