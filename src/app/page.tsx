import { Container, Stack } from "@mui/material";
import HomeHeroSection from "@/components/homeHero/HomeHero";
import ListHomeSection from "@/components/listHomeSection/ListHomeSection";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenres } from "@/lib/actions/genre.action";
import { getMovies } from "@/lib/actions/movie.action";
import { getSeries } from "@/lib/actions/serie.action";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MovieLand24 - Your Ultimate Destination for Movies",
    description:
        "Welcome to MovieLand24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
};

export default async function Home() {
    const queryParams = {
        page: 1,
    };

    const queryParamsGenres = {
        page: 1,
    };

    const moviesData = await getMovies(queryParams);
    const seriesData = await getSeries(queryParams);
    const genresData = await getGenres(queryParamsGenres);

    const movies: Movie = moviesData?.movies.slice(0, 5);
    const series: Serie = seriesData?.rows.slice(0, 5);
    const genres: Genre = genresData?.rows.slice(0, 5);

    return (
        <>
            <HomeHeroSection />
            <Container>
                <Stack flexDirection={"column"} rowGap={10} mb={6} mt={6}>
                    <ListHomeSection
                        key={"movie"}
                        data={movies}
                        type="movie"
                        link="/movies"
                        linkText="Explore All Movies"
                    />
                    <ListHomeSection
                        key={"serie"}
                        data={series}
                        type="serie"
                        link="/series"
                        linkText="Explore All Series"
                    />
                    <ListHomeSection
                        key={"genre"}
                        data={genres}
                        type="genre"
                        link="/genres"
                        linkText="Explore All Genres"
                    />
                </Stack>
            </Container>
        </>
    );
}
