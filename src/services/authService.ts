// import bcrypt from 'bcryptjs';
// import { prisma } from '../app';
// import { User } from '@prisma/client';

// const authService = {
//     async signUp(userData: { email: string; password: string; userName: string }): Promise<User | null> {
//         const { email, password, userName } = userData;

//         const existingUser: User | null = await prisma.user.findUnique({
//             where: { email },
//         });

//         if (existingUser) {
//             return null;
//         } else {
//             const hash = bcrypt.hashSync(password);
//             const user: User | null = await prisma.user.create({
//                 data: { email, password: hash, userName },
//                 include: {
//                     favMovies: { include: { movie: true } },
//                     favSeries: { include: { serie: true } },
//                     movieReviews: { include: { movie: true } },
//                     serieReviews: { include: { serie: true } },
//                     upvotedMovies: { include: { movieReview: true, movie: true } },
//                     downvotedMovies: { include: { movieReview: true, movie: true } },
//                     upvotedSeries: { include: { serieReview: true, serie: true } },
//                     downvotedSeries: { include: { serieReview: true, serie: true } },
//                 },
//             });

//             if (user) {
//                 return user;
//             } else {
//                 return null;
//             }
//         }
//     },

//     async login(email: string, password: string): Promise<User | null> {
//         const user: User | null = await prisma.user.findUnique({
//             where: { email },
//             include: {
//                 favMovies: { include: { movie: true } },
//                 favSeries: { include: { serie: true } },
//                 movieReviews: { include: { movie: true } },
//                 serieReviews: { include: { serie: true } },
//                 upvotedMovies: { include: { movieReview: true, movie: true } },
//                 downvotedMovies: { include: { movieReview: true, movie: true } },
//                 upvotedSeries: { include: { serieReview: true, serie: true } },
//                 downvotedSeries: { include: { serieReview: true, serie: true } },
//             },
//         });

//         if (user) {
//             const passwordMatches: boolean = bcrypt.compareSync(password, user.password);

//             if (passwordMatches) {
//                 return user;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
// };

// export default authService;
