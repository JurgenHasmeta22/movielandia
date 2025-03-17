"use client";

import { Box, Stack, Typography, Tooltip, IconButton, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArchiveIcon from "@mui/icons-material/Archive";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListDetailCardItem from "@/components/root/listDetailCardItem/ListDetailCardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import ListDetailHeader from "@/components/root/listDetailHeader/ListDetailHeader";
import { formatDate } from "@/utils/helpers/utils";
import { List } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ListPageContentProps {
    list: List;
    userName: string;
    currentUserId: number;
    content: any[];
    totalItems: number;
    currentPage: number;
}

export default function ListPageContent({ list, userName, currentUserId, content, totalItems, currentPage }: ListPageContentProps) {
    const router = useRouter();
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
                <Stack direction="row" alignItems="center" spacing={3}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            router.back();
                            router.refresh();
                        }}
                        sx={{
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "text.primary",
                            borderColor: "divider",
                            "&:hover": {
                                borderColor: "primary.main",
                            },
                        }}
                    >
                        GO BACK
                    </Button>
                    <Stack>
                        <Typography
                            variant="overline"
                            sx={{
                                fontSize: { xs: 15, sm: 18, md: 22 },
                                fontWeight: 700,
                                color: "text.secondary",
                                letterSpacing: 1,
                                textTransform: "capitalize",
                                minWidth: 200,
                            }}
                        >
                            {list.contentType} custom list
                        </Typography>
                    </Stack>
                </Stack>
                <ListDetailHeader 
                    listId={list.id} 
                    userId={list.userId} 
                    listTitle={list.name} 
                />
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
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
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(auto-fill, minmax(120px, 1fr))",
                            sm: "repeat(auto-fill, minmax(140px, 1fr))",
                            md: "repeat(auto-fill, minmax(150px, 1fr))",
                            lg: "repeat(auto-fill, minmax(160px, 1fr))",
                        },
                        gap: { xs: 2, sm: 3, md: 4 },
                        justifyItems: "center",
                    }}
                >
                    {content.map((item) => (
                        <ListDetailCardItem key={item.id} data={item} type={list.contentType!} userId={currentUserId} listId={list.id} />
                    ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <PaginationControl currentPage={currentPage} pageCount={pageCount} urlParamName="page" />
                </Box>
            </Stack>
        </Box>
    );
}
