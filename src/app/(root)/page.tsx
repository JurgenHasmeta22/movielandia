import { Stack } from "@mui/material";
import HomeHeroSection from "@/components/root/ui/homeHero/HomeHero";
import ListHomeSection from "@/components/root/ui/listHomeSection/ListHomeSection";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenres } from "@/lib/actions/genre.actions";
import { getMovies } from "@/lib/actions/movie.actions";
import { getSeries } from "@/lib/actions/serie.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MovieLandia24 - Your Ultimate Destination for Movies",
    description:
        "Welcome to MovieLandia24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
    openGraph: {
        type: "video.tv_show",
        url: process.env.NEXT_PUBLIC_PROJECT_URL,
        title: "MovieLandia24 - Your Ultimate Destination for Movies",
        description:
            "Welcome to MovieLandia24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
        siteName: "MovieLandia24",
    },
    twitter: {
        card: "summary_large_image",
        site: "@movieLandia24",
        creator: "movieLandia24",
        title: "MovieLandia24 - Your Ultimate Destination for Movies",
        description:
            "Welcome to MovieLandia24 - your ultimate destination for movies. Discover a vast collection of movies and enjoy streaming your favorites.",
    },
    robots: {
        index: true,
        follow: true,
    },
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

    const movies: Movie = moviesData?.movies.slice(0, 6);
    const series: Serie = seriesData?.rows.slice(0, 6);
    const genres: Genre = genresData?.rows.slice(0, 6);

    return (
        <>
            <HomeHeroSection />
            <Stack flexDirection={"column"} rowGap={6} mb={6} mt={6}>
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
        </>
    );
}
