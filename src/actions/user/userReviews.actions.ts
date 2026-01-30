"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../prisma/config/prisma";
import {
	AddReviewMovieParams,
	getReferer,
	AddReviewSerieParams,
	AddReviewSeasonParams,
	AddReviewEpisodeParams,
	AddReviewActorParams,
	AddReviewCrewParams,
	UpdateReviewMovieParams,
	UpdateReviewSerieParams,
	RemoveReviewMovieParams,
	RemoveReviewSerieParams,
	RemoveReviewSeasonParams,
	RemoveReviewEpisodeParams,
	RemoveReviewActorParams,
	RemoveReviewCrewParams,
} from "./user.actions";
import { Prisma } from "../../../prisma/generated/prisma/client";

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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const addReviewSeason = async ({
	content,
	createdAt = new Date(),
	rating,
	userId,
	seasonId,
}: AddReviewSeasonParams): Promise<void> => {
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const addReviewEpisode = async ({
	content,
	createdAt = new Date(),
	rating,
	userId,
	episodeId,
}: AddReviewEpisodeParams): Promise<void> => {
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const addReviewActor = async ({
	content,
	createdAt = new Date(),
	rating,
	userId,
	actorId,
}: AddReviewActorParams): Promise<void> => {
	try {
		const existingReview = await prisma.actorReview.findFirst({
			where: {
				userId,
				actorId,
			},
		});

		if (!existingReview) {
			const actor = await prisma.actor.findUnique({
				where: {
					id: actorId,
				},
			});

			if (!actor) {
				throw new Error("Actor not found.");
			}

			const reviewAdded = await prisma.actorReview.create({
				data: {
					content,
					createdAt,
					rating,
					userId,
					actorId,
				},
			});

			if (reviewAdded) {
				const referer = getReferer();
				revalidatePath(`${referer}`, "page");
			} else {
				throw new Error("Failed to add review.");
			}
		} else {
			throw new Error("You have already reviewed this actor.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const addReviewCrew = async ({
	content,
	createdAt = new Date(),
	rating,
	userId,
	crewId,
}: AddReviewCrewParams): Promise<void> => {
	try {
		const existingReview = await prisma.crewReview.findFirst({
			where: {
				userId,
				crewId,
			},
		});

		if (!existingReview) {
			const crew = await prisma.crew.findUnique({
				where: {
					id: crewId,
				},
			});

			if (!crew) {
				throw new Error("Crew not found.");
			}

			const reviewAdded = await prisma.crewReview.create({
				data: {
					content,
					createdAt,
					rating,
					userId,
					crewId,
				},
			});

			if (reviewAdded) {
				const referer = getReferer();
				revalidatePath(`${referer}`, "page");
			} else {
				throw new Error("Failed to add review.");
			}
		} else {
			throw new Error("You have already reviewed this crew.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};
// #endregion

// #region "Update Review"
export const updateReviewMovie = async ({
	content,
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const updateReviewSerie = async ({
	content,
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const updateReviewSeason = async ({
	content,
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const updateReviewEpisode = async ({
	content,
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const updateReviewActor = async ({
	content,
	rating,
	userId,
	actorId,
}: Prisma.ActorReviewCreateManyInput): Promise<void> => {
	try {
		const existingReview = await prisma.actorReview.findFirst({
			where: {
				AND: [{ userId }, { actorId }],
			},
			include: {
				actor: true,
			},
		});

		if (existingReview) {
			const reviewUpdated = await prisma.actorReview.update({
				data: {
					content,
					rating,
					userId,
					actorId,
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
			throw new Error("Actor not found.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const updateReviewCrew = async ({
	content,
	rating,
	userId,
	crewId,
}: Prisma.CrewReviewCreateManyInput): Promise<void> => {
	try {
		const existingReview = await prisma.crewReview.findFirst({
			where: {
				AND: [{ userId }, { crewId }],
			},
			include: {
				crew: true,
			},
		});

		if (existingReview) {
			const reviewUpdated = await prisma.crewReview.update({
				data: {
					content,
					rating,
					userId,
					crewId,
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
			throw new Error("Crew not found.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};
// #endregion

// #region "Remove Review"
export const removeReviewMovie = async ({
	userId,
	movieId,
}: RemoveReviewMovieParams): Promise<void> => {
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const removeReviewSerie = async ({
	userId,
	serieId,
}: RemoveReviewSerieParams): Promise<void> => {
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const removeReviewSeason = async ({
	userId,
	seasonId,
}: RemoveReviewSeasonParams): Promise<void> => {
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const removeReviewEpisode = async ({
	userId,
	episodeId,
}: RemoveReviewEpisodeParams): Promise<void> => {
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const removeReviewActor = async ({
	userId,
	actorId,
}: RemoveReviewActorParams): Promise<void> => {
	try {
		const existingReview = await prisma.actorReview.findFirst({
			where: {
				AND: [{ userId }, { actorId }],
			},
			include: {
				actor: true,
			},
		});

		if (existingReview) {
			const result = await prisma.actorReview.delete({
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
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};

export const removeReviewCrew = async ({
	userId,
	crewId,
}: RemoveReviewCrewParams): Promise<void> => {
	try {
		const existingReview = await prisma.crewReview.findFirst({
			where: {
				AND: [{ userId }, { crewId }],
			},
			include: {
				crew: true,
			},
		});

		if (existingReview) {
			const result = await prisma.crewReview.delete({
				where: { id: existingReview.id },
			});

			if (result) {
				const referer = getReferer();
				revalidatePath(`${referer}`, "page");
			} else {
				throw new Error("Failed to delete review.");
			}
		} else {
			throw new Error("Crew not found.");
		}
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
};
// #endregion

// #endregion
