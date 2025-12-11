"use server";

import { prisma } from "../../../prisma/config/prisma";
import { redirect } from "next/navigation";
import { getReferer } from "../user/user.actions";
import type { ListFormData } from "@/schemas/list.schema";
import { revalidatePath } from "next/cache";
import { Prisma, List } from "../../../prisma/generated/prisma/client";
import { ContentType } from "../../../prisma/generated/prisma/enums";

interface ListParams {
	page?: number;
	perPage?: number;
	sortBy?: string;
	ascOrDesc?: string;
	isPrivate?: boolean;
	isArchived?: boolean;
	sharedWithMe?: boolean;
}

export async function getUserLists(userId: number, params: ListParams = {}) {
	const {
		page = 1,
		perPage = 12,
		sortBy = "createdAt",
		ascOrDesc = "desc",
		isPrivate,
		isArchived,
		sharedWithMe = false,
	} = params;

	const skip = (page - 1) * perPage;

	let where: Prisma.ListWhereInput;

	if (sharedWithMe) {
		// Get lists shared with the user
		where = {
			sharedWith: {
				some: {
					userId,
				},
			},
			...(typeof isArchived === "boolean" && { isArchived }),
		};
	} else {
		// Get lists owned by the user
		where = {
			userId,
			...(typeof isPrivate === "boolean" && { isPrivate }),
			...(typeof isArchived === "boolean" && { isArchived }),
		};
	}

	// For shared lists, we need to include the permission level
	const sharedWithInclude = sharedWithMe
		? {
				where: {
					userId,
				},
				include: {
					user: {
						select: {
							id: true,
							userName: true,
							avatar: true,
						},
					},
				},
			}
		: {
				include: {
					user: {
						select: {
							id: true,
							userName: true,
							avatar: true,
						},
					},
				},
			};

	try {
		const [lists, total] = await prisma.$transaction([
			prisma.list.findMany({
				where,
				orderBy: { [sortBy]: ascOrDesc },
				skip,
				take: perPage,
				include: {
					user: {
						select: {
							id: true,
							userName: true,
							avatar: true,
						},
					},
					_count: {
						select: {
							movieItems: true,
							serieItems: true,
							seasonItems: true,
							episodeItems: true,
							actorItems: true,
							crewItems: true,
						},
					},
					sharedWith: sharedWithInclude,
				},
			}),
			prisma.list.count({ where }),
		]);

		return {
			items: lists,
			total,
			success: true,
		};
	} catch (error) {
		console.error("Failed to fetch user lists:", error);

		return {
			items: [],
			total: 0,
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch user lists",
		};
	}
}

export async function getListById(listId: number, userId?: number) {
	try {
		const where: Prisma.ListWhereInput = {
			id: listId,
		};

		if (userId) {
			where.OR = [{ userId }, { sharedWith: { some: { userId } } }];
		}

		const list = await prisma.list.findFirst({
			where,
			include: {
				sharedWith: {
					include: {
						user: {
							select: {
								id: true,
								userName: true,
								email: true,
								avatar: true,
							},
						},
					},
				},
			},
		});

		if (!list) {
			throw new Error("List not found");
		}

		return list;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to fetch list",
		);
	}
}

export async function getListMovies(
	listId: number,
	userId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	try {
		const [movies, total] = await prisma.$transaction([
			prisma.listMovie.findMany({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
				include: {
					movie: {
						select: {
							id: true,
							title: true,
							photoSrc: true,
							photoSrcProd: true,
							ratingImdb: true,
							dateAired: true,
							duration: true,
						},
					},
				},
				orderBy: { orderIndex: "asc" },
				skip,
				take: limit,
			}),
			prisma.listMovie.count({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
			}),
		]);

		return { items: movies, total };
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to fetch list movies",
		);
	}
}

export async function getListSeries(
	listId: number,
	userId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	try {
		const [series, total] = await prisma.$transaction([
			prisma.listSerie.findMany({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
				include: {
					serie: {
						select: {
							id: true,
							title: true,
							photoSrc: true,
							photoSrcProd: true,
							ratingImdb: true,
							dateAired: true,
						},
					},
				},
				orderBy: { orderIndex: "asc" },
				skip,
				take: limit,
			}),
			prisma.listSerie.count({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
			}),
		]);

		return { items: series, total };
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to fetch list series",
		);
	}
}

export async function getListActors(
	listId: number,
	userId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	try {
		const [actors, total] = await prisma.$transaction([
			prisma.listActor.findMany({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
				include: {
					actor: {
						select: {
							id: true,
							fullname: true,
							photoSrc: true,
							photoSrcProd: true,
							debut: true,
						},
					},
				},
				orderBy: { orderIndex: "asc" },
				skip,
				take: limit,
			}),
			prisma.listActor.count({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
			}),
		]);

		return { items: actors, total };
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to fetch list actors",
		);
	}
}

export async function getListCrew(
	listId: number,
	userId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	try {
		const [crew, total] = await prisma.$transaction([
			prisma.listCrew.findMany({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
				include: {
					crew: {
						select: {
							id: true,
							fullname: true,
							photoSrc: true,
							photoSrcProd: true,
							debut: true,
						},
					},
				},
				orderBy: { orderIndex: "asc" },
				skip,
				take: limit,
			}),
			prisma.listCrew.count({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
			}),
		]);

		return { items: crew, total };
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to fetch list crew",
		);
	}
}

