"use client";

import { Box, Stack, Typography, Tooltip, IconButton } from "@mui/material";
import { useQueryState } from "nuqs";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { formatDate } from "@/utils/helpers/utils";
import { List } from "@prisma/client";


interface ListPageContentProps {
    list: List;
    userName: string;
    currentUserId: number;
    content: any[];
    totalItems: number;
    currentPage: number;
}

export default function ListPageContent({
    list,
    userName,
    content,
    totalItems,
    currentPage,
}: ListPageContentProps) {
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
                mt: 6,
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
                            {list.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {list.isPrivate && (
                                <Tooltip title="Private list">
                                    <IconButton size="small">
                                        <LockIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {list.isArchived && (
                                <Tooltip title="Archived list">
                                    <IconButton size="small">
                                        <ArchiveIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    </Stack>

                    {list.description && (
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "800px" }}>
                            {list.description}
                        </Typography>
                    )}

                    <Stack direction="row" spacing={2} alignItems="center" sx={{ color: "text.secondary" }}>
                        <Typography variant="body2">Created by {userName}</Typography>
                        <Typography variant="body2">Last updated {formatDate(list.updatedAt)}</Typography>
                        <Typography variant="body2">{totalItems} items</Typography>
                    </Stack>
                </Stack>
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
                            key={item.id}
                            data={item}
                            type={item.contentType}
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
