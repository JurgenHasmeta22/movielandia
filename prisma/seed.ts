import { PrismaClient } from "@prisma/client";
import { genres, movieGenres, movies, serieGenres, series, users } from "./data";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function createStuff() {
    try {
        await prisma.serieGenre.deleteMany();
        await prisma.movieGenre.deleteMany();
        await prisma.serie.deleteMany();
        await prisma.movie.deleteMany();
        await prisma.genre.deleteMany();
        await prisma.user.deleteMany();

        for (const user of users) {
            await prisma.user.create({ data: user });
        }

        for (const genre of genres) {
            await prisma.genre.create({ data: genre });
        }

        for (const movie of movies) {
            await prisma.movie.create({ data: movie });
        }

        for (const serie of series) {
            await prisma.serie.create({ data: serie });
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

        console.log("Database seeding completed successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createStuff();
