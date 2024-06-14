// import { Prisma, User } from '@prisma/client';
// import { prisma } from '../app';

// interface UserModelParams {
//     sortBy: string;
//     ascOrDesc: 'asc' | 'desc';
//     perPage: number;
//     page: number;
//     userName?: string | null;
//     filterValue?: number | string;
//     filterNameString?: string | null;
//     filterOperatorString?: '>' | '=' | '<' | 'gt' | 'equals' | 'lt';
// }

// const userModel = {
//     // #region "CRUD"
//     async getUsers({
//         sortBy,
//         ascOrDesc,
//         perPage,
//         page,
//         userName,
//         filterValue,
//         filterNameString,
//         filterOperatorString,
//     }: UserModelParams): Promise<any | null> {
//         const filters: Prisma.UserWhereInput = {};
//         const skip = perPage ? (page ? (page - 1) * perPage : 0) : page ? (page - 1) * 20 : 0;
//         const take = perPage || 20;

//         if (userName) filters.userName = { contains: userName };

//         if (filterValue !== undefined && filterNameString && filterOperatorString) {
//             const operator = filterOperatorString === '>' ? 'gt' : filterOperatorString === '<' ? 'lt' : 'equals';
//             (filters[filterNameString as keyof Prisma.UserWhereInput] as any) = { [operator]: filterValue };
//         }

//         const orderByObject: any = {};

//         if (sortBy && ascOrDesc) {
//             orderByObject[sortBy] = ascOrDesc;
//         }

//         const users = await prisma.user.findMany({
//             where: filters,
//             orderBy: orderByObject,
//             skip,
//             take,
//         });

//         const count = await prisma.user.count();

//         if (users) {
//             return { rows: users, count };
//         } else {
//             return null;
//         }
//     },
//     async getUserById(userId: number): Promise<User | null> {
//         const result = await prisma.user.findUnique({
//             where: { id: userId },
//         });

//         if (result) {
//             return result;
//         } else {
//             return null;
//         }
//     },
//     async getUserByUsername(username: string): Promise<User | null> {
//         const result = await prisma.user.findFirst({
//             where: { userName: username },
//         });

//         if (result) {
//             return result;
//         } else {
//             return null;
//         }
//     },
//     async updateUserById(userParam: Prisma.UserUpdateInput, id: string): Promise<User | null> {
//         const result = await prisma.user.update({
//             where: { id: Number(id) },
//             data: userParam,
//         });

//         if (result) {
//             return result;
//         } else {
//             return null;
//         }
//     },
//     async deleteUserById(id: number): Promise<string | null> {
//         const user = await prisma.user.findUnique({
//             where: { id },
//         });

//         if (user) {
//             await prisma.user.delete({
//                 where: { id },
//             });
//             return 'User deleted successfully';
//         } else {
//             return null;
//         }
//     },
//     async searchUsersByUsername(username: string, page: number): Promise<User[] | null> {
//         const result = await prisma.user.findMany({
//             where: {
//                 userName: { contains: username },
//             },
//             skip: page ? (page - 1) * 20 : 0,
//             take: 20,
//         });

//         if (result) {
//             return result;
//         } else {
//             return null;
//         }
//     },
//     // #endregion

//     // #region "Bookmarks"
//     async addFavoriteSerieToUser(userId: number, serieId: number): Promise<User | null> {
//         const existingFavorite = await prisma.userSerieFavorite.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }],
//             },
//         });

//         if (existingFavorite) {
//             return null;
//         }

//         await prisma.userSerieFavorite.create({
//             data: { userId, serieId },
//         });

//         const user = await prisma.user.findUnique({
//             where: { id: userId },
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
//             return user;
//         } else {
//             return null;
//         }
//     },
//     async addFavoriteMovieToUser(userId: number, movieId: number): Promise<User | null> {
//         const existingFavorite = await prisma.userMovieFavorite.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }],
//             },
//         });

