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
import SearchIcon from "@mui/icons-material/Search";
import TagSelector from "@/app/(root)/forum/_components/TagSelector";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import { AddCircleOutlined } from "@mui/icons-material";

interface ICategoryPageContentProps {
    category: ForumCategory;
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

    const [_topicsPage, setTopicsPage] = useQueryState("topicsPage", { shallow: false });
    const [_topicsSortBy, setTopicsSortBy] = useQueryState("topicsSortBy", { shallow: false });
    const [_topicsAscOrDesc, setTopicsAscOrDesc] = useQueryState("topicsAscOrDesc", { shallow: false });

    const [tagIds, setTagIds] = useQueryState("tags", { shallow: false });
    const [status, setStatus] = useQueryState("status", { shallow: false });

    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const limit = 10;

    useEffect(() => {
        const setTagsData = async () => {
            try {
                if (tagIds) {
                    const parsedTagIds = tagIds.split(",").map((id) => parseInt(id));
                    setSelectedTags(parsedTagIds);
                }
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        setTagsData();
    }, [tagIds]);

    const handleCreateTopic = () => {
        router.push(`/forum/categories/${category.id}/${category.slug}/topics/create`);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        const selectedStatus = event.target.value;

        if (selectedStatus === "all") {
            setStatus(null);
        } else if (["Open", "Closed", "Archived"].includes(selectedStatus)) {
            setStatus(selectedStatus);
        }

        setTopicsPage(null);
    };

    const handleTagChange = (newTagIds: number[]) => {
        setSelectedTags(newTagIds);
        const newTagIdsString = newTagIds.length > 0 ? newTagIds.join(",") : null;
        setTagIds(newTagIdsString);
        setTopicsPage(null);
    };

    const clearFilters = () => {
        setTopicsSortBy(null);
        setTopicsAscOrDesc(null);
        setTagIds(null);
        setStatus(null);
        setSelectedTags([]);
        setTopicsPage(null);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4, mt: 4 }}>
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
                    backgroundColor: (theme) => theme.vars.palette.background.paper,
                    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
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
                            sx={{
                                textTransform: "capitalize"
                            }}
                        >
                            Search in Category
                        </Button>
                        {session?.user && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddCircleOutlined />}
                                onClick={handleCreateTopic}
                            >
                                Create Topic
                            </Button>
                        )}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        mb: 3,
                        alignItems: "center",
                    }}
                >
                    <SortSelect sortBy={currentSortBy} ascOrDesc={currentOrder} type="list" dataType="topics" />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            value={status || "all"}
                            label="Status"
                            onChange={handleStatusChange}
                            startAdornment={<FilterAltIcon fontSize="small" sx={{ mr: 1 }} />}
                            MenuProps={{
                                disableScrollLock: true,
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                            <MenuItem value="Archived">Archived</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        size="medium"
                        sx={{
                            textTransform: "capitalize",
                        }}
                        onClick={clearFilters}
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
            <TopicList topics={topics} userLoggedIn={session?.user} />
            {Math.ceil(topics.total / limit) > 1 && (
                <Box sx={{ mt: 4 }}>
                    <PaginationControl
                        currentPage={currentPage}
                        pageCount={Math.ceil(topics.total / limit)}
                        urlParamName="page"
                    />
                </Box>
            )}
        </Container>
    );
}
