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

// #region "Upvotes"

// #region "Add Upvote"
export async function addUpvoteMovieReview({ userId, movieId, movieReviewId }: VoteMovieReviewParams): Promise<any> {
    try {
        const existingUpvoteMovieReview = await prisma.upvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }, { movieReviewId }],
            },
        });

        if (!existingUpvoteMovieReview) {
            const upvoteAdded = await prisma.upvoteMovieReview.create({
                data: {
                    userId,
                    movieId,
                    movieReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote movie");
            }
        } else {
            throw new Error("Failed to upvote movie");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addUpvoteSerieReview({ userId, serieId, serieReviewId }: VoteSerieReviewParams): Promise<any> {
    try {
        const existingUpvoteSerieReview = await prisma.upvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }, { serieReviewId }],
            },
        });

        if (!existingUpvoteSerieReview) {
            const upvoteAdded = await prisma.upvoteSerieReview.create({
                data: {
                    userId,
                    serieId,
                    serieReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote serie");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addUpvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingUpvoteSeasonReview = await prisma.upvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }, { seasonReviewId }],
            },
        });

        if (!existingUpvoteSeasonReview) {
            const upvoteAdded = await prisma.upvoteSeasonReview.create({
                data: {
                    userId,
                    seasonId,
                    seasonReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote season");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addUpvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingUpvoteEpisodeReview = await prisma.upvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }, { episodeReviewId }],
            },
        });

        if (!existingUpvoteEpisodeReview) {
            const upvoteAdded = await prisma.upvoteEpisodeReview.create({
                data: {
                    userId,
                    episodeId,
                    episodeReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote episode");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addUpvoteActorReview({ userId, actorId, actorReviewId }: VoteActorReviewParams): Promise<any> {
    try {
        const existingUpvoteActorReview = await prisma.upvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorId }, { actorReviewId }],
            },
        });

        if (!existingUpvoteActorReview) {
            const upvoteAdded = await prisma.upvoteActorReview.create({
                data: {
                    userId,
                    actorId,
                    actorReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote actor");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function addUpvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingUpvoteCrewReview = await prisma.upvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewId }, { crewReviewId }],
            },
        });

        if (!existingUpvoteCrewReview) {
            const upvoteAdded = await prisma.upvoteCrewReview.create({
                data: {
                    userId,
                    crewId,
                    crewReviewId,
                },
            });

            if (upvoteAdded) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to upvote crew");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
// #endregion

// #region "Remove Upvote"
export async function removeUpvoteMovieReview({ userId, movieId, movieReviewId }: VoteMovieReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteMovieReview.findFirst({
            where: {
                AND: [{ userId }, { movieReviewId }, { movieId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteMovieReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote movie");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeUpvoteSerieReview({ userId, serieId, serieReviewId }: VoteSerieReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteSerieReview.findFirst({
            where: {
                AND: [{ userId }, { serieReviewId }, { serieId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteSerieReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote serie");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeUpvoteSeasonReview({
    userId,
    seasonId,
    seasonReviewId,
}: VoteSeasonReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteSeasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonReviewId }, { seasonId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteSeasonReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote season");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeUpvoteEpisodeReview({
    userId,
    episodeId,
    episodeReviewId,
}: VoteEpisodeReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteEpisodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeReviewId }, { episodeId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteEpisodeReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote episode");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeUpvoteActorReview({ userId, actorId, actorReviewId }: VoteActorReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteActorReview.findFirst({
            where: {
                AND: [{ userId }, { actorReviewId }, { actorId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteActorReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote actor");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}

export async function removeUpvoteCrewReview({ userId, crewId, crewReviewId }: VoteCrewReviewParams): Promise<any> {
    try {
        const existingUpvote = await prisma.upvoteCrewReview.findFirst({
            where: {
                AND: [{ userId }, { crewReviewId }, { crewId }],
            },
        });

        if (existingUpvote) {
            const result = await prisma.upvoteCrewReview.delete({
                where: { id: existingUpvote.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(referer);
            } else {
                throw new Error("Failed to remove upvote crew");
            }
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
}
// #endregion

// #endregion
