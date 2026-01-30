"use client";

import { useState, useEffect } from "react";
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
import ForumSearchResultsList from "./ForumSearchResultsList";

interface SearchPageContentProps {
	query: string;
	searchResults: ForumSearchResult;
	currentPage: number;
	currentTab?: string;
	session: any;
	allTags: ForumTag[];
	allCategories: ForumCategory[];
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

export default function ForumSearchPageContent({
	query,
	searchResults,
	currentPage,
	currentTab = "all",
	allCategories,
	category,
	filters,
}: SearchPageContentProps) {
	const [searchQuery, setSearchQuery] = useState(query);

	const [_q, setQ] = useQueryState("q", { shallow: false });
	const [_page, setPage] = useQueryState("page", { shallow: false });
	const [categoryId, setCategoryId] = useQueryState("categoryId", {
		shallow: false,
	});
	const [_userId, setUserId] = useQueryState("userId", { shallow: false });
	const [_tags, setTags] = useQueryState("tags", { shallow: false });
	const [status, setStatus] = useQueryState("status", { shallow: false });
	const [dateFrom, setDateFrom] = useQueryState("dateFrom", {
		shallow: false,
	});
	const [dateTo, setDateTo] = useQueryState("dateTo", { shallow: false });
	const [tab, setTab] = useQueryState("tab", {
		shallow: false,
		defaultValue: currentTab,
	});
	const hasFilters = Boolean(
		filters.categoryId ||
		filters.status ||
		filters.tagIds?.length ||
		filters.dateFrom ||
		filters.dateTo,
	);
	const [showFilters, setShowFilters] = useState(hasFilters);
	const [selectedTags, setSelectedTags] = useState<number[]>(
		filters.tagIds || [],
	);
	const [localCategoryId, setLocalCategoryId] = useState<string>(
		categoryId || "",
	);
	const [localStatus, setLocalStatus] = useState<string>(status || "all");
	const [localDateFrom, setLocalDateFrom] = useState<string>(dateFrom || "");
	const [localDateTo, setLocalDateTo] = useState<string>(dateTo || "");

	useEffect(() => {
		if (hasFilters) {
			setShowFilters(true);
		}
	}, [hasFilters]);

	useEffect(() => {
		if (query) {
			setSearchQuery(query);
		}
	}, [query]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setQ(searchQuery || null);
		setCategoryId(localCategoryId === "" ? null : localCategoryId);
		setStatus(localStatus === "all" ? null : localStatus);
		setTags(selectedTags.length > 0 ? selectedTags.join(",") : null);
		setDateFrom(localDateFrom || null);
		setDateTo(localDateTo || null);
		setPage(null);
	};

	const handleTabChange = (
		_event: React.SyntheticEvent,
		newValue: number,
	) => {
		const tabNames = ["all", "topics", "posts", "replies"];
		setTab(newValue === 0 ? null : tabNames[newValue]);
	};

	const handlePageChange = (
		_event: React.ChangeEvent<unknown>,
		value: number,
	) => {
		setPage(value === 1 ? null : value.toString());
	};

	const handleCategoryChange = (event: SelectChangeEvent) => {
		setLocalCategoryId(event.target.value);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		setLocalStatus(event.target.value);
	};

	const handleTagChange = (newTagIds: number[]) => {
		setSelectedTags(newTagIds);
	};

	const handleDateFromChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setLocalDateFrom(event.target.value);
	};

