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
	CircularProgress,
	Backdrop,
} from "@mui/material";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { ForumCategory } from "@prisma/client";
import TopicList from "./TopicList";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
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
	currentTags?: string;
	currentStatus?: string;
}

export default function CategoryPageContent({
	category,
	session,
	topics,
	currentPage,
	currentSortBy,
	currentOrder,
	currentTags,
	currentStatus,
}: ICategoryPageContentProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const limit = 10;

	const updateSearchParams = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (value === null || value === "") {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});

		const queryString = params.toString().replace(/%2C/g, ",");
		startTransition(() => {
			router.push(`${pathname}?${queryString}`, { scroll: false });
		});
	};

	const selectedTags = (currentTags || "")
		.split(",")
		.filter((id) => id)
		.map((id) => parseInt(id));

	const handleCreateTopic = () => {
		router.push(
			`/forum/categories/${category.id}/${category.slug}/topics/create`,
		);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		const selectedStatus = event.target.value;

		updateSearchParams({
			status: selectedStatus === "all" ? null : selectedStatus,
			page: null,
		});
	};

	const handleTagChange = (newTagIds: number[]) => {
		const newTagIdsString =
			newTagIds.length > 0 ? newTagIds.join(",") : null;

		updateSearchParams({
			tags: newTagIdsString,
			page: null,
		});
	};

	const clearFilters = () => {
		updateSearchParams({
			topicsSortBy: null,
			topicsAscOrDesc: null,
			tags: null,
			status: null,
			page: null,
		});
	};

	return (
		<>
			<Backdrop
				open={isPending}
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
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
					<MuiLink
						component={Link}
						href="/forum"
						underline="hover"
						color="inherit"
					>
						Categories
					</MuiLink>
					<Typography color="text.primary">
						{category.name}
					</Typography>
				</Breadcrumbs>
				<Box sx={{ mb: 4 }}>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						fontWeight="bold"
					>
						{category.name}
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						gutterBottom
					>
						{category.description}
					</Typography>
				</Box>
				<Paper
					elevation={0}
					sx={{
						p: 3,
						mb: 3,
						borderRadius: 2,
						backgroundColor: (theme) =>
							theme.vars.palette.background.paper,
						border: (theme) =>
							`1px solid ${theme.vars.palette.divider}`,
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 3,
						}}
					>
						<Typography
							variant="h5"
							component="h2"
							fontWeight="bold"
						>
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
									textTransform: "capitalize",
								}}
							>
								Search in Category
							</Button>
							{session?.user && (
								<Button
									variant="contained"
									color="secondary"
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
						<Box sx={{ position: "relative" }}>
							<SortSelect
								sortBy={currentSortBy}
								ascOrDesc={currentOrder}
								type="list"
								dataType="topics"
							/>
						</Box>
					<FormControl 
						size="small" 
						sx={{ 
							minWidth: 150,
							opacity: isPending ? 0.6 : 1,
							pointerEvents: isPending ? "none" : "auto"
						}}
					>
							<InputLabel id="status-label">Status</InputLabel>
							<Select
								labelId="status-label"
								value={currentStatus || "all"}
								label="Status"
								onChange={handleStatusChange}
								startAdornment={
									<FilterAltIcon
										fontSize="small"
										sx={{ mr: 1 }}
									/>
								}
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
		</>
	);
}
