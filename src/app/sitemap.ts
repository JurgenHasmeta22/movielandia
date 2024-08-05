import { getActorsAll } from "@/lib/actions/actor.actions";
import { getEpisodesAll } from "@/lib/actions/episode.actions";
import { getGenresAll } from "@/lib/actions/genre.actions";
import { getMoviesAll } from "@/lib/actions/movie.actions";
import { getSeasonsAll } from "@/lib/actions/season.actions";
import { getSeriesAll } from "@/lib/actions/serie.actions";
import { Actor, Episode, Genre, Movie, Season, Serie } from "@prisma/client";
import { MetadataRoute } from "next";

type Route = {
    url: string;
    lastModified: string;
};

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routesMap = [""].map((route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly",
    }));

    const moviesPromise = getMoviesAll().then((movies) =>
        movies.map((movie: Movie) => ({
            url: `${baseUrl}/movies/${movie.title}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
        })),
    );

    const seriesPromise = getSeriesAll().then((series) =>
        series.map((serie: Serie) => ({
            url: `${baseUrl}/series/${serie.title}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
        })),
    );

    const genresPromise = getGenresAll().then((genres) =>
        genres.map((genre: Genre) => ({
            url: `${baseUrl}/genres/${genre.name}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
        })),
    );

    const seasonsPromise = getSeasonsAll().then((seasons) =>
        seasons.map((season: Season) => ({
            url: `${baseUrl}/seasons/${season.title}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
        })),
    );

    const episodesPromise = getEpisodesAll().then((episodes) =>
        episodes.map((episode: Episode) => ({
            url: `${baseUrl}/episodes/${episode.title}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
        })),
    );

    const actorsPromise = getActorsAll().then((actors) =>
        actors.map((actor: Actor) => ({
            url: `${baseUrl}/actors/${actor.fullname}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "weekly",
        })),
    );

    let fetchedRoutes: Route[] = [];

    try {
        fetchedRoutes = (
            await Promise.all([
                moviesPromise,
                seriesPromise,
                genresPromise,
                seasonsPromise,
                episodesPromise,
                actorsPromise,
            ])
        ).flat();
    } catch (error) {
        throw JSON.stringify(error, null, 2);
    }

    return [...routesMap, ...fetchedRoutes];
}
