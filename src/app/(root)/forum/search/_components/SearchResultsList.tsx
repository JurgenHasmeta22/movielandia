"use client";

import { Box, Paper, Typography, Pagination, Stack, Avatar, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ForumSearchResult } from "@/actions/forum/forumSearch.actions";
import TagDisplay from "@/app/(root)/forum/_components/TagDisplay";

interface SearchResultsListProps {
    searchResults: ForumSearchResult;
    tabValue: number;
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function SearchResultsList({
    searchResults,
    tabValue,
    currentPage,
    onPageChange,
}: SearchResultsListProps) {
    const theme = useTheme();
    const limit = 10;

    let items: any[] = [];
    let total = 0;

    if (tabValue === 0) {
        const allItems = [
            ...searchResults.topics.items.map((item) => ({ ...item, type: "topic" })),
            ...searchResults.posts.items.map((item) => ({ ...item, type: "post" })),
            ...searchResults.replies.items.map((item) => ({ ...item, type: "reply" })),
        ];

        items = allItems
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        total = searchResults.topics.total + searchResults.posts.total + searchResults.replies.total;
    } else if (tabValue === 1) {
        items = searchResults.topics.items.map((item) => ({ ...item, type: "topic" }));
        total = searchResults.topics.total;
    } else if (tabValue === 2) {
        items = searchResults.posts.items.map((item) => ({ ...item, type: "post" }));
        total = searchResults.posts.total;
    } else if (tabValue === 3) {
        items = searchResults.replies.items.map((item) => ({ ...item, type: "reply" }));
        total = searchResults.replies.total;
    }

    if (items.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    backgroundColor: theme.vars.palette.secondary.light,
                    border: `1px solid ${theme.vars.palette.primary.light}`,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    No results found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Try adjusting your search terms or filters.
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            <Stack spacing={2}>
                {items.map((item, index) => (
                    <Paper
                        key={`${item.type}-${item.id}-${index}`}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: theme.vars.palette.secondary.light,
                            border: `1px solid ${theme.vars.palette.primary.light}`,
                        }}
                    >
                        {item.type === "topic" && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Chip size="small" label="Topic" color="primary" />
                                    <Link
                                        href={`/forum/categories/${item.categoryId}/${item.category.slug}/topics/${item.id}/${item.slug}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            {item.title}
                                        </Typography>
                                    </Link>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {item.content.replace(/<[^>]*>?/gm, "").substring(0, 200)}
                                    {item.content.length > 200 ? "..." : ""}
                                </Typography>
                                {item.tags && item.tags.length > 0 && <TagDisplay tags={item.tags} size="small" />}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                    <Avatar
                                        src={item.user.avatar?.photoSrc || ""}
                                        alt={item.user.userName}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Posted by{" "}
                                        <Link
                                            href={`/users/${item.user.id}/${item.user.userName}`}
                                            style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                                        >
                                            {item.user.userName}
                                        </Link>
                                        {" in "}
                                        <Link
                                            href={`/forum/categories/${item.category.id}/${item.category.slug}`}
                                            style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                                        >
                                            {item.category.name}
                                        </Link>{" "}
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </Typography>
                                </Box>
                            </>
                        )}
                        {item.type === "post" && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Chip size="small" label="Post" color="secondary" />
                                    <Link
                                        href={`/forum/categories/${item.topic.categoryId}/${item.topic.category.slug}/topics/${item.topic.id}/${item.topic.slug}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            Re: {item.topic.title}
                                        </Typography>
                                    </Link>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {item.content.replace(/<[^>]*>?/gm, "").substring(0, 200)}
                                    {item.content.length > 200 ? "..." : ""}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                    <Avatar
                                        src={item.user.avatar?.photoSrc || ""}
                                        alt={item.user.userName}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Posted by{" "}
                                        <Link
                                            href={`/users/${item.user.id}/${item.user.userName}`}
                                            style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                                        >
                                            {item.user.userName}
                                        </Link>
                                        {" in "}
                                        <Link
                                            href={`/forum/categories/${item.topic.category.id}/${item.topic.category.slug}`}
                                            style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                                        >
                                            {item.topic.category.name}
                                        </Link>{" "}
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </Typography>
                                </Box>
                            </>
                        )}
                        {item.type === "reply" && (
                            <>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Chip size="small" label="Reply" color="info" />
                                    <Link
                                        href={`/forum/categories/${item.post.topic.categoryId}/${item.post.topic.category.slug}/topics/${item.post.topic.id}/${item.post.topic.slug}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            Re: {item.post.topic.title}
                                        </Typography>
                                    </Link>
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {item.content.replace(/<[^>]*>?/gm, "").substring(0, 200)}
                                    {item.content.length > 200 ? "..." : ""}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                                    <Avatar
                                        src={item.user.avatar?.photoSrc || ""}
                                        alt={item.user.userName}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Replied by{" "}
                                        <Link
                                            href={`/users/${item.user.id}/${item.user.userName}`}
                                            style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                                        >
                                            {item.user.userName}
                                        </Link>
                                        {" in "}
                                        <Link
                                            href={`/forum/categories/${item.post.topic.category.id}/${item.post.topic.category.slug}`}
                                            style={{ textDecoration: "none", color: theme.vars.palette.primary.main }}
                                        >
                                            {item.post.topic.category.name}
                                        </Link>{" "}
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Paper>
                ))}
            </Stack>
            {Math.ceil(total / limit) > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={Math.ceil(total / limit)}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </>
    );
}
