// #region "Imports"
import { PrismaClient } from "@prisma/client";
import { actors } from "./data/actors";
import { crew } from "./data/crew";
import { episodes } from "./data/episodes";
import { genres } from "./data/genres";
import { movies } from "./data/movies";
import { movieGenres, serieGenres, castMovies, castSeries, crewMovies, crewSeries, downvoteCrewReviews, crewReviews, downvoteMovieReviews, movieReviews, upvoteCrewReviews, upvoteMovieReviews } from "./data/relationships";
import { seasons } from "./data/seasons";
import { series } from "./data/series";
import { users } from "./data/users";
// #endregion

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
});

// #region "Utils"
function getRandomRating(): number {
    return Number((Math.random() * (9.9 - 1.0) + 1.0).toFixed(1));
}

function getRandomDate(): string {
    const start = new Date(1950, 0, 1).getTime(); // Jan 1, 1950
    const end = new Date().getTime(); // Today
    const randomTimestamp = Math.floor(Math.random() * (end - start) + start);

    return new Date(randomTimestamp).toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

function getRandomDuration(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// #endregion

// #region "Seeding data"
async function main() {
    // #region "Deleting data"
    await prisma.serieGenre.deleteMany();
    await prisma.movieGenre.deleteMany();

    await prisma.castMovie.deleteMany();
    await prisma.castSerie.deleteMany();
    await prisma.actorReview.deleteMany();
    await prisma.upvoteActorReview.deleteMany();
    await prisma.downvoteActorReview.deleteMany();
    await prisma.actor.deleteMany();

    await prisma.crewMovie.deleteMany();
    await prisma.crewSerie.deleteMany();
    await prisma.crewReview.deleteMany();
    await prisma.upvoteCrewReview.deleteMany();
    await prisma.downvoteCrewReview.deleteMany();
    await prisma.crew.deleteMany();

    await prisma.movieReview.deleteMany();
    await prisma.upvoteMovieReview.deleteMany();
    await prisma.downvoteMovieReview.deleteMany();
    await prisma.userMovieFavorite.deleteMany();
    await prisma.userMovieRating.deleteMany();

    await prisma.serieReview.deleteMany();
    await prisma.upvoteSerieReview.deleteMany();
    await prisma.downvoteSerieReview.deleteMany();
    await prisma.userSerieFavorite.deleteMany();
    await prisma.userSerieRating.deleteMany();

    await prisma.actorReview.deleteMany();
    await prisma.upvoteActorReview.deleteMany();
    await prisma.downvoteActorReview.deleteMany();
    await prisma.userActorFavorite.deleteMany();
    await prisma.userActorRating.deleteMany();

    await prisma.crewReview.deleteMany();
    await prisma.upvoteCrewReview.deleteMany();
    await prisma.downvoteCrewReview.deleteMany();
    await prisma.userCrewFavorite.deleteMany();
    await prisma.userCrewRating.deleteMany();

    await prisma.episodeReview.deleteMany();
    await prisma.upvoteEpisodeReview.deleteMany();
    await prisma.downvoteEpisodeReview.deleteMany();
    await prisma.userEpisodeFavorite.deleteMany();
    await prisma.userEpisodeRating.deleteMany();

    await prisma.seasonReview.deleteMany();
    await prisma.upvoteSeasonReview.deleteMany();
    await prisma.downvoteSeasonReview.deleteMany();
    await prisma.userSeasonFavorite.deleteMany();
    await prisma.userSeasonRating.deleteMany();

    await prisma.userFollow.deleteMany();

    await prisma.listMovie.deleteMany();
    await prisma.listSerie.deleteMany();
    await prisma.listSeason.deleteMany();
    await prisma.listEpisode.deleteMany();
    await prisma.listActor.deleteMany();
    await prisma.listCrew.deleteMany();
    await prisma.list.deleteMany();

    await prisma.season.deleteMany();
    await prisma.serie.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.episode.deleteMany();
    await prisma.user.deleteMany();
    // #endregion

    // #region "User data stuff"
    const createdUsers = [];

    for (let i = 1; i <= 10; i++) {
        const user = await prisma.user.create({
            data: {
                id: i,
                userName: `user${i}`,
                email: `user${i}@example.com`,
                password: "hashedpassword123",
                role: i === 1 ? "Admin" : "User",
                bio: `I'm user ${i}, a movie enthusiast!`,
                age: 20 + i,
                birthday: new Date(1990 + i, 0, 1),
                gender: i % 2 === 0 ? "Male" : "Female",
                countryFrom: "United States",
                active: true,
            }
        });

        createdUsers.push(user);
    }

    for (const user of createdUsers) {
        const otherUsers = createdUsers.filter(u => u.id !== user.id);
        const randomUsers = otherUsers.sort(() => 0.5 - Math.random()).slice(0, 3);

        for (const followedUser of randomUsers) {
            await prisma.userFollow.create({
                data: {
                    followerId: user.id,
                    followingId: followedUser.id,
                    state: "accepted"
                }
            });
        }
    }

    for (const user of createdUsers) {
        for (let movieId = 1; movieId <= 5; movieId++) {
            await prisma.userMovieRating.create({
                data: {
                    userId: user.id,
                    movieId,
                    rating: getRandomRating()
                }
            });

            if (Math.random() > 0.5) {
                await prisma.userMovieFavorite.create({
                    data: {
                        userId: user.id,
                        movieId
                    }
                });
            }
        }

        for (let movieId = 1; movieId <= 3; movieId++) {
            const review = await prisma.movieReview.create({
                data: {
                    userId: user.id,
                    movieId,
                    content: `Review for movie ${movieId} by user ${user.id}`,
                    rating: getRandomRating(),
                    createdAt: new Date()
                }
            });

            const otherUsers = createdUsers.filter(u => u.id !== user.id);

            for (const voter of otherUsers.slice(0, 2)) {
                if (Math.random() > 0.5) {
                    await prisma.upvoteMovieReview.create({
                        data: {
                            userId: voter.id,
                            movieId,
                            movieReviewId: review.id
                        }
                    });
                } else {
                    await prisma.downvoteMovieReview.create({
                        data: {
                            userId: voter.id,
                            movieId,
                            movieReviewId: review.id
                        }
                    });
                }
            }
        }

        const list = await prisma.list.create({
            data: {
                userId: user.id,
                name: `${user.userName}'s Watchlist`,
                description: "My favorite movies and shows",
                contentType: "movie",
                isPrivate: false
            }
        });

        for (let movieId = 1; movieId <= 3; movieId++) {
            await prisma.listMovie.create({
                data: {
                    listId: list.id,
                    movieId,
                    userId: user.id,
                    note: `Added movie ${movieId} to watchlist`
                }
            });
        }
    }
    // #endregion

    // #region "Base seeding data"
    // for (const user of users) {
    //     // @ts-ignore
    //     await prisma.user.create({ data: user });
    // }

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
        await prisma.actor.create({ data: actor });
    }

    for (const crewMember of crew) {
        await prisma.crew.create({ data: crewMember });
    }

    for (const movieGenre of movieGenres) {
        await prisma.movieGenre.create({ data: movieGenre });
    }

    for (const serieGenre of serieGenres) {
        await prisma.serieGenre.create({ data: serieGenre });
    }

    for (const castMovie of castMovies) {
        await prisma.castMovie.create({ data: castMovie });
    }

    for (const castSerie of castSeries) {
        await prisma.castSerie.create({ data: castSerie });
    }

    for (const crewMovie of crewMovies) {
        await prisma.crewMovie.create({ data: crewMovie });
    }

    for (const crewSerie of crewSeries) {
        await prisma.crewSerie.create({ data: crewSerie });
    }

    for (const movieReviewsData of movieReviews) {
        await prisma.movieReview.create({ data: movieReviewsData });
    }

    for (const upvoteMovieReviewsData of upvoteMovieReviews) {
        await prisma.upvoteMovieReview.create({ data: upvoteMovieReviewsData });
    }

    for (const downvoteMovieReviewsData of downvoteMovieReviews) {
        await prisma.downvoteMovieReview.create({ data: downvoteMovieReviewsData });
    }

    for (const crewReviewsData of crewReviews) {
        await prisma.crewReview.create({ data: crewReviewsData });
    }

    for (const upvoteCrewReviewsData of upvoteCrewReviews) {
        await prisma.upvoteCrewReview.create({ data: upvoteCrewReviewsData });
    }

    for (const downvoteCrewReviewsData of downvoteCrewReviews) {
        await prisma.downvoteCrewReview.create({ data: downvoteCrewReviewsData });
    }
    // #endregion
}
// #endregion

main()
    .then(async () => {
        console.log("Database seeding completed successfully.");
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })