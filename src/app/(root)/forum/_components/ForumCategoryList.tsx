"use client";

import { Box, Paper, Typography, Pagination, Stack, Divider, Button } from "@mui/material";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import ForumIcon from "@mui/icons-material/Forum";
import { ForumCategory } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface ForumCategoryListProps {
    categories: {
        items: ForumCategory[];
        total: number;
    };
    currentPage: number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function ForumCategoryList({ categories, currentPage, onPageChange }: ForumCategoryListProps) {
    const theme = useTheme();
    const limit = 10;
    const totalPages = Math.ceil(categories.total / limit);

    if (categories.items.length === 0) {
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
                <ForumIcon sx={{ fontSize: 60, color: theme.vars.palette.primary.main, mb: 2, opacity: 0.7 }} />
                <Typography variant="h6" gutterBottom>
                    No categories found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    There are no forum categories available yet.
                </Typography>
            </Paper>
        );
    }

    return (
        <>
            <Stack spacing={2}>
                {categories.items.map((category) => (
                    <Paper
                        key={category.id}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            backgroundColor: theme.vars.palette.secondary.light,
                            border: `1px solid ${theme.vars.palette.primary.light}`,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                                borderColor: theme.vars.palette.primary.main,
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Link
                                href={`/forum/categories/${category.id}/${category.slug}`}
                                style={{ textDecoration: "none" }}
                            >
                                <Typography variant="h6" color="primary" fontWeight="bold">
                                    {category.name}
                                </Typography>
                            </Link>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {category.topicCount} {category.topicCount === 1 ? "topic" : "topics"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {category.postCount} {category.postCount === 1 ? "post" : "posts"}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {category.description}
                        </Typography>

                        {category.lastPostAt && (
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Last activity:{" "}
                                    {formatDistanceToNow(new Date(category.lastPostAt), { addSuffix: true })}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    component={Link}
                                    href={`/forum/categories/${category.id}/${category.slug}`}
                                >
                                    View Topics
                                </Button>
                            </Box>
                        )}
                    </Paper>
                ))}
            </Stack>

            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Pagination
                        count={totalPages}
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
