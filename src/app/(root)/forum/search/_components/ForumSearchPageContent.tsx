"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Breadcrumbs,
    Link as MuiLink,
    SelectChangeEvent,
    IconButton,
    InputAdornment,
} from "@mui/material";
import Link from "next/link";
import { ForumCategory, ForumTag, TopicStatus } from "@prisma/client";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ClearIcon from "@mui/icons-material/Clear";
import TagSelector from "@/app/(root)/forum/_components/TagSelector";
import { ForumSearchResult } from "@/actions/forum/forumSearch.actions";

interface SearchPageContentProps {
    query: string;
    searchResults: ForumSearchResult;
    currentPage: number;
    session: any;
    allTags: ForumTag[];
    category: ForumCategory | null;
    filters: {
        categoryId?: number;
        userId?: number;
        tagIds?: number[];
        status?: TopicStatus;
        dateFrom?: Date;
        dateTo?: Date;
    };
}

const SearchResultsList = () => {
    return (
        <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Search Results Component</Typography>
            <Typography variant="body2" color="text.secondary">
                This component will display search results when implemented.
            </Typography>
        </Box>
    );
};

export default function ForumSearchPageContent({
    query,
    searchResults,
    currentPage,
    category,
    filters,
}: SearchPageContentProps) {
    const [searchQuery, setSearchQuery] = useState(query);

    const [_q, setQ] = useQueryState("q");
    const [_page, setPage] = useQueryState("page");
    const [categoryId, setCategoryId] = useQueryState("categoryId");
    const [_userId, setUserId] = useQueryState("userId");
    const [_tags, setTags] = useQueryState("tags");
    const [status, setStatus] = useQueryState("status");
    const [dateFrom, setDateFrom] = useQueryState("dateFrom");
    const [dateTo, setDateTo] = useQueryState("dateTo");

    const [tabValue, setTabValue] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTags, setSelectedTags] = useState<number[]>(filters.tagIds || []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQ(searchQuery || null);
        setPage(null);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value === 1 ? null : value.toString());
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategoryId(event.target.value === "" ? null : event.target.value);
        setPage(null);
    };

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value === "all" ? null : event.target.value);
        setPage(null);
    };

    const handleTagChange = (newTagIds: number[]) => {
        setSelectedTags(newTagIds);
        setTags(newTagIds.length > 0 ? newTagIds.join(",") : null);
        setPage(null);
    };

    const handleDateFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(event.target.value || null);
        setPage(null);
    };

    const handleDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(event.target.value || null);
        setPage(null);
    };

    const clearFilters = () => {
        setCategoryId(null);
        setUserId(null);
        setTags(null);
        setStatus(null);
        setDateFrom(null);
        setDateTo(null);
        setSelectedTags([]);
        setPage(null);
    };

    const totalResults = searchResults.topics.total + searchResults.posts.total + searchResults.replies.total;

    return (
        <Container maxWidth="xl" sx={{ py: 4, mt: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
                <MuiLink component={Link} href="/forum" underline="hover" color="inherit">
                    Forum
                </MuiLink>
                <Typography color="text.primary">Search</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Forum Search
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Search for topics, posts, and replies in the forum.
                </Typography>
            </Box>

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
                <Box component="form" onSubmit={handleSearch}>
                    <TextField
                        fullWidth
                        label="Search Forum"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: searchQuery ? (
                                <InputAdornment position="end">
                                    <IconButton aria-label="clear search" onClick={() => setSearchQuery("")} edge="end">
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<FilterAltIcon />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>

                        <Button type="submit" variant="contained" color="primary" startIcon={<SearchIcon />}>
                            Search
                        </Button>
                    </Box>
                    {showFilters && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Search Filters
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            value={categoryId || ""}
                                            label="Category"
                                            onChange={handleCategoryChange}
                                        >
                                            <MenuItem value="">All Categories</MenuItem>
                                            {category && (
                                                <MenuItem value={category.id.toString()}>{category.name}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="status-label">Topic Status</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            value={status || "all"}
                                            label="Topic Status"
                                            onChange={handleStatusChange}
                                        >
                                            <MenuItem value="all">All Statuses</MenuItem>
                                            <MenuItem value="Open">Open</MenuItem>
                                            <MenuItem value="Closed">Closed</MenuItem>
                                            <MenuItem value="Archived">Archived</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="From Date"
                                        type="date"
                                        value={dateFrom || ""}
                                        onChange={handleDateFromChange}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <TextField
                                        fullWidth
                                        label="To Date"
                                        type="date"
                                        value={dateTo || ""}
                                        onChange={handleDateToChange}
                                        InputLabelProps={{ shrink: true }}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                            <TagSelector
                                selectedTags={selectedTags}
                                onChange={handleTagChange}
                                label="Filter by Tags"
                                placeholder="Select tags to filter results"
                            />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                <Button variant="outlined" color="secondary" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
            {query && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Search Results {query && `for "${query}"`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Found {totalResults} results
                        </Typography>
                    </Box>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="search results tabs">
                            <Tab label={`All (${totalResults})`} />
                            <Tab label={`Topics (${searchResults.topics.total})`} />
                            <Tab label={`Posts (${searchResults.posts.total})`} />
                            <Tab label={`Replies (${searchResults.replies.total})`} />
                        </Tabs>
                    </Box>
                    <SearchResultsList
                        searchResults={searchResults}
                        tabValue={tabValue}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Container>
    );
}
