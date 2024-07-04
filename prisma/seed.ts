import { prisma } from "@/lib/prisma";
import { genres, movieGenres, movies, serieGenres, series } from "./data";

async function createStuff() {
    await prisma.serie.deleteMany();

    for (const serie of series) {
        await prisma.serie.create({ data: serie });
    }

    await prisma.user.deleteMany();

    for (const user of users) {
        await prisma.user.create({ data: user });
    }

    await prisma.genre.deleteMany();

    for (const genre of genres) {
        await prisma.genre.create({ data: genre });
    }

    await prisma.movie.deleteMany();

    for (const movie of movies) {
        await prisma.movie.create({
            data: movie,
        });
    }

    await prisma.movieGenre.deleteMany();

    for (const movieGenre of movieGenres) {
        await prisma.movieGenre.create({
            data: { genreId: movieGenre.genreId, movieId: movieGenre.movieId },
        });
    }

    await prisma.serieGenre.deleteMany();

    for (const serieGenre of serieGenres) {
        await prisma.serieGenre.create({
            data: { genreId: serieGenre.genreId, serieId: serieGenre.serieId },
        });
    }
}

createStuff();
