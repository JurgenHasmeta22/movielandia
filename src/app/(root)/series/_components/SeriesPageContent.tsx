import { Box, Stack, Typography } from "@mui/material";
import { Serie } from "@prisma/client";
import { getLatestSeries, getSeriesWithFilters } from "@/actions/serie.actions";
import Carousel from "@/components/root/carousel/Carousel";
import CardItem from "@/components/root/cardItem/CardItem";
import PaginationControl from "@/components/root/paginationControl/PaginationControl";
import { LatestList } from "@/components/root/latestList/LatestList";
import SortSelect from "@/components/root/sortSelect/SortSelect";

interface SeriesPageContentProps {
    searchParams:
        | {
              seriesAscOrDesc?: string;
              pageSeries?: string;
              seriesSortBy?: string;
          }
        | undefined;
    session: any;
}

export default async function SeriesPageContent({ searchParams, session }: SeriesPageContentProps) {
    const ascOrDesc = searchParams?.seriesAscOrDesc ?? "";
    const page = searchParams?.pageSeries ? Number(searchParams.pageSeries) : 1;
    const sortBy = searchParams?.seriesSortBy ?? "";
    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const seriesData = await getSeriesWithFilters(queryParams, Number(session?.user?.id));
    const series = seriesData.rows;
    const seriesCount = seriesData.count;

    const seriesCarouselImages: Serie[] = seriesData.rows.slice(0, 5);
    const latestSeries = await getLatestSeries();

    const itemsPerPage = 12;
    const pageCount = Math.ceil(seriesCount / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, seriesCount);

    return (
        <Box
            component="section"
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4, md: 5 },
            }}
        >
            <Box component="section">
                <Carousel data={seriesCarouselImages} type="series" />
            </Box>
            <Box
                component="section"
                sx={{
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
                            Series
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
                            {startIndex} – {endIndex} of {seriesCount} series
                        </Typography>
                    </Box>
                    <Box>
                        <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="series" />
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
                        {series.map((serie: Serie) => (
                            <CardItem key={serie.id} data={serie} type="serie" />
                        ))}
                    </Stack>
                    <PaginationControl currentPage={Number(page)} pageCount={pageCount} urlParamName="pageSeries" />
                </Box>
            </Box>
            <LatestList data={latestSeries} type="Series" />
        </Box>
    );
}
