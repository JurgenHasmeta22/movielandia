// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { series, seasons, episodes, movies, movieGenres, serieGenres } from './movies';

// const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
// });

// async function createStuff() {
//     // await prisma.serie.deleteMany();

//     // for (const serie of series) {
//     //     await prisma.serie.create({ data: serie });
//     // }

//     // await prisma.season.deleteMany();

//     // for (const season of seasons) {
//     //     await prisma.season.create({ data: season });
//     // }

//     // await prisma.episode.deleteMany();

//     // for (const episode of episodes) {
//     //     await prisma.episode.create({ data: episode });
//     // }

//     // await prisma.user.deleteMany();

//     // for (const user of users) {
//     //   await prisma.user.create({ data: user });
//     // }

//     // await prisma.genre.deleteMany();

//     // for (const genre of genres) {
//     //   await prisma.genre.create({ data: genre });
//     // }

//     // await prisma.movie.deleteMany();

//     // for (const movie of movies) {
//     //     await prisma.movie.create({
//     //         data: movie,
//     //     });
//     // }

//     // await prisma.movieGenre.deleteMany();

//     // for (const movieGenre of movieGenres) {
//     //     await prisma.movieGenre.create({
//     //         data: { genreId: movieGenre.genreId, movieId: movieGenre.movieId },
//     //     });
//     // }

//     // await prisma.serieGenre.deleteMany();

//     for (const serieGenre of serieGenres) {
//         await prisma.serieGenre.create({
//             data: { genreId: serieGenre.genreId, serieId: serieGenre.serieId },
//         });
//     }
// }

// createStuff();
