import CardItem from "@/components/root/ui/cardItem/CardItem";
import Carousel from "@/components/root/ui/carousel/Carousel";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { Box, Container, Stack, Typography } from "@mui/material";
import { LatestList } from "@/components/root/ui/latestList/LatestList";
import { Serie } from "@prisma/client";
import type { Metadata } from "next";
import { getSeries, getLatestSeries } from "@/lib/actions/serie.action";
import DividerLine from "@/components/root/ui/dividerLine/DividerLine";
import { Suspense } from "react";

interface ISeriesProps {
    searchParams?: { seriesAscOrDesc?: string; page?: string; seriesSortBy?: string };
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Watch the Latest Series | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
    openGraph: {
        type: "video.tv_show",
        url: `${baseUrl}/series`,
        title: "Watch the Latest Series | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Watch the Latest Series | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing series in high quality. Our collection is always updated with the newest episodes and releases.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Series({ searchParams }: ISeriesProps) {
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
                        <DividerLine />
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
                    <Suspense>
                        <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
                    </Suspense>
                </Box>
                <DividerLine />
                <LatestList data={latestSeries} type="Series" />
            </Box>
        </Container>
    );
}