	const handleDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLocalDateTo(event.target.value);
	};

	const clearFilters = () => {
		setLocalCategoryId("");
		setLocalStatus("all");
		setLocalDateFrom("");
		setLocalDateTo("");
		setSelectedTags([]);
		setCategoryId(null);
		setUserId(null);
		setTags(null);
		setStatus(null);
		setDateFrom(null);
		setDateTo(null);
		setPage(null);
	};

	const totalResults =
		searchResults.topics.total +
		searchResults.posts.total +
		searchResults.replies.total;

	return (
		<Container maxWidth="xl" sx={{ py: 4, mt: 4 }}>
			<Breadcrumbs
				separator={<NavigateNextIcon fontSize="small" />}
				aria-label="breadcrumb"
				sx={{ mb: 3 }}
			>
				<MuiLink
					component={Link}
					href="/forum"
					underline="hover"
					color="inherit"
				>
					Forum
				</MuiLink>
				<Typography color="text.primary">Search</Typography>
			</Breadcrumbs>

			<Box sx={{ mb: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					fontWeight="bold"
				>
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
					backgroundColor: (theme) =>
						theme.vars.palette.secondary.light,
					border: (theme) =>
						`1px solid ${theme.vars.palette.primary.light}`,
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
									<IconButton
										aria-label="clear search"
										onClick={() => setSearchQuery("")}
										edge="end"
									>
										<ClearIcon />
									</IconButton>
								</InputAdornment>
							) : null,
						}}
					/>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							mb: 2,
						}}
					>
						<Button
							variant="outlined"
							color="primary"
							startIcon={<FilterAltIcon />}
							sx={{
								textTransform: "capitalize",
							}}
							onClick={() => setShowFilters(!showFilters)}
						>
							{showFilters ? "Hide Filters" : "Show Filters"}
						</Button>

						<Button
							type="submit"
							variant="contained"
							color="secondary"
							startIcon={<SearchIcon />}
							sx={{
								"&:hover": {
									backgroundColor: (theme) =>
										theme.vars.palette.primary.dark,
								},
							}}
						>
							Search
						</Button>
					</Box>
					{showFilters && (
						<Box sx={{ mt: 3 }}>
							<Typography variant="h6" gutterBottom>
								Search Filters
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexDirection: { xs: "column", md: "row" },
									gap: 2,
									mb: 2,
								}}
							>
								<Box sx={{ flex: 1 }}>
									<FormControl fullWidth size="small">
										<InputLabel id="category-label">
											Category
										</InputLabel>
										<Select
											labelId="category-label"
											value={localCategoryId}
											label="Category"
											onChange={handleCategoryChange}
										>
											{category ? (
												<MenuItem
													value={category.id.toString()}
												>
													{category.name}
												</MenuItem>
											) : (
												[
													<MenuItem
														key="all"
														value=""
													>
														All Categories
													</MenuItem>,
													...allCategories.map(
														(cat) => (
															<MenuItem
																key={cat.id}
																value={cat.id.toString()}
															>
																{cat.name}
															</MenuItem>
														),
													),
												]
											)}
										</Select>
									</FormControl>
								</Box>
								<Box sx={{ flex: 1 }}>
									<FormControl fullWidth size="small">
										<InputLabel id="status-label">
											Topic Status
										</InputLabel>
										<Select
											labelId="status-label"
											value={localStatus}
											label="Topic Status"
											onChange={handleStatusChange}
										>
											<MenuItem value="all">
												All Statuses
											</MenuItem>
											<MenuItem value="Open">
												Open
											</MenuItem>
											<MenuItem value="Closed">
												Closed
											</MenuItem>
											<MenuItem value="Archived">
												Archived
											</MenuItem>
										</Select>
									</FormControl>
								</Box>
							</Box>
							<Box
								sx={{
									display: "flex",
									flexDirection: { xs: "column", md: "row" },
									gap: 2,
									mb: 2,
								}}
							>
								<Box sx={{ flex: 1 }}>
									<TextField
										fullWidth
										label="From Date"
										type="date"
										value={localDateFrom}
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
										value={localDateTo}
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
							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-end",
									mt: 2,
								}}
							>
								<Button
									variant="outlined"
									color="primary"
									onClick={clearFilters}
								>
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
					<Box
						sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
					>
						<Tabs
							value={(() => {
								const tabNames = [
									"all",
									"topics",
									"posts",
									"replies",
								];
								return tabNames.indexOf(tab || "all");
							})()}
							onChange={handleTabChange}
							aria-label="search results tabs"
						>
							<Tab label={`All (${totalResults})`} />
							<Tab
								label={`Topics (${searchResults.topics.total})`}
							/>
							<Tab
								label={`Posts (${searchResults.posts.total})`}
							/>
							<Tab
								label={`Replies (${searchResults.replies.total})`}
							/>
						</Tabs>
					</Box>
					<ForumSearchResultsList
						searchResults={searchResults}
						tabValue={(() => {
							const tabNames = [
								"all",
								"topics",
								"posts",
								"replies",
							];
							return tabNames.indexOf(tab || "all");
						})()}
						currentPage={currentPage}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</Container>
	);
}
