import { PrismaClient } from "@prisma/client";
import { episodes } from "./data/episodes";
import { persons } from "./data/persons";
import { genres } from "./data/genres";
import { movies } from "./data/movies";
import { movieGenres, serieGenres, personSeries, personMovies, downvotePersonReviews, personReviews, downvoteMovieReviews, movieReviews, upvoteMovieReviews } from "./data/relationships";
import { seasons } from "./data/seasons";
import { series } from "./data/series";
import { users } from "./data/users";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

async function createStuff() {
    try {
        await prisma.serieGenre.deleteMany();
        await prisma.movieGenre.deleteMany();
        await prisma.personMovie.deleteMany();
        await prisma.personSerie.deleteMany();
        await prisma.person.deleteMany();
        await prisma.personReview.deleteMany();
        await prisma.upvotePersonReview.deleteMany();
        await prisma.downvotePersonReview.deleteMany();
        await prisma.movieReview.deleteMany();
        await prisma.upvoteMovieReview.deleteMany();
        await prisma.downvoteMovieReview.deleteMany();
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

        for (const person of persons) {
            await prisma.person.create({
                data: person,
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

        for (const personMovie of personMovies) {
            await prisma.personMovie.create({
                data: personMovie,
            });
        }

        for (const personSerie of personSeries) {
            await prisma.personSerie.create({
                data: personSerie,
            });
        }

        for (const personMovie of personMovies) {
            await prisma.personMovie.create({
                data: personMovie,
            });
        }

        for (const personSerie of personSeries) {
            await prisma.personSerie.create({
                data: personSerie,
            });
        }

        for (const movieReviewsData of movieReviews) {
            await prisma.movieReview.create({
                data: movieReviewsData,
            });
        }

        for (const upvoteMovieReviewsData of upvoteMovieReviews) {
            await prisma.upvoteMovieReview.create({
                data: upvoteMovieReviewsData,
            });
        }

        for (const downvoteMovieReviewsData of downvoteMovieReviews) {
            await prisma.downvoteMovieReview.create({
                data: downvoteMovieReviewsData,
            });
        }

        for (const personReviewsData of personReviews) {
            await prisma.personReview.create({
                data: personReviewsData,
            });
        }

        for (const personReviewsData of personReviews) {
            await prisma.personReview.create({
                data: personReviewsData,
            });
        }

        for (const downvotePersonReviewsData of downvotePersonReviews) {
            await prisma.downvotePersonReview.create({
                data: downvotePersonReviewsData,
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
