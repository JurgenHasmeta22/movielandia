"use server";

import { prisma } from "../../../prisma/config/prisma";

type ReviewType = "movie" | "serie" | "season" | "episode" | "actor" | "crew";

interface VotesResponse {
    items: Array<{
        user: {
            id: number;
            userName: string;
            bio: string;
            avatar: { photoSrc: string } | null;
        };
    }>;
    total: number;
}

export async function getUpvotesByReviewId(
    reviewId: number,
    type: ReviewType,
    page: number = 1,
    perPage: number = 10,
): Promise<VotesResponse> {
    const skip = (page - 1) * perPage;

    const userSelect = {
        select: {
            id: true,
            userName: true,
            bio: true,
            avatar: true,
        },
    };

    let upvotes;
    let total;

    switch (type) {
        case "movie":
            [upvotes, total] = await Promise.all([
                prisma.upvoteMovieReview.findMany({
                    where: { movieReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.upvoteMovieReview.count({
                    where: { movieReviewId: reviewId },
                }),
            ]);
            break;

        case "serie":
            [upvotes, total] = await Promise.all([
                prisma.upvoteSerieReview.findMany({
                    where: { serieReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.upvoteSerieReview.count({
                    where: { serieReviewId: reviewId },
                }),
            ]);
            break;

        case "season":
            [upvotes, total] = await Promise.all([
                prisma.upvoteSeasonReview.findMany({
                    where: { seasonReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.upvoteSeasonReview.count({
                    where: { seasonReviewId: reviewId },
                }),
            ]);
            break;

        case "episode":
            [upvotes, total] = await Promise.all([
                prisma.upvoteEpisodeReview.findMany({
                    where: { episodeReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.upvoteEpisodeReview.count({
                    where: { episodeReviewId: reviewId },
                }),
            ]);
            break;

        case "actor":
            [upvotes, total] = await Promise.all([
                prisma.upvoteActorReview.findMany({
                    where: { actorReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.upvoteActorReview.count({
                    where: { actorReviewId: reviewId },
                }),
            ]);
            break;

        case "crew":
            [upvotes, total] = await Promise.all([
                prisma.upvoteCrewReview.findMany({
                    where: { crewReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.upvoteCrewReview.count({
                    where: { crewReviewId: reviewId },
                }),
            ]);
            break;

        default:
            throw new Error("Invalid review type");
    }

    return {
        items: upvotes,
        total,
    };
}

export async function getDownvotesByReviewId(
    reviewId: number,
    type: ReviewType,
    page: number = 1,
    perPage: number = 10,
): Promise<VotesResponse> {
    const skip = (page - 1) * perPage;

    const userSelect = {
        select: {
            id: true,
            userName: true,
            bio: true,
            avatar: true,
        },
    };

    let downvotes;
    let total;

    switch (type) {
        case "movie":
            [downvotes, total] = await Promise.all([
                prisma.downvoteMovieReview.findMany({
                    where: { movieReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.downvoteMovieReview.count({
                    where: { movieReviewId: reviewId },
                }),
            ]);
            break;

        case "serie":
            [downvotes, total] = await Promise.all([
                prisma.downvoteSerieReview.findMany({
                    where: { serieReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.downvoteSerieReview.count({
                    where: { serieReviewId: reviewId },
                }),
            ]);
            break;

        case "season":
            [downvotes, total] = await Promise.all([
                prisma.downvoteSeasonReview.findMany({
                    where: { seasonReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.downvoteSeasonReview.count({
                    where: { seasonReviewId: reviewId },
                }),
            ]);
            break;

        case "episode":
            [downvotes, total] = await Promise.all([
                prisma.downvoteEpisodeReview.findMany({
                    where: { episodeReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.downvoteEpisodeReview.count({
                    where: { episodeReviewId: reviewId },
                }),
            ]);
            break;

        case "actor":
            [downvotes, total] = await Promise.all([
                prisma.downvoteActorReview.findMany({
                    where: { actorReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.downvoteActorReview.count({
                    where: { actorReviewId: reviewId },
                }),
            ]);
            break;

        case "crew":
            [downvotes, total] = await Promise.all([
                prisma.downvoteCrewReview.findMany({
                    where: { crewReviewId: reviewId },
                    include: { user: userSelect },
                    skip,
                    take: perPage,
                }),
                prisma.downvoteCrewReview.count({
                    where: { crewReviewId: reviewId },
                }),
            ]);
            break;

        default:
            throw new Error("Invalid review type");
    }

    return {
        items: downvotes,
        total,
    };
}
