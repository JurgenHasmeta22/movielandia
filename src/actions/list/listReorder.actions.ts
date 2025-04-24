"use server";

import { prisma } from "../../../prisma/config/prisma";
import { revalidatePath } from "next/cache";
import { getReferer } from "../user/user.actions";

import { ContentType } from "@prisma/client";

interface ReorderItemsParams {
	listId: number;
	userId: number;
	type: ContentType;
	items: { id: number; orderIndex: number }[];
}

export async function reorderListItems({
	listId,
	userId,
	type,
	items,
}: ReorderItemsParams) {
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

		const updates = items.map((item) => {
			switch (type) {
				case "movie":
					return prisma.listMovie.update({
						where: {
							listId_movieId: {
								listId,
								movieId: item.id,
							},
						},
						data: {
							orderIndex: item.orderIndex,
						},
					});
				case "serie":
					return prisma.listSerie.update({
						where: {
							listId_serieId: {
								listId,
								serieId: item.id,
							},
						},
						data: {
							orderIndex: item.orderIndex,
						},
					});
				case "season":
					return prisma.listSeason.update({
						where: {
							listId_seasonId: {
								listId,
								seasonId: item.id,
							},
						},
						data: {
							orderIndex: item.orderIndex,
						},
					});
				case "episode":
					return prisma.listEpisode.update({
						where: {
							listId_episodeId: {
								listId,
								episodeId: item.id,
							},
						},
						data: {
							orderIndex: item.orderIndex,
						},
					});
				case "actor":
					return prisma.listActor.update({
						where: {
							listId_actorId: {
								listId,
								actorId: item.id,
							},
						},
						data: {
							orderIndex: item.orderIndex,
						},
					});
				case "crew":
					return prisma.listCrew.update({
						where: {
							listId_crewId: {
								listId,
								crewId: item.id,
							},
						},
						data: {
							orderIndex: item.orderIndex,
						},
					});
				case "user":
					// User lists are not supported for reordering
					throw new Error("User lists cannot be reordered");
				default:
					throw new Error("Invalid content type");
			}
		});

		await prisma.$transaction(updates);

		const activityData = {
			listId,
			userId,
			actionType: "Updated" as const,
			metadata: { action: "reordered_items" },
		};

		switch (type) {
			case "movie":
				await prisma.listActivityMovie.create({
					data: {
						...activityData,
						movieId: items[0].id,
					},
				});
				break;
			case "serie":
				await prisma.listActivitySerie.create({
					data: {
						...activityData,
						serieId: items[0].id,
					},
				});
				break;
			case "season":
				await prisma.listActivitySeason.create({
					data: {
						...activityData,
						seasonId: items[0].id,
					},
				});
				break;
			case "episode":
				await prisma.listActivityEpisode.create({
					data: {
						...activityData,
						episodeId: items[0].id,
					},
				});
				break;
			case "actor":
				await prisma.listActivityActor.create({
					data: {
						...activityData,
						actorId: items[0].id,
					},
				});
				break;
			case "crew":
				await prisma.listActivityCrew.create({
					data: {
						...activityData,
						crewId: items[0].id,
					},
				});
				break;
			case "user":
				// No activity logging for user lists
				break;
		}

		const referer = getReferer();
		revalidatePath(`${referer}`, "page");

		return { success: true };
	} catch (error) {
		console.error("Failed to reorder list items:", error);
		throw new Error(
			error instanceof Error
				? error.message
				: "Failed to reorder list items",
		);
	}
}
