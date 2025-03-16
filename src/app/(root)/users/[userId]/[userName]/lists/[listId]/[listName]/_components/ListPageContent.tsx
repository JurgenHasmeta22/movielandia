"use client";

import { Box, Stack, Typography, Tabs, Tab, Tooltip, IconButton } from "@mui/material";
import { useQueryState } from "nuqs";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import CardItem, { CardItemType } from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { formatDate } from "@/utils/helpers/utils";
import { Playlist } from "@prisma/client";

const tabToCardType: Record<string, CardItemType> = {
    movies: "movie",
    series: "serie",
    seasons: "season",
    episodes: "episode",
    actors: "actor",
    crew: "crew",
};

interface ListPageContentProps {
    playlist: Playlist;
    userName: string;
    currentUserId: number;
    content: any[];
    totalItems: number;
    currentTab: string;
    currentPage: number;
}

export default function ListPageContent({
    playlist,
    userName,
    currentUserId,
    content,
    totalItems,
    currentTab,
    currentPage,
}: ListPageContentProps) {
    const [tab, setTab] = useQueryState<string>("tab", {
        history: "push",
        shallow: true,
        parse: (value: string | null) => value ?? currentTab,
    });

    const [page, setPage] = useQueryState<number>("page", {
        history: "push",
        shallow: true,
        parse: (value: string | null) => Number(value) || currentPage,
    });

    const pageCount = Math.ceil(totalItems / 12);

    return (
        <Box
            component="section"
            sx={{
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, sm: 4 },
            }}
        >
            <Stack spacing={4}>
                {/* Header */}
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography
                            variant="h1"
                            sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, fontWeight: 800, color: "text.primary" }}
                        >
                            {playlist.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {playlist.isPrivate && (
                                <Tooltip title="Private list">
                                    <IconButton size="small">
                                        <LockIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {playlist.isArchived && (
                                <Tooltip title="Archived list">
                                    <IconButton size="small">
                                        <ArchiveIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    </Stack>

                    {playlist.description && (
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "800px" }}>
                            {playlist.description}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ color: "text.secondary" }}>
                        <Typography variant="body2">Created by {userName}</Typography>
                        <Typography variant="body2">Last updated {formatDate(playlist.updatedAt)}</Typography>
                        <Typography variant="body2">{playlist.itemCount} items</Typography>
                    </Stack>
                </Stack>

                {/* Tabs */}
                <Tabs
                    value={tab || currentTab}
                    onChange={(_, value) => {
                        setTab(value);
                        setPage(1);
                    }}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label="Movies" value="movies" icon={<MovieIcon />} />
                    <Tab label="TV Series" value="series" icon={<TvIcon />} />
                    <Tab label="Seasons" value="seasons" icon={<TvIcon />} />
                    <Tab label="Episodes" value="episodes" icon={<TvIcon />} />
                    <Tab label="Actors" value="actors" icon={<PersonIcon />} />
                    <Tab label="Crew" value="crew" icon={<GroupIcon />} />
                </Tabs>

                {/* Content */}
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    sx={{
                        gap: { xs: 2, sm: 3, md: 4 },
                        justifyContent: { xs: "center", md: "flex-start" },
                    }}
                >
                    {content.map((item) => (
                        <CardItem
                            key={item[(tab || currentTab).slice(0, -1)]?.id}
                            data={item[(tab || currentTab).slice(0, -1)]}
                            type={tabToCardType[tab || currentTab]}
                        />
                    ))}
                </Stack>

                {/* Pagination */}
                {pageCount > 1 && (
                    <PaginationControl
                        currentPage={Number(page) || currentPage}
                        pageCount={pageCount}
                        urlParamName="page"
                    />
                )}
            </Stack>
        </Box>
    );
}
