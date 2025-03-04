import { Box, Stack, Typography } from "@mui/material";
import { Playlist } from "@prisma/client";
import { getUserPlaylists } from "@/actions/playlist/playlist.actions";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import ListTypeSelect from "./ListTypeSelect";
import ListCard from "@/components/root/listCard/ListCard";

interface ListsPageContentProps {
    searchParams?: {
        listsAscOrDesc?: string;
        pageLists?: string;
        listsSortBy?: string;
        listsType?: string;
    };
    session: any;
    userId: number;
    username: string;
}

export default async function ListsPageContent({ searchParams, session, userId, username }: ListsPageContentProps) {
    const { ascOrDesc, page, sortBy, type } = {
        ascOrDesc: searchParams?.listsAscOrDesc ?? "desc",
        page: searchParams?.pageLists ? Number(searchParams.pageLists) : 1,
        sortBy: searchParams?.listsSortBy ?? "createdAt",
        type: searchParams?.listsType,
    };

    const itemsPerPage = 12;
    const { items: lists, total: listsCount } = await getUserPlaylists(userId, {
        page,
        perPage: itemsPerPage,
        sortBy,
        ascOrDesc,
        type: type as any,
    });

    const pageCount = Math.ceil(listsCount / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, listsCount);

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
                    gap: { xs: 2, sm: 3 },
                    mb: { xs: 3, md: 4 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "baseline" },
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: 24, sm: 28, md: 32 },
                            fontWeight: 800,
                            color: "text.primary",
                            position: "relative",
                            display: "inline-block",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: -8,
                                left: 0,
                                width: "100%",
                                height: 3,
                                bgcolor: "primary.main",
                                borderRadius: 1,
                            },
                        }}
                    >
                        {username}&apos;s Lists
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: 16, sm: 18 },
                            color: "text.secondary",
                            mt: { xs: 2, sm: 0 },
                            ml: { sm: 1 },
                            position: "relative",
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
                    <ListCard key={list.id} playlist={list} username={username} userId={userId} />
                ))}
            </Stack>

            <PaginationControl currentPage={page} pageCount={pageCount} urlParamName="pageLists" />
        </Box>
    );
}
