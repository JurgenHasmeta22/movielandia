"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/config/prisma";
import {
    VoteMovieReviewParams,
    getReferer,
    VoteSerieReviewParams,
    VoteSeasonReviewParams,
    VoteEpisodeReviewParams,
    VoteActorReviewParams,
    VoteCrewReviewParams,
} from "./user.actions";

// #region "Downvotes"

// #region "Add Downvote"
export async function addDownvoteMovieReview({ userId, movieId, movieReviewId }: VoteMovieReviewParams): Promise<any> {
    try {
        const existingDownvoteMovieReview = await prisma.downvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }, { movieReviewId }],
            },
        });

        if (!existingDownvoteMovieReview) {
            const downvoteAdded = await prisma.downvoteMovieReview.create({
                data: {
                    userId,
                    movieId,
                    movieReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote movie");
            }
        } else {
            throw new Error("Failed to downvote movie");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addDownvoteSerieReview({ userId, serieId, serieReviewId }: VoteSerieReviewParams): Promise<any> {
    try {
        const existingDownvoteSerieReview = await prisma.downvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }, { serieReviewId }],
            },
        });

        if (!existingDownvoteSerieReview) {
            const downvoteAdded = await prisma.downvoteSerieReview.create({
                data: {
                    userId,
                    serieId,
                    serieReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote serie");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addDownvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingDownvoteSeasonReview = await prisma.downvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }, { seasonReviewId }],
            },
        });

        if (!existingDownvoteSeasonReview) {
            const downvoteAdded = await prisma.downvoteSeasonReview.create({
                data: {
                    userId,
                    seasonId,
                    seasonReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote season");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addDownvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingDownvoteEpisodeReview = await prisma.downvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }, { episodeReviewId }],
            },
        });

        if (!existingDownvoteEpisodeReview) {
            const downvoteAdded = await prisma.downvoteEpisodeReview.create({
                data: {
                    userId,
                    episodeId,
                    episodeReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote episode");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addDownvoteActorReview({ userId, actorId, actorReviewId }: VoteActorReviewParams): Promise<any> {
    try {
        const existingDownvoteActorReview = await prisma.downvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }, { actorReviewId }],
            },
        });

        if (!existingDownvoteActorReview) {
            const downvoteAdded = await prisma.downvoteActorReview.create({
                data: {
                    userId,
                    actorId,
                    actorReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote actor");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addDownvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingDownvoteCrewReview = await prisma.downvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }, { crewReviewId }],
            },
        });

        if (!existingDownvoteCrewReview) {
            const downvoteAdded = await prisma.downvoteCrewReview.create({
                data: {
                    userId,
                    crewId,
                    crewReviewId,
                },
            });

            if (downvoteAdded) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to downvote crew");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
// #endregion

// #region "Remove Downvote"
export async function removeDownvoteMovieReview({
    userId,
    movieId,
    movieReviewId,
}: VoteMovieReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieReviewId }, { movieId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteMovieReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote movie");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeDownvoteSerieReview({
    userId,
    serieId,
    serieReviewId,
}: VoteSerieReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieReviewId }, { serieId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteSerieReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote serie");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeDownvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonReviewId }, { seasonId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteSeasonReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote season");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeDownvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeReviewId }, { episodeId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteEpisodeReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote episode");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeDownvoteActorReview({
    userId,
    actorId,
    actorReviewId,
}: VoteActorReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorReviewId }, { actorId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteActorReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote actor");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeDownvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingDownvote = await prisma.downvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewReviewId }, { crewId }],
            },
        });

        if (existingDownvote) {
            const result = await prisma.downvoteCrewReview.delete({
                where: { id: existingDownvote.id },
            });

            if (result) {
                const referer = await getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove downvote crew");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
// #endregion

//#endregion
