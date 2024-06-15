import CardItem from "@/components/cardItem/CardItem";
import Carousel from "@/components/carousel/Carousel";
import PaginationControl from "@/components/paginationControl/PaginationControl";
import SortSelect from "@/components/sortSelect/SortSelect";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { LatestList } from "@/components/latestList/LatestList";
import { Serie } from "@prisma/client";
import type { Metadata } from "next";
import { getSeries, getLatestSeries } from "@/lib/actions/serie.action";

export const metadata: Metadata = {
    title: "Watch the Latest Series | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
};

export default async function Series({
    searchParams,
}: {
    searchParams?: { seriesAscOrDesc?: string; page?: string; seriesSortBy?: string };
}) {
    const ascOrDesc = searchParams?.seriesAscOrDesc ? searchParams?.seriesAscOrDesc : "";
    const page = searchParams?.page ? Number(searchParams?.page) : 1;
    const sortBy = searchParams?.seriesSortBy ? searchParams?.seriesSortBy : "";
    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const seriesData = await getSeries(queryParams);
    const latestSeries = await getLatestSeries();
    const series = seriesData?.rows;
    const seriesCount = seriesData?.count;
    const seriesCarouselImages: Serie[] = seriesData?.rows!.slice(0, 5);

    const pageCount = Math.ceil(seriesCount / 10);

    return (
        <>
            <Container>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        rowGap: 4,
                        paddingTop: 4,
                    }}
                    component={"section"}
                >
                    <Box mt={4} component={"section"}>
                        <Carousel data={seriesCarouselImages} type="series" />
                    </Box>
                    <Stack
                        display="flex"
                        flexDirection="row"
                        justifyContent={"space-between"}
                        alignItems="center"
                        component="section"
                    >
                        <Box ml={1}>
                            <Typography fontSize={28} variant="h2">
                                Series
                            </Typography>
                            <Divider sx={{ borderBottomWidth: 3, mt: 1 }} />
                        </Box>
                        <Box mr={1}>
                            <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="series" />
                        </Box>
                    </Stack>
                    <Box
                        component={"section"}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            placeItems: "center",
                            placeContent: "center",
                            rowGap: 4,
                        }}
                    >
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent={"center"}
                            alignContent={"center"}
                            rowGap={8}
                            columnGap={4}
                        >
                            {series.map((serie: any) => (
                                <CardItem data={serie} type="serie" key={serie.id} />
                            ))}
                        </Stack>
                        <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <LatestList data={latestSeries} type="Series" />
                </Box>
            </Container>
        </>
    );
}
