"use client";

import {
    Box,
    Container,
    Typography,
    Button,
    Breadcrumbs,
    Link as MuiLink,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import Link from "next/link";
import { ForumCategory } from "@prisma/client";
import TopicList from "./TopicList";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState, useEffect } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";
import SearchIcon from "@mui/icons-material/Search";
import TagSelector from "@/app/(root)/forum/_components/TagSelector";

interface ICategoryPageContentProps {
    category: ForumCategory;
    searchParams?: {
        page?: string;
        sortBy?: string;
        order?: string;
        tags?: string;
        status?: string;
    };
    session: any;
    topics: {
        items: any[];
        total: number;
    };
    currentPage: number;
    currentSortBy: string;
    currentOrder: string;
}

export default function CategoryPageContent({
    category,
    session,
    topics,
    currentPage,
    currentSortBy,
    currentOrder,
}: ICategoryPageContentProps) {
    const router = useRouter();
    const [page, setPage] = useQueryState("page");
    const [sortBy, setSortBy] = useQueryState("sortBy");
    const [order, setOrder] = useQueryState("order");
    const [tagIds, setTagIds] = useQueryState("tags");
    const [status, setStatus] = useQueryState("status");

    const [selectedTags, setSelectedTags] = useState<number[]>([]);

    const limit = 10;

    useEffect(() => {
        const fetchTags = async () => {
            try {
                if (tagIds) {
                    const parsedTagIds = tagIds.split(",").map((id) => parseInt(id));
                    setSelectedTags(parsedTagIds);
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, [tagIds]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value === 1 ? null : value.toString());
    };

    const handleCreateTopic = () => {
        router.push(`/forum/categories/${category.id}/${category.slug}/topics/create`);
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value === "lastPostAt" ? null : event.target.value);
        setPage(null);
    };

    const handleOrderChange = (event: SelectChangeEvent) => {
        setOrder(event.target.value === "desc" ? null : event.target.value);
        setPage(null);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value === "all" ? null : event.target.value);
        setPage(null);
    };

    const handleTagChange = (newTagIds: number[]) => {
        setSelectedTags(newTagIds);
        setTagIds(newTagIds.length > 0 ? newTagIds.join(",") : null);
        setPage(null);
    };

    const clearFilters = () => {
        setSortBy(null);
        setOrder(null);
        setTagIds(null);
        setStatus(null);
        setSelectedTags([]);
        setPage(null);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
                    Forum
                </MuiLink>
                <Typography color="text.primary">{category.name}</Typography>
            </Breadcrumbs>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    {category.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {category.description}
                </Typography>
            </Box>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: (theme) => theme.vars.palette.secondary.light,
                    border: (theme) => `1px solid ${theme.vars.palette.primary.light}`,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        Topics
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SearchIcon />}
                            href={`/forum/search?categoryId=${category.id}`}
                            component={Link}
                        >
                            Search in Category
                        </Button>

                        {session?.user && (
                            <Button variant="contained" color="primary" onClick={handleCreateTopic}>
                                Create Topic
                            </Button>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="sort-by-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            value={currentSortBy}
                            label="Sort By"
                            onChange={handleSortChange}
                            startAdornment={<SortIcon fontSize="small" sx={{ mr: 1 }} />}
                        >
                            <MenuItem value="lastPostAt">Last Activity</MenuItem>
                            <MenuItem value="createdAt">Creation Date</MenuItem>
                            <MenuItem value="title">Title</MenuItem>
                            <MenuItem value="viewCount">View Count</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="order-label">Order</InputLabel>
                        <Select labelId="order-label" value={currentOrder} label="Order" onChange={handleOrderChange}>
                            <MenuItem value="desc">Descending</MenuItem>
                            <MenuItem value="asc">Ascending</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            value={status || "all"}
                            label="Status"
                            onChange={handleStatusChange}
                            startAdornment={<FilterAltIcon fontSize="small" sx={{ mr: 1 }} />}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                            <MenuItem value="Archived">Archived</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={clearFilters}
                        sx={{ height: 40 }}
                    >
                        Clear Filters
                    </Button>
                </Box>
                <TagSelector
                    selectedTags={selectedTags}
                    onChange={handleTagChange}
                    label="Filter by Tags"
                    placeholder="Select tags to filter topics"
                />
            </Paper>
            <TopicList
                topics={topics}
                currentPage={currentPage}
                totalPages={Math.ceil(topics.total / limit)}
                onPageChange={handlePageChange}
                userLoggedIn={session?.user}
            />
        </Container>
    );
}
