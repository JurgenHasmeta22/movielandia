import CardItem from "@/components/cardItem/CardItem";
import Carousel from "@/components/carousel/Carousel";
import PaginationControl from "@/components/paginationControl/PaginationControl";
import SortSelect from "@/components/sortSelect/SortSelect";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { LatestList } from "@/components/latestList/LatestList";
import movieService from "@/services/movieService";
import { Movie } from "@prisma/client";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Watch the Latest Movies | High-Quality and Always Updated",
    description:
        "Discover and watch the latest and most amazing movies in high quality. Our collection is always updated with the newest episodes and releases.",
};

export default async function Movies({
    searchParams,
}: {
    searchParams?: { moviesAscOrDesc?: string; page?: string; moviesSortBy?: string };
}) {
    const ascOrDesc = searchParams?.moviesAscOrDesc ? searchParams?.moviesAscOrDesc : "";
    const page = searchParams?.page ? Number(searchParams?.page) : 1;
    const sortBy = searchParams?.moviesSortBy ? searchParams?.moviesSortBy : "";
    const queryParams = {
        ascOrDesc,
        page,
        sortBy,
    };

    const moviesData = await movieService.getMovies(queryParams);
    const latestMovies = await movieService.getLatestMovies();
    const movies = moviesData?.movies;
    const moviesCount = moviesData?.count;
    const moviesCarouselImages: Movie[] = moviesData?.movies!.slice(0, 5);

    const pageCount = Math.ceil(moviesCount / 10);

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
                            <Divider sx={{ borderBottomWidth: 3, mt: 1 }} />
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
                            {movies.map((movie: any) => (
                                <CardItem data={movie} type="movie" key={movie.id} />
                            ))}
                        </Stack>
                        <PaginationControl currentPage={Number(page)} pageCount={pageCount} />
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <LatestList data={latestMovies} type="Movies" />
                </Box>
            </Container>
        </>
    );
}