//         if (existingFavorite) {
//             return null;
//         }

//         await prisma.userMovieFavorite.create({
//             data: { userId, movieId },
//         });

//         const user = await prisma.user.findUnique({
//             where: { id: userId },
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
//             return user;
//         } else {
//             return null;
//         }
//     },
//     async removeFavoriteMovieToUser(userId: number, movieId: number): Promise<User | null> {
//         const existingFavorite = await prisma.userMovieFavorite.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }],
//             },
//         });

//         if (existingFavorite) {
//             await prisma.userMovieFavorite.delete({
//                 where: { id: existingFavorite.id },
//             });

//             const user = await prisma.user.findUnique({
//                 where: { id: userId },
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
//         } else {
//             return null;
//         }
//     },
//     async removeFavoriteSerieToUser(userId: number, serieId: number): Promise<User | null> {
//         const existingFavorite = await prisma.userSerieFavorite.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }],
//             },
//         });

//         if (existingFavorite) {
//             await prisma.userSerieFavorite.delete({
//                 where: { id: existingFavorite.id },
//             });

//             const user = await prisma.user.findUnique({
//                 where: { id: userId },
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
//         } else {
//             return null;
//         }
//     },
//     // #endregion

//     // #region "Reviews"
//     async addReviewMovie({ content, createdAt, rating, userId, movieId }: any): Promise<any> {
//         const existingReview = await prisma.movieReview.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }],
//             },
//         });

//         if (!existingReview) {
//             const reviewAdded = await prisma.movieReview.create({
//                 data: {
//                     content,
//                     createdAt,
//                     rating,
//                     userId,
//                     movieId,
//                 },
//             });

//             if (reviewAdded) {
//                 const user = await prisma.user.findUnique({
//                     where: { id: userId },
//                     include: {
//                         favMovies: { include: { movie: true } },
//                         favSeries: { include: { serie: true } },
//                         movieReviews: { include: { movie: true } },
//                         serieReviews: { include: { serie: true } },
//                         upvotedMovies: { include: { movieReview: true, movie: true } },
//                         downvotedMovies: { include: { movieReview: true, movie: true } },
//                         upvotedSeries: { include: { serieReview: true, serie: true } },
//                         downvotedSeries: { include: { serieReview: true, serie: true } },
//                     },
//                 });