export async function getListSeasons(
	listId: number,
	userId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	try {
		const [seasons, total] = await prisma.$transaction([
			prisma.listSeason.findMany({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
				include: {
					season: {
						select: {
							id: true,
							title: true,
							description: true,
							photoSrc: true,
							photoSrcProd: true,
							trailerSrc: true,
							dateAired: true,
							ratingImdb: true,
							serie: {
								select: {
									id: true,
									title: true,
								},
							},
						},
					},
				},
				orderBy: { orderIndex: "asc" },
				skip,
				take: limit,
			}),
			prisma.listSeason.count({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
			}),
		]);

		return { items: seasons, total };
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to fetch list seasons",
		);
	}
}

export async function getListEpisodes(
	listId: number,
	userId: number,
	page: number = 1,
	limit: number = 10,
) {
	const skip = (page - 1) * limit;

	try {
		const [episodes, total] = await prisma.$transaction([
			prisma.listEpisode.findMany({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
				include: {
					episode: {
						select: {
							id: true,
							title: true,
							description: true,
							photoSrc: true,
							photoSrcProd: true,
							trailerSrc: true,
							dateAired: true,
							ratingImdb: true,
							season: {
								select: {
									id: true,
									title: true,
									serie: {
										select: {
											id: true,
											title: true,
										},
									},
								},
							},
						},
					},
				},
				orderBy: { orderIndex: "asc" },
				skip,
				take: limit,
			}),
			prisma.listEpisode.count({
				where: {
					listId,
					list: {
						OR: [{ userId }, { sharedWith: { some: { userId } } }],
					},
				},
			}),
		]);

		return { items: episodes, total };
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to fetch list episodes",
		);
	}
}
// #endregion

// #region "Mutation Methods"
export async function createList(data: ListFormData & { userId: number }) {
	try {
		const list = await prisma.list.create({
			data: {
				name: data.name,
				description: data.description,
				isPrivate: data.isPrivate,
				userId: data.userId,
			},
		});

		if (!list) {
			throw new Error("Failed to create list");
		}

		return list;
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error has occurred",
		);
	}
}

export async function updateList(
	listId: number,
	userId: number,
	data: {
		name?: string;
		description?: string;
		isPrivate?: boolean;
		isArchived?: boolean;
		contentType?: ContentType;
	},
): Promise<List> {
	try {
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				OR: [
					{ userId },
					{ sharedWith: { some: { userId, canEdit: true } } },
				],
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		const updatedList = await prisma.list.update({
			where: { id: listId },
			data,
		});

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");

		return updatedList;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to update list",
		);
	}
}

export async function deleteList(listId: number, userId: number): Promise<any> {
	try {
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				userId,
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to delete",
			);
		}

		const deletedList = await prisma.list.delete({
			where: { id: listId },
		});

		return deletedList;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to delete list",
		);
	}
}

export async function updateListContentType(
	listId: number,
	userId: number,
	contentType: ContentType,
): Promise<List> {
	try {
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				OR: [
					{ userId },
					{ sharedWith: { some: { userId, canEdit: true } } },
				],
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		const updatedList = await prisma.list.update({
			where: { id: listId },
			data: { contentType },
		});

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");

		return updatedList;
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to update list content type",
		);
	}
}

export async function getListForAddItems(listId: number) {
	try {
		const list = await prisma.list.findUnique({
			where: { id: listId },
			include: {
				movieItems: { select: { id: true } },
				serieItems: { select: { id: true } },
				seasonItems: { select: { id: true } },
				episodeItems: { select: { id: true } },
				actorItems: { select: { id: true } },
				crewItems: { select: { id: true } },
			},
		});

		if (!list) {
			return null;
		}

		// Determine existing type
		const existingType =
			list.movieItems.length > 0
				? "Movie"
				: list.serieItems.length > 0
					? "Serie"
					: list.seasonItems.length > 0
						? "Season"
						: list.episodeItems.length > 0
							? "Episode"
							: list.actorItems.length > 0
								? "Actor"
								: list.crewItems.length > 0
									? "Crew"
									: null;

		return { list, existingType };
	} catch (error: any) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An unexpected error occurred.",
		);
	}
}

export async function getListContentType(listId: number) {
	try {
		const list = await prisma.list.findUnique({
			where: { id: listId },
			select: { contentType: true },
		});

		return list?.contentType || null;
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to get list content type",
		);
	}
}

export async function detectAndUpdateListContentType(
	listId: number,
	userId: number,
): Promise<ContentType | null> {
	try {
		// Check for movies
		const { total: movieTotal } = await getListMovies(listId, userId, 1, 1);
		if (movieTotal > 0) {
			await updateListContentType(listId, userId, "movie");
			return "movie";
		}

		// Check for series
		const { total: serieTotal } = await getListSeries(listId, userId, 1, 1);
		if (serieTotal > 0) {
			await updateListContentType(listId, userId, "serie");
			return "serie";
		}

		// Check for seasons
		const { total: seasonTotal } = await getListSeasons(
			listId,
			userId,
			1,
			1,
		);
		if (seasonTotal > 0) {
			await updateListContentType(listId, userId, "season");
			return "season";
		}

		// Check for episodes
		const { total: episodeTotal } = await getListEpisodes(
			listId,
			userId,
			1,
			1,
		);
		if (episodeTotal > 0) {
			await updateListContentType(listId, userId, "episode");
			return "episode";
		}

		// Check for actors
		const { total: actorTotal } = await getListActors(listId, userId, 1, 1);
		if (actorTotal > 0) {
			await updateListContentType(listId, userId, "actor");
			return "actor";
		}

		// Check for crew
		const { total: crewTotal } = await getListCrew(listId, userId, 1, 1);
		if (crewTotal > 0) {
			await updateListContentType(listId, userId, "crew");
			return "crew";
		}

		return null;
	} catch (error) {
		console.error("Failed to detect and update list content type:", error);
		return null;
	}
}

// #endregion
