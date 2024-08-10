"use server";

import { hashSync } from "bcrypt";
import { User } from "@prisma/client";
import { prisma } from "../../prisma/config/prisma";

interface IRegister {
    email: string;
    password: string;
    userName: string;
}

export async function signUp(userData: IRegister): Promise<User | null | undefined> {
    try {
        const { email, password, userName } = userData;

        const existingUser: User | null = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return null;
        } else {
            const hash = hashSync(password, 7);

            const user: User | null = await prisma.user.create({
                data: { email, password: hash, userName },
                include: {
                    favMovies: { include: { movie: true } },
                    favSeries: { include: { serie: true } },
                    movieReviews: { include: { movie: true } },
                    serieReviews: { include: { serie: true } },
                    movieReviewsUpvoted: { include: { movieReview: true, movie: true } },
                    movieReviewsDownvoted: { include: { movieReview: true, movie: true } },
                    serieReviewsUpvoted: { include: { serieReview: true, serie: true } },
                    serieReviewsDownvoted: { include: { serieReview: true, serie: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        }
    } catch (error) {
        console.error(error);
    }
}
