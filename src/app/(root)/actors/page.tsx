import CardItem from "@/components/root/ui/cardItem/CardItem";
import Carousel from "@/components/root/ui/carousel/Carousel";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { Box, Stack, Typography } from "@mui/material";
import { Actor } from "@prisma/client";
import type { Metadata } from "next";
import { getActors } from "@/actions/actor.actions";

interface IActorsProps {
    searchParams?: { actorsAscOrDesc?: string; page?: string; actorsSortBy?: string };
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Check Actors | High-Quality and Always Updated",
    description: "Discover most amazing actors.",
    openGraph: {
        type: "video.other",
        url: `${baseUrl}/actors`,
        title: "Actors",
        description: "Discover the most amazing actors in high quality.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Actors",
        description: "Discover the most amazing actors in high quality.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Actors({ searchParams }: IActorsProps) {
    const ascOrDesc = searchParams?.actorsAscOrDesc ? searchParams?.actorsAscOrDesc : "";
    const page = searchParams?.page ? Number(searchParams?.page) : 1;
    const sortBy = searchParams?.actorsSortBy ? searchParams?.actorsSortBy : "";
    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const actorsData = await getActors(queryParams);
    const actors = actorsData?.actors;
    const actorsCarouselImages: Actor[] = actorsData?.actors!.slice(0, 5);

    const actorsCount = actorsData?.count;
    const pageCount = Math.ceil(actorsCount / 10);

    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, actorsCount);

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
                <Carousel data={actorsCarouselImages} type="actors" />
            </Box>
            <Stack
                display="flex"
                flexDirection="row"
                justifyContent={"space-between"}
                alignItems="center"
                component="section"
                ml={3}
                mr={3}
            >
                <Box display={"flex"} flexDirection={"row"} columnGap={1} alignItems={"center"}>
                    <Typography fontSize={22} variant="h2">
                        Actors
                    </Typography>
                    <Typography variant="h5" pt={0.5}>
                        {startIndex} – {endIndex} of {actorsCount} actors
                    </Typography>
                </Box>
                <Box>
                    <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="actors" />
                </Box>
            </Stack>
            <Box
                component={"section"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 4,
                }}
                pl={5}
                pr={3}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    alignItems={"start"}
                    rowGap={4}
                    columnGap={3}
                    sx={{
                        justifyContent: {
                            xs: "center",
                            sm: "center",
                            md: "start",
                            lg: "start",
                        },
                    }}
                >
                    {actors.map((actor: Actor) => (
                        <Box key={actor.id}>
                            <CardItem data={actor} type="actor" path={"actors"} />
                        </Box>
                    ))}
                </Stack>
                <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
            </Box>
        </Box>
    );
}
