import { Stack } from "@mui/material";
import HomeHeroSection from "@/components/root/ui/homeHero/HomeHero";
import ListHomeSection from "@/components/root/ui/listHomeSection/ListHomeSection";
import { Actor, Genre, Movie, Serie } from "@prisma/client";
import { getGenres } from "@/actions/genre.actions";
import { getMovies } from "@/actions/movie.actions";
import { getSeries } from "@/actions/serie.actions";
import type { Metadata } from "next";
import { getActors } from "@/actions/actor.actions";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

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
    const session = await getServerSession(authOptions);
    console.log(session);

    const queryParams = {
        page: 1,
    };

    const moviesData = await getMovies(queryParams, Number(session?.user?.id));
    const movies: Movie[] = moviesData.movies;

    const seriesData = await getSeries(queryParams, Number(session?.user?.id));
    const series: Serie[] = seriesData.rows;

    const genresData = await getGenres(queryParams);
    const genres: Genre[] = genresData.rows;

    const actorsData = await getActors(queryParams, Number(session?.user?.id));
    const actors: Actor[] = actorsData.actors;

    return (
        <>
            <HomeHeroSection />
            <Stack
                flexDirection={"column"}
                rowGap={6}
                sx={{
                    mb: 6,
                    mt: 6,
                }}
            >
                <ListHomeSection
                    key={"movie"}
                    data={movies}
                    type="movie"
                    link="/movies"
                    linkText="Explore all Movies"
                />
                <ListHomeSection
                    key={"serie"}
                    data={series}
                    type="serie"
                    link="/series"
                    linkText="Explore all Series"
                />
                <ListHomeSection
                    key={"genre"}
                    data={genres}
                    type="genre"
                    link="/genres"
                    linkText="Explore all Genres"
                />
                <ListHomeSection
                    key={"actor"}
                    data={actors}
                    type="actor"
                    link="/actors"
                    linkText="Explore all Actors"
                    path="actors"
                />
            </Stack>
        </>
    );
}
