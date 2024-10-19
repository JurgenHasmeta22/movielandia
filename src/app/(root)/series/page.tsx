import CardItem from "@/components/root/ui/cardItem/CardItem";
import Carousel from "@/components/root/ui/carousel/Carousel";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { Box, Stack, Typography } from "@mui/material";
import { LatestList } from "@/components/root/ui/latestList/LatestList";
import { Serie } from "@prisma/client";
import type { Metadata } from "next";
import { getLatestSeries, getSeriesWithFilters } from "@/actions/serie.actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

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
    const session = await getServerSession(authOptions);

    const ascOrDesc = searchParams && searchParams.seriesAscOrDesc ? searchParams.seriesAscOrDesc : "";
    const page = searchParams && searchParams.page ? Number(searchParams.page) : 1;
    const sortBy = searchParams && searchParams.seriesSortBy ? searchParams.seriesSortBy : "";

    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const seriesData = await getSeriesWithFilters(queryParams, Number(session?.user?.id));
    const series = seriesData.rows;

    const latestSeries = await getLatestSeries();
    const seriesCount = seriesData.count;
    const seriesCarouselImages: Serie[] = seriesData.rows.slice(0, 5);
    const pageCount = Math.ceil(seriesCount / 10);

    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, seriesCount);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
            }}
            component={"section"}
        >
            <Box component={"section"}>
                <Carousel data={seriesCarouselImages} type="series" />
            </Box>
            <Stack
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent={"space-between"}
                alignItems={{ xs: "flex-start", sm: "center" }}
                component="section"
                sx={{
                    ml: 3,
                    mr: 3,
                    rowGap: { xs: 2, sm: 0 },
                    flexWrap: "wrap",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    columnGap={1}
                    textAlign={{ xs: "left", sm: "center" }}
                >
                    <Typography fontSize={26} fontWeight={800}>
                        Series
                    </Typography>
                    <Typography variant="h5" sx={{ pt: 0.5 }}>
                        {startIndex} – {endIndex} of {seriesCount} series
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", sm: "flex-end" },
                        alignItems: "center",
                        mt: { xs: 2, sm: 0 },
                    }}
                >
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="series" />
                </Box>
            </Stack>
            <Box
                component={"section"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                    pl: 5,
                    pr: 3,
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems={"start"}
                    columnGap={5}
                    rowGap={5}
                    sx={{
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "start",
                            lg: "start",
                        },
                    }}
                >
                    {series.map((serie: Serie) => (
                        <CardItem data={serie} type="serie" key={serie.id} />
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
            </Box>
            <LatestList data={latestSeries} type="Series" />
        </Box>
    );
}
