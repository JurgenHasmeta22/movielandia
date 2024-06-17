import { getGenres } from "@/lib/actions/genre.action";
import { getMovies } from "@/lib/actions/movie.action";
import { getSeries } from "@/lib/actions/serie.action";
import { Genre, Movie, Serie } from "@prisma/client";
import { MetadataRoute } from "next";

type Route = {
    url: string;
    lastModified: string;
};

// const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL
//     ? `https://${process.env.NEXT_PUBLIC_PROJECT_URL}`
//     : "http://localhost:4000";

const baseUrl = "http://localhost:4000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routesMap = [""].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
    }));

    const moviesPromise = getMovies({}).then((moviesData) =>
        moviesData.movies.map((movie: Movie) => ({
            url: `${baseUrl}/movies/${movie.title}`,
        })),
    );

    const seriesPromise = getSeries({}).then((seriesData) =>
        seriesData.rows.map((serie: Serie) => ({
            url: `${baseUrl}/series/${serie.title}`,
        })),
    );

    const genresPromise = getGenres({}).then((genresData) =>
        genresData.rows.map((genre: Genre) => ({
            url: `${baseUrl}/genres/${genre.name}`,
        })),
    );

    let fetchedRoutes: Route[] = [];

    try {
        fetchedRoutes = (await Promise.all([moviesPromise, seriesPromise, genresPromise])).flat();
    } catch (error) {
        throw JSON.stringify(error, null, 2);
    }

    return [...routesMap, ...fetchedRoutes];
}
