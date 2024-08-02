import CardItem from "@/components/root/ui/cardItem/CardItem";
import Carousel from "@/components/root/ui/carousel/Carousel";
import PaginationControl from "@/components/root/features/paginationControl/PaginationControl";
import SortSelect from "@/components/root/features/sortSelect/SortSelect";
import { Box, Container, Stack, Typography } from "@mui/material";
import { LatestList } from "@/components/root/ui/latestList/LatestList";
import { Movie } from "@prisma/client";
import type { Metadata } from "next";
import { getMovies, getLatestMovies } from "@/lib/actions/movie.actions";
import DividerLine from "@/components/root/ui/dividerLine/DividerLine";
import { Suspense } from "react";

interface IMoviesProps {
    searchParams?: { moviesAscOrDesc?: string; page?: string; moviesSortBy?: string };
}

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const metadata: Metadata = {
    title: "Watch the Latest Movies | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing movies in high quality. Our collection is always updated with the newest episodes and releases.",
    openGraph: {
        type: "video.other",
        url: `${baseUrl}/movies`,
        title: "Watch the Latest Movies | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing movies in high quality. Our collection is always updated with the newest episodes and releases.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "Watch the Latest Movies | High-Quality and Always Updated",
        description:
            "Discover and watch the latest and most amazing movies in high quality. Our collection is always updated with the newest episodes and releases.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function Movies({ searchParams }: IMoviesProps) {
    const ascOrDesc = searchParams?.moviesAscOrDesc ? searchParams?.moviesAscOrDesc : "";
    const page = searchParams?.page ? Number(searchParams?.page) : 1;
    const sortBy = searchParams?.moviesSortBy ? searchParams?.moviesSortBy : "";
    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const moviesData = await getMovies(queryParams);
    const latestMovies = await getLatestMovies();
    const movies = moviesData?.movies;
    const moviesCarouselImages: Movie[] = moviesData?.movies!.slice(0, 5);

    const moviesCount = moviesData?.count;
    const pageCount = Math.ceil(moviesCount / 10);

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
                    <Carousel data={moviesCarouselImages} type="movies" />
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
                            Movies
                        </Typography>
                    </Box>
                    <Box mr={1}>
                        <SortSelect sortBy={sortBy} ascOrDesc={ascOrDesc} type="list" dataType="movies" />
                    </Box>
                </Stack>
                <Box
                    component={"section"}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 4,
                    }}
                >
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        // justifyContent={{ xs: "center", sm: "center", md: "start", lg: "start" }}
                        justifyContent="center"
                        alignItems={"start"}
                        alignContent={"start"}
                        rowGap={8}
                        columnGap={4}
                    >
                        {movies.map((movie: Movie) => (
                            <CardItem data={movie} type="movie" key={movie.id} />
                        ))}
                    </Stack>
                    <Suspense>
                        <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
                    </Suspense>
                </Box>
                <DividerLine />
                <LatestList data={latestMovies} type="Movies" />
            </Box>
        </Container>
    );
}
