"use client";

import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { Playlist } from "@prisma/client";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import ListTypeSelect from "./ListTypeSelect";
import ListCard from "@/components/root/listCard/ListCard";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";

interface ListsPageContentProps {
    lists: Playlist[];
    listsCount: number;
    itemsPerPage: number;
    currentPage: number;
    searchParams?: {
        listsAscOrDesc?: string;
        pageLists?: string;
        listsSortBy?: string;
        listsType?: string;
    };
    session: any;
    userId: number;
    userName: string;
}

export default function ListsPageContent({
    lists,
    listsCount,
    itemsPerPage,
    currentPage,
    searchParams,
    session,
    userId,
    userName,
}: ListsPageContentProps) {
    const router = useRouter();

    const isOwnProfile = Number(session?.user?.id) === userId;

    const pageCount = Math.ceil(listsCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, listsCount);

    const type = searchParams?.listsType;
    const sortBy = searchParams?.listsSortBy ?? "createdAt";
    const ascOrDesc = searchParams?.listsAscOrDesc ?? "desc";

    if (!lists || lists.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        py: 8,
                        px: 4,
                        textAlign: "center",
                        backgroundColor: "transparent",
                        maxWidth: 600,
                    }}
                >
                    <PlaylistAddIcon
                        sx={{
                            fontSize: 80,
                            color: "text.secondary",
                            opacity: 0.6,
                            mb: 3,
                        }}
                    />
                    <Typography
                        variant="h5"
                        color="text.primary"
                        sx={{
                            mb: 2,
                            fontWeight: 500,
                        }}
                    >
                        {isOwnProfile ? "No Lists Found" : `${userName} hasn't created any lists yet`}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            maxWidth: 450,
                            mx: "auto",
                            lineHeight: 1.6,
                            mb: isOwnProfile ? 4 : 0,
                        }}
                    >
                        {isOwnProfile
                            ? "Start creating your first list to keep track of your favorite movies, TV shows, and more."
                            : "Check back later for new lists from this user."}
                    </Typography>
                    {isOwnProfile && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => router.push("/playlists/create")}
                            sx={{
                                mt: 2,
                                textTransform: "none",
                                px: 3,
                                py: 1,
                            }}
                        >
                            Create New List
                        </Button>
                    )}
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4, md: 5 },
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                px: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            position: { sm: "relative" },
                            top: { sm: 2 },
                        }}
                    >
                        {startIndex} – {endIndex} of {listsCount} lists
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <ListTypeSelect type={type} />
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="lists" dataType="lists" />
                </Box>
            </Box>
            <Stack
                direction="row"
                flexWrap="wrap"
                sx={{
                    columnGap: { xs: 2, sm: 3 },
                    rowGap: { xs: 3, sm: 4 },
                    justifyContent: {
                        xs: "center",
                        md: "flex-start",
                    },
                }}
            >
                {lists.map((list: Playlist) => (
                    <ListCard key={list.id} playlist={list} username={userName} userId={userId} />
                ))}
            </Stack>

            {pageCount > 1 && (
                <PaginationControl currentPage={currentPage} pageCount={pageCount} urlParamName="pageLists" />
            )}
        </Box>
    );
}
