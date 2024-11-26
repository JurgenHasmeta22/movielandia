import { Stack, Box, Container } from "@mui/material";
import { Genre, Movie, Serie } from "@prisma/client";
import { getGenresWithFilters } from "@/actions/genre.actions";
import { getMoviesWithFilters } from "@/actions/movie.actions";
import { getSeriesWithFilters } from "@/actions/serie.actions";
import type { Metadata } from "next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import HomeHeroSection from "./(home)/_components/HomeHero";
import ListHomeSection from "./(home)/_components/ListHomeSection";
import MarketingSection from "./(home)/_components/MarketingSection";
import NewsletterSection from "./(home)/_components/NewsletterSection";

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

    const queryParams = {
        page: 1,
    };

    const moviesData = await getMoviesWithFilters(queryParams, Number(session?.user?.id));
    const movies: Movie[] = moviesData.movies;

    const seriesData = await getSeriesWithFilters(queryParams, Number(session?.user?.id));
    const series: Serie[] = seriesData.rows;

    const genresData = await getGenresWithFilters(queryParams);
    const genres: Genre[] = genresData.rows;

    return (
        <Box
            component="main"
            sx={{
                width: "100%",
                overflow: "hidden",
            }}
        >
            <HomeHeroSection />
            <MarketingSection />
            <NewsletterSection />
            <Container
                maxWidth="xl"
                sx={{
                    py: { xs: 2, md: 3 },
                }}
            >
                <Stack spacing={{ xs: 4, md: 5 }}>
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
                </Stack>
            </Container>
        </Box>
    );
}
