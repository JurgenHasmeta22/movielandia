"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/config/prisma";
import {
    AddReviewMovieParams,
    getReferer,
    AddReviewSerieParams,
    UpdateReviewMovieParams,
    UpdateReviewSerieParams,
    RemoveReviewMovieParams,
    RemoveReviewSerieParams,
    RemoveReviewSeasonParams,
    RemoveReviewEpisodeParams,
    RemoveReviewPersonParams,
} from "./user.actions";

// #region "Reviews"

// #region "Add Review"
export const addReviewMovie = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    movieId,
}: AddReviewMovieParams): Promise<void> => {
    try {
        const existingReview = await prisma.movieReview.findFirst({
            where: {
                userId,
                movieId,
            },
        });

        if (!existingReview) {
            const movie = await prisma.movie.findUnique({
                where: {
                    id: movieId,
                },
            });

            if (!movie) {
                throw new Error("Movie not found.");
            }

            // console.log(content, createdAt, rating, userId, movieId);

            const reviewAdded = await prisma.movieReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    movieId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this movie.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const addReviewSerie = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    serieId,
}: AddReviewSerieParams): Promise<void> => {
    try {
        const existingReview = await prisma.serieReview.findFirst({
            where: {
                userId,
                serieId,
            },
        });

        if (!existingReview) {
            const serie = await prisma.serie.findUnique({
                where: {
                    id: serieId,
                },
            });

            if (!serie) {
                throw new Error("Serie not found.");
            }

            const reviewAdded = await prisma.serieReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    serieId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this serie.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const addReviewSeason = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    seasonId,
}: Prisma.SeasonReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.seasonReview.findFirst({
            where: {
                userId,
                seasonId,
            },
        });

        if (!existingReview) {
            const season = await prisma.season.findUnique({
                where: {
                    id: seasonId,
                },
            });

            if (!season) {
                throw new Error("Season not found.");
            }

            const reviewAdded = await prisma.seasonReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    seasonId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this season.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const addReviewEpisode = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    episodeId,
}: Prisma.EpisodeReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.episodeReview.findFirst({
            where: {
                userId,
                episodeId,
            },
        });

        if (!existingReview) {
            const episode = await prisma.episode.findUnique({
                where: {
                    id: episodeId,
                },
            });

            if (!episode) {
                throw new Error("Episode not found.");
            }

            const reviewAdded = await prisma.episodeReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    episodeId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this episode.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const addReviewPerson = async ({
    content,
    createdAt = new Date(),
    rating,
    userId,
    personId,
}: Prisma.PersonReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.personReview.findFirst({
            where: {
                userId,
                personId,
            },
        });

        if (!existingReview) {
            const person = await prisma.person.findUnique({
                where: {
                    id: personId,
                },
            });

            if (!person) {
                throw new Error("Person not found.");
            }

            const reviewAdded = await prisma.personReview.create({
                data: {
                    content,
                    createdAt,
                    rating,
                    userId,
                    personId,
                },
            });

            if (reviewAdded) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to add review.");
            }
        } else {
            throw new Error("You have already reviewed this person.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};
// #endregion

// #region "Update Review"
export const updateReviewMovie = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    movieId,
}: UpdateReviewMovieParams): Promise<void> => {
    try {
        const existingReview = await prisma.movieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
            include: {
                movie: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.movieReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    movieId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const updateReviewSerie = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    serieId,
}: UpdateReviewSerieParams): Promise<void> => {
    try {
        const existingReview = await prisma.serieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
            include: {
                serie: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.serieReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    serieId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const updateReviewSeason = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    seasonId,
}: Prisma.SeasonReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.seasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }],
            },
            include: {
                season: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.seasonReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    seasonId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Season not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const updateReviewEpisode = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    episodeId,
}: Prisma.EpisodeReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.episodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }],
            },
            include: {
                episode: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.episodeReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    episodeId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Episode not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const updateReviewPerson = async ({
    content,
    updatedAt = new Date(),
    rating,
    userId,
    personId,
}: Prisma.PersonReviewCreateManyInput): Promise<void> => {
    try {
        const existingReview = await prisma.personReview.findFirst({
            where: {
                AND: [{ userId }, { personId }],
            },
            include: {
                person: true,
            },
        });

        if (existingReview) {
            const reviewUpdated = await prisma.personReview.update({
                data: {
                    content,
                    updatedAt,
                    rating,
                    userId,
                    personId,
                },
                where: {
                    id: existingReview.id,
                },
            });

            if (reviewUpdated) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to update review.");
            }
        } else {
            throw new Error("Person not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};
// #endregion

// #region "Remove Review"
export const removeReviewMovie = async ({ userId, movieId }: RemoveReviewMovieParams): Promise<void> => {
    try {
        const existingReview = await prisma.movieReview.findFirst({
            where: {
                AND: [{ userId }, { movieId }],
            },
            include: {
                movie: true,
            },
        });

        if (existingReview) {
            const result = await prisma.movieReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const removeReviewSerie = async ({ userId, serieId }: RemoveReviewSerieParams): Promise<void> => {
    try {
        const existingReview = await prisma.serieReview.findFirst({
            where: {
                AND: [{ userId }, { serieId }],
            },
            include: {
                serie: true,
            },
        });

        if (existingReview) {
            const result = await prisma.serieReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const removeReviewSeason = async ({ userId, seasonId }: RemoveReviewSeasonParams): Promise<void> => {
    try {
        const existingReview = await prisma.seasonReview.findFirst({
            where: {
                AND: [{ userId }, { seasonId }],
            },
            include: {
                season: true,
            },
        });

        if (existingReview) {
            const result = await prisma.seasonReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const removeReviewEpisode = async ({ userId, episodeId }: RemoveReviewEpisodeParams): Promise<void> => {
    try {
        const existingReview = await prisma.episodeReview.findFirst({
            where: {
                AND: [{ userId }, { episodeId }],
            },
            include: {
                episode: true,
            },
        });

        if (existingReview) {
            const result = await prisma.episodeReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};

export const removeReviewPerson = async ({ userId, personId }: RemoveReviewPersonParams): Promise<void> => {
    try {
        const existingReview = await prisma.personReview.findFirst({
            where: {
                AND: [{ userId }, { personId }],
            },
            include: {
                person: true,
            },
        });

        if (existingReview) {
            const result = await prisma.personReview.delete({
                where: { id: existingReview.id },
            });

            if (result) {
                const referer = getReferer();
                revalidatePath(`${referer}`, "page");
            } else {
                throw new Error("Failed to delete review.");
            }
        } else {
            throw new Error("Review not found.");
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
};
// #endregion

// #endregion
