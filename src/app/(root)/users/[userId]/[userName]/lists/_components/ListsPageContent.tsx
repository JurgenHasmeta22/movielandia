"use client";

import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { List } from "@prisma/client";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import ListCard from "@/components/root/listCard/ListCard";
import { useRouter } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface ListsPageContentProps {
    lists: List[];
    listsCount: number;
    itemsPerPage: number;
    currentPage: number;
    searchParams?: {
        listsAscOrDesc?: string;
        pageLists?: string;
        listsSortBy?: string;
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

    const sortBy = searchParams?.listsSortBy ?? "createdAt";
    const ascOrDesc = searchParams?.listsAscOrDesc ?? "desc";

    if (!lists || lists.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
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
                    <Typography variant="h5" color="text.primary" sx={{ mb: 2, fontWeight: 500 }}>
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
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => router.push(`/users/${userId}/${userName}/lists/create`)}
                            sx={{
                                textTransform: "none",
                                bgcolor: "primary.main",
                                "&:hover": {
                                    bgcolor: "primary.light",
                                },
                                "& .MuiButton-startIcon": {
                                    color: "rgba(0, 0, 0, 0.87)",
                                },
                                color: "rgba(0, 0, 0, 0.87)",
                                fontWeight: 500,
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
            sx={{
                minHeight: "calc(100vh - 200px)",
                display: "flex",
                flexDirection: "column",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 2, sm: 3 },
                maxWidth: "1200px",
                mx: "auto",
                width: "100%",
                mt: { xs: 4, sm: 5 },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: { xs: 3, sm: 4 },
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {startIndex} – {endIndex} of {listsCount} lists
                    </Typography>
                    {isOwnProfile && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => router.push(`/users/${userId}/${userName}/lists/create`)}
                            sx={{
                                textTransform: "none",
                                bgcolor: "primary.main",
                                "&:hover": {
                                    bgcolor: "primary.light",
                                },
                                "& .MuiButton-startIcon": {
                                    color: "rgba(0, 0, 0, 0.87)",
                                },
                                color: "rgba(0, 0, 0, 0.87)",
                                fontWeight: 500,
                            }}
                        >
                            Create New List
                        </Button>
                    )}
                </Box>
                <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="lists" dataType="lists" />
            </Box>
            <Box sx={{ flex: 1, overflow: "visible" }}>
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
                    {lists.map((list: List) => (
                        <ListCard key={list.id} list={list} username={userName} userId={userId} />
                    ))}
                </Stack>

                {pageCount > 1 && (
                    <Box sx={{ mt: 4, mb: 2 }}>
                        <PaginationControl currentPage={currentPage} pageCount={pageCount} urlParamName="pageLists" />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