//                 if (user) {
//                     return user;
//                 } else {
//                     return null;
//                 }
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async addReviewSerie({ content, createdAt, rating, userId, serieId }: any): Promise<any> {
//         const existingReview = await prisma.serieReview.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }],
//             },
//         });

//         if (!existingReview) {
//             const reviewAdded = await prisma.serieReview.create({
//                 data: {
//                     content,
//                     createdAt,
//                     rating,
//                     userId,
//                     serieId,
//                 },
//             });

//             if (reviewAdded) {
//                 const user = await prisma.user.findUnique({
//                     where: { id: userId },
//                     include: {
//                         favMovies: { include: { movie: true } },
//                         favSeries: { include: { serie: true } },
//                         movieReviews: { include: { movie: true } },
//                         serieReviews: { include: { serie: true } },
//                         upvotedMovies: { include: { movieReview: true, movie: true } },
//                         downvotedMovies: { include: { movieReview: true, movie: true } },
//                         upvotedSeries: { include: { serieReview: true, serie: true } },
//                         downvotedSeries: { include: { serieReview: true, serie: true } },
//                     },
//                 });

//                 if (user) {
//                     return user;
//                 } else {
//                     return null;
//                 }
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async updateReviewMovie({ content, updatedAt, rating, userId, movieId }: any): Promise<any> {
//         const existingReview = await prisma.movieReview.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }],
//             },
//         });

//         if (existingReview) {
//             const reviewUpdated = await prisma.movieReview.update({
//                 data: {
//                     content,
//                     updatedAt,
//                     rating,
//                     userId,
//                     movieId,
//                 },
//                 where: {
//                     id: existingReview.id,
//                 },
//             });

//             if (reviewUpdated) {
//                 const user = await prisma.user.findUnique({
//                     where: { id: userId },
//                     include: {
//                         favMovies: { include: { movie: true } },
//                         favSeries: { include: { serie: true } },
//                         movieReviews: { include: { movie: true } },
//                         serieReviews: { include: { serie: true } },
//                         upvotedMovies: { include: { movieReview: true, movie: true } },
//                         downvotedMovies: { include: { movieReview: true, movie: true } },
//                         upvotedSeries: { include: { serieReview: true, serie: true } },
//                         downvotedSeries: { include: { serieReview: true, serie: true } },
//                     },
//                 });

//                 if (user) {
//                     return user;
//                 } else {
//                     return null;
//                 }
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async updateReviewSerie({ content, updatedAt, rating, userId, serieId }: any): Promise<any> {
//         const existingReview = await prisma.serieReview.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }],
//             },
//         });

//         if (existingReview) {
//             const reviewUpdated = await prisma.serieReview.update({
//                 data: {
//                     content,
//                     updatedAt,
//                     rating,
//                     userId,
//                     serieId,
//                 },
//                 where: {
//                     id: existingReview.id,
//                 },
//             });

//             if (reviewUpdated) {
//                 const user = await prisma.user.findUnique({
//                     where: { id: userId },
//                     include: {
//                         favMovies: { include: { movie: true } },
//                         favSeries: { include: { serie: true } },
//                         movieReviews: { include: { movie: true } },
//                         serieReviews: { include: { serie: true } },
//                         upvotedMovies: { include: { movieReview: true, movie: true } },
//                         downvotedMovies: { include: { movieReview: true, movie: true } },
//                         upvotedSeries: { include: { serieReview: true, serie: true } },
//                         downvotedSeries: { include: { serieReview: true, serie: true } },
//                     },
//                 });

//                 if (user) {
//                     return user;
//                 } else {
//                     return null;
//                 }
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async removeReviewMovie({ userId, movieId }: any): Promise<any> {
//         const existingReview = await prisma.movieReview.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }],
//             },
//         });

//         if (existingReview) {
//             const result = await prisma.movieReview.delete({
//                 where: { id: existingReview.id },
//             });

//             if (result) {
//                 const user = await prisma.user.findUnique({
//                     where: { id: userId },
//                     include: {
//                         favMovies: { include: { movie: true } },
//                         favSeries: { include: { serie: true } },
//                         movieReviews: { include: { movie: true } },
//                         serieReviews: { include: { serie: true } },
//                         upvotedMovies: { include: { movieReview: true, movie: true } },
//                         downvotedMovies: { include: { movieReview: true, movie: true } },
//                         upvotedSeries: { include: { serieReview: true, serie: true } },
//                         downvotedSeries: { include: { serieReview: true, serie: true } },
//                     },
//                 });

//                 if (user) {
//                     return user;
//                 } else {
//                     return null;
//                 }
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async removeReviewSerie({ userId, serieId }: any): Promise<any> {
//         const existingReview = await prisma.serieReview.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }],
//             },
//         });

//         if (existingReview) {
//             const result = await prisma.serieReview.delete({
//                 where: { id: existingReview.id },
//             });

//             if (result) {
//                 const user = await prisma.user.findUnique({
//                     where: { id: userId },
//                     include: {
//                         favMovies: { include: { movie: true } },
//                         favSeries: { include: { serie: true } },
//                         movieReviews: { include: { movie: true } },
//                         serieReviews: { include: { serie: true } },
//                         upvotedMovies: { include: { movieReview: true, movie: true } },
//                         downvotedMovies: { include: { movieReview: true, movie: true } },
//                         upvotedSeries: { include: { serieReview: true, serie: true } },
//                         downvotedSeries: { include: { serieReview: true, serie: true } },
//                     },
//                 });

//                 if (user) {
//                     return user;
//                 } else {
//                     return null;
//                 }
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     // #endregion

//     // #region "upvotes, downvotes"
//     async addUpvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
//         const existingUpvoteMovieReview = await prisma.upvoteMovie.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }, { movieReviewId }],
//             },
//         });

//         if (!existingUpvoteMovieReview) {
//             const upvoteAdded = await prisma.upvoteMovie.create({
//                 data: {
//                     userId,
//                     movieId,
//                     movieReviewId,
//                 },
//             });

//             if (upvoteAdded) {
//                 return upvoteAdded;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async addUpvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
//         const existingUpvoteSerieReview = await prisma.upvoteSerie.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }, { serieReviewId }],
//             },
//         });

//         if (!existingUpvoteSerieReview) {
//             const upvoteAdded = await prisma.upvoteSerie.create({
//                 data: {
//                     userId,
//                     serieId,
//                     serieReviewId,
//                 },
//             });

//             if (upvoteAdded) {
//                 return upvoteAdded;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },

//     async removeUpvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
//         const existingUpvote = await prisma.upvoteMovie.findFirst({
//             where: {
//                 AND: [{ userId }, { movieReviewId }, { movieId }],
//             },
//         });

//         if (existingUpvote) {
//             const result = await prisma.upvoteMovie.delete({
//                 where: { id: existingUpvote.id },
//             });

//             if (result) {
//                 return result;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async removeUpvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
//         const existingUpvote = await prisma.upvoteSerie.findFirst({
//             where: {
//                 AND: [{ userId }, { serieReviewId }, { serieId }],
//             },
//         });

//         if (existingUpvote) {
//             const result = await prisma.upvoteSerie.delete({
//                 where: { id: existingUpvote.id },
//             });

//             if (result) {
//                 return result;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },

//     async addDownvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
//         const existingDownvoteMovieReview = await prisma.downvoteMovie.findFirst({
//             where: {
//                 AND: [{ userId }, { movieId }, { movieReviewId }],
//             },
//         });

//         if (!existingDownvoteMovieReview) {
//             const downvoteAdded = await prisma.downvoteMovie.create({
//                 data: {
//                     userId,
//                     movieId,
//                     movieReviewId,
//                 },
//             });

//             if (downvoteAdded) {
//                 return downvoteAdded;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async addDownvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
//         const existingDownvoteSerieReview = await prisma.downvoteSerie.findFirst({
//             where: {
//                 AND: [{ userId }, { serieId }, { serieReviewId }],
//             },
//         });

//         if (!existingDownvoteSerieReview) {
//             const downvoteAdded = await prisma.downvoteSerie.create({
//                 data: {
//                     userId,
//                     serieId,
//                     serieReviewId,
//                 },
//             });

//             if (downvoteAdded) {
//                 return downvoteAdded;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },

//     async removeDownvoteMovieReview({ userId, movieId, movieReviewId }: any): Promise<any> {
//         const existingDownvote = await prisma.downvoteMovie.findFirst({
//             where: {
//                 AND: [{ userId }, { movieReviewId }, { movieId }],
//             },
//         });

//         if (existingDownvote) {
//             const result = await prisma.downvoteMovie.delete({
//                 where: { id: existingDownvote.id },
//             });

//             if (result) {
//                 return result;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     async removeDownvoteSerieReview({ userId, serieId, serieReviewId }: any): Promise<any> {
//         const existingDownvote = await prisma.downvoteSerie.findFirst({
//             where: {
//                 AND: [{ userId }, { serieReviewId }, { serieId }],
//             },
//         });

//         if (existingDownvote) {
//             const result = await prisma.downvoteSerie.delete({
//                 where: { id: existingDownvote.id },
//             });

//             if (result) {
//                 return result;
//             } else {
//                 return null;
//             }
//         } else {
//             return null;
//         }
//     },
//     // #endregion
// };

// export default userModel;
