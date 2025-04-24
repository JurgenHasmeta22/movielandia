"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

interface AddItemParams {
	listId: number;
	userId: number;
	note?: string;
}

interface AddItemsParams {
	listId: number;
	userId: number;
	type: string;
	itemIds: number[];
}

// #region "Movie Items"
export async function addMovieToList(
	movieId: number,
	{ listId, userId, note }: AddItemParams,
) {
	try {
		const [list, existingItem] = await Promise.all([
			prisma.list.findFirst({
				where: {
					id: listId,
					OR: [
						{ userId },
						{ sharedWith: { some: { userId, canEdit: true } } },
					],
				},
			}),
			prisma.listMovie.findUnique({
				where: {
					listId_movieId: {
						listId,
						movieId,
					},
				},
			}),
		]);

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		if (existingItem) {
			throw new Error("Movie already exists in list");
		}

		await prisma.$transaction([
			prisma.listMovie.create({
				data: {
					listId,
					movieId,
					userId,
					note,
					orderIndex: await prisma.listMovie.count({
						where: { listId },
					}),
				},
			}),
			prisma.listActivityMovie.create({
				data: {
					listId,
					movieId,
					userId,
					actionType: "ItemAdded",
					metadata: { note },
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add movie to list",
		);
	}
}

export async function removeMovieFromList(
	movieId: number,
	listId: number,
	userId: number,
) {
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

		await prisma.$transaction([
			prisma.listMovie.delete({
				where: {
					listId_movieId: {
						listId,
						movieId,
					},
				},
			}),
			prisma.listActivityMovie.create({
				data: {
					listId,
					movieId,
					userId,
					actionType: "ItemRemoved",
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove movie from list",
		);
	}
}
// #endregion

// #region "Serie Items"
export async function addSerieToList(
	serieId: number,
	{ listId, userId, note }: AddItemParams,
) {
	try {
		const [list, existingItem] = await Promise.all([
			prisma.list.findFirst({
				where: {
					id: listId,
					OR: [
						{ userId },
						{ sharedWith: { some: { userId, canEdit: true } } },
					],
				},
			}),
			prisma.listSerie.findUnique({
				where: {
					listId_serieId: {
						listId,
						serieId,
					},
				},
			}),
		]);

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		if (existingItem) {
			throw new Error("Serie already exists in list");
		}

		await prisma.$transaction([
			prisma.listSerie.create({
				data: {
					listId,
					serieId,
					userId,
					note,
					orderIndex: await prisma.listSerie.count({
						where: { listId },
					}),
				},
			}),
			prisma.listActivitySerie.create({
				data: {
					listId,
					serieId,
					userId,
					actionType: "ItemAdded",
					metadata: { note },
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add serie to list",
		);
	}
}

export async function removeSerieFromList(
	serieId: number,
	listId: number,
	userId: number,
) {
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

		await prisma.$transaction([
			prisma.listSerie.delete({
				where: {
					listId_serieId: {
						listId,
						serieId,
					},
				},
			}),
			prisma.listActivitySerie.create({
				data: {
					listId,
					serieId,
					userId,
					actionType: "ItemRemoved",
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove serie from list",
		);
	}
}
// #endregion

// #region "Season Items"
export async function addSeasonToList(
	seasonId: number,
	{ listId, userId, note }: AddItemParams,
) {
	try {
		const [list, existingItem] = await Promise.all([
			prisma.list.findFirst({
				where: {
					id: listId,
					OR: [
						{ userId },
						{ sharedWith: { some: { userId, canEdit: true } } },
					],
				},
			}),
			prisma.listSeason.findUnique({
				where: {
					listId_seasonId: {
						listId,
						seasonId,
					},
				},
			}),
		]);

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		if (existingItem) {
			throw new Error("Season already exists in list");
		}

		await prisma.$transaction([
			prisma.listSeason.create({
				data: {
					listId,
					seasonId,
					userId,
					note,
					orderIndex: await prisma.listSeason.count({
						where: { listId },
					}),
				},
			}),
			prisma.listActivitySeason.create({
				data: {
					listId,
					seasonId,
					userId,
					actionType: "ItemAdded",
					metadata: { note },
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add season to list",
		);
	}
}

export async function removeSeasonFromList(
	seasonId: number,
	listId: number,
	userId: number,
) {
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

		await prisma.$transaction([
			prisma.listSeason.delete({
				where: {
					listId_seasonId: {
						listId,
						seasonId,
					},
				},
			}),
			prisma.listActivitySeason.create({
				data: {
					listId,
					seasonId,
					userId,
					actionType: "ItemRemoved",
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove season from list",
		);
	}
}
// #endregion

// #region "Episode Items"
export async function addEpisodeToList(
	episodeId: number,
	{ listId, userId, note }: AddItemParams,
) {
	try {
		const [list, existingItem] = await Promise.all([
			prisma.list.findFirst({
				where: {
					id: listId,
					OR: [
						{ userId },
						{ sharedWith: { some: { userId, canEdit: true } } },
					],
				},
			}),
			prisma.listEpisode.findUnique({
				where: {
					listId_episodeId: {
						listId,
						episodeId,
					},
				},
			}),
		]);

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		if (existingItem) {
			throw new Error("Episode already exists in list");
		}

		await prisma.$transaction([
			prisma.listEpisode.create({
				data: {
					listId,
					episodeId,
					userId,
					note,
					orderIndex: await prisma.listEpisode.count({
						where: { listId },
					}),
				},
			}),
			prisma.listActivityEpisode.create({
				data: {
					listId,
					episodeId,
					userId,
					actionType: "ItemAdded",
					metadata: { note },
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add episode to list",
		);
	}
}

export async function removeEpisodeFromList(
	episodeId: number,
	listId: number,
	userId: number,
) {
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

		await prisma.$transaction([
			prisma.listEpisode.delete({
				where: {
					listId_episodeId: {
						listId,
						episodeId,
					},
				},
			}),
			prisma.listActivityEpisode.create({
				data: {
					listId,
					episodeId,
					userId,
					actionType: "ItemRemoved",
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove episode from list",
		);
	}
}
// #endregion

// #region "Actor Items"
export async function addActorToList(
	actorId: number,
	{ listId, userId, note }: AddItemParams,
) {
	try {
		const [list, existingItem] = await Promise.all([
			prisma.list.findFirst({
				where: {
					id: listId,
					OR: [
						{ userId },
						{ sharedWith: { some: { userId, canEdit: true } } },
					],
				},
			}),
			prisma.listActor.findUnique({
				where: {
					listId_actorId: {
						listId,
						actorId,
					},
				},
			}),
		]);

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		if (existingItem) {
			throw new Error("Actor already exists in list");
		}

		await prisma.$transaction([
			prisma.listActor.create({
				data: {
					listId,
					actorId,
					userId,
					note,
					orderIndex: await prisma.listActor.count({
						where: { listId },
					}),
				},
			}),
			prisma.listActivityActor.create({
				data: {
					listId,
					actorId,
					userId,
					actionType: "ItemAdded",
					metadata: { note },
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add actor to list",
		);
	}
}

export async function removeActorFromList(
	actorId: number,
	listId: number,
	userId: number,
) {
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

		await prisma.$transaction([
			prisma.listActor.delete({
				where: {
					listId_actorId: {
						listId,
						actorId,
					},
				},
			}),
			prisma.listActivityActor.create({
				data: {
					listId,
					actorId,
					userId,
					actionType: "ItemRemoved",
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove actor from list",
		);
	}
}
// #endregion

// #region "Crew Items"
export async function addCrewToList(
	crewId: number,
	{ listId, userId, note }: AddItemParams,
) {
	try {
		const [list, existingItem] = await Promise.all([
			prisma.list.findFirst({
				where: {
					id: listId,
					OR: [
						{ userId },
						{ sharedWith: { some: { userId, canEdit: true } } },
					],
				},
			}),
			prisma.listCrew.findUnique({
				where: {
					listId_crewId: {
						listId,
						crewId,
					},
				},
			}),
		]);

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		if (existingItem) {
			throw new Error("Crew member already exists in list");
		}

		await prisma.$transaction([
			prisma.listCrew.create({
				data: {
					listId,
					crewId,
					userId,
					note,
					orderIndex: await prisma.listCrew.count({
						where: { listId },
					}),
				},
			}),
			prisma.listActivityCrew.create({
				data: {
					listId,
					crewId,
					userId,
					actionType: "ItemAdded",
					metadata: { note },
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add crew member to list",
		);
	}
}

export async function removeCrewFromList(
	crewId: number,
	listId: number,
	userId: number,
) {
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

		await prisma.$transaction([
			prisma.listCrew.delete({
				where: {
					listId_crewId: {
						listId,
						crewId,
					},
				},
			}),
			prisma.listActivityCrew.create({
				data: {
					listId,
					crewId,
					userId,
					actionType: "ItemRemoved",
				},
			}),
		]);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove crew member from list",
		);
	}
}
// #endregion

export async function addItemsToList({
	listId,
	userId,
	type,
	itemIds,
}: AddItemsParams) {
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

		const addActions = itemIds.map(async (itemId) => {
			switch (type) {
				case "movies":
					return addMovieToList(itemId, { listId, userId });
				case "series":
					return addSerieToList(itemId, { listId, userId });
				case "actors":
					return addActorToList(itemId, { listId, userId });
				case "crew":
					return addCrewToList(itemId, { listId, userId });
				case "seasons":
					return addSeasonToList(itemId, { listId, userId });
				case "episodes":
					return addEpisodeToList(itemId, { listId, userId });
				default:
					throw new Error("Invalid content type");
			}
		});

		await Promise.all(addActions);
		revalidatePath(`/users/${userId}/lists/${listId}`);
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to add items to list",
		);
	}
}

export async function removeAllItemsFromList(listId: number, userId: number) {
	try {
		// First check if the user has permission to edit the list
		const list = await prisma.list.findFirst({
			where: {
				id: listId,
				OR: [
					{ userId },
					{ sharedWith: { some: { userId, canEdit: true } } },
				],
			},
			select: {
				id: true,
				contentType: true,
			},
		});

		if (!list) {
			throw new Error(
				"List not found or you don't have permission to edit",
			);
		}

		// Get counts for each type of item to determine if we need to delete anything
		const [
			movieCount,
			serieCount,
			seasonCount,
			episodeCount,
			actorCount,
			crewCount,
		] = await Promise.all([
			prisma.listMovie.count({ where: { listId } }),
			prisma.listSerie.count({ where: { listId } }),
			prisma.listSeason.count({ where: { listId } }),
			prisma.listEpisode.count({ where: { listId } }),
			prisma.listActor.count({ where: { listId } }),
			prisma.listCrew.count({ where: { listId } }),
		]);

		// Create transaction operations for each type of item
		const operations = [];

		// Delete all movie items if any exist
		if (movieCount > 0) {
			operations.push(
				prisma.listMovie.deleteMany({
					where: { listId },
				}),
			);
		}

		// Delete all serie items if any exist
		if (serieCount > 0) {
			operations.push(
				prisma.listSerie.deleteMany({
					where: { listId },
				}),
			);
		}

		// Delete all season items if any exist
		if (seasonCount > 0) {
			operations.push(
				prisma.listSeason.deleteMany({
					where: { listId },
				}),
			);
		}

		// Delete all episode items if any exist
		if (episodeCount > 0) {
			operations.push(
				prisma.listEpisode.deleteMany({
					where: { listId },
				}),
			);
		}

		// Delete all actor items if any exist
		if (actorCount > 0) {
			operations.push(
				prisma.listActor.deleteMany({
					where: { listId },
				}),
			);
		}

		// Delete all crew items if any exist
		if (crewCount > 0) {
			operations.push(
				prisma.listCrew.deleteMany({
					where: { listId },
				}),
			);
		}

		// Add operation to reset content type
		operations.push(
			prisma.list.update({
				where: { id: listId },
				data: { contentType: null },
			}),
		);

		// Execute all operations in a transaction
		await prisma.$transaction(operations);

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");

		return { success: true };
	} catch (error) {
		console.error("Failed to remove all items from list:", error);
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to remove all items from list",
		);
	}
}
