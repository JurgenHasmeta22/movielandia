import { PrismaClient } from "@prisma/client";
import {
    genres,
    movieGenres,
    movies,
    serieGenres,
    series,
    users,
    episodes,
    seasons,
    castMovies,
    castSeries,
    actors,
} from "./data";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function createStuff() {
    try {
        await prisma.serieGenre.deleteMany();
        await prisma.movieGenre.deleteMany();
        await prisma.castMovie.deleteMany();
        await prisma.castSerie.deleteMany();
        await prisma.actor.deleteMany();
        await prisma.season.deleteMany();
        await prisma.serie.deleteMany();
        await prisma.movie.deleteMany();
        await prisma.genre.deleteMany();
        await prisma.episode.deleteMany();
        await prisma.user.deleteMany();

        for (const user of users) {
            await prisma.user.create({ data: user });
        }

        for (const genre of genres) {
            await prisma.genre.create({ data: genre });
        }

        for (const serie of series) {
            await prisma.serie.create({ data: serie });
        }

        for (const movie of movies) {
            await prisma.movie.create({ data: movie });
        }

        for (const season of seasons) {
            await prisma.season.create({ data: season });
        }

        for (const episode of episodes) {
            await prisma.episode.create({ data: episode });
        }

        for (const actor of actors) {
            await prisma.actor.create({
                data: actor,
            });
        }

        for (const movieGenre of movieGenres) {
            await prisma.movieGenre.create({
                data: movieGenre,
            });
        }

        for (const serieGenre of serieGenres) {
            await prisma.serieGenre.create({
                data: serieGenre,
            });
        }

        for (const castMovie of castMovies) {
            await prisma.castMovie.create({
                data: castMovie,
            });
        }

        for (const castSerie of castSeries) {
            await prisma.castSerie.create({
                data: castSerie,
            });
        }

        console.log("Database seeding completed successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createStuff();
