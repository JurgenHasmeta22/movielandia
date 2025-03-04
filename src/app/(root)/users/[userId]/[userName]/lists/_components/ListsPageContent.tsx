import { Box, Stack, Typography } from "@mui/material";
import { Playlist } from "@prisma/client";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import ListTypeSelect from "./ListTypeSelect";
import ListCard from "@/components/root/listCard/ListCard";

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
    lists = [],
    listsCount = 0,
    itemsPerPage,
    currentPage,
    searchParams,
    userId,
    userName,
}: ListsPageContentProps) {
    if (!lists || lists.length === 0) {
        return (
            <Box
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    width: "100%",
                    px: { xs: 2, sm: 3, md: 4 },
                    textAlign: "center",
                    py: 4,
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No lists found
                </Typography>
            </Box>
        );
    }

    const pageCount = Math.ceil(listsCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, listsCount);

    const type = searchParams?.listsType;
    const sortBy = searchParams?.listsSortBy ?? "createdAt";
    const ascOrDesc = searchParams?.listsAscOrDesc ?? "desc";

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
