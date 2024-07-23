"use server";

import { hashSync } from "bcrypt";
import { prisma } from "@/lib/prisma/prisma";
import { User } from "@prisma/client";

export async function signUp(userData: {
    email: string;
    password: string;
    userName: string;
}): Promise<User | null | undefined> {
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
                    upvotedMovies: { include: { movieReview: true, movie: true } },
                    downvotedMovies: { include: { movieReview: true, movie: true } },
                    upvotedSeries: { include: { serieReview: true, serie: true } },
                    downvotedSeries: { include: { serieReview: true, serie: true } },
                },
            });

            if (user) {
                return user;
            } else {
                return null;
            }
        }
    } catch (error) {
        console.log(error);
    }
}
