import { getActorsAll } from "@/actions/actor.actions";
import { getEpisodesAll } from "@/actions/episode.actions";
import { getGenresAll } from "@/actions/genre.actions";
import { getMoviesAll } from "@/actions/movie.actions";
import { getSeasonsAll } from "@/actions/season.actions";
import { getSeriesAll } from "@/actions/serie.actions";
import { Actor, Episode, Genre, Movie, Season, Serie } from "@prisma/client";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urls: any[] = [];

    const movies = await getMoviesAll();
    const series = await getSeriesAll();
    const genres = await getGenresAll();
    const seasons = await getSeasonsAll();
    const episodes = await getEpisodesAll();
    const actors = await getActorsAll();

    urls.push({
        url: `${baseUrl}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    });

    urls.push({
        url: `${baseUrl}/movies`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    });

    urls.push({
        url: `${baseUrl}/series`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    });

    urls.push({
        url: `${baseUrl}/seasons`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    });

    urls.push({
        url: `${baseUrl}/genres`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    });

    urls.push({
        url: `${baseUrl}/episodes`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 1,
    });

    urls.push({
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    });

    urls.push({
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    });

    urls.push({
        url: `${baseUrl}/profile`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    });

    urls.push({
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
    });

    movies.forEach((movie: Movie) => {
        urls.push({
            url: `${baseUrl}/movies/${movie.id}/${movie.title}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        });
    });

    series.forEach((serie: Serie) => {
        urls.push({
            url: `${baseUrl}/series/${serie.id}/${serie.title}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        });
    });

    genres.forEach((genre: Genre) => {
        urls.push({
            url: `${baseUrl}/genres/${genre.id}/${genre.name}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        });
    });

    seasons.forEach((season: Season) => {
        urls.push({
            url: `${baseUrl}/seasons/${season.id}/${season.title}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        });
    });

    episodes.forEach((episode: Episode) => {
        urls.push({
            url: `${baseUrl}/episodes/${episode.id}/${episode.title}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        });
    });

    actors.forEach((actor: Actor) => {
        urls.push({
            url: `${baseUrl}/actors/${actor.id}/${actor.fullname}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        });
    });

    return urls;
}
