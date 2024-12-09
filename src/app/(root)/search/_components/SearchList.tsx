"use client";

import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import CardItem, { PathType } from "@/components/root/cardItem/CardItem";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import { Actor, Crew, Episode, Movie, Season, Serie, User } from "@prisma/client";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { motion } from "framer-motion";

interface MediaListProps {
    title: string;
    data: Array<Movie | Serie | Actor | Season | Episode | User | Crew>;
    count: number;
    sortBy: string;
    ascOrDesc: string;
    page: number;
    pageCount: number;
    dataType: "Movies" | "Series" | "Actors" | "Seasons" | "Episodes" | "Users" | "Crew";
    cardType: "movie" | "serie" | "actor" | "season" | "episode" | "user" | "crew";
    path?: PathType;
}

const SearchList = ({
    title,
    data,
    count,
    sortBy,
    ascOrDesc,
    page,
    pageCount,
    dataType,
    cardType,
    path = null,
}: MediaListProps) => {
    const theme = useTheme();

    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, count);

    if (data.length === 0) {
        return null;
    }

    return (
        <Box
            component={motion.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: theme.vars.shadows[1],
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderBottom: `1px solid ${theme.vars.palette.divider}`,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: 20, sm: 24 },
                                fontWeight: 700,
                                color: "text.primary",
                                mb: 0.5,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary",
                            }}
                        >
                            {startIndex} – {endIndex} of {count} {dataType.toLowerCase()}
                        </Typography>
                    </Box>
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType={dataType.toLowerCase()} />
                </Box>
            </Box>
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: { xs: 2, sm: 3 },
                        rowGap: { xs: 3, sm: 4 },
                        justifyContent: "flex-start",
                    }}
                >
                    {data.map((item) => (
                        <Box
                            key={item.id}
                            sx={{
                                display: "flex",
                                columnGap: { xs: 1, sm: 2, md: 3 },
                                paddingLeft: 1,
                                rowGap: { xs: 3, sm: 4, md: 5 },
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <CardItem data={item} type={cardType} path={path} />
                        </Box>
                    ))}
                </Box>
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                    <PaginationControl currentPage={Number(page)} pageCount={pageCount} dataType={dataType} />
                </Box>
            </Box>
        </Box>
    );
};

export default SearchList;
