"use server";

import { prisma } from "../../../prisma/config/prisma";

export async function getUpvotesByReviewId(reviewId: number, page: number = 1, perPage: number = 10) {
    const skip = (page - 1) * perPage;

    const [upvotes, total] = await Promise.all([
        prisma.upvoteMovieReview.findMany({
            where: { movieReviewId: reviewId },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        bio: true,
                        avatar: true,
                    },
                },
            },
            skip,
            take: perPage,
        }),
        prisma.upvoteMovieReview.count({
            where: { movieReviewId: reviewId },
        }),
    ]);

    return {
        items: upvotes,
        total,
    };
}

export async function getDownvotesByReviewId(reviewId: number, page: number = 1, perPage: number = 10) {
    const skip = (page - 1) * perPage;

    const [downvotes, total] = await Promise.all([
        prisma.downvoteMovieReview.findMany({
            where: { movieReviewId: reviewId },
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        bio: true,
                        avatar: true,
                    },
                },
            },
            skip,
            take: perPage,
        }),
        prisma.downvoteMovieReview.count({
            where: { movieReviewId: reviewId },
        }),
    ]);

    return {
        items: downvotes,
        total,
    };
}
