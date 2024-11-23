"use client";

import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import SortSelect from "@/components/root/sortSelect/SortSelect";
import CardItem from "@/components/root/cardItem/CardItem";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import { Movie, Serie } from "@prisma/client";
import type {} from "@mui/material/themeCssVarsAugmentation";

interface GenreListProps {
    title: string;
    data: Array<Movie | Serie>;
    count: number;
    sortBy: string;
    ascOrDesc: string;
    page: number;
    pageCount: number;
    dataType: "Movies" | "Series";
    cardType: "movie" | "serie";
}

const GenreList = ({ title, data, count, sortBy, ascOrDesc, page, pageCount, dataType, cardType }: GenreListProps) => {
    const theme = useTheme();

    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, count);

    if (data.length === 0) {
        return (
            <Box
                component="section"
                sx={{
                    height: "50vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontSize: { xs: 20, sm: 22, md: 24 },
                        color: theme.vars.palette.text.secondary,
                        textAlign: "center",
                    }}
                >
                    No search result, no {dataType.toLowerCase()} found with this genre.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            component="section"
            sx={{
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 3, md: 4 },
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
                            color: theme.vars.palette.text.primary,
                            position: "relative",
                            display: "inline-block",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: -8,
                                left: 0,
                                width: "100%",
                                height: 3,
                                bgcolor: theme.vars.palette.primary.main,
                                borderRadius: 1,
                            },
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: 16, sm: 18 },
                            color: theme.vars.palette.text.secondary,
                            mt: { xs: 2, sm: 0 },
                            ml: { sm: 1 },
                            position: "relative",
                            top: { sm: 2 },
                        }}
                    >
                        {startIndex} – {endIndex} of {count} {dataType.toLowerCase()}
                    </Typography>
                </Box>

                <Box>
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType={dataType.toLowerCase()} />
                </Box>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    overflow: "hidden",
                    mt: { xs: 4, md: 5 },
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    sx={{
                        columnGap: { xs: 1, sm: 2, md: 3 },
                        rowGap: { xs: 3, sm: 4, md: 5 },
                        justifyContent: {
                            xs: "center",
                            md: "flex-start",
                        },
                        mx: { xs: 1, sm: 2 },
                        mb: { xs: 3, md: 4 },
                    }}
                >
                    {data.map((item, index) => (
                        <CardItem key={index} data={item} type={cardType} />
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} dataType={dataType} />
            </Box>
        </Box>
    );
};

export default GenreList;
