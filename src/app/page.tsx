import { Container, Stack } from "@mui/material";
import HomeHeroSection from "@/components/homeHero/HomeHero";
import ListHomeSection from "@/components/listHomeSection/ListHomeSection";
import movieService from "@/services/movieService";
import genreService from "@/services/genreService";
import serieService from "@/services/serieService";
import { Genre, Movie, Serie } from "@prisma/client";

export default async function Home() {
    const queryParams = {
        page: 1,
    };

    const queryParamsGenres = {
        page: 1,
    };

    const moviesData = await movieService.getMovies(queryParams);
    const seriesData = await serieService.getSeries(queryParams);
    const genresData = await genreService.getGenres(queryParamsGenres);

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
