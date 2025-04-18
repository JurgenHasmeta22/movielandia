"use client";

import { Box, Container, Typography, Paper, Button, Stack, Divider, ButtonGroup } from "@mui/material";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import ForumCategoryList from "./ForumCategoryList";
import ForumStats from "./ForumStats";
import SearchIcon from "@mui/icons-material/Search";

interface IForumPageContentProps {
    searchParams?: {
        page?: string;
    };
    session: any;
    categories: {
        items: any[];
        total: number;
    };
    stats: {
        categoriesCount: number;
        topicsCount: number;
        postsCount: number;
    };
    currentPage: number;
}

export default function ForumPageContent({
    searchParams,
    session,
    categories,
    stats,
    currentPage,
}: IForumPageContentProps) {
    const router = useRouter();
    const [page, setPage] = useQueryState("page");

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value === 1 ? null : value.toString());
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Community Forum
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Join discussions about your favorite movies and series with other movie enthusiasts.
                </Typography>
            </Box>

            {stats && <ForumStats stats={stats} />}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 4 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Categories
                </Typography>
                <Box>
                    <ButtonGroup variant="contained" sx={{ mr: 2 }}>
                        <Button
                            color="secondary"
                            startIcon={<SearchIcon />}
                            onClick={() => router.push("/forum/search")}
                        >
                            Search Forum
                        </Button>
                    </ButtonGroup>

                    {session?.user?.role === "ADMIN" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => router.push("/forum/categories/create")}
                        >
                            Create Category
                        </Button>
                    )}
                </Box>
            </Box>

            <ForumCategoryList categories={categories} currentPage={currentPage} onPageChange={handlePageChange} />
        </Container>
    );
}
